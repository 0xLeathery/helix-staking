-- Initial schema for HELIX Staking Indexer
-- Generated from services/indexer/src/db/schema.ts
-- Phase 8.1 Audit Fix: T004 — Migration file must match Drizzle schema

-- ---------------------------------------------------------------------------
-- 1. ProtocolInitialized
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS protocol_initialized_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    global_state TEXT NOT NULL,
    mint TEXT NOT NULL,
    mint_authority TEXT NOT NULL,
    authority TEXT NOT NULL,
    annual_inflation_bp TEXT NOT NULL,
    min_stake_amount TEXT NOT NULL,
    starting_share_rate TEXT NOT NULL,
    slots_per_day TEXT NOT NULL
);

-- ---------------------------------------------------------------------------
-- 2. StakeCreated
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stake_created_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "user" TEXT NOT NULL,
    stake_id BIGINT NOT NULL,
    amount TEXT NOT NULL,
    t_shares TEXT NOT NULL,
    days INTEGER NOT NULL,
    share_rate TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS stake_created_user_idx ON stake_created_events ("user");
CREATE INDEX IF NOT EXISTS stake_created_user_slot_idx ON stake_created_events ("user", slot);

-- ---------------------------------------------------------------------------
-- 3. StakeEnded
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stake_ended_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "user" TEXT NOT NULL,
    stake_id BIGINT NOT NULL,
    original_amount TEXT NOT NULL,
    return_amount TEXT NOT NULL,
    penalty_amount TEXT NOT NULL,
    penalty_type INTEGER NOT NULL,
    rewards_claimed TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS stake_ended_user_idx ON stake_ended_events ("user");

-- ---------------------------------------------------------------------------
-- 4. RewardsClaimed
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rewards_claimed_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "user" TEXT NOT NULL,
    stake_id BIGINT NOT NULL,
    amount TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS rewards_claimed_user_idx ON rewards_claimed_events ("user");

-- ---------------------------------------------------------------------------
-- 5. InflationDistributed
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inflation_distributed_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    day BIGINT NOT NULL,
    days_elapsed BIGINT NOT NULL,
    amount TEXT NOT NULL,
    new_share_rate TEXT NOT NULL,
    total_shares TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS inflation_distributed_day_idx ON inflation_distributed_events (day);

-- ---------------------------------------------------------------------------
-- 6. AdminMinted
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_minted_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    authority TEXT NOT NULL,
    recipient TEXT NOT NULL,
    amount TEXT NOT NULL
);

-- ---------------------------------------------------------------------------
-- 7. ClaimPeriodStarted
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS claim_period_started_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" BIGINT NOT NULL,
    claim_period_id INTEGER NOT NULL,
    merkle_root TEXT NOT NULL,
    total_claimable TEXT NOT NULL,
    total_eligible INTEGER NOT NULL,
    claim_deadline_slot TEXT NOT NULL
);

-- ---------------------------------------------------------------------------
-- 8. TokensClaimed
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tokens_claimed_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" BIGINT NOT NULL,
    claimer TEXT NOT NULL,
    snapshot_wallet TEXT NOT NULL,
    claim_period_id INTEGER NOT NULL,
    snapshot_balance TEXT NOT NULL,
    base_amount TEXT NOT NULL,
    bonus_bps INTEGER NOT NULL,
    days_elapsed INTEGER NOT NULL,
    total_amount TEXT NOT NULL,
    immediate_amount TEXT NOT NULL,
    vesting_amount TEXT NOT NULL,
    vesting_end_slot TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS tokens_claimed_claimer_idx ON tokens_claimed_events (claimer);

-- ---------------------------------------------------------------------------
-- 9. VestedTokensWithdrawn
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vested_tokens_withdrawn_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" BIGINT NOT NULL,
    claimer TEXT NOT NULL,
    amount TEXT NOT NULL,
    total_vested TEXT NOT NULL,
    total_withdrawn TEXT NOT NULL,
    remaining TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS vested_tokens_withdrawn_claimer_idx ON vested_tokens_withdrawn_events (claimer);

-- ---------------------------------------------------------------------------
-- 10. ClaimPeriodEnded
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS claim_period_ended_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" BIGINT NOT NULL,
    claim_period_id INTEGER NOT NULL,
    total_claimed TEXT NOT NULL,
    claims_count INTEGER NOT NULL,
    unclaimed_amount TEXT NOT NULL
);

-- ---------------------------------------------------------------------------
-- 11. BigPayDayDistributed
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS big_pay_day_distributed_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "timestamp" BIGINT NOT NULL,
    claim_period_id INTEGER NOT NULL,
    total_unclaimed TEXT NOT NULL,
    total_eligible_share_days TEXT NOT NULL,
    helix_per_share_day TEXT NOT NULL,
    eligible_stakers INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- 12. BpdAborted
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bpd_aborted_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    claim_period_id INTEGER NOT NULL,
    stakes_finalized INTEGER NOT NULL,
    stakes_distributed INTEGER NOT NULL
);

-- ---------------------------------------------------------------------------
-- 13. BpdBatchFinalized (Phase 8.1)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bpd_batch_finalized_events (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL UNIQUE,
    slot BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    claim_period_id INTEGER NOT NULL,
    batch_stakes_processed INTEGER NOT NULL,
    total_stakes_finalized INTEGER NOT NULL,
    cumulative_share_days TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL
);

-- ---------------------------------------------------------------------------
-- Operational: Checkpoints
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS checkpoints (
    id SERIAL PRIMARY KEY,
    program_id TEXT NOT NULL UNIQUE,
    last_signature TEXT,
    last_slot BIGINT,
    processed_count BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
