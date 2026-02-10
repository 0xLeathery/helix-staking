# Research & Decisions: Audit Fixes

**Feature**: Audit Fixes (Phase 8.1)
**Date**: 2026-02-11

## 1. Safe Math for BPD
**Decision**: Use `saturating_sub` for speed bonus calculations.
**Rationale**: BPD calculations involve user-speed bonuses that *should* be positive but edge cases (or malicious inputs) could cause underflow. `saturating_sub` ensures the result floors at 0 instead of panicking, preventing the "bricking" scenario described in finding C1.
**Alternatives**: 
- `checked_sub` + error: Would cause transaction failure, potentially locking the BPD state if the error is unavoidable for a specific user. Saturating is safer for "best effort" bonus distribution.

## 2. Backward Pagination for Indexer
**Decision**: Recursive fetch loop in `poller.ts`.
**Rationale**: RPC `getSignaturesForAddress` has a hard limit (usually 1000). If the indexer is down for >1000 transactions, a simple poll misses data.
**Pattern**:
1. Fetch latest 1000 sigs.
2. If the oldest sig > last_known_checkpoint, fetch next 1000 starting from oldest sig.
3. Repeat until gap is closed.
4. Process all in reverse chronological order (or batch insert).

## 3. Atomic Indexer Checkpoints
**Decision**: Run event insertion and checkpoint update in a single SQL transaction.
**Rationale**: Finding H7 notes that if an event fails to insert (e.g., data error), the checkpoint might still advance if not transactional, permanently skipping that event.
**Implementation**: Use `db.transaction()` wrapper around the event processing loop.

## 4. CI/CD & Verifiable Builds
**Decision**: GitHub Actions with `anchor build --verifiable`.
**Rationale**: "Verifiable builds" (Dockerized) are the standard for Solana program verification. This allows third parties to verify the on-chain bytecode matches the source.
**Tooling**: Use standard `backpack-app/build-anchor-program` action or manual Docker invocation in CI.