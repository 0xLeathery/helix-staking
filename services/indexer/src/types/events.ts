/**
 * TypeScript interfaces mirroring all 11 Helix Staking program events.
 *
 * Convention:
 * - camelCase field names (Anchor JS SDK convention)
 * - Pubkey fields -> string
 * - u64/u128 fields -> string (BN.toString()) to avoid JS precision loss
 * - u8/u16/u32 fields -> number
 * - [u8; 32] fields -> number[]
 */

export interface ProtocolInitialized {
  slot: string;
  globalState: string;
  mint: string;
  mintAuthority: string;
  authority: string;
  annualInflationBp: string;
  minStakeAmount: string;
  startingShareRate: string;
  slotsPerDay: string;
}

export interface StakeCreated {
  slot: string;
  user: string;
  stakeId: string;
  amount: string;
  tShares: string;
  days: number;
  shareRate: string;
}

export interface StakeEnded {
  slot: string;
  user: string;
  stakeId: string;
  originalAmount: string;
  returnAmount: string;
  penaltyAmount: string;
  penaltyType: number;
  rewardsClaimed: string;
}

export interface RewardsClaimed {
  slot: string;
  user: string;
  stakeId: string;
  amount: string;
}

export interface InflationDistributed {
  slot: string;
  day: string;
  daysElapsed: string;
  amount: string;
  newShareRate: string;
  totalShares: string;
}

export interface AdminMinted {
  slot: string;
  authority: string;
  recipient: string;
  amount: string;
}

export interface ClaimPeriodStarted {
  slot: string;
  timestamp: string;
  claimPeriodId: number;
  merkleRoot: number[];
  totalClaimable: string;
  totalEligible: number;
  claimDeadlineSlot: string;
}

export interface TokensClaimed {
  slot: string;
  timestamp: string;
  claimer: string;
  snapshotWallet: string;
  claimPeriodId: number;
  snapshotBalance: string;
  baseAmount: string;
  bonusBps: number;
  daysElapsed: number;
  totalAmount: string;
  immediateAmount: string;
  vestingAmount: string;
  vestingEndSlot: string;
}

export interface VestedTokensWithdrawn {
  slot: string;
  timestamp: string;
  claimer: string;
  amount: string;
  totalVested: string;
  totalWithdrawn: string;
  remaining: string;
}

export interface ClaimPeriodEnded {
  slot: string;
  timestamp: string;
  claimPeriodId: number;
  totalClaimed: string;
  claimsCount: number;
  unclaimedAmount: string;
}

export interface BigPayDayDistributed {
  slot: string;
  timestamp: string;
  claimPeriodId: number;
  totalUnclaimed: string;
  totalEligibleShareDays: string;
  helixPerShareDay: string;
  eligibleStakers: number;
}

export interface BpdAborted {
  claimPeriodId: number;
  stakesFinalized: number;
  stakesDistributed: number;
}

/** All event name strings */
export const EVENT_NAMES = [
  'ProtocolInitialized',
  'StakeCreated',
  'StakeEnded',
  'RewardsClaimed',
  'InflationDistributed',
  'AdminMinted',
  'ClaimPeriodStarted',
  'TokensClaimed',
  'VestedTokensWithdrawn',
  'ClaimPeriodEnded',
  'BigPayDayDistributed',
  'BpdAborted',
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

/** Map from event name to its data type */
export interface EventDataMap {
  ProtocolInitialized: ProtocolInitialized;
  StakeCreated: StakeCreated;
  StakeEnded: StakeEnded;
  RewardsClaimed: RewardsClaimed;
  InflationDistributed: InflationDistributed;
  AdminMinted: AdminMinted;
  ClaimPeriodStarted: ClaimPeriodStarted;
  TokensClaimed: TokensClaimed;
  VestedTokensWithdrawn: VestedTokensWithdrawn;
  ClaimPeriodEnded: ClaimPeriodEnded;
  BigPayDayDistributed: BigPayDayDistributed;
  BpdAborted: BpdAborted;
}

/** Discriminated union type for any indexed event */
export type IndexedEvent = {
  [K in EventName]: { name: K; data: EventDataMap[K] };
}[EventName];
