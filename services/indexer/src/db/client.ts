import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema.js';

// Lazy initialization to avoid import-time env validation failures during tests
let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getPool(): Pool {
  if (!_pool) {
    // Import env dynamically to allow test overrides
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    _pool = new Pool({ connectionString, max: 10 });
  }
  return _pool;
}

function getDb() {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}

/** Neon serverless connection pool */
export const pool = new Proxy({} as Pool, {
  get(_, prop) {
    return (getPool() as any)[prop];
  },
});

/** Drizzle ORM instance with typed schema */
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});

/** Phase 8.1 (H7/FR-008): Type for db or transaction - both share the same query API */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DbClient = Pick<typeof db, 'insert' | 'select' | 'update' | 'delete' | 'execute'>;

/** Gracefully close the database pool */
export async function closePool(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = null;
  }
}
