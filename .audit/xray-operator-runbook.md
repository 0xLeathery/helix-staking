# X-Ray Static Analysis — Operator Runbook

## Running sec3 X-Ray against helix-staking for vulnerability detection

---

## Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| Docker | Any recent | `docker --version` |
| X-Ray image | v0.0.6+ | `docker run --rm ghcr.io/sec3-product/x-ray:latest -version` |
| Project repo | Current | Must be in repo root (`/Users/annon/projects/solhex` or equivalent) |

### First-Time Setup

```bash
# Pull the X-Ray Docker image
docker pull ghcr.io/sec3-product/x-ray:latest
```

No Rust toolchain, Solana CLI, or Anchor CLI required — X-Ray parses source directly and compiles to LLVM-IR inside the container.

---

## Running a Scan

### Quick Run

```bash
npm run xray
```

### Manual Run (Equivalent)

```bash
docker run --rm \
  --volume "$(pwd):/workspace" \
  ghcr.io/sec3-product/x-ray:latest \
  /workspace/programs/helix-staking
```

### Expected Output

A successful scan prints:
1. **Program discovery** — path, source path, subpaths found
2. **IR compilation** — `Loading IR From File`, `Running Transformation Passes`, `Running Pointer Analysis`
3. **Attack surface enumeration** — one entry per instruction handler (e.g., `Found attack surface #1: sol.initialize.2`)
4. **Vulnerability details** — file, line, code snippet, stack trace, and reference link per finding
5. **Summary** — count of issues by category

```
--------The summary of potential vulnerabilities in programs_helix-staking.ll--------
	 2 untrustful account issues
	 2 unsafe operation issues
==============VULNERABLE: MaliciousSimulation!============
==============VULNERABLE: IntegerUnderflow!============
==============VULNERABLE: IntegerDivOverflow!============
==============VULNERABLE: BumpSeedNotValidated!============
```

### Expected Duration

~5-10 seconds on Apple Silicon. The scan is CPU-bound during pointer analysis.

---

## When to Run

| Trigger | Priority |
|---------|----------|
| Before any mainnet deployment | **Required** |
| After modifying any instruction handler in `src/instructions/` | **Required** |
| After modifying `src/state/` account structures | Recommended |
| After adding a new instruction | **Required** |
| After updating Anchor version | Recommended |
| As part of PR review for security-sensitive changes | Recommended |
| On a regular cadence (weekly during active development) | Optional |

---

## Interpreting Results

### Vulnerability Classes X-Ray Detects

| Class | What It Means |
|-------|---------------|
| **MissingSigner** | Instruction doesn't verify a required signer |
| **MissingOwner** | Account ownership not checked |
| **IntegerOverflow** | Arithmetic may overflow without checked ops |
| **IntegerUnderflow** | Subtraction may underflow |
| **IntegerDivOverflow** | Division may panic on zero |
| **MaliciousSimulation** | Code branches on clock/blockhash to behave differently in simulation vs. execution |
| **BumpSeedNotValidated** | PDA bump seed from account data used without canonical validation |
| **ArbitraryCPI** | Cross-program invocation with untrusted program ID |
| **TypeCosplay** | Account discriminator not checked, allowing type confusion |
| **ClosedAccountExploit** | Using account data after it was closed |
| **PDASubstitution** | PDA seeds not fully validated |

### Triage Workflow

For each finding X-Ray reports:

1. **Read the code snippet** — X-Ray prints the exact file, line, and surrounding context
2. **Check the stack trace** — trace from entry point to flagged line
3. **Classify the finding**:
   - **True positive** — real vulnerability, needs a code fix
   - **False positive** — safe code that X-Ray misidentifies (document why)
   - **Informational** — technically correct concern, but mitigated by design (document the mitigation)
4. **Cross-reference** with existing findings in `.audit/xray-static-analysis-feb-9-2026.md`
5. **Update the analysis report** if the finding is new or status changed

### Known False Positive Patterns

