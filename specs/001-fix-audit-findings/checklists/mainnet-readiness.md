# Mainnet Readiness Checklist: Audit Fixes (Phase 8.1)

**Purpose**: Cross-domain requirements quality validation for mainnet launch gate
**Created**: 2026-02-11
**Feature**: [spec.md](../spec.md)
**Depth**: Thorough | **Audience**: Author (self-review) | **Focus**: All domains (Program, Frontend, Indexer, DevOps)

## Requirement Completeness

- [x] CHK001 - Is a functional requirement defined for BPD abort retry logic? US3-AS2 and task T024 reference it, but no FR covers abort behavior. [Gap] — FR-015 added: abort MUST be idempotent
- [x] CHK002 - Is a functional requirement defined for marketing link cluster detection? US3-AS3 references it, but no FR explicitly covers link URL routing by cluster. [Gap] — FR-008 covers cluster detection; US3-AS3 applies it to marketing links via T030
- [x] CHK003 - Are acceptance scenarios defined for multisig authority support (FR-003)? US1 has no acceptance scenario for multisig, only a bare FR. [Completeness, Spec §FR-003] — US1-AS5 added: multisig signs admin instruction successfully; non-authority rejected
- [x] CHK004 - Are error handling requirements defined for all modified program instructions, not just claims (FR-004)? BPD finalization, admin bounds, and abort also mutate state. [Completeness, Gap] — Spec §Error Handling Requirements table now covers all modified instructions with specific error variants
- [x] CHK005 - Are monitoring and alerting requirements specified for production operation of all three layers (program, indexer, frontend)? [Gap] — KG-001: deferred to operational readiness phase; not user-facing for launch
- [x] CHK006 - Are rollback or fix-forward procedures documented for a failed program deploy to mainnet? [Gap] — KG-002: Solana programs are upgradeable; rollback = re-deploy previous verified binary; formal runbook deferred
- [x] CHK007 - Are math parity requirements between Rust (`instructions/math.rs`) and TypeScript (`lib/solana/math.ts`) documented as part of these changes? The copilot-instructions mandate parity but no FR or task addresses validation. [Gap] — T038 validates TypeScript math parity after Rust changes
- [x] CHK008 - Are IDL versioning requirements defined for the program upgrade? Consumers (frontend, indexer) parse the IDL — is compatibility addressed? [Gap] — KG-003: IDL changes are additive only (new error variants); no runtime compatibility issue
- [x] CHK009 - Is a functional requirement defined for the RPC proxy whitelist? US3-AS4 mentions "whitelisted" but no FR enumerates allowed methods. [Gap] — FR-016 enumerates: getAccountInfo, getBalance, sendTransaction, simulateTransaction

## Requirement Clarity & Specificity

- [x] CHK010 - Is "strictly bound" (FR-002) quantified with specific numeric thresholds? Data-model says "±10%" but the spec FR does not include this figure. [Ambiguity, Spec §FR-002 vs data-model] — FR-002a now specifies ±10% of DEFAULT_SLOTS_PER_DAY (216,000)
- [x] CHK011 - Is the ±10% bound (data-model) defined as relative to the initial value, the previous value, or an absolute range? [Ambiguity, data-model §GlobalState] — FR-002a: relative to DEFAULT_SLOTS_PER_DAY constant (216,000) from constants.rs
- [x] CHK012 - Are rate limit thresholds quantified in FR-011? SC-004 says "100 req/s" but FR-011 only says "enforce rate limits" without a number. [Clarity, Spec §FR-011 vs §SC-004] — FR-011 now specifies 100 requests/second per IP
- [x] CHK013 - Is the backward pagination target gap explicitly specified in FR-009? SC-002 references "5,000 blocks" but FR-009 only says "exceeds the RPC limit (1000 signatures)." [Clarity, Spec §FR-009 vs §SC-002] — FR-009: triggers when gap > 1000 signatures; SC-002: tested with 5,000 signatures; units consistent
- [x] CHK014 - What constitutes a "failed transaction simulation" in FR-006? Is it only `simulationResult.err != null`, or does it also include high CU consumption or specific log warnings? [Clarity, Spec §FR-006] — FR-006 now specifies: "a simulation is considered failed when `simulationResult.err` is non-null"
- [x] CHK015 - Is "exclude private keys" (FR-005) scoped to only `NEXT_PUBLIC_TEST_WALLET_SECRET`, or all sensitive environment variables (API keys, RPC URLs with credentials)? [Clarity, Spec §FR-005] — FR-005 scopes to `NEXT_PUBLIC_TEST_WALLET_SECRET` (the only secret found in C4); broader env hygiene is a separate concern
- [x] CHK016 - Is the required Anchor version reconciled? Plan says 0.31.0, copilot-instructions say 0.31.1. Which is canonical? [Ambiguity, Plan vs .github/copilot-instructions.md] — All docs now specify 0.31.1 (plan.md and quickstart.md corrected)
- [x] CHK017 - Is "verify the user's wallet matches the expected environment" (FR-008) defined with a specific detection mechanism (genesis hash, cluster URL pattern, other)? [Clarity, Spec §FR-008] — FR-008: "comparing the connection endpoint URL against known cluster patterns (Mainnet/Devnet)"

