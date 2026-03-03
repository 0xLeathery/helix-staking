# Crank Service: Lightweight Node.js Alpine image
# No Solana CLI, no Postgres client needed — crank talks directly to RPC
#
# Multi-stage build: builder compiles TypeScript, production stage ships
# only compiled JS + production deps (~50MB vs ~400MB single-stage)
#
# IDL is NOT copied into the image — bind-mounted at runtime via Docker Compose

# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false
COPY tsconfig.json ./
COPY src/ ./src/
RUN npx tsc

# ── Production stage ─────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production && npm cache clean --force
COPY --from=builder /app/dist/ ./dist/

# IDL is bind-mounted at runtime via Docker Compose volume:
#   ../target/idl:/mnt/idl:ro
# The IDL_PATH env var points to the mounted file (set in docker-compose.yml)
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
