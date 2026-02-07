# Phase 1: Board Review Notes

**Date:** 2026-02-07
**Vote:** 5/5 APPROVE (unanimous)

## Advisory Notes for Execution

These notes were raised during the expert board review of 01-01-PLAN.md and 01-02-PLAN.md. They are advisory (non-blocking) but should be addressed during execution where applicable.

### From anchor-expert

1. **overflow-checks in root Cargo.toml** — `overflow-checks = true` should be set in the workspace root `Cargo.toml` `[profile.release]` section, not just the program-level Cargo.toml. Ensures all workspace crates get overflow protection.

2. **InterfaceAccount for Token-2022** — Use `InterfaceAccount<'info, Mint>` and `InterfaceAccount<'info, TokenAccount>` instead of `Account<'info, Mint>` when working with Token-2022. This ensures compatibility with both Token and Token-2022 programs.

3. **Pre-compute mint account space** — When creating a Token-2022 mint with metadata extension, the account space must be computed before `init_mint`. The metadata extension adds variable-length data. Use `ExtensionType::try_calculate_account_len(&[ExtensionType::MetadataPointer, ExtensionType::TokenMetadata])` or equivalent.

4. **Token-2022 in Bankrun** — The Token-2022 program may not be available by default in Bankrun's localnet. May need to explicitly add it to `startAnchor`'s extra programs list or use `add_program()` to load the Token-2022 BPF.

### From frontend-expert

5. **@solana/spl-token dependency** — May need `@solana/spl-token` in the test dependencies for parsing Token-2022 mint data and metadata in Bankrun tests.

### From tokenomics-expert

6. **Inflation BP encoding verified** — 3,690,000 basis points = 3.69% annual inflation. Encoding confirmed correct. The BP value uses a 100,000,000 denominator (not 10,000) — ensure consistent interpretation in distribution math.

### From indexer-expert

7. **Monotonic event counters** — GlobalState event counters (total_stakes_created, etc.) satisfy the indexer's need for reliable, gap-free event tracking. No additional changes needed for Phase 1.

### From security-expert

8. **All security hard gates passed** — overflow-checks, PDA authority separation, and account validation patterns all present in plans. No blocking concerns.

---

*These notes should be referenced by execution agents when implementing the plans.*
