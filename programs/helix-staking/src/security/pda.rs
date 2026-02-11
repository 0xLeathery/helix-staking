//! PDA Derivation and Validation
//!
//! This module provides Anchor-equivalent PDA validation for bulk operations
//! that accept remaining_accounts (which Anchor cannot validate declaratively).
//!
//! Pattern: All bulk operations must validate PDAs using these functions.
//! This ensures consistency with standard instructions that use Anchor constraints.
//!
//! Security Guarantees:
//! - Account is owned by our program
//! - Account deserializes as correct type
//! - PDA is correctly derived from seeds
//! - Bump is canonical (only valid bump for these seeds)
//! - Account key matches derived PDA

use anchor_lang::prelude::*;
use crate::constants::*;
use crate::error::HelixError;
use crate::state::StakeAccount;

/// Validates a StakeAccount PDA is correctly derived with canonical bump.
///
/// This function replaces manual PDA validation in bulk operations like
/// trigger_big_pay_day and finalize_bpd_calculation, which accept
/// remaining_accounts and cannot use Anchor's declarative constraints.
///
/// # Arguments
/// * `account_info` - The AccountInfo to validate
/// * `stake` - The deserialized StakeAccount (must already be validated for size/ownership)
///
/// # Returns
/// - `Ok(())` if the PDA is valid
/// - `Err(HelixError)` if any validation fails
///
/// # Examples
/// ```rust
/// if validate_stake_pda(&account_info, &stake).is_err() {
///     continue;  // Skip invalid account in bulk operation
/// }
/// // Now we know account_info is the correct StakeAccount for this stake
/// ```
pub fn validate_stake_pda(
    account_info: &AccountInfo,
    stake: &StakeAccount,
) -> Result<()> {
    // Derive the canonical PDA from seeds (returns the ONLY valid bump)
    let (expected_pda, expected_bump) = Pubkey::try_find_program_address(
        &[
            STAKE_SEED,
            stake.user.as_ref(),
            &stake.stake_id.to_le_bytes(),
        ],
        &crate::id(),
    ).ok_or(error!(HelixError::InvalidPDA))?;

    // Verify account key matches derived PDA
    require_keys_eq!(
        account_info.key(),
        expected_pda,
        HelixError::InvalidPDA
    );

    // Verify bump is canonical (critical for preventing seed canonicalization attacks)
    require_eq!(
        stake.bump,
        expected_bump,
        HelixError::InvalidBumpSeed
    );

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    // Tests will be in tests/bankrun/security.test.ts (integration tests)
    // Unit tests here for pure validation logic if needed
}
