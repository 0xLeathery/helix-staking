//! Security validation utilities for Helix Staking.
//!
//! This module contains reusable validation functions that enforce
//! critical security invariants across all instruction handlers.

pub mod pda;

pub use pda::validate_stake_pda;
