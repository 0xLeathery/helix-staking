---
color: yellow
position:
  x: 1840
  y: 658
isContextNode: false
---
# Module 6: Big Pay Day (BPD) Distribution System

**Parent**: [[run_me_context_1770768781075.md]]

## Purpose

Multi-phase distribution mechanism that redistributes unclaimed airdrop tokens to active stakers based on their share-days (time-weighted stake commitment). Implements batch processing, speed bonuses, and anti-gaming protections.

## BPD Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Idle: Initial State
    Idle --> InProgress: trigger_big_pay_day()
    
    InProgress --> Calculating: crank_distribution() [batch 1]
    Calculating --> Calculating: crank_distribution() [batch N]
    Calculating --> Ready: All stakes processed
    
    Ready --> Finalized: finalize_bpd_calculation() [admin]
    Finalized --> Sealed: seal_bpd_finalize() [admin]
    
    Sealed --> Distributing: Users claim via claim_rewards()
    Distributing --> Idle: All claims processed
    
    InProgress --> Idle: abort_bpd() [admin, emergency]
    Calculating --> Idle: abort_bpd()
    Ready --> Idle: abort_bpd()
```

## Multi-Batch Processing Flow

```mermaid
sequenceDiagram
    participant A as Admin
    participant C as Crank Operator
    participant P as Program
    participant S1 as Stakes [0-19]
    participant S2 as Stakes [20-39]
    participant SN as Stakes [N-...]
    
    A->>P: trigger_big_pay_day()
    P->>P: Set bpd_state = InProgress
    
    C->>P: crank_distribution(stakes[0-19])
    P->>S1: Calculate share_days
    P->>P: Accumulate total_share_days
    P->>S1: Mark bpd_finalize_period_id
    
    C->>P: crank_distribution(stakes[20-39])
    P->>S2: Calculate share_days
    P->>P: Accumulate total_share_days
    P->>S2: Mark bpd_finalize_period_id
    
    C->>P: crank_distribution(stakes[N-...]) [last batch]
    P->>SN: Calculate share_days
    P->>P: total_share_days finalized
    P->>P: Set bpd_state = Calculating
    
    A->>P: finalize_bpd_calculation()
    P->>P: Calculate distribution_rate
    P->>P: Set bpd_state = Finalized
    
    A->>P: seal_bpd_finalize()
    P->>P: Lock distribution_rate
    P->>P: bpd_state = None
```

## Share-Days Calculation

```mermaid
flowchart TD
    A[Stake Account] --> B[Get T-Shares]
    B --> C[Calculate Days Staked]
    C --> D[share_days = t_shares * days]
    
    E[All Stakes] --> F[Sum share_days]
    F --> G[total_share_days]
    
    D --> H[Individual Portion]
    G --> H
    H --> I[portion = share_days / total_share_days]
    
    J[Unclaimed Pool] --> K[stake_bonus = pool * portion]
    I --> K
```

**Formula**:
```rust
// Per stake
current_day = (current_slot - stake.start_slot) / slots_per_day;
share_days = stake.t_shares * min(current_day, stake.lock_duration_days);

// Global accumulation
total_share_days += share_days;

// Final distribution (after finalize)
distribution_rate = unclaimed_pool / total_share_days;
stake.bpd_bonus_pending = share_days * distribution_rate;
```

## Batch Processing Strategy

```mermaid
flowchart LR
    A[Total Stakes: 500] --> B{Batch Size}
    B -->|Max 20| C[Batch 1: 0-19]
    B -->|Max 20| D[Batch 2: 20-39]
    B -->|Max 20| E[Batch 25: 480-499]
    
    C --> F[Crank Call 1]
    D --> G[Crank Call 2]
    E --> H[Crank Call 25]
    
    F --> I[Idempotent: Skip if already marked]
    G --> I
    H --> I
