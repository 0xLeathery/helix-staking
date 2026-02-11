# Data Model: Audit Fixes

**Feature**: Audit Fixes (Phase 8.1)
**Date**: 2026-02-11

## Program State (On-Chain)

### GlobalState (Modified)
No new fields, but strict validation on existing ones.
- **`slots_per_day`**: Bounded to ±10% of `DEFAULT_SLOTS_PER_DAY` (216,000) from `constants.rs`. No new field required; the constant serves as the baseline.
- **`claim_end_slot`**: Immutable or monotonic increase only.

### BPDState (Logic Change)
- **`speed_bonus`**: Calculation logic updated to use `u64::saturating_sub` instead of checked math to prevent panics.

## Indexer Schema (PostgreSQL)

### `indexer_checkpoints` (Existing - Hardening)
- **`last_signature`**: Updated ATOMICALLY with event insertion.
- **`last_slot`**: Updated ATOMICALLY with event insertion.

### `migrations` (New Table)
Standard migration tracking table (managed by Drizzle/DbMate).
- **`id`**: Serial
- **`name`**: Migration filename
- **`applied_at`**: Timestamp

## Frontend State (React)

### ErrorBoundaryState
- **`hasError`**: Boolean
- **`error`**: Error object
- **`errorInfo`**: Stack trace info

### TransactionSimulation
- **`simulationResult`**: Object containing `err` (if any), `logs`, and `unitsConsumed`.
- **Validation**: If `simulationResult.err` is not null, block signing.