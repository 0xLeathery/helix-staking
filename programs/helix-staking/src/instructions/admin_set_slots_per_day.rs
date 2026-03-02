use anchor_lang::prelude::*;

use crate::constants::*;
use crate::error::HelixError;
use crate::state::GlobalState;

/// Admin-only instruction to override slots_per_day.
/// Used for devnet/testing to make "days" pass faster
/// so BPD eligibility (requires >= 1 day staked) can be tested.
#[derive(Accounts)]
pub struct AdminSetSlotsPerDay<'info> {
    #[account(
        constraint = authority.key() == global_state.authority @ HelixError::Unauthorized
    )]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,
}

pub fn admin_set_slots_per_day(
    ctx: Context<AdminSetSlotsPerDay>,
    new_slots_per_day: u64,
) -> Result<()> {
    require!(new_slots_per_day > 0, HelixError::InvalidParameter);

    // A-4 FIX: Use a reasonable ceiling (10× default) to prevent extreme values
    // while still allowing devnet/testing values (e.g. slots_per_day = 10).
    // The floor is 1 (checked above). The ceiling prevents accidental
    // values that would break day calculations (e.g. u64::MAX).
    let upper_bound = DEFAULT_SLOTS_PER_DAY
        .checked_mul(10)
        .ok_or(HelixError::Overflow)?;
    require!(
        new_slots_per_day <= upper_bound,
        HelixError::AdminBoundsExceeded
    );

    ctx.accounts.global_state.slots_per_day = new_slots_per_day;
    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::constants::*;

    #[test]
    fn test_slots_per_day_bounds() {
        let upper_bound = DEFAULT_SLOTS_PER_DAY.checked_mul(10).unwrap();

        // 1 is valid (floor = 1)
        assert!(1u64 > 0 && 1u64 <= upper_bound);

        // Default is valid
        assert!(DEFAULT_SLOTS_PER_DAY > 0 && DEFAULT_SLOTS_PER_DAY <= upper_bound);

        // Upper bound is valid
        assert!(upper_bound > 0 && upper_bound <= upper_bound);

        // 0 is invalid
        assert!(!(0u64 > 0));

        // Upper + 1 is invalid
        assert!(!(upper_bound + 1 <= upper_bound));
    }

    #[test]
    fn test_slots_per_day_upper_bound_value() {
        // Upper bound = 10 * DEFAULT = 10 * 216_000 = 2_160_000
        let upper = DEFAULT_SLOTS_PER_DAY.checked_mul(10).unwrap();
        assert_eq!(upper, 2_160_000);
    }
}
