Verify math parity between Rust and TypeScript implementations.

1. Read `programs/helix-staking/src/instructions/math.rs` (Rust)
2. Read `app/web/lib/solana/math.ts` (TypeScript)
3. Read `programs/helix-staking/src/constants.rs` and `app/web/lib/solana/constants.ts`
4. Compare every function and constant — they must produce identical results for all inputs
5. Report any discrepancies with specific line numbers and suggested fixes
6. If changes are needed, update both files to restore parity
