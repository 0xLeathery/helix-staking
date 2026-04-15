# Requirements

## Active

### FRONT-05 — LP pool stats widget showing TVL, price, volume when pool exists

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

LP pool stats widget showing TVL, price, volume when pool exists

### TRUST-01 — Published documentation explaining full seed → boost → LP mechanics end-to-end

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Published documentation explaining full seed → boost → LP mechanics end-to-end

### TRUST-02 — Every on-chain action links to Solana Explorer for independent verification

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Every on-chain action links to Solana Explorer for independent verification

### TRUST-03 — SOL flow transparency dashboard showing how seed launch proceeds fund HLX LP

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

SOL flow transparency dashboard showing how seed launch proceeds fund HLX LP

### TRUST-04 — All boost state verifiable on-chain — no off-chain hidden state

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

All boost state verifiable on-chain — no off-chain hidden state

## Validated

### COMM-01 — Seed launch page clearly states creator rewards from seed token fund the HLX/SOL liquidity pool

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Seed launch page clearly states creator rewards from seed token fund the HLX/SOL liquidity pool

### COMM-02 — Seed launch page explains the seed token's purpose and its relationship to the HELIX protocol

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Seed launch page explains the seed token's purpose and its relationship to the HELIX protocol

### COMM-03 — Seed launch page explains boost eligibility — hold seed tokens for better APY when staking HLX

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Seed launch page explains boost eligibility — hold seed tokens for better APY when staking HLX

### COMM-04 — Pre-staking boost rules displayed prominently before any stake action — snapshot, headroom, permanent revocation explained in plain language

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Pre-staking boost rules displayed prominently before any stake action — snapshot, headroom, permanent revocation explained in plain language

### BOOST-01 — Admin can set seed token mint address and minimum balance threshold in program GlobalState (admin-adjustable)

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Admin can set seed token mint address and minimum balance threshold in program GlobalState (admin-adjustable)

### BOOST-02 — User can register for APY boost by proving seed token ownership on-chain (one boosted stake per wallet)

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

User can register for APY boost by proving seed token ownership on-chain (one boosted stake per wallet)

### BOOST-03 — Seed token balance is snapshotted in StakeAccount at stake time

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Seed token balance is snapshotted in StakeAccount at stake time

### BOOST-04 — `claim_rewards` verifies current seed balance >= snapshot before applying boost multiplier

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

`claim_rewards` verifies current seed balance >= snapshot before applying boost multiplier

### BOOST-05 — Boost revocation is permanent per stake — buying back seed tokens does not restore it

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Boost revocation is permanent per stake — buying back seed tokens does not restore it

### BOOST-06 — Boost multiplier of 10% (1,000 BPS) mints extra tokens at claim time (real rewards, not display-only)

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Boost multiplier of 10% (1,000 BPS) mints extra tokens at claim time (real rewards, not display-only)

### BOOST-07 — Buying more seed tokens after staking provides headroom above snapshot threshold

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Buying more seed tokens after staking provides headroom above snapshot threshold

### BOOST-08 — Crank checks all boosted stakers every 6 hours and revokes if balance dropped below snapshot

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Crank checks all boosted stakers every 6 hours and revokes if balance dropped below snapshot

### FRONT-01 — Boost indicator on staking dashboard showing eligible/active/revoked states

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Boost indicator on staking dashboard showing eligible/active/revoked states

### FRONT-02 — Boosted APY display shows actual multiplied rate when boost is active

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Boosted APY display shows actual multiplied rate when boost is active

### FRONT-03 — Wallet interaction to register for boost (calls `register_seed_boost` on-chain)

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Wallet interaction to register for boost (calls `register_seed_boost` on-chain)

### FRONT-04 — Push notification when boost is revoked (using existing notification infrastructure)

- Status: validated
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Push notification when boost is revoked (using existing notification infrastructure)

## Deferred

## Out of Scope
