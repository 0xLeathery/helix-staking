# T03: 24-anchor-program-boost-system 03

**Slice:** S06 — **Milestone:** M001

## Description

Modify claim_rewards to apply the 10% boost multiplier with live seed balance verification, implement permanent revocation on balance drop, and complete all LiteSVM integration tests for BOOST-04 through BOOST-07.

Purpose: This plan makes the boost economically real -- boosted stakers actually receive 10% more tokens when claiming. The live balance check ensures boost cannot be gamed (sell seed tokens -> lose boost permanently). This is the core enforcement mechanism.

Output: Modified claim_rewards instruction with boost check, complete integration test suite proving all 7 BOOST requirements, and the phase is fully testable.

## Must-Haves

- [ ] "claim_rewards reads current seed ATA balance and applies boost only if current >= snapshot"
- [ ] "claim_rewards revokes boost permanently if current balance < snapshot (sets boost_revoked = true)"
- [ ] "A revoked boost is never restored even if user repurchases seed tokens"
- [ ] "Boosted claim mints extra tokens -- RewardsClaimed.amount is strictly higher for seed holder vs identical non-seed stake"
- [ ] "Boost applies after loyalty multiplier, before BPD bonus: final = (loyalty_adjusted * 1.10) + bpd_bonus"
- [ ] "BPD bonus is NOT amplified by boost"
- [ ] "Non-boosted stakers are unaffected (claim_rewards works without seed ATA in remaining_accounts)"
- [ ] "Headroom: selling surplus above snapshot does not trigger revocation at claim time"

## Files

- `programs/helix-staking/src/instructions/claim_rewards.rs`
- `tests/litesvm/boost.test.ts`
