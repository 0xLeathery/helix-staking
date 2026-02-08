import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../db/client.js';

const querySchema = z.object({
  user: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
  sort: z
    .enum(['t_shares', 'total_staked', 'stake_count'])
    .default('t_shares'),
});

export const leaderboardRoutes: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts,
  done,
) => {
  // GET /api/leaderboard - leaderboard rankings with active stakes only
  fastify.get('/api/leaderboard', async (request, reply) => {
    const { user, limit, sort } = querySchema.parse(request.query);

    // Determine sort column
    const sortColumn =
      sort === 't_shares'
        ? 'total_t_shares'
        : sort === 'total_staked'
          ? 'total_staked'
          : 'active_stake_count';

    const result = await db.execute(sql`
      WITH active_stakes AS (
        SELECT
          sc.user,
          SUM(sc.t_shares::numeric) as total_t_shares,
          COUNT(*) as active_stake_count,
          SUM(sc.amount::numeric) as total_staked,
          MAX(sc.days) as max_duration
        FROM stake_created_events sc
        LEFT JOIN stake_ended_events se
          ON sc.user = se.user AND sc.stake_id = se.stake_id
        WHERE se.id IS NULL
        GROUP BY sc.user
      ),
      ranked AS (
        SELECT
          user,
          total_t_shares,
          active_stake_count,
          total_staked,
          max_duration,
          RANK() OVER (ORDER BY ${sql.raw(sortColumn)} DESC) as rank
        FROM active_stakes
      )
      SELECT
        user,
        rank,
        total_t_shares::text,
        active_stake_count,
        total_staked::text,
        max_duration
      FROM ranked
      WHERE rank <= ${limit} OR user = ${user || ''}
      ORDER BY rank
    `);

    return reply.send({ data: result.rows });
  });

  done();
};
