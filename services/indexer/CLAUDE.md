# Helix Indexer

Fastify 5 API + event polling worker. TypeScript with Drizzle ORM on PostgreSQL.

## Structure

- `src/worker/` — Polls `getSignaturesForAddress`, decodes Anchor events
- `src/api/` — Fastify REST API endpoints
- `src/db/schema.ts` — Drizzle ORM schema (one table per event type)

## Rules

- All tables share `id`, `signature` (unique), `slot`, `createdAt` columns
- The `slot` field is critical for reorg handling — never omit it
- Worker and API run as separate processes

## Commands

```bash
npm run dev:worker   # Start indexer worker
npm run dev:api      # Start API server
npm run db:generate  # Generate Drizzle migrations
```
