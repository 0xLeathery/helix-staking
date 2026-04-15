# Phase 26: Frontend Boost UI - Research

**Researched:** 2026-03-04
**Domain:** Next.js 14 frontend — React Query hooks, Anchor program client, SPL Token ATA reads, Web Push notifications, indexer event processing
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FRONT-01 | Boost indicator on staking dashboard showing eligible/active/revoked states | `StakeAccount.seed_balance_at_stake`, `boost_revoked`, `boosted_stake_id` fields available from `useStakes()` hook — already fetched, just not rendered. `GlobalState.get_boost_enabled()` via `useGlobalState()`. Seed ATA balance readable via `connection.getTokenAccountBalance()`. Three states can be derived client-side with no new RPC calls beyond what already exists. |
| FRONT-02 | Boosted APY display shows actual multiplied rate when boost is active | On-chain formula: `(loyalty_adjusted * 1.10) + bpd_bonus`. Boost multiplier is 10% (1,000 BPS, locked). `apply_boost_multiplier()` in `lib/solana/math.ts` needs a TS equivalent. APY display logic lives in `StakeCard` and `PortfolioSummary`. |
| FRONT-03 | Wallet interaction to register for boost (calls `register_seed_boost` on-chain) | `register_seed_boost` instruction exists in `target/idl/helix_staking.json` but NOT in `app/web/public/idl/helix_staking.json` (stale). IDL copy is Wave 0 blocker. Instruction pattern established by `useCreateStake.ts`. |
| FRONT-04 | Push notification when boost is revoked (using existing notification infrastructure) | `BoostRevoked` event is emitted on-chain and parseable by indexer (IDL at `target/idl/` includes it). BUT `processor.ts` has no handler for `BoostRevoked`. `push_subscriptions` table has no `notify_boost_revoked` column. `dispatchToSubscribers` requires a matching preference key. Three backend additions needed: DB migration, processor case, notification dispatch function. |
</phase_requirements>

---

## Summary

Phase 26 implements all user-visible boost features in the Next.js frontend, plus the backend event pipeline that powers push notifications on boost revocation. The on-chain boost system (Phase 24) and the 6-hour crank (Phase 25) are already complete. Phase 26 consumes those on-chain capabilities.

The four requirements span two distinct layers: (1) **frontend-only** (FRONT-01, FRONT-02, FRONT-03) — new React components and hooks that read `StakeAccount` boost fields already returned by `useStakes()`, plus a new `useRegisterBoost` mutation hook; and (2) **backend + frontend** (FRONT-04) — a pipeline addition to the indexer that processes `BoostRevoked` on-chain events and dispatches Web Push notifications to the affected wallet.

**Critical blocker identified:** The IDL deployed to `app/web/public/idl/helix_staking.json` is stale — it is missing all Phase 24 instructions (`register_seed_boost`, `admin_set_seed_mint`, `admin_toggle_boost`, `update_boost_status`) and the `BoostRecord` account type. The `app/web/types/program.ts` is similarly stale. Copying `target/idl/helix_staking.json` to `app/web/public/idl/` and regenerating the TypeScript types must be the very first task in Wave 0, otherwise `program.methods.registerSeedBoost()` will throw at runtime and `program.account.boostRecord` will not exist for type-safe access.

**Primary recommendation:** Implement in this order: (1) copy IDL + types, (2) seed ATA balance hook, (3) boost indicator component, (4) APY display with boost, (5) register boost mutation hook + button, (6) indexer backend additions for FRONT-04, (7) notification settings toggle.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@coral-xyz/anchor` | `0.31.1` (installed) | `program.methods.registerSeedBoost()`, `program.account.boostRecord.fetch()` | Already the project's Anchor client; all existing hooks use it |
| `@solana/wallet-adapter-react` | `^0.15.35` (installed) | `useWallet()`, `useConnection()` — wallet + connection for on-chain calls | Standard pattern throughout all existing hooks |
| `@tanstack/react-query` | `^5.0.0` (installed) | `useQuery` for seed ATA balance, `useMutation` for register boost | All existing data hooks follow this pattern |
| `@solana/spl-token` | `^0.4.6` (installed) | `getAssociatedTokenAddressSync` to derive seed ATA for seed balance reads | Already used in `useTokenBalance.ts` and crank for ATA derivation |
| `bn.js` | `5.2.1` (installed) | BN arithmetic for boost APY math | All on-chain numeric values are BN |
| `zustand` | `^5.0.0` (installed) | UI store for register boost flow state if needed | Already used for stake wizard state |
| `lucide-react` | `^0.460.0` (installed) | Icons for boost badge states (`Zap`, `ShieldCheck`, `ShieldX`) | All existing UI uses lucide-react |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `web-push` | (indexer, already installed) | Send Web Push notifications from indexer | FRONT-04: `dispatchToSubscribers` already uses it |
| `drizzle-orm` | (indexer, already installed) | DB migrations and queries | FRONT-04: new `notify_boost_revoked` column and `boost_revoked_events` table |
| `node-cron` | (indexer, already installed) | Notification scheduler | FRONT-04: no new cron needed; `BoostRevoked` is event-driven via processor |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Deriving boost state from existing `useStakes()` data | New standalone `useBoostStatus` RPC hook | `useStakes()` already returns all `StakeAccount` fields including `seed_balance_at_stake`, `boost_revoked`, `boosted_stake_id`. No extra RPC calls needed for three of the four states. Use derivation, not a new hook. |
| Event-driven `BoostRevoked` notification (processor.ts) | Poll on-chain every 6h to detect revocations | Event-driven is correct — the existing indexer already parses all events. Adding a processor case is 10 lines; polling would require a new cron job and on-chain reads from the indexer. |
| Inline boost indicator in `StakeCard` | Separate `BoostBadge` component | A small, focused `BoostBadge` component matches the `StatusBadge` pattern already in `StakeCard`. Composable and independently testable. |

**Installation:** No new npm packages needed anywhere. All required libraries are already installed in `app/web/package.json` and `services/indexer/`.

---

## Architecture Patterns

### Recommended File Structure

New files to create:
```
app/web/
├── components/stake/
│   └── boost-badge.tsx          # BoostBadge component (eligible/active/revoked states)
├── lib/hooks/
│   ├── useSeedBalance.ts        # React Query hook: seed ATA balance for connected wallet
│   └── useRegisterBoost.ts      # useMutation hook: calls register_seed_boost on-chain
└── __tests__/components/
    └── boost-badge.test.tsx     # Unit tests for BoostBadge

