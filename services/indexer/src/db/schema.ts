import {
  pgTable,
  serial,
  text,
  bigint,
  integer,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

// ---------------------------------------------------------------------------
// Helper: shared columns present in every event table
// ---------------------------------------------------------------------------
const sharedColumns = {
  id: serial('id').primaryKey(),
  signature: text('signature').notNull().unique(),
  slot: bigint('slot', { mode: 'number' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
};

// ---------------------------------------------------------------------------
// 1. ProtocolInitialized
// ---------------------------------------------------------------------------
export const protocolInitializedEvents = pgTable(
  'protocol_initialized_events',
  {
    ...sharedColumns,
    globalState: text('global_state').notNull(),
    mint: text('mint').notNull(),
    mintAuthority: text('mint_authority').notNull(),
    authority: text('authority').notNull(),
    annualInflationBp: text('annual_inflation_bp').notNull(),
    minStakeAmount: text('min_stake_amount').notNull(),
    startingShareRate: text('starting_share_rate').notNull(),
    slotsPerDay: text('slots_per_day').notNull(),
  },
);

// ---------------------------------------------------------------------------
// 2. StakeCreated
// ---------------------------------------------------------------------------
export const stakeCreatedEvents = pgTable(
  'stake_created_events',
  {
    ...sharedColumns,
    user: text('user').notNull(),
    stakeId: bigint('stake_id', { mode: 'number' }).notNull(),
    amount: text('amount').notNull(),
    tShares: text('t_shares').notNull(),
    days: integer('days').notNull(),
    shareRate: text('share_rate').notNull(),
  },
  (table) => [
    index('stake_created_user_idx').on(table.user),
    index('stake_created_user_slot_idx').on(table.user, table.slot),
  ],
);

// ---------------------------------------------------------------------------
// 3. StakeEnded
// ---------------------------------------------------------------------------
export const stakeEndedEvents = pgTable(
  'stake_ended_events',
  {
    ...sharedColumns,
    user: text('user').notNull(),
    stakeId: bigint('stake_id', { mode: 'number' }).notNull(),
    originalAmount: text('original_amount').notNull(),
    returnAmount: text('return_amount').notNull(),
    penaltyAmount: text('penalty_amount').notNull(),
    penaltyType: integer('penalty_type').notNull(),
    rewardsClaimed: text('rewards_claimed').notNull(),
  },
  (table) => [index('stake_ended_user_idx').on(table.user)],
);

// ---------------------------------------------------------------------------
// 4. RewardsClaimed
// ---------------------------------------------------------------------------
export const rewardsClaimedEvents = pgTable(
  'rewards_claimed_events',
  {
    ...sharedColumns,
    user: text('user').notNull(),
    stakeId: bigint('stake_id', { mode: 'number' }).notNull(),
    amount: text('amount').notNull(),
  },
  (table) => [index('rewards_claimed_user_idx').on(table.user)],
);

// ---------------------------------------------------------------------------
// 5. InflationDistributed
// ---------------------------------------------------------------------------
export const inflationDistributedEvents = pgTable(
  'inflation_distributed_events',
  {
    ...sharedColumns,
    day: bigint('day', { mode: 'number' }).notNull(),
    daysElapsed: bigint('days_elapsed', { mode: 'number' }).notNull(),
    amount: text('amount').notNull(),
    newShareRate: text('new_share_rate').notNull(),
    totalShares: text('total_shares').notNull(),
  },
  (table) => [index('inflation_distributed_day_idx').on(table.day)],
);

// ---------------------------------------------------------------------------
// 6. AdminMinted
// ---------------------------------------------------------------------------
export const adminMintedEvents = pgTable('admin_minted_events', {
  ...sharedColumns,
  authority: text('authority').notNull(),
  recipient: text('recipient').notNull(),
  amount: text('amount').notNull(),
});

// ---------------------------------------------------------------------------
// 7. ClaimPeriodStarted
// ---------------------------------------------------------------------------
export const claimPeriodStartedEvents = pgTable(
  'claim_period_started_events',
  {
    ...sharedColumns,
    timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
    claimPeriodId: integer('claim_period_id').notNull(),
    merkleRoot: text('merkle_root').notNull(),
    totalClaimable: text('total_claimable').notNull(),
    totalEligible: integer('total_eligible').notNull(),
    claimDeadlineSlot: text('claim_deadline_slot').notNull(),
  },
);

// ---------------------------------------------------------------------------
// 8. TokensClaimed
// ---------------------------------------------------------------------------
export const tokensClaimedEvents = pgTable(
  'tokens_claimed_events',
  {
    ...sharedColumns,
    timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
    claimer: text('claimer').notNull(),
    snapshotWallet: text('snapshot_wallet').notNull(),
    claimPeriodId: integer('claim_period_id').notNull(),
    snapshotBalance: text('snapshot_balance').notNull(),
    baseAmount: text('base_amount').notNull(),
    bonusBps: integer('bonus_bps').notNull(),
    daysElapsed: integer('days_elapsed').notNull(),
    totalAmount: text('total_amount').notNull(),
    immediateAmount: text('immediate_amount').notNull(),
    vestingAmount: text('vesting_amount').notNull(),
    vestingEndSlot: text('vesting_end_slot').notNull(),
  },
  (table) => [index('tokens_claimed_claimer_idx').on(table.claimer)],
);

// ---------------------------------------------------------------------------
// 9. VestedTokensWithdrawn
// ---------------------------------------------------------------------------
export const vestedTokensWithdrawnEvents = pgTable(
  'vested_tokens_withdrawn_events',
  {
    ...sharedColumns,
    timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
    claimer: text('claimer').notNull(),
    amount: text('amount').notNull(),
    totalVested: text('total_vested').notNull(),
    totalWithdrawn: text('total_withdrawn').notNull(),
    remaining: text('remaining').notNull(),
  },
  (table) => [
    index('vested_tokens_withdrawn_claimer_idx').on(table.claimer),
  ],
);

// ---------------------------------------------------------------------------
// 10. ClaimPeriodEnded
// ---------------------------------------------------------------------------
export const claimPeriodEndedEvents = pgTable('claim_period_ended_events', {
  ...sharedColumns,
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
  claimPeriodId: integer('claim_period_id').notNull(),
  totalClaimed: text('total_claimed').notNull(),
  claimsCount: integer('claims_count').notNull(),
  unclaimedAmount: text('unclaimed_amount').notNull(),
});

// ---------------------------------------------------------------------------
// 11. BigPayDayDistributed
// ---------------------------------------------------------------------------
export const bigPayDayDistributedEvents = pgTable(
  'big_pay_day_distributed_events',
  {
    ...sharedColumns,
    timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
    claimPeriodId: integer('claim_period_id').notNull(),
    totalUnclaimed: text('total_unclaimed').notNull(),
    totalEligibleShareDays: text('total_eligible_share_days').notNull(),
    helixPerShareDay: text('helix_per_share_day').notNull(),
    eligibleStakers: integer('eligible_stakers').notNull(),
  },
);

// ---------------------------------------------------------------------------
// 12. BpdAborted
// ---------------------------------------------------------------------------
export const bpdAbortedEvents = pgTable('bpd_aborted_events', {
  ...sharedColumns,
  claimPeriodId: integer('claim_period_id').notNull(),
  stakesFinalized: integer('stakes_finalized').notNull(),
  stakesDistributed: integer('stakes_distributed').notNull(),
});

// ---------------------------------------------------------------------------
// 13. BpdBatchFinalized (Phase 8.1)
// ---------------------------------------------------------------------------
export const bpdBatchFinalizedEvents = pgTable('bpd_batch_finalized_events', {
  ...sharedColumns,
  claimPeriodId: integer('claim_period_id').notNull(),
  batchStakesProcessed: integer('batch_stakes_processed').notNull(),
  totalStakesFinalized: integer('total_stakes_finalized').notNull(),
  cumulativeShareDays: text('cumulative_share_days').notNull(),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
});

// ---------------------------------------------------------------------------
// Operational: Checkpoints (polling state)
// ---------------------------------------------------------------------------
export const checkpoints = pgTable('checkpoints', {
  id: serial('id').primaryKey(),
  programId: text('program_id').notNull().unique(),
  lastSignature: text('last_signature'),
  lastSlot: bigint('last_slot', { mode: 'number' }),
  processedCount: bigint('processed_count', { mode: 'number' })
    .notNull()
    .default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
