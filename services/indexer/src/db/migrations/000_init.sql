-- Initial schema for indexer service
-- Created by Audit Fixes (Phase 8.1) foundation task

CREATE TABLE IF NOT EXISTS indexer_checkpoints (
    id SERIAL PRIMARY KEY,
    last_signature TEXT NOT NULL,
    last_slot BIGINT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add other existing tables here if needed for the initial state
-- For now, ensuring the checkpoint table exists as per data-model.md