services/indexer/src/
├── db/
│   └── migrations/
│       └── 004_boost_notifications.sql  # notify_boost_revoked column + boost_revoked_events table
└── worker/
    └── processor.ts             # Add BoostRevoked case (modify existing file)
    └── notification-scheduler.ts  # Add sendBoostRevokedNotification (modify existing file)
```

Modified files:
```
app/web/
├── public/idl/helix_staking.json     # Copy from target/idl/ (WAVE 0 BLOCKER)
├── types/program.ts                   # Regenerate from target IDL
├── lib/solana/pdas.ts                 # Add deriveBoostRecord()
├── lib/solana/constants.ts            # Add BOOST_RECORD_SEED, BOOST_MULTIPLIER_BPS
├── lib/solana/math.ts                 # Add applyBoostMultiplier()
├── components/stake/stake-card.tsx    # Embed BoostBadge + boosted APY display
└── lib/api.ts                         # Add notifyBoostRevoked preference field

services/indexer/src/
└── db/schema.ts                       # Add notifyBoostRevoked column, boostRevokedEvents table
```

### Pattern 1: Derive Boost State from StakeAccount Fields

**What:** Three boost states computed from fields already returned by `useStakes()`. No extra RPC calls.

**When to use:** In `StakeCard` and `BoostBadge` to determine which state to display.

```typescript
// Source: StakeAccount fields from programs/helix-staking/src/state/stake_account.rs
// account.seedBalanceAtStake: BN (0 = not boosted, >0 = boosted)
// account.boostRevoked: boolean
// account.boostedStakeId: BN (u64::MAX = not linked to stake yet)

type BoostState = 'none' | 'eligible' | 'active' | 'revoked';

function deriveBoostState(
  account: StakeAccountData,
  hasBoostRecord: boolean,
  hasSufficientSeedBalance: boolean,
): BoostState {
  // Already revoked (permanent)
  if (account.boostRevoked) return 'revoked';

  // Boosted stake: seed_balance_at_stake > 0 means boost was active at stake time
  if (new BN(account.seedBalanceAtStake.toString()).gtn(0)) return 'active';

  // Wallet has registered BoostRecord but hasn't staked yet
  // OR wallet holds seed tokens but hasn't registered
  if (hasBoostRecord || hasSufficientSeedBalance) return 'eligible';

  return 'none';
}
```

**Confidence:** HIGH — field names confirmed from `stake_account.rs` and the built IDL.

### Pattern 2: Read Seed ATA Balance (useSeedBalance hook)

**What:** Fetch the connected wallet's seed token ATA balance. Needed for "eligible" state detection (holds seed, not yet registered).

**When to use:** In `BoostBadge` or the register boost flow to check eligibility before calling `register_seed_boost`.

```typescript
// Source: mirrors useTokenBalance.ts exactly, but for seed token (SPL Token, not Token-2022)
import { useQuery } from "@tanstack/react-query";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useGlobalState } from "./useGlobalState";

// Standard SPL Token program (pump.fun tokens use this, not Token-2022)
const SPL_TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

