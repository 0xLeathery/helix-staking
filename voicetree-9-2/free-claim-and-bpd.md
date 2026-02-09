---
color: red
agent_name: Aki
---

# Free Claim & Big Pay Day (BPD)

## Merkle airdrop, vesting, and unclaimed token redistribution

Complex multi-phase system for token distribution via Merkle proofs with speed bonuses, linear vesting, and redistribution of unclaimed tokens to stakers proportional to share-days.

### Free Claim Flow

```mermaid
sequenceDiagram
    participant Auth as Authority
    participant CC as ClaimConfig PDA
    participant User
    participant CS as ClaimStatus PDA

    Auth->>CC: initialize_claim_period(merkle_root)
    Note over CC: 180-day claim window starts

    User->>CS: free_claim(snapshot_balance, proof)
    Note over CS: Ed25519 signature verified (MEV prevention)
    Note over CS: Merkle proof verified
    Note over CS: Speed bonus applied (+20% wk1, +10% wk2-4)
    CS-->>User: 10% immediate mint
    Note over CS: 90% enters 30-day linear vesting

    User->>CS: withdraw_vested()
    CS-->>User: Proportional vested tokens
```

### Big Pay Day (BPD) - 3-Phase Process

After the 180-day claim period ends, unclaimed tokens are redistributed to stakes created during that period.

```mermaid
flowchart TD
    subgraph "Phase 1: Finalize (Authority, Batched)"
        F1[First batch] -->|calc unclaimed| F2[Pin snapshot slot]
        F2 -->|activate BPD window| F3[Scan stakes in batches of 20]
        F3 -->|accumulate| SD[total_share_days += t_shares * days_staked]
        F3 -->|mark| FM[bpd_finalize_period_id = claim_period_id]
    end

    subgraph "Phase 1.5: Seal (Authority)"
        SD --> SEAL[seal_bpd_finalize]
        SEAL -->|calculate| RATE[bpd_helix_per_share_day =<br/>unclaimed * PRECISION / total_share_days]
        SEAL -->|set| DONE[bpd_calculation_complete = true]
    end

    subgraph "Phase 2: Trigger (Permissionless, Batched)"
        DONE --> T1[trigger_big_pay_day]
        T1 -->|use pre-calc rate| T2[bonus = share_days * rate / PRECISION]
        T2 -->|add to| BP[stake.bpd_bonus_pending]
        T2 -->|mark| TM[bpd_claim_period_id = claim_period_id]
        T2 -->|when all done| CLEAR[Clear BPD window flag]
    end

    subgraph "Emergency"
        ABORT[abort_bpd] -->|authority only| RESET[Reset all BPD state]
    end
```

### Security Measures (Post-Audit Fixes)
| Issue | Fix |
|-------|-----|
| Per-batch rate manipulation | Authority-gated finalize + separate seal step |
| Duplicate BPD claims | `bpd_claim_period_id` tracking per stake |
| Stake changes during BPD | BPD window flag blocks unstaking |
| Snapshot consistency | `bpd_snapshot_slot` pinned on first batch |

### Notable Gotchas & Tech Debt
- **Ed25519 introspection** required for free_claim (prevents MEV front-running)
- **Batch size of 20** means large protocols need many finalize/trigger txs
- `abort_bpd` has a known HIGH severity issue (can reset bpd_claim_period_id tracking)
- Two deprecated fields on StakeAccount: `bpd_eligible`, `claim_period_start_slot`
- Counter-based completion (`distributed >= finalized`) prevents rounding exploits
- Complexity score: **HIGH** - most complex subsystem, 3-phase with batching + security constraints

[[run_me.md]]
