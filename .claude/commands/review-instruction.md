Review a Solana program instruction for correctness and security.

For the instruction file specified by the user (or the most recently modified one in `programs/helix-staking/src/instructions/`):

1. Check **Check-Effects-Interactions** ordering — state mutations must happen before CPI calls
2. Verify all account constraints in `#[derive(Accounts)]` are sufficient
3. Ensure no `unwrap()` calls — must use `ok_or(HelixError::...)` or `?`
4. Confirm an event is emitted with a `slot: u64` field
5. Check for integer overflow risks (even though overflow checks are enabled)
6. Verify PDA seeds match the patterns in `src/constants.rs`
7. Report findings with severity levels: Critical / Warning / Info