```

**Constraints**:
- **Max accounts per transaction**: 20 stakes (Solana account limit ~32, minus program/global)
- **Idempotency**: Stakes with matching `bpd_finalize_period_id` are skipped
- **Last batch detection**: Automatically transitions to `Calculating` when no unprocessed stakes remain

## Anti-Gaming Protections

### CRIT-NEW-1 Fix: Permissionless Finalize Attack

**Original Vulnerability**:
```rust
// ❌ BEFORE: Attacker could call finalize with subset of stakes
pub fn finalize_bpd_calculation(ctx: Context<FinalizeBpd>) -> Result<()> {
    // No check on who calls this!
    let rate = global.unclaimed_pool / global.total_share_days;
    global.bpd_distribution_rate = rate;
}
```

**Exploit**:
1. Attacker waits for crank to process 480/500 stakes
2. Calls `finalize_bpd_calculation` before remaining 20 are processed
3. Distribution rate is calculated with incomplete `total_share_days`
4. Remaining 20 stakes get 0% of pool (already finalized)

**Fix**:
```rust
// ✅ AFTER: Admin-only + two-phase seal
#[access_control(only_admin(&ctx))]
pub fn finalize_bpd_calculation(ctx: Context<FinalizeBpd>) -> Result<()> {
    require!(global.bpd_state == BpdState::Calculating, ErrorCode::InvalidBpdState);
    
    let rate = global.unclaimed_pool / global.total_share_days;
    global.bpd_distribution_rate = rate;
    global.bpd_state = BpdState::Finalized; // Not yet distributable!
}

#[access_control(only_admin(&ctx))]
pub fn seal_bpd_finalize(ctx: Context<SealBpd>) -> Result<()> {
    require!(global.bpd_state == BpdState::Finalized, ErrorCode::InvalidBpdState);
    global.bpd_state = BpdState::None; // Now distributable
}
```

### Period ID Tracking

```mermaid
flowchart TD
    A[Global: bpd_finalize_period_id = 5] --> B[Stake: bpd_finalize_period_id = 0]
    B --> C{Already processed?}
    C -->|No: 0 != 5| D[Process stake]
    D --> E[Set stake.bpd_finalize_period_id = 5]
    
    F[Same stake in next batch] --> G{Already processed?}
    G -->|Yes: 5 == 5| H[Skip stake]
