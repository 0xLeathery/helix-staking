-- Add notify_boost_revoked preference column to push_subscriptions
ALTER TABLE push_subscriptions
  ADD COLUMN IF NOT EXISTS notify_boost_revoked BOOLEAN NOT NULL DEFAULT TRUE;

-- Store BoostRevoked events for deduplication
CREATE TABLE IF NOT EXISTS boost_revoked_events (
  id          SERIAL PRIMARY KEY,
  signature   TEXT NOT NULL UNIQUE,
  slot        BIGINT NOT NULL,
  user_wallet TEXT NOT NULL,
  stake_id    BIGINT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS boost_revoked_events_user_idx
  ON boost_revoked_events(user_wallet);
