#!/usr/bin/env bash
# Helix Localnet Entrypoint
#
# Starts solana-test-validator with the Helix Staking program pre-loaded,
# waits for readiness, runs the TypeScript bootstrap script, then blocks
# until the validator exits.
#
# Environment variables (with defaults):
#   PROGRAM_SO_PATH  — path to helix_staking.so   (/mnt/deploy/helix_staking.so)
#   IDL_PATH         — path to Anchor IDL JSON     (/mnt/idl/helix_staking.json)
#   WALLET_PATH      — path to test keypair JSON   (/app/test-wallet.json)

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────

PROGRAM_ID="E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7"
PROGRAM_SO_PATH="${PROGRAM_SO_PATH:-/mnt/deploy/helix_staking.so}"
IDL_PATH="${IDL_PATH:-/mnt/idl/helix_staking.json}"
WALLET_PATH="${WALLET_PATH:-/app/test-wallet.json}"
LEDGER_DIR="/tmp/test-ledger"
LOG_FILE="/mnt/logs/validator.log"

HEALTH_INTERVAL=2    # seconds between health checks
HEALTH_RETRIES=45    # max retries (45 × 2s = 90s budget)

# ── Pre-flight checks ───────────────────────────────────────────────────────

preflight() {
    echo "=== Helix Localnet: Pre-flight checks ==="

    if [[ ! -f "$PROGRAM_SO_PATH" ]] || [[ ! -s "$PROGRAM_SO_PATH" ]]; then
        echo "ERROR: Program binary not found or empty at: $PROGRAM_SO_PATH"
        echo ""
        echo "  The container bind-mounts target/deploy/ from your host."
        echo "  Run 'anchor build' in the repo root first, then restart the container."
        echo ""
        exit 1
    fi
    echo "  ✓ Program binary: $PROGRAM_SO_PATH ($(stat -c%s "$PROGRAM_SO_PATH" 2>/dev/null || stat -f%z "$PROGRAM_SO_PATH") bytes)"

    if [[ ! -f "$IDL_PATH" ]]; then
        echo "ERROR: IDL not found at: $IDL_PATH"
        echo ""
        echo "  Run 'anchor build' to generate the IDL, then restart the container."
        echo ""
        exit 1
    fi
    echo "  ✓ IDL: $IDL_PATH"

    if [[ ! -f "$WALLET_PATH" ]]; then
        echo "ERROR: Test wallet not found at: $WALLET_PATH"
        exit 1
    fi
    echo "  ✓ Test wallet: $WALLET_PATH"

    echo ""
}

# ── Signal handling ──────────────────────────────────────────────────────────

VALIDATOR_PID=""

cleanup() {
    echo ""
    echo "=== Shutting down validator ==="
    if [[ -n "$VALIDATOR_PID" ]] && kill -0 "$VALIDATOR_PID" 2>/dev/null; then
        kill "$VALIDATOR_PID" 2>/dev/null || true
        # Wait up to 8 seconds for graceful shutdown
        local count=0
        while kill -0 "$VALIDATOR_PID" 2>/dev/null && [[ $count -lt 8 ]]; do
            sleep 1
            count=$((count + 1))
        done
        # Force kill if still running
        if kill -0 "$VALIDATOR_PID" 2>/dev/null; then
            echo "  Force-killing validator..."
            kill -9 "$VALIDATOR_PID" 2>/dev/null || true
        fi
    fi
    rm -f /tmp/.bootstrap-complete
    echo "  Validator stopped."
    exit 0
}

trap cleanup SIGTERM SIGINT

# ── Health check loop ────────────────────────────────────────────────────────

wait_for_ready() {
    echo "Waiting for validator to be ready..."
    local attempt=0
    while [[ $attempt -lt $HEALTH_RETRIES ]]; do
        # Check if the validator process is still alive
        if ! kill -0 "$VALIDATOR_PID" 2>/dev/null; then
            echo "ERROR: Validator process died unexpectedly."
            exit 1
        fi

        # Check RPC health
        if curl -sf http://127.0.0.1:8899 \
            -X POST \
            -H "Content-Type: application/json" \
            -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' \
            2>/dev/null | grep -q '"result":"ok"'; then
            echo "  ✓ Validator is ready (attempt $((attempt + 1))/$HEALTH_RETRIES)"
            return 0
        fi

        attempt=$((attempt + 1))
        sleep "$HEALTH_INTERVAL"
    done

    echo "ERROR: Validator did not become ready after $((HEALTH_RETRIES * HEALTH_INTERVAL)) seconds."
    exit 1
}

# ── Main ─────────────────────────────────────────────────────────────────────

preflight

echo "=== Starting Solana Test Validator ==="
echo "  Program ID: $PROGRAM_ID"
echo "  Ledger: $LEDGER_DIR"
echo ""

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Start validator in background, tee output to both stdout and log file (FR-012)
solana-test-validator \
    --reset \
    --bpf-program "$PROGRAM_ID" "$PROGRAM_SO_PATH" \
    --ledger "$LEDGER_DIR" \
    --rpc-port 8899 \
    --faucet-port 9900 \
    --log \
    --limit-ledger-size 50000000 \
    --slots-per-epoch 150 \
    --ticks-per-slot 8 \
    2>&1 | tee "$LOG_FILE" &

VALIDATOR_PID=$!
echo "  Validator PID: $VALIDATOR_PID"
echo ""

# Wait for RPC to be healthy
wait_for_ready
echo ""

# Run bootstrap script (initialize protocol, fund wallet, mint tokens)
echo "=== Running Bootstrap ==="
if ! npx tsx /app/bootstrap.ts; then
    echo "ERROR: Bootstrap script failed."
    cleanup
    exit 1
fi

# Mark bootstrap complete — healthcheck sentinel
touch /tmp/.bootstrap-complete
echo ""
echo "============================================"
echo "  Helix Localnet Ready!"
echo "  RPC:       http://localhost:8899"
echo "  WebSocket: ws://localhost:8900"
echo "============================================"
echo ""

# Block until validator exits
wait "$VALIDATOR_PID"
