Verify that protocol constants are in sync across all components.

1. Read `programs/helix-staking/src/constants.rs`
2. Read `app/web/lib/solana/constants.ts`
3. Compare all shared constants (PRECISION, TOKEN_DECIMALS, BPD limits, PDA seeds, etc.)
4. Report any mismatches with exact values from both files
5. If fixes are needed, update the TypeScript file to match Rust (Rust is source of truth)