## Requirement Consistency

- [x] CHK018 - Do FR-009's "RPC limit (1000 signatures)" and SC-002's "5,000 blocks" reference consistent units? Blocks ≠ signatures — are the targets aligned? [Consistency, Spec §FR-009 vs §SC-002] — SC-002 updated to "5,000 signatures" to match FR-009 unit
- [x] CHK019 - Does FR-008 (wallet/environment matching) align with US3-AS3 (marketing link cluster targeting)? They appear to describe different behaviors under one FR. [Consistency, Spec §FR-008 vs US3-AS3] — FR-008 is the detection mechanism; US3-AS3 applies it specifically to marketing links. Complementary, not conflicting.
- [x] CHK020 - Are `slots_per_day` bounds in the spec (FR-002), data-model ("±10%"), and plan description mutually consistent? [Consistency, Spec §FR-002 vs data-model vs plan] — All now say ±10% of DEFAULT_SLOTS_PER_DAY (216,000)
- [x] CHK021 - Is the Anchor version consistent across all documents (plan: 0.31.0, copilot-instructions: 0.31.1, tasks: not specified)? [Consistency] — All corrected to 0.31.1
- [x] CHK022 - Are the Critical/High finding counts in SC-001 ("7 Critical, 11 High") reconciled with the actual audit report totals? [Consistency, Spec §SC-001] — Audit report confirms: 7 CRIT, 11 HIGH — matches SC-001

## Acceptance Criteria Quality

- [x] CHK023 - Can SC-001 ("100% of findings verified fixed") be objectively measured? Is there a finding-by-finding mapping to verification method (test, code review, deploy check)? [Measurability, Spec §SC-001] — Spec §Verification Mapping (SC-001) provides finding-by-finding mapping to verification method
- [x] CHK024 - Is SC-002 ("syncs a gap of 5,000 blocks") testable in CI/CD, or only manual? No automated gap test is specified in tasks. [Measurability, Spec §SC-002] — T021 creates mock gap simulation script; T039 runs it end-to-end
- [x] CHK025 - Is SC-003 ("matching on-chain hash") verifiable before first mainnet deploy? There is no prior deployment hash to compare against. [Measurability, Spec §SC-003] — KG-012: first deploy establishes baseline hash; CI pipeline produces hash for governance approval
- [x] CHK026 - Is SC-004 ("100 req/s with <1% error rate") testable? No load testing task, tool, or script is defined in tasks.md. [Measurability, Spec §SC-004] — T037 creates load test script targeting indexer API at 100+ req/s
- [x] CHK027 - Are acceptance scenarios for US1-AS2 ("beyond safe bounds → transaction MUST fail") specific about which error code or user-facing message is expected? [Measurability, Spec §US1-AS2] — US1-AS2 updated: must fail with `AdminBoundsExceeded` error code; T016 defines the variant

## Scenario & Edge Case Coverage

