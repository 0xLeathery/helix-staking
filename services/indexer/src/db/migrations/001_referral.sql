-- Phase 10: Referral System
CREATE TABLE IF NOT EXISTS referral_staked_events (
  id SERIAL PRIMARY KEY,
  signature TEXT NOT NULL UNIQUE,
  slot BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  referrer TEXT NOT NULL,
  referee TEXT NOT NULL,
  stake_id BIGINT NOT NULL,
  referee_t_share_bonus TEXT NOT NULL,
  referrer_token_bonus TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS referral_staked_referrer_idx ON referral_staked_events (referrer);
CREATE INDEX IF NOT EXISTS referral_staked_referee_idx ON referral_staked_events (referee);
