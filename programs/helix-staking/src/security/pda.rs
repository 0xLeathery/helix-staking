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

use crate::constants::*;
use crate::error::HelixError;
use crate::state::StakeAccount;
use anchor_lang::prelude::*;

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
pub fn validate_stake_pda(account_info: &AccountInfo, stake: &StakeAccount) -> Result<()> {
    // Derive the canonical PDA from seeds (returns the ONLY valid bump)
    let (expected_pda, expected_bump) = Pubkey::try_find_program_address(
        &[
            STAKE_SEED,
            stake.user.as_ref(),
            &stake.stake_id.to_le_bytes(),
        ],
        &crate::id(),
    )
    .ok_or(error!(HelixError::InvalidPDA))?;

    // Verify account key matches derived PDA
    require_keys_eq!(account_info.key(), expected_pda, HelixError::InvalidPDA);

    // Verify bump is canonical (critical for preventing seed canonicalization attacks)
    require_eq!(stake.bump, expected_bump, HelixError::InvalidBumpSeed);

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants::*;

    #[test]
    fn test_stake_pda_derivation_is_deterministic() {
        // Same inputs should always yield the same PDA
        let user = Pubkey::new_unique();
        let stake_id: u64 = 42;

        let (pda1, bump1) = Pubkey::try_find_program_address(
            &[STAKE_SEED, user.as_ref(), &stake_id.to_le_bytes()],
            &crate::id(),
        )
        .unwrap();

        let (pda2, bump2) = Pubkey::try_find_program_address(
            &[STAKE_SEED, user.as_ref(), &stake_id.to_le_bytes()],
            &crate::id(),
        )
        .unwrap();

        assert_eq!(pda1, pda2, "PDA derivation is deterministic");
        assert_eq!(bump1, bump2, "Canonical bump is deterministic");
    }

    #[test]
    fn test_different_users_yield_different_pdas() {
        let user1 = Pubkey::new_unique();
        let user2 = Pubkey::new_unique();
        let stake_id: u64 = 0;

        let (pda1, _) = Pubkey::try_find_program_address(
            &[STAKE_SEED, user1.as_ref(), &stake_id.to_le_bytes()],
            &crate::id(),
        )
        .unwrap();

        let (pda2, _) = Pubkey::try_find_program_address(
            &[STAKE_SEED, user2.as_ref(), &stake_id.to_le_bytes()],
            &crate::id(),
        )
        .unwrap();

        assert_ne!(pda1, pda2, "Different users yield different PDAs");
    }

    #[test]
    fn test_different_stake_ids_yield_different_pdas() {
        let user = Pubkey::new_unique();

        let (pda1, _) = Pubkey::try_find_program_address(
            &[STAKE_SEED, user.as_ref(), &0u64.to_le_bytes()],
            &crate::id(),
        )
        .unwrap();

        let (pda2, _) = Pubkey::try_find_program_address(
            &[STAKE_SEED, user.as_ref(), &1u64.to_le_bytes()],
            &crate::id(),
        )
        .unwrap();

        assert_ne!(pda1, pda2, "Different stake_ids yield different PDAs");
    }

    #[test]
    fn test_canonical_bump_is_valid() {
        // The canonical bump returned by try_find_program_address should create a valid PDA
        let user = Pubkey::new_unique();
        let stake_id: u64 = 5;

        let (pda, bump) = Pubkey::try_find_program_address(
            &[STAKE_SEED, user.as_ref(), &stake_id.to_le_bytes()],
            &crate::id(),
        )
        .unwrap();

        // Verify by recreating with create_program_address
        let recreated = Pubkey::create_program_address(
            &[STAKE_SEED, user.as_ref(), &stake_id.to_le_bytes(), &[bump]],
            &crate::id(),
        )
        .unwrap();

        assert_eq!(pda, recreated, "Canonical bump recreates the same PDA");
    }
}