- [x] CHK028 - Are requirements defined for when `saturating_sub` returns 0? Is a zero-bonus claim acceptable, or should the user be warned/blocked? [Edge Case, Spec §FR-001] — Spec §Edge Case Behavior: 0-reward is acceptable; stake receives zero bonus, not blocked
- [x] CHK029 - Are concurrent BPD finalization attempts addressed? Two callers invoking `finalize_bpd_calculation` simultaneously could race. [Coverage, Gap] — Spec §Edge Case Behavior: Solana serializes per-account; no race condition possible
- [x] CHK030 - Are requirements defined for indexer behavior during RPC node failures or timeouts mid-way through backward pagination? [Edge Case, Gap] — KG-005: checkpoint NOT advanced on failure (atomic transaction); next poll cycle retries
- [x] CHK031 - Are requirements defined for indexer checkpoint behavior during chain reorgs (checkpoint ahead of canonical tip)? [Edge Case, Gap] — KG-006: indexer uses finalized commitment; reorgs not exposed
- [x] CHK032 - Are requirements defined for multisig transaction timeout during time-sensitive BPD operations (finalize, seal, trigger)? [Edge Case, Gap] — KG-004: 24h seal delay provides window; abort_bpd (idempotent) is escape path
- [x] CHK033 - Are partial migration failure scenarios addressed for FR-012? If a migration applies halfway, what is the recovery path? [Edge Case, Spec §FR-012] — KG-007: Drizzle migrations run in transactions; partial failure rolls back
- [x] CHK034 - Are requirements specified for Error Boundary fallback UI content and user recovery actions (retry, reload, contact support)? [Coverage, Spec §FR-007] — T028 specifies "fallback UI (retry/reload)"
- [x] CHK035 - Is the behavior defined when transaction simulation succeeds but the actual on-chain transaction fails? [Edge Case, Spec §FR-006] — Spec §Edge Case Behavior: standard Solana behavior; wallet adapter handles retry/error

## Non-Functional Requirements

- [x] CHK036 - Are compute unit (CU) budget constraints specified for modified program instructions? Changed math could affect CU consumption. [Gap] — KG-008: changes are minimal (<100 CU per bounds check/saturating_sub); no budget adjustment needed
- [x] CHK037 - Are logging requirements defined for audit trail purposes across program (events), indexer (structured logs), and frontend (error reporting)? [Gap] — KG-009: existing program events + indexer pino logging sufficient for launch
- [x] CHK038 - Are on-chain account size constraints validated? Copilot-instructions warn against changing `StakeAccount::LEN` — are existing account sizes preserved? [Gap, per copilot-instructions] — Spec §Edge Case Behavior: no account struct sizes modified; no data migration needed
- [x] CHK039 - Are Token-2022 compatibility requirements re-validated after program logic changes? [Gap] — Spec §Edge Case Behavior: no CPI changes to Token-2022; compatibility preserved
- [x] CHK040 - Are data retention or pruning requirements specified for the indexer database? [Gap] — KG-010: not needed at launch scale; deferred to post-launch

## Dependencies & Assumptions

- [x] CHK041 - Is the assumption that Squads multisig is compatible with all modified instructions explicitly validated? Task T025a exists but has no acceptance criteria or FR. [Assumption, Gap] — T034 (bankrun test) + T035 (devnet validation) verify multisig compatibility; US1-AS5 provides acceptance criteria
- [x] CHK042 - Are external dependency version requirements (Solana CLI, Docker, Node.js, PostgreSQL) documented for reproducible builds in FR-014? [Dependency, Spec §FR-014] — Spec §External Dependencies table documents all required versions
- [x] CHK043 - Is the assumption that existing on-chain accounts (GlobalState, StakeAccount, ClaimConfig) do not require data migration after program upgrade documented? [Assumption, Gap] — Spec §Edge Case Behavior: no struct size changes; no data migration needed
- [x] CHK044 - Are RPC provider requirements (supported methods, rate limits, archive access) documented as a dependency for backward pagination (FR-009)? [Dependency, Gap] — KG-011: standard RPC methods used; any Solana provider supports getSignaturesForAddress

## Notes

- Check items off as you verify the spec addresses each concern: `[x]`
- If an item is unchecked, update `spec.md`, `plan.md`, or `tasks.md` to resolve the gap.
- Items marked `[Gap]` indicate missing requirements; items marked `[Ambiguity]` indicate existing but unclear requirements.
- This checklist complements `security-audit-fixes.md` (vulnerability-specific) with cross-domain readiness concerns.
