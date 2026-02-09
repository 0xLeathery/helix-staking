---
color: blue
position:
  x: 1524
  y: -166
isContextNode: false
agent_name: Aki
---

# Solana Integration

## Client-side Anchor program binding, PDA derivation, on-chain math replication, and protocol constants

### File Inventory

| File | Purpose | Lines |
|------|---------|-------|
| `lib/solana/program.ts` | Creates typed `Program<HelixStaking>` via Anchor + IDL | ~43 |
| `lib/solana/pdas.ts` | 6 PDA derivation functions matching on-chain seeds | ~78 |
| `lib/solana/math.ts` | Client-side replication of on-chain penalty/bonus math | ~215 |
| `lib/solana/constants.ts` | Protocol constants, PDA seeds, display labels | ~81 |
| `lib/utils/format.ts` | BN formatting (HELIX amounts, T-shares, days, bps) | ~178 |

### program.ts

Creates an Anchor `Program<HelixStaking>` instance from:
- **IDL**: Loaded from `public/idl/helix_staking.json`
- **Provider**: `AnchorProvider` wrapping Connection + wallet
- **Dummy wallet**: Read-only fallback with `.signTransaction()` that rejects

```typescript
getProgram(connection, wallet?) -> Program<HelixStaking>
```

The IDL and wallet types use `as any` casts to bridge Anchor type mismatches.

### pdas.ts -- PDA Seed Map

| Function | Seeds | Returns |
|----------|-------|---------|
| `deriveGlobalState()` | `["global_state"]` | Protocol singleton |
| `deriveMint()` | `["helix_mint"]` | Token-2022 mint PDA |
| `deriveMintAuthority()` | `["mint_authority"]` | Mint authority PDA |
| `deriveStakeAccount(user, stakeId)` | `["stake", user, stakeId_le_u64]` | Per-user stake PDA |
| `deriveClaimConfig()` | `["claim_config"]` | Claim period config singleton |
| `deriveClaimStatus(merkleRoot, wallet)` | `["claim_status", root[0..8], wallet]` | Per-user claim status |

Note: `stakeId` is serialized as **little-endian u64** buffer (`toArrayLike(Buffer, "le", 8)`), matching the Anchor on-chain derivation.

### math.ts -- On-Chain Replication

All functions use `bn.js` BN arithmetic to match the on-chain Rust u128 intermediate calculations.

| Function | Formula | Notes |
|----------|---------|-------|
| `calculateLpbBonus(days)` | `(days-1) * 2 * PRECISION / LPB_MAX_DAYS` | Caps at `2 * PRECISION` for days >= 3641 |
| `calculateBpbBonus(amount)` | `(amount/10) * PRECISION / BPB_THRESHOLD` | Caps at `PRECISION` for amounts >= threshold*10 |
| `calculateTShares(amount, days, shareRate)` | `amount * (PRECISION + LPB + BPB) / shareRate` | Combines both bonuses |
| `calculateEarlyPenalty(...)` | `(1 - elapsed/total) * amount`, min 50% | Uses `mulDivUp` for protocol-favorable rounding |
| `calculateLatePenalty(...)` | `penaltyDays * amount / 351` | 14-day grace, caps at 100% |
| `calculatePendingRewards(tShares, shareRate, debt)` | `tShares * shareRate - rewardDebt` | Saturating subtraction (min 0) |

Helper functions:
- `mulDiv(a, b, c)`: `(a * b) / c`
- `mulDivUp(a, b, c)`: `(a * b + c - 1) / c` -- rounds UP to favor protocol

### constants.ts -- Protocol Parameters

| Constant | Value | Purpose |
|----------|-------|---------|
| `PROGRAM_ID` | `E9B7Bs...` | On-chain program address |
| `TOKEN_DECIMALS` | 8 | HELIX uses 8 decimal places |
| `PRECISION` | `1_000_000_000` (1e9) | Fixed-point scaling for bonus math |
| `MAX_STAKE_DAYS` | 5555 | Maximum lock duration |
| `LPB_MAX_DAYS` | 3641 | Days for full 2x duration bonus |
| `BPB_THRESHOLD` | `15000000000000000` | Size bonus threshold (~150M tokens) |
| `GRACE_PERIOD_DAYS` | 14 | Penalty-free unstake window after maturity |
| `LATE_PENALTY_WINDOW_DAYS` | 351 | Days to reach 100% late penalty |
| `MIN_PENALTY_BPS` | 5000 | Minimum 50% early penalty |
| `SLOTS_PER_DAY` | 216_000 | ~400ms per slot |
| `TSHARE_DISPLAY_FACTOR` | `10^12` | Scale factor for human-readable T-shares |

PDA seeds are Buffer-encoded strings: `"global_state"`, `"helix_mint"`, `"mint_authority"`, `"stake"`, `"claim_config"`, `"claim_status"`.

### format.ts -- Display Utilities

| Function | Input | Output Example |
|----------|-------|---------------|
| `formatHelix(BN, showSymbol?)` | `BN(150000000)` | `"1.50 HELIX"` |
| `formatHelixCompact(BN)` | `BN(1.5e15)` | `"1.50M"` |
| `parseHelix(string)` | `"1.5"` | `BN(150000000)` |
| `formatBps(number)` | `5000` | `"50.00%"` |
| `formatDays(number)` | `1825` | `"5.0 years"` |
| `formatTShares(BN)` | `BN(5e14)` | `"500.00"` |
| `truncateAddress(string)` | `"AbCd...Wxyz..."` | `"AbCd...Wxyz"` |

### Notable Gotchas

- **Client math MUST match on-chain**: Any divergence between `math.ts` and the Rust program will show users incorrect bonus/penalty previews. This is a critical sync point during protocol upgrades.
- **BN overflow risk**: `calculateTShares` multiplies `amount * totalMultiplier` which can produce very large intermediates. BN handles arbitrary precision, but be aware when converting to `number` (loss of precision above 2^53).
- **`parseHelix` truncates, does not round**: Input `"1.123456789"` becomes `"1.12345678"` (8 decimals). This matches on-chain behavior where extra precision is dropped.
- **SLOTS_PER_DAY is a constant**: The on-chain program has an `admin_set_slots_per_day` instruction, but the frontend hardcodes 216,000. If the admin changes it on-chain, the frontend will show incorrect time calculations until the constant is updated.
- **Token-2022 (not legacy SPL)**: The program uses Token Extensions (Token-2022). Using legacy SPL Token program ID for ATA derivation will produce wrong addresses.
- **TSHARE_DISPLAY_FACTOR normalization**: Raw on-chain T-share values are divided by 10^12 for display, making "100 T-Shares" correspond to a modest stake. This scaling is purely cosmetic.

[[frontend-dashboard.md]]
