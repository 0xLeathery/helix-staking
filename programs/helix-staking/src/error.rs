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
}