export function useSeedBalance() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { data: globalState } = useGlobalState();

  // Reconstruct seed_mint from GlobalState reserved[2..5]
  const seedMint = globalState ? getSeedMintFromGlobalState(globalState) : null;

  return useQuery({
    queryKey: ["seedBalance", publicKey?.toBase58(), seedMint?.toBase58()],
    queryFn: async (): Promise<BN> => {
      if (!publicKey || !seedMint || seedMint.equals(PublicKey.default)) return new BN(0);
      try {
        const ata = getAssociatedTokenAddressSync(
          seedMint, publicKey, false, SPL_TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
        );
        const balance = await connection.getTokenAccountBalance(ata);
        return new BN(balance.value.amount);
      } catch {
        return new BN(0); // ATA doesn't exist = zero balance
      }
    },
    enabled: !!publicKey && !!globalState && !!seedMint && !seedMint.equals(PublicKey.default),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

// Extract seed mint from GlobalState reserved slots (mirrors boost.test.ts pattern)
function getSeedMintFromGlobalState(globalState: any): PublicKey {
  const reserved = globalState.reserved as BN[];
  const mintBytes = new Uint8Array(32);
  for (let i = 0; i < 4; i++) {
    const le = reserved[2 + i].toArrayLike(Buffer, "le", 8);
    mintBytes.set(le, i * 8);
  }
  return new PublicKey(mintBytes);
}
```

**Confidence:** HIGH — mirrors existing `useTokenBalance.ts` pattern directly. Seed mint extraction mirrors `getSeedMintFromGlobalState` from `tests/litesvm/utils.ts`.

### Pattern 3: Derive BoostRecord PDA and Fetch

**What:** Derive the `BoostRecord` PDA for the connected wallet and check if it exists on-chain. Needed to distinguish "eligible but not registered" from "registered and waiting for a stake."

**When to use:** In `BoostBadge` or the register boost flow.

```typescript
// Source: register_seed_boost.rs seeds = [BOOST_RECORD_SEED, user.key().as_ref()]
// BOOST_RECORD_SEED = b"boost_record"
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";

const BOOST_RECORD_SEED = Buffer.from("boost_record");

export function deriveBoostRecord(user: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [BOOST_RECORD_SEED, user.toBuffer()],
    PROGRAM_ID
  );
}

// In a hook:
// const [boostRecordPda] = deriveBoostRecord(publicKey);
// const boostRecord = await program.account.boostRecord.fetchNullable(boostRecordPda);
// hasBoostRecord = boostRecord !== null
```

**Confidence:** HIGH — seeds confirmed from `register_seed_boost.rs` and `constants.rs`.

### Pattern 4: useRegisterBoost Mutation Hook

**What:** `useMutation` hook that calls `register_seed_boost` on-chain. Mirrors `useCreateStake.ts` structure exactly.

**When to use:** In the boost registration button on the dashboard.

```typescript
// Source: mirrors useCreateStake.ts exactly
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useProgram } from "./useProgram";
import { deriveGlobalState, deriveBoostRecord } from "@/lib/solana/pdas";
import { getComputeBudgetInstructions } from "@/lib/solana/compute-budget";

// Standard SPL Token for pump.fun seed tokens
const SPL_TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

