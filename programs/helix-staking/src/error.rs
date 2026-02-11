use anchor_lang::prelude::*;

#[error_code]
pub enum HelixError {
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid parameter value")]
    InvalidParameter,
    #[msg("Account already initialized")]
    AlreadyInitialized,
    #[msg("Stake amount below minimum")]
    StakeBelowMinimum,
    #[msg("Claim period has not ended")]
    ClaimPeriodActive,
    #[msg("Claim period has ended")]
    ClaimPeriodEnded,
    #[msg("Invalid Merkle proof")]
    InvalidMerkleProof,
    #[msg("Tokens already claimed")]
    AlreadyClaimed,
    #[msg("Failed to calculate mint account space")]
    InvalidMintSpace,
    #[msg("Invalid stake duration (must be 1-5555 days)")]
    InvalidStakeDuration,
    #[msg("Stake is not active")]
    StakeNotActive,
    #[msg("Stake is already closed")]
    StakeAlreadyClosed,
    #[msg("Unauthorized stake access")]
    UnauthorizedStakeAccess,
    #[msg("Distribution already completed for current day")]
    AlreadyDistributedToday,
    #[msg("No active shares for distribution")]
    NoActiveShares,
    #[msg("No rewards to claim")]
    NoRewardsToClaim,
    #[msg("Division by zero")]
    DivisionByZero,
    #[msg("Admin mint cap exceeded")]
    AdminMintCapExceeded,
    #[msg("Claim period not yet started")]
    ClaimPeriodNotStarted,
    #[msg("Claim period already started")]
    ClaimPeriodAlreadyStarted,
    #[msg("Big Pay Day already triggered")]
    BigPayDayAlreadyTriggered,
    #[msg("Big Pay Day not yet available")]
    BigPayDayNotAvailable,
    #[msg("Invalid Ed25519 signature")]
    InvalidSignature,
    #[msg("Missing Ed25519 verification instruction")]
    MissingEd25519Instruction,
    #[msg("No vested tokens available")]
    NoVestedTokens,
    #[msg("Insufficient vested balance")]
    InsufficientVestedBalance,
    #[msg("No eligible stakers for Big Pay Day")]
    NoEligibleStakers,
    #[msg("Stake not eligible for Big Pay Day")]
    StakeNotBpdEligible,
    #[msg("Snapshot balance below minimum")]
    SnapshotBalanceTooLow,
    #[msg("Reward debt calculation exceeds maximum storable value")]
    RewardDebtOverflow,
    #[msg("BPD rate calculation not yet complete")]
    BpdCalculationNotComplete,
    #[msg("BPD rate calculation already finalized")]
    BpdCalculationAlreadyComplete,
    #[msg("Unstaking is temporarily blocked during Big Pay Day calculation")]
    UnstakeBlockedDuringBpd,
    #[msg("Claim period ID must be greater than 0")]
    InvalidClaimPeriodId,
    #[msg("BPD distribution exceeded remaining pool")]
    BpdOverDistribution,
    #[msg("Stake not counted in BPD finalize phase")]
    StakeNotFinalized,
    #[msg("BPD finalization incomplete - no stakes finalized")]
    BpdFinalizationIncomplete,
    #[msg("BPD window is not active")]
    BpdWindowNotActive,
    #[msg("BPD finalize count mismatch - expected stakes do not match finalized count")]
    BpdFinalizeCountMismatch,
    #[msg("Cannot abort BPD after distribution has started")]
    BpdDistributionAlreadyStarted,
    #[msg("Signer does not match pending authority")]
    UnauthorizedNewAuthority,
    #[msg("Authority transfer blocked while BPD window is active")]
    AuthorityTransferBlockedDuringBpd,
    #[msg("BPD seal attempted before observation window elapsed")]
    BpdSealTooEarly,
    #[msg("Admin parameter change exceeds safe bounds (±10% of default)")]
    AdminBoundsExceeded,
    #[msg("Claim amount is zero — nothing to distribute")]
    ClaimAmountZero,
}