```

**Prevention**:
- Duplicate processing within same BPD cycle
- Accidental inclusion in multiple batches

### Abort Recovery Issue

**Known Bug** (HIGH severity):
```rust
// ❌ PROBLEM: abort_bpd does NOT reset per-stake fields
pub fn abort_bpd(ctx: Context<AbortBpd>) -> Result<()> {
    global.bpd_state = BpdState::None;
    global.total_share_days = 0;
    global.bpd_distribution_rate = 0;
    // Missing: Reset all stake.bpd_finalize_period_id to 0!
}
```

**Impact**:
1. BPD cycle 1 starts: `global.bpd_finalize_period_id = 1`
2. Crank processes 100 stakes: They get `stake.bpd_finalize_period_id = 1`
3. Admin aborts due to bug: `abort_bpd()`
4. New BPD cycle starts with SAME `claim_period_id`: `global.bpd_finalize_period_id = 1`
5. Those 100 stakes are skipped (already marked as processed)!

**Workaround**: Always increment `claim_period_id` after abort

## State Transitions

| Instruction | From State | To State | Admin Only? |
|-------------|-----------|----------|-------------|
| `trigger_big_pay_day` | None | InProgress | ❌ |
| `crank_distribution` [mid] | InProgress | InProgress | ❌ |
| `crank_distribution` [last] | InProgress | Calculating | ❌ |
| `finalize_bpd_calculation` | Calculating | Finalized | ✅ |
| `seal_bpd_finalize` | Finalized | None | ✅ |
| `abort_bpd` | Any | None | ✅ |

## Notable Gotchas

### 🔴 CRITICAL ISSUES

1. **Last batch detection relies on account list**
   - **Issue**: Crank operator must provide ALL remaining stakes in final batch
   - **Risk**: Missing stakes → stuck in `InProgress` forever
   - **Mitigation**: Off-chain indexer tracks unprocessed stakes

2. **No time limit on BPD duration**
   - **Issue**: BPD can stay `InProgress` for days/weeks
   - **Impact**: New stakes during BPD might not be included
   - **Design**: Intentional (snapshot at trigger time)

3. **Finalize before seal window**
   - **Issue**: `Finalized` state blocks new BPD trigger
   - **Impact**: If admin delays `seal_bpd_finalize`, system is paused
   - **Workaround**: Abort and restart

### ⚠️ Operational Considerations

- **Crank coordination**: Multiple crank operators can cause duplicate work (idempotent but wasteful)
- **Gas costs**: 500 stakes = 25 crank calls = ~0.025 SOL in fees
- **Ordering matters**: Process oldest stakes first to maximize share-days accuracy
- **Claim window**: Users can claim BPD bonuses anytime after seal (no expiry)

### 💡 Implementation Details

- **Share-days capped at lock_duration**: Prevents infinite accumulation from very old stakes
- **Distribution rate precision**: Uses u128 to avoid rounding errors
- **Bonus stored in `bpd_bonus_pending`**: Not auto-distributed (user must `claim_rewards`)
- **Emit events**: `BpdTriggered`, `BpdFinalized`, `BpdSealed` for indexer tracking

## Key Files

| File | Purpose |
|------|---------|
| `instructions/trigger_big_pay_day.rs` | BPD initialization |
| `instructions/crank_distribution.rs` | Batch stake processing |
| `instructions/finalize_bpd_calculation.rs` | Rate calculation (admin) |
| `instructions/seal_bpd_finalize.rs` | Enable distribution (admin) |
| `instructions/abort_bpd.rs` | Emergency reset (admin) |
| `state/global_state.rs` | BPD state enum + fields |
| `tests/bankrun/phase3/triggerBpd.test.ts` | State transition tests |
| `tests/bankrun/phase3/crankDistribution.test.ts` | Batch processing tests |
| `tests/bankrun/tests/bpd_math.test.ts` | Share-days calculation |

## Economic Model

```mermaid
flowchart TD
    A[1M tokens unclaimed] --> B{Speed Bonus Distribution}
    B -->|10%| C[Immediately minted]
    B -->|90%| D[Linear vesting 365d]
    
    D --> E{After 365 days}
    E -->|50% withdrawn| F[500K in circulation]
    E -->|50% NOT withdrawn| G[500K redistribution pool]
    
    G --> H[BPD Trigger]
    H --> I[Staker A: 1M T-Shares, 180 days]
    H --> J[Staker B: 500K T-Shares, 360 days]
    
    I --> K[Share-days A = 180M]
    J --> L[Share-days B = 180M]
    
    K --> M[Total = 360M share-days]
    L --> M
    
    M --> N[Rate = 500K / 360M = 0.00139]
    
    N --> O[Bonus A = 180M * 0.00139 = 250K]
    N --> P[Bonus B = 180M * 0.00139 = 250K]
```

**Incentive Alignment**:
- Early stakers accumulate more share-days → larger BPD portion
- Long lock durations grant more T-Shares → higher share-days
- Encourages NOT withdrawing vested tokens (more to redistribute)

## Monitoring & Alerts

**Recommended alerts**:
- BPD stuck in `InProgress` for > 24 hours
- `total_share_days` not increasing during crank
- `finalize_bpd_calculation` called with < 90% stakes processed
- Abort events (investigate why)

## Performance Benchmarks

- **Crank processing**: ~200ms per batch (20 stakes)
- **Total BPD duration**: ~10 minutes for 1000 stakes
- **Compute units**: ~50K CU per crank call
- **Storage growth**: +8 bytes per stake (period ID field)

## Future Improvements

1. **Automatic finalize detection**: Remove admin requirement, auto-finalize when all stakes processed
2. **Partial BPD**: Allow BPD while some stakes are excluded (opt-in flag)
3. **Time-weighted decay**: Recent share-days count more than old ones
4. **Multi-token BPD**: Distribute multiple SPL tokens in single cycle
5. **Penalty-funded BPD**: Add early unstake penalties to redistribution pool

[[/Users/annon/projects/solhex/voicetree-9-2/module-1-onchain-program.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/module-2-frontend-dashboard.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/module-4-tokenomics-engine.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/module-3-indexer-service.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/module-5-testing-infrastructure.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/module-7-free-claim-system.md]]
[[/Users/annon/projects/solhex/voicetree-9-2/codebase-architecture-map.md]]