export function useRegisterBoost() {
  const program = useProgram();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation<{ signature: string }, Error, void>({
    mutationFn: async () => {
      if (!publicKey) throw new Error("Wallet not connected");

      const [globalStatePda] = deriveGlobalState();
      const globalState = await program.account.globalState.fetch(globalStatePda);

      // Extract seed_mint from GlobalState reserved[2..5]
      const seedMint = getSeedMintFromGlobalState(globalState);
      if (seedMint.equals(PublicKey.default)) throw new Error("Seed mint not configured");

      const [boostRecordPda] = deriveBoostRecord(publicKey);

      // Seed ATA for the user (SPL Token)
      const seedTokenAccount = getAssociatedTokenAddressSync(
        seedMint, publicKey, false, SPL_TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const tx = await program.methods
        .registerSeedBoost()
        .accountsPartial({
          user: publicKey,
          globalState: globalStatePda,
          boostRecord: boostRecordPda,
          seedTokenAccount,
          seedMint,
          seedTokenProgram: SPL_TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .transaction();

      tx.instructions.unshift(...getComputeBudgetInstructions(150_000));

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      // Simulate first (security requirement per existing pattern)
      const simulation = await connection.simulateTransaction(tx);
      if (simulation.value.err) {
        throw new Error(`Simulation failed: ${JSON.stringify(simulation.value.err)}`);
      }

      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");
      return { signature };
    },

    onSuccess: () => {
      // Invalidate boostRecord and stakes caches
      queryClient.invalidateQueries({ queryKey: ["boostRecord", publicKey?.toBase58()] });
      queryClient.invalidateQueries({ queryKey: ["stakes", publicKey?.toBase58()] });
    },
  });
}
```

**Confidence:** HIGH — instruction account layout confirmed from `register_seed_boost.rs` and IDL.

### Pattern 5: Boost APY Math (applyBoostMultiplier)

**What:** Apply the 10% boost multiplier to pending rewards for display. Mirrors the on-chain formula in `math.rs`.

**When to use:** In `StakeCard` when `account.seedBalanceAtStake > 0 && !account.boostRevoked`.

```typescript
// Source: programs/helix-staking/src/instructions/math.rs apply_boost_multiplier
// On-chain formula: amount + (amount * BOOST_MULTIPLIER_BPS / 10_000)
// BOOST_MULTIPLIER_BPS = 1_000 (10%)

const BOOST_MULTIPLIER_BPS = new BN(1_000);
const BPS_SCALER = new BN(10_000);

export function applyBoostMultiplier(amount: BN): BN {
  // bonus = amount * 1_000 / 10_000 = amount * 0.10
  const bonus = amount.mul(BOOST_MULTIPLIER_BPS).div(BPS_SCALER);
  return amount.add(bonus);
}

// For APY display: boostedRewards = applyBoostMultiplier(pendingRewards)
// Note: BPD bonus is NOT amplified by boost — it is additive after boost.
// boostedTotal = applyBoostMultiplier(loyaltyAdjustedRewards) + bpdBonus
```

**Confidence:** HIGH — formula confirmed from `math.rs` `apply_boost_multiplier()` and STATE.md decisions ("BPD bonus not amplified by boost: formula is `(loyalty_adjusted * 1.10) + bpd_bonus`").

### Pattern 6: FRONT-04 — Indexer BoostRevoked Pipeline

**What:** Three coordinated additions to the indexer to enable push notifications on boost revocation.

**Step 1 — DB migration** (`004_boost_notifications.sql`):
```sql
-- Add notify_boost_revoked preference column to push_subscriptions
ALTER TABLE push_subscriptions
  ADD COLUMN IF NOT EXISTS notify_boost_revoked BOOLEAN NOT NULL DEFAULT TRUE;

-- Store BoostRevoked events for deduplication
CREATE TABLE IF NOT EXISTS boost_revoked_events (
  id          SERIAL PRIMARY KEY,
  signature   TEXT NOT NULL UNIQUE,
  slot        BIGINT NOT NULL,
  user_wallet TEXT NOT NULL,
  stake_id    BIGINT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS boost_revoked_events_user_idx
  ON boost_revoked_events(user_wallet);
```

**Step 2 — processor.ts case** (add to switch statement):
```typescript
// Source: mirrors existing event cases in processor.ts
case 'BoostRevoked': {
  // 1. Idempotently insert event
  await db
    .insert(boostRevokedEvents)
    .values({
      signature,
      slot,
      userWallet: toStr(data.user),
      stakeId: toNum(data.stakeId),
    })
    .onConflictDoNothing();

  // 2. Dispatch notification (event-driven, no scheduler needed)
  await sendBoostRevokedNotification(toStr(data.user), toNum(data.stakeId));
  break;
}
```

**Step 3 — notification-scheduler.ts function**:
```typescript
// Source: mirrors sendBpdTransitionNotification pattern
export async function sendBoostRevokedNotification(
  wallet: string,
  stakeId: number,
): Promise<void> {
  if (!isPushEnabled()) return;

  const payload: PushPayload = {
    title: 'Boost Revoked',
    body: `Your seed boost on Stake #${stakeId} has been revoked. Your seed token balance dropped below your snapshot. Future claims on this stake earn base APY only.`,
    tag: `boost-revoked-${stakeId}`,
    data: {
      url: '/dashboard',
      eventType: 'boost_revoked',
      stakeId,
    },
  };

  await dispatchToSubscribers([wallet], payload, 'notifyBoostRevoked');
}
```

**Step 4 — update `dispatchToSubscribers` preference key union** in `push.ts`:
```typescript
// Change preferenceKey type to include 'notifyBoostRevoked'
export async function dispatchToSubscribers(
  wallets: string[],
  payload: PushPayload,
  preferenceKey:
    | 'notifyMaturity'
    | 'notifyLatePenalty'
    | 'notifyRewards'
    | 'notifyBpd'
    | 'notifyBoostRevoked',  // ADD THIS
): Promise<{ sent: number; expired: number; errors: number }>
```

**Step 5 — update `lib/api.ts` and `PushPreferences`** in web app:
```typescript
// Add notifyBoostRevoked to PushPreferences interface
export interface PushPreferences {
  notifyMaturity: boolean;
  notifyLatePenalty: boolean;
  notifyRewards: boolean;
  notifyBpd: boolean;
  notifyBoostRevoked: boolean;  // ADD
}
```

**Confidence:** HIGH — all components of this pipeline are verified from codebase reading.

### Pattern 7: BoostBadge Component

**What:** Small badge component with three states, mirroring the existing `StatusBadge` pattern in `stake-card.tsx`.

**When to use:** In `StakeCard`, displayed alongside the existing `StatusBadge`.

```typescript
// Source: mirrors StatusBadge in stake-card.tsx

type BoostState = 'eligible' | 'active' | 'revoked';

const BOOST_CONFIG: Record<BoostState, { label: string; className: string; description: string }> = {
  eligible: {
    label: "Boost Eligible",
    className: "bg-amber-600/20 text-amber-400",
    description: "You hold seed tokens. Register to activate 10% bonus APY.",
  },
  active: {
    label: "Boosted",
    className: "bg-green-600/20 text-green-400",
    description: "10% APY boost is active. Keep your seed balance above your snapshot.",
  },
  revoked: {
    label: "Boost Revoked",
    className: "bg-red-600/20 text-red-400",
    description: "Boost was permanently revoked when your seed balance dropped below your snapshot.",
  },
};

export function BoostBadge({ state }: { state: BoostState }) {
  const { label, className, description } = BOOST_CONFIG[state];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium cursor-help",
          className
        )}>
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
```

### Anti-Patterns to Avoid

- **Creating a new useBoostStatus RPC hook that re-fetches StakeAccount:** `useStakes()` already returns all boost fields. Derive state from existing data.
- **Hardcoding TOKEN_2022_PROGRAM_ID for seed token ATA:** pump.fun tokens are standard SPL Token (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`). Using Token-2022 program ID will derive the wrong ATA address and the `register_seed_boost` call will fail with a constraint violation.
- **Not copying the IDL first:** Any plan that builds `useRegisterBoost` before updating `app/web/public/idl/helix_staking.json` will fail at runtime.
- **Adding notify_boost_revoked as opt-in (default false):** Boost revocation is a high-urgency financial event. Default to `true` (consistent with all other preferences).
- **Using u64::MAX stakeId in boost state derivation:** When `account.boostedStakeId` equals `u64::MAX`, the stake is not yet linked to a boost. Treat as `none` state, not `active`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Seed ATA address derivation | Manual PDA derivation | `getAssociatedTokenAddressSync` from `@solana/spl-token` | Deterministic ATA; already used in `useTokenBalance.ts` |
| BoostRecord PDA derivation | Manual seeds buffer construction | `PublicKey.findProgramAddressSync([BOOST_RECORD_SEED, user.toBuffer()], PROGRAM_ID)` | Mirrors all other PDA derivations in `pdas.ts` |
| Seed mint extraction from GlobalState | Custom byte parsing | `getSeedMintFromGlobalState()` helper (copy from `tests/litesvm/utils.ts`) | Already implemented and verified in LiteSVM tests |
| Web Push delivery | Custom HTTP to push servers | `dispatchToSubscribers()` in indexer `lib/push.ts` | Already handles VAPID auth, 410/404 cleanup, preference filtering |
| Transaction simulation before send | Optimistic send | `connection.simulateTransaction(tx)` before `sendTransaction` | Security requirement: all existing mutation hooks simulate first |

**Key insight:** Every building block for FRONT-01 through FRONT-03 exists — the data is already fetched (StakeAccount fields in `useStakes()`), the transaction pattern is established (`useCreateStake.ts`), and the ATA math is done. Phase 26 is mostly assembly, not invention. The only genuinely new work is: (1) `useSeedBalance` hook, (2) `useRegisterBoost` mutation, (3) `BoostBadge` component, (4) the 5-file indexer backend for FRONT-04.

---

## Common Pitfalls

### Pitfall 1: Stale IDL in app/web/public/

**What goes wrong:** `program.methods.registerSeedBoost()` throws "instruction not found" at runtime. `program.account.boostRecord` is undefined.

**Why it happens:** `app/web/public/idl/helix_staking.json` was NOT updated after Phase 24 added `register_seed_boost`, `admin_set_seed_mint`, `admin_toggle_boost`, `update_boost_status`, and `BoostRecord`. The gap is confirmed: web IDL has 22 instructions, built IDL has 26.

**How to avoid:** Wave 0 task: copy `target/idl/helix_staking.json` to `app/web/public/idl/helix_staking.json` AND regenerate `app/web/types/program.ts` from the new IDL.

**Warning signs:** TypeScript compile errors about unknown instructions or account types; runtime "instruction not found" errors from Anchor.

### Pitfall 2: TOKEN_2022_PROGRAM_ID for Seed Token ATA

**What goes wrong:** `register_seed_boost` fails with Anchor `AccountConstraintViolation` because the wrong ATA was provided.

**Why it happens:** HELIX token uses Token-2022. The HLX ATA is derived with `TOKEN_2022_PROGRAM_ID`. Developers may copy that pattern for the seed token ATA. But pump.fun seed tokens are standard SPL Token (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`).

**How to avoid:** Use `SPL_TOKEN_PROGRAM_ID` (standard) for seed ATA derivation, not `TOKEN_2022_PROGRAM_ID`. Both `useTokenBalance.ts` and the Phase 25 research explicitly document this distinction.

**Warning signs:** Transaction simulation succeeds but on-chain execution fails; Anchor error `InvalidSeedTokenAccount`.

### Pitfall 3: Missing `seed_balance_at_stake` and `boost_revoked` in TypeScript StakeAccount Type

**What goes wrong:** TypeScript type for `StakeAccount` returned by `useStakes()` does not include `seedBalanceAtStake`, `boostRevoked`, `boostedStakeId`. Accessing these fields produces TypeScript errors.

**Why it happens:** `types/program.ts` is stale (same IDL issue). The TS type was generated before Phase 24 added these fields.

**How to avoid:** After copying the IDL, regenerate `types/program.ts` using `anchor-client-gen` or manually add the three fields to the `StakeAccount` interface. Also update `StakeAccountData` interface in `stake-card.tsx`.

**Warning signs:** TypeScript errors on `account.seedBalanceAtStake`, `account.boostRevoked`, `account.boostedStakeId`.

### Pitfall 4: BoostRecord "Not Yet Linked" Sentinel (u64::MAX)

**What goes wrong:** Displaying "Boosted" state for a wallet that has a `BoostRecord` but `boostedStakeId == u64::MAX` — meaning they registered but haven't staked yet. The stake is not actually boosted.

**Why it happens:** `BoostRecord.boostedStakeId` is initialized to `u64::MAX` at registration and only written by `create_stake`. The state "registered but not staked" is a valid intermediate state.

**How to avoid:** When deriving boost state from `StakeAccount` fields: a stake is "active" only when `account.seedBalanceAtStake > 0`. For the wallet-level "eligible" state (for the dashboard register button), check `BoostRecord` existence separately. Never show a specific stake as boosted when `seedBalanceAtStake == 0`.

**Warning signs:** Stakes showing "Boosted" when `account.seedBalanceAtStake == 0`.

### Pitfall 5: APY Display Shows Pre-Boost Rewards

**What goes wrong:** The `pendingRewards` calculation in `StakeCard` applies the loyalty multiplier but NOT the boost multiplier. Displaying this number for a boosted stake would be misleading.

**Why it happens:** The existing `calculatePendingRewards` + `applyLoyaltyMultiplier` chain does not know about the boost. The boost multiplier is applied by the on-chain `claim_rewards` instruction at claim time.

**How to avoid:** In `StakeCard`, check if `account.seedBalanceAtStake > 0 && !account.boostRevoked`. If true, apply `applyBoostMultiplier(loyaltyAdjustedRewards)` for display. Add a tooltip clarifying this is the estimated boosted amount and the actual claim may differ if seed balance has changed.

**Warning signs:** Boosted stakes showing same APY as non-boosted stakes.

### Pitfall 6: dispatchToSubscribers TypeScript Error After Adding notifyBoostRevoked

**What goes wrong:** TypeScript compile error in indexer when calling `dispatchToSubscribers(wallets, payload, 'notifyBoostRevoked')` — the preference key union doesn't include the new value.

**Why it happens:** `push.ts` has a strict union type for the `preferenceKey` parameter.

**How to avoid:** In the same PR as the DB migration and processor change, update the `preferenceKey` union in `dispatchToSubscribers` to include `'notifyBoostRevoked'`. Also add the `notifyBoostRevoked` field to the Drizzle schema object — Drizzle will type-check column access at the query level.

**Warning signs:** TypeScript error `Argument of type '"notifyBoostRevoked"' is not assignable to parameter of type...` in indexer.

---

## Code Examples

Verified patterns from official sources and existing codebase:

### Boost State Derivation in StakeCard

```typescript
// Source: stake_account.rs Phase 24 fields
// seedBalanceAtStake: BN — 0 means not boosted at stake time
// boostRevoked: boolean — permanent flag
// boostedStakeId: BN — u64::MAX means not yet linked (pre-stake registration)

import BN from "bn.js";

const U64_MAX = new BN("18446744073709551615");

function getBoostState(account: StakeAccountData): 'none' | 'active' | 'revoked' {
  const seedBalance = new BN(account.seedBalanceAtStake.toString());

  if (account.boostRevoked) return 'revoked';
  if (seedBalance.gtn(0)) return 'active';
  return 'none';
}
```

### deriveBoostRecord in pdas.ts

```typescript
// Source: register_seed_boost.rs — seeds = [BOOST_RECORD_SEED, user.key().as_ref()]
// BOOST_RECORD_SEED = b"boost_record" (from constants.rs)
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "./constants";

const BOOST_RECORD_SEED = Buffer.from("boost_record");

export function deriveBoostRecord(user: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [BOOST_RECORD_SEED, user.toBuffer()],
    PROGRAM_ID
  );
}
```

### CU Limit for register_seed_boost

```typescript
// Source: compute-budget.ts pattern; register_seed_boost init a new PDA (~150K CU)
// Add to CU_LIMITS in compute-budget.ts:
export const CU_LIMITS = {
  // ... existing entries ...
  registerSeedBoost: 150_000,  // PDA init + ATA constraint check
} as const;
```

### Notification Settings Toggle (web app)

```typescript
// Source: notification-settings.tsx pattern — add to existing ToggleRow list
<ToggleRow
  label="Boost Revoked"
  description="Get notified if your seed boost is revoked for any stake"
  checked={preferences.notifyBoostRevoked}
  disabled={prefsLoading}
  onChange={(v) => handleToggle('notifyBoostRevoked', v)}
/>
```

### Push API route update

```typescript
// Source: app/web/app/api/push routes (via indexer)
// PushPreferences in lib/api.ts needs notifyBoostRevoked: boolean
export interface PushPreferences {
  notifyMaturity: boolean;
  notifyLatePenalty: boolean;
  notifyRewards: boolean;
  notifyBpd: boolean;
  notifyBoostRevoked: boolean;  // NEW
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Static APY display on stake cards | Conditional APY display based on live boost state | Phase 26 | Users see true boosted APY vs. base |
| No boost indicator | Three-state boost badge (eligible/active/revoked) | Phase 26 | Clear user feedback on boost status |
| Registration via CLI/admin only | In-dashboard register boost button | Phase 26 | Self-service boost registration |
| No boost revocation alert | Push notification on BoostRevoked event | Phase 26 | Users immediately know when boost is lost |

**Deprecated/outdated:**
- `app/web/public/idl/helix_staking.json` (22 instructions): replaced by the Phase 24 built IDL (26 instructions) — must be updated in Wave 0.
- `app/web/types/program.ts` (without boost fields): must be regenerated after IDL copy.

---

## Open Questions

1. **Where does the "Register Boost" button live on the dashboard?**
   - What we know: The requirement says "on the dashboard." The staking dashboard has `StakesList`, `PortfolioSummary`, `ProtocolStats`. There is no dedicated boost panel yet.
   - What's unclear: Should the register button be in a new standalone "Boost Status" card at the top of the dashboard, or embedded in `PortfolioSummary`?
   - Recommendation: Add a new `BoostStatusCard` component at the dashboard level (similar to `ProtocolPausedBanner` in `dashboard/page.tsx`). This keeps boost registration separate from individual stake cards and gives it appropriate visual prominence.

2. **What if the user has multiple stakes — which ones get the BoostBadge?**
   - What we know: "One boosted stake per wallet" (locked decision). When `create_stake` runs with a BoostRecord, it sets `seed_balance_at_stake > 0` on that specific StakeAccount. Only that stake has the boost; others have `seed_balance_at_stake == 0`.
   - What's unclear: Can a user create a second stake and have the boost apply to it if they register again? (No — BoostRecord is unique per wallet, and `register_seed_boost` uses `init` which prevents re-registration while a BoostRecord exists.)
   - Recommendation: Show BoostBadge only on the specific `StakeCard` where `account.seedBalanceAtStake > 0`. Other stake cards get no boost indicator.

3. **Should the register boost button appear before or after the user creates a stake?**
   - What we know: The flow is: register boost FIRST, then create stake. The stake picks up the boost via `create_stake` remaining_accounts. `BoostRecord.boostedStakeId` starts at `u64::MAX` and gets set when `create_stake` runs.
   - What's unclear: Should the dashboard nudge users who have no active BoostRecord to register before their next stake?
   - Recommendation: Show the register button to wallets with: (1) no existing BoostRecord, AND (2) sufficient seed balance. If the user already has an active stake with boost, hide the register button (nothing to do). If the user has a BoostRecord but no boosted stake yet, show a "Boost registered — create a stake to activate it" message.

---

## Validation Architecture

`workflow.nyquist_validation` is not set to false in `.planning/config.json` — validation section included.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.x + React Testing Library 16.x (jsdom) |
| Config file | `app/web/vitest.config.mts` |
| Quick run command | `npx vitest run app/web/__tests__/components/boost-badge.test.tsx` |
| Full suite command | `npx vitest run app/web/__tests__/` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FRONT-01 | BoostBadge renders "Boost Eligible" for eligible state | unit | `npx vitest run app/web/__tests__/components/boost-badge.test.tsx -t "eligible"` | ❌ Wave 0 |
| FRONT-01 | BoostBadge renders "Boosted" for active state | unit | `npx vitest run app/web/__tests__/components/boost-badge.test.tsx -t "active"` | ❌ Wave 0 |
| FRONT-01 | BoostBadge renders "Boost Revoked" for revoked state | unit | `npx vitest run app/web/__tests__/components/boost-badge.test.tsx -t "revoked"` | ❌ Wave 0 |
| FRONT-01 | StakeCard shows BoostBadge when boost fields present | unit | `npx vitest run app/web/__tests__/components/stake-card.test.tsx -t "boost"` | Partial — file exists, needs new test cases |
| FRONT-02 | APY display shows boosted rewards when boost active | unit | `npx vitest run app/web/__tests__/lib/math.test.ts -t "applyBoostMultiplier"` | ❌ Wave 0 |
| FRONT-02 | APY display shows base rewards when boost revoked | unit | `npx vitest run app/web/__tests__/components/stake-card.test.tsx -t "boost revoked"` | ❌ Wave 0 |
| FRONT-03 | useRegisterBoost calls register_seed_boost instruction | unit (mocked) | `npx vitest run app/web/__tests__/hooks/useRegisterBoost.test.ts` | ❌ Wave 0 |
| FRONT-04 | BoostRevoked event triggers push notification | unit (indexer) | `npx vitest run services/indexer/src/__tests__/` | Partial — processor.test.ts likely exists |
| FRONT-04 | notifyBoostRevoked preference is respected | unit (indexer push.ts) | `npx vitest run services/indexer/src/__tests__/` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run app/web/__tests__/`
- **Per wave merge:** `npx vitest run app/web/__tests__/ && npx vitest run services/indexer/src/__tests__/`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `app/web/public/idl/helix_staking.json` — copy from `target/idl/helix_staking.json` (BLOCKER)
- [ ] `app/web/types/program.ts` — regenerate with boost instructions and BoostRecord type
- [ ] `app/web/__tests__/components/boost-badge.test.tsx` — covers FRONT-01 three states
- [ ] `app/web/__tests__/lib/math.test.ts` — add `applyBoostMultiplier` test cases (FRONT-02)
- [ ] `app/web/__tests__/hooks/useRegisterBoost.test.ts` — mocked mutation (FRONT-03)
- [ ] `services/indexer/src/db/migrations/004_boost_notifications.sql` — DB schema (FRONT-04)

---

## Sources

### Primary (HIGH confidence)

- `programs/helix-staking/src/instructions/register_seed_boost.rs` — read directly; confirms accounts, seeds, balance check logic
- `programs/helix-staking/src/instructions/update_boost_status.rs` — read directly; confirms permissionless pattern
- `programs/helix-staking/src/state/boost_record.rs` — read directly; BoostRecord fields: user, slot, bump, boostedStakeId; u64::MAX sentinel
- `programs/helix-staking/src/state/stake_account.rs` — read directly; Phase 24 fields: seedBalanceAtStake, boostRevoked, boostedStakeId
- `programs/helix-staking/src/state/global_state.rs` — read directly; reserved slot layout, getSeedMint/getMinSeedBalance/getBoostEnabled helpers
- `programs/helix-staking/src/constants.rs` — read directly; BOOST_RECORD_SEED = b"boost_record", BOOST_MULTIPLIER_BPS = 1_000
- `programs/helix-staking/src/events.rs` — read directly; BoostRevoked event fields: slot, user, stakeId, currentBalance, requiredBalance
- `target/idl/helix_staking.json` — read directly; confirmed 26 instructions including registerSeedBoost; BoostRecord in accounts; BoostRevoked in events
- `app/web/public/idl/helix_staking.json` — read directly; confirmed stale (22 instructions, no BoostRecord)
- `app/web/types/program.ts` — read directly; confirmed stale (no boost fields in StakeAccount, no boost instructions)
- `app/web/lib/hooks/useCreateStake.ts` — read directly; the mutation hook pattern to mirror for useRegisterBoost
- `app/web/lib/hooks/useTokenBalance.ts` — read directly; the query hook pattern to mirror for useSeedBalance
- `app/web/lib/solana/pdas.ts` — read directly; PDA derivation pattern for deriveBoostRecord
- `app/web/lib/solana/constants.ts` — read directly; no BOOST_RECORD_SEED yet — must add
- `app/web/lib/solana/math.ts` — read directly; no applyBoostMultiplier yet — must add
- `app/web/components/stake/stake-card.tsx` — read directly; StatusBadge pattern to mirror for BoostBadge; current APY calculation to extend
- `app/web/app/dashboard/page.tsx` — read directly; layout for new BoostStatusCard placement
- `services/indexer/src/worker/processor.ts` — read directly; confirmed no BoostRevoked case; pattern for adding it
- `services/indexer/src/worker/notification-scheduler.ts` — read directly; sendBpdTransitionNotification pattern to mirror for sendBoostRevokedNotification
- `services/indexer/src/lib/push.ts` — read directly; dispatchToSubscribers preferenceKey union type must be extended
- `services/indexer/src/db/schema.ts` — read directly; push_subscriptions table (no notifyBoostRevoked column); pattern for new boostRevokedEvents table
- `services/indexer/src/lib/anchor.ts` — read directly; uses target/idl directly — already has boost events for decoding
- `.planning/STATE.md` — read directly; locked decisions on boost multiplier (10%), one-per-wallet, revocation permanence

### Secondary (MEDIUM confidence)

- Phase 25 RESEARCH.md — getSeedMintFromGlobalState pattern and TOKEN_PROGRAM_ID vs TOKEN_2022 distinction verified and documented there
- `tests/litesvm/boost.test.ts` (referenced in Phase 24 summaries) — getSeedMintFromGlobalState reconstruction pattern confirmed

### Tertiary (LOW confidence)

- None — all findings are supported by direct codebase evidence.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries installed; patterns confirmed from existing hooks
- Architecture: HIGH — all component patterns directly derivable from existing code; on-chain account layouts confirmed from Rust source and built IDL
- Pitfalls: HIGH — stale IDL confirmed by direct diff; TOKEN_2022 issue documented in Phase 25 research; all other pitfalls derived from concrete code analysis
- Validation: HIGH — existing test framework established; Wave 0 gaps are well-bounded

**Research date:** 2026-03-04
**Valid until:** 2026-04-04 (stable Anchor/Next.js/React Query ecosystem; internal patterns change only when team changes them)