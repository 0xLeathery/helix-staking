-- Phase 11: Badge eligibility tracking
CREATE TABLE IF NOT EXISTS badge_eligibility (
  id SERIAL PRIMARY KEY,
  wallet TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  eligible BOOLEAN NOT NULL DEFAULT false,
  earned_at TIMESTAMP,
  stake_amount TEXT,
  computed_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE (wallet, badge_type)
);

CREATE INDEX IF NOT EXISTS badge_eligibility_wallet_idx ON badge_eligibility (wallet);