| Pattern | Why It's False | Example in This Codebase |
|---------|----------------|--------------------------|
| `clock.slot` comparison flagged as MaliciousSimulation | X-Ray flags any branch on slot/clock; our code checks claim period windows, not simulations | `create_stake.rs:121` |
| Subtraction flagged despite prior `require!(x > 0)` guard | X-Ray's data flow doesn't track `require!` macro constraints | `math.rs:27` (`c - 1` after `require!(c > 0)`) |
| `create_program_address` with stored bump | Flagged as non-canonical, but bump was set by Anchor `init` (always canonical) and PDA key is compared | `trigger_big_pay_day.rs:101` |

---

## Troubleshooting

### Docker Not Found

```
command not found: docker
```

**Fix**: Install Docker Desktop for macOS from https://www.docker.com/products/docker-desktop/

### Image Pull Fails

```
Error response from daemon: pull access denied
```

**Fix**: The image is public on GHCR. Check internet connectivity and retry:
```bash
docker pull ghcr.io/sec3-product/x-ray:latest
```

### "Program Not Found"

```
No program found in: /workspace/programs/helix-staking/
```

**Fix**: Ensure you're running from the repo root where `programs/helix-staking/Cargo.toml` exists:
```bash
ls programs/helix-staking/Cargo.toml   # Must exist
ls programs/helix-staking/Xargo.toml   # Must exist
```

### IR Compilation Errors

If X-Ray fails during `Loading IR From File`:

```bash
# Check for Rust syntax errors first
cd programs/helix-staking && cargo check
```

X-Ray needs compilable Rust source. Fix any syntax errors before re-running.

### Docker Resource Issues

If the scan hangs or is killed:
```bash
# Increase Docker memory allocation
# Docker Desktop → Settings → Resources → Memory → 4GB minimum
```

### `anchor: not found` Warning

```
sh: 1: /usr/bin/anchor: not found
```

This is an informational message from X-Ray attempting to detect the Anchor version. It does **not** affect the scan — X-Ray reads `Cargo.toml` directly and the warning can be ignored.

---

## Updating X-Ray

```bash
# Pull latest image
docker pull ghcr.io/sec3-product/x-ray:latest

# Verify version
docker run --rm ghcr.io/sec3-product/x-ray:latest -version
```

After updating, re-run the scan and compare findings against the previous analysis report. New X-Ray versions may detect additional vulnerability classes or reduce false positives.

---

## Output Artifacts

| Artifact | Location | Committed |
|----------|----------|-----------|
| Terminal output | stdout (not saved by default) | No |
| JSON reports (if generated) | `.xray/` | No (gitignored) |
| Analysis report | `.audit/xray-static-analysis-feb-9-2026.md` | Yes |

### Saving Terminal Output

```bash
npm run xray 2>&1 | tee xray-output-$(date +%Y%m%d).txt
```

---

## CI Integration (Future)

To run X-Ray in CI (e.g., GitHub Actions):

```yaml
- name: Run X-Ray Static Analysis
  run: |
    docker run --rm \
      --volume "${{ github.workspace }}:/workspace" \
      ghcr.io/sec3-product/x-ray:latest \
      /workspace/programs/helix-staking
```

Note: X-Ray exits with a non-zero code when vulnerabilities are found. To prevent CI failures on known false positives, use `|| true` or capture the exit code and evaluate against a baseline.

---

## Escalation

| Scenario | Action |
|----------|--------|
| New true positive (CRITICAL/HIGH) | Stop deployment. File issue. Fix before proceeding. |
| New true positive (MEDIUM/LOW) | Document in analysis report. Fix before mainnet; devnet deploy may proceed. |
| New false positive | Document in the Known False Positive Patterns table above and in the analysis report. |
| X-Ray tool itself is broken | Check https://github.com/sec3-service/x-ray for updates/issues. Fall back to manual review. |

---

## Reference

- X-Ray GitHub: https://github.com/sec3-service/x-ray
- sec3 blog (vulnerability classes): https://www.sec3.dev/blog
- Sealevel attacks reference: https://github.com/project-serum/sealevel-attacks
- Current findings report: `.audit/xray-static-analysis-feb-9-2026.md`
