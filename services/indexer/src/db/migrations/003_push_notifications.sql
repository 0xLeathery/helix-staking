-- Phase 12: Push Notifications
-- Creates push_subscriptions and notification_state tables

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id                       SERIAL PRIMARY KEY,
  wallet                   TEXT NOT NULL,
  endpoint                 TEXT NOT NULL UNIQUE,
  p256dh                   TEXT NOT NULL,
  auth                     TEXT NOT NULL,
  notify_maturity          BOOLEAN NOT NULL DEFAULT TRUE,
  notify_late_penalty      BOOLEAN NOT NULL DEFAULT TRUE,
  notify_rewards           BOOLEAN NOT NULL DEFAULT TRUE,
  notify_bpd               BOOLEAN NOT NULL DEFAULT TRUE,
  last_rewards_notified_at TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS push_subscriptions_wallet_idx
  ON push_subscriptions(wallet);

CREATE TABLE IF NOT EXISTS notification_state (
  id         SERIAL PRIMARY KEY,
  wallet     TEXT NOT NULL,
  stake_id   BIGINT NOT NULL,
  event_type TEXT NOT NULL,
  sent_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS notification_state_unique_idx
  ON notification_state(wallet, stake_id, event_type);
