# Docker Localnet: Solana Test Validator + Helix Staking
# Single-stage build: Ubuntu 22.04 + Solana CLI 1.18.26 + Node.js 20.x
#
# Program binary is bind-mounted at runtime via target/deploy/ — no rebuild
# needed when the program changes. Only rebuild on Dockerfile/entrypoint changes.

FROM --platform=linux/amd64 ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# ── System dependencies ──────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        tini \
        bzip2 \
    && rm -rf /var/lib/apt/lists/*

# ── Solana CLI v1.18.26 (direct tarball — deterministic, cache-friendly) ─────
RUN curl -fsSL https://github.com/solana-labs/solana/releases/download/v1.18.26/solana-release-x86_64-unknown-linux-gnu.tar.bz2 \
    | tar -xjC /opt \
    && ln -s /opt/solana-release/bin/* /usr/local/bin/

# Verify install
RUN solana --version

# ── Node.js 20.x LTS ────────────────────────────────────────────────────────
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# ── Application directory ────────────────────────────────────────────────────
WORKDIR /app

# Install bootstrap script dependencies (cached unless package.json changes)
COPY package.json ./
RUN npm install --production && npm cache clean --force

# Copy application files
COPY entrypoint.sh bootstrap.ts test-wallet.json ./
RUN chmod +x /app/entrypoint.sh

# ── Solana config ────────────────────────────────────────────────────────────
# Set default Solana config to point at local validator
RUN solana config set --url http://127.0.0.1:8899 --keypair /app/test-wallet.json

# ── Ports ────────────────────────────────────────────────────────────────────
EXPOSE 8899 8900

# ── Health check ─────────────────────────────────────────────────────────────
# Only reports healthy after bootstrap completes (sentinel file + RPC check)
HEALTHCHECK --interval=2s --timeout=5s --start-period=15s --retries=30 \
    CMD test -f /tmp/.bootstrap-complete && \
        curl -sf http://127.0.0.1:8899 -X POST \
            -H "Content-Type: application/json" \
            -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' \
        | grep -q '"result":"ok"'

# ── Entrypoint ───────────────────────────────────────────────────────────────
# tini as PID 1 for proper signal forwarding and zombie reaping
ENTRYPOINT ["tini", "--"]
CMD ["/app/entrypoint.sh"]
