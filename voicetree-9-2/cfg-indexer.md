---
color: cyan
position:
  x: 1206
  y: -658
isContextNode: false
agent_name: Aki
---

# Indexer Config

## Light indexer service configuration: Drizzle ORM, Zod env validation, Fastify API server, and Neon Postgres

### Package Identity (`/services/indexer/package.json`)

```json
{
  "name": "@helix/indexer",
  "type": "module",   // ESM-first
  "private": true
}
```

Two runtime entry points:
- `dev:worker` -- `tsx src/worker/index.ts` (polls chain events)
- `dev:api` -- `tsx src/api/index.ts` (Fastify REST server)

Database management:
- `db:generate` -- `drizzle-kit generate` (create migration SQL from schema diff)
- `db:migrate` -- `drizzle-kit migrate` (apply migrations)
- `db:studio` -- `drizzle-kit studio` (web UI for database inspection)

### Environment Validation (`/services/indexer/src/lib/env.ts`)

Zod schema validates all env vars at startup. The process **exits immediately** on validation failure with a formatted error listing missing/invalid vars.

| Variable | Type | Default | Required |
|----------|------|---------|----------|
| `DATABASE_URL` | string | -- | Yes |
| `RPC_URL` | string | `https://api.devnet.solana.com` | No |
| `PROGRAM_ID` | string | -- | Yes |
| `PORT` | number | `3001` | No |
| `POLL_INTERVAL_MS` | number | `5000` | No |
| `LOG_LEVEL` | enum(`debug`/`info`/`warn`/`error`) | `info` | No |
| `FRONTEND_URL` | string | `http://localhost:3000` | No |

### Drizzle Config (`/services/indexer/drizzle.config.ts`)

```ts
defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  out: './src/db/migrations',
});
```

Loads `dotenv/config` at top level. Schema file at `src/db/schema.ts` is the single source of truth for all 11+ event tables and checkpoint tracking.

### Fastify API Server (`/services/indexer/src/api/index.ts`)

- CORS origin locked to `env.FRONTEND_URL` (single origin, credentials allowed)
- Listens on `0.0.0.0:{PORT}` (default 3001)
- Built-in Fastify logger disabled; uses custom `pino` logger
- Global error handler returns structured JSON `{ error, message, statusCode }`
- Graceful shutdown on SIGTERM/SIGINT: closes Fastify, then closes DB pool

Route plugins registered:
1. `/health` -- health check
2. `/stats` -- aggregate protocol statistics
3. `/distributions` -- inflation distribution history
4. `/stakes` -- stake event history
5. `/claims` -- free claim event history
6. `/leaderboard` -- T-share rankings (RANK window function)
7. `/whale-activity` -- large stake/unstake movements

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `fastify` | ^5.2.1 | HTTP server |
| `@fastify/cors` | ^10.0.2 | CORS middleware |
| `drizzle-orm` | ^0.38.3 | Type-safe SQL ORM |
| `@neondatabase/serverless` | ^0.10.4 | Neon Postgres serverless driver |
| `zod` | ^3.24.1 | Runtime env/query validation |
| `pino` / `pino-pretty` | ^9.6 / ^13.0 | Structured logging |
| `p-retry` | ^6.2.1 | Retry logic for RPC calls |
| `@coral-xyz/anchor` | ^0.30.1 | IDL decoding (note: 0.30, not 0.31) |

### vitest.config.ts (`/services/indexer/vitest.config.ts`)

```ts
defineConfig({
  test: {
    root: 'src',
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

Path alias `@` maps to `./src` for clean imports throughout the indexer codebase.

### Notable Gotchas

- **Anchor version mismatch**: Indexer uses `@coral-xyz/anchor ^0.30.1` while root and frontend use `0.31.x`. This is intentional -- the indexer only decodes events from the IDL and does not construct transactions, so the minor version difference is tolerable.
- **`type: "module"`**: The indexer is ESM-only. All internal imports use `.js` extensions. This differs from the root workspace which is CommonJS.
- **Lazy DB initialization**: The DB client uses a `Proxy` pattern to defer connection until first use, avoiding import-time env validation failures during testing.
- **`DATABASE_URL` is required**: Unlike RPC_URL which has a default, missing DATABASE_URL kills the process at startup. Ensure `.env` is present.
- **Neon serverless driver**: Uses `@neondatabase/serverless` for HTTP-based Postgres connections. This requires a Neon-hosted database (not a standard Postgres connection string).
- **Token-value fields stored as text**: Large numeric fields (amounts, T-shares, share rates) are stored as Postgres `text` to preserve full precision beyond JavaScript's Number range. Client-side parsing uses `BN.js`.
- **CORS single-origin**: The API only accepts requests from `FRONTEND_URL`. If you run the frontend on a different port, update the env var.
- **No authentication**: The API is fully public/read-only. No auth tokens, no rate limiting.

[[config-and-deployment.md]]
