CREATE TABLE "admin_minted_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"authority" text NOT NULL,
	"recipient" text NOT NULL,
	"amount" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "authority_transfer_cancelled_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"authority" text NOT NULL,
	"cancelled_new_authority" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "authority_transfer_completed_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"old_authority" text NOT NULL,
	"new_authority" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "authority_transfer_initiated_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"old_authority" text NOT NULL,
	"new_authority" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "big_pay_day_distributed_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"timestamp" bigint NOT NULL,
	"claim_period_id" integer NOT NULL,
	"total_unclaimed" text NOT NULL,
	"total_eligible_share_days" text NOT NULL,
	"helix_per_share_day" text NOT NULL,
	"eligible_stakers" integer NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "bpd_aborted_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"claim_period_id" integer NOT NULL,
	"stakes_finalized" integer NOT NULL,
	"stakes_distributed" integer NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "bpd_batch_finalized_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"claim_period_id" integer NOT NULL,
	"batch_stakes_processed" integer NOT NULL,
	"total_stakes_finalized" integer NOT NULL,
	"cumulative_share_days" text NOT NULL,
	"timestamp" bigint NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "checkpoints" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" text NOT NULL,
	"last_signature" text,
	"last_slot" bigint,
	"processed_count" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "checkpoints_program_id_unique" UNIQUE("program_id")
);
--> statement-breakpoint
CREATE TABLE "claim_period_ended_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"timestamp" bigint NOT NULL,
	"claim_period_id" integer NOT NULL,
	"total_claimed" text NOT NULL,
	"claims_count" integer NOT NULL,
	"unclaimed_amount" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "claim_period_started_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"timestamp" bigint NOT NULL,
	"claim_period_id" integer NOT NULL,
	"merkle_root" text NOT NULL,
	"total_claimable" text NOT NULL,
	"total_eligible" integer NOT NULL,
	"claim_deadline_slot" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "inflation_distributed_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"day" bigint NOT NULL,
	"days_elapsed" bigint NOT NULL,
	"amount" text NOT NULL,
	"new_share_rate" text NOT NULL,
	"total_shares" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "protocol_initialized_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"global_state" text NOT NULL,
	"mint" text NOT NULL,
	"mint_authority" text NOT NULL,
	"authority" text NOT NULL,
	"annual_inflation_bp" text NOT NULL,
	"min_stake_amount" text NOT NULL,
	"starting_share_rate" text NOT NULL,
	"slots_per_day" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "rewards_claimed_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user" text NOT NULL,
	"stake_id" bigint NOT NULL,
	"amount" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "stake_created_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user" text NOT NULL,
	"stake_id" bigint NOT NULL,
	"amount" text NOT NULL,
	"t_shares" text NOT NULL,
	"days" integer NOT NULL,
	"share_rate" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "stake_ended_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user" text NOT NULL,
	"stake_id" bigint NOT NULL,
	"original_amount" text NOT NULL,
	"return_amount" text NOT NULL,
	"penalty_amount" text NOT NULL,
	"penalty_type" integer NOT NULL,
	"rewards_claimed" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "tokens_claimed_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"timestamp" bigint NOT NULL,
	"claimer" text NOT NULL,
	"snapshot_wallet" text NOT NULL,
	"claim_period_id" integer NOT NULL,
	"snapshot_balance" text NOT NULL,
	"base_amount" text NOT NULL,
	"bonus_bps" integer NOT NULL,
	"days_elapsed" integer NOT NULL,
	"total_amount" text NOT NULL,
	"immediate_amount" text NOT NULL,
	"vesting_amount" text NOT NULL,
	"vesting_end_slot" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE TABLE "vested_tokens_withdrawn_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"signature" text NOT NULL,
	"slot" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"timestamp" bigint NOT NULL,
	"claimer" text NOT NULL,
	"amount" text NOT NULL,
	"total_vested" text NOT NULL,
	"total_withdrawn" text NOT NULL,
	"remaining" text NOT NULL,
	CONSTRAINT "protocol_initialized_events_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
CREATE INDEX "inflation_distributed_day_idx" ON "inflation_distributed_events" USING btree ("day");--> statement-breakpoint
CREATE INDEX "rewards_claimed_user_idx" ON "rewards_claimed_events" USING btree ("user");--> statement-breakpoint
CREATE INDEX "stake_created_user_idx" ON "stake_created_events" USING btree ("user");--> statement-breakpoint
CREATE INDEX "stake_created_user_slot_idx" ON "stake_created_events" USING btree ("user","slot");--> statement-breakpoint
CREATE INDEX "stake_ended_user_idx" ON "stake_ended_events" USING btree ("user");--> statement-breakpoint
CREATE INDEX "tokens_claimed_claimer_idx" ON "tokens_claimed_events" USING btree ("claimer");--> statement-breakpoint
CREATE INDEX "vested_tokens_withdrawn_claimer_idx" ON "vested_tokens_withdrawn_events" USING btree ("claimer");