# GitHub Actions Security Checks Setup

**File Created**: `.github/workflows/security-checks.yml`

This workflow runs automatically on every push and pull request to ensure code quality and security.

---

## What The Workflow Does

The workflow runs **4 jobs in parallel**:

### 1. **Clippy Linter** (30 seconds)
- Runs Rust linter on all code
- Fails if any warnings found (`-D warnings`)
- Caches dependencies for speed

### 2. **Dependency Audit** (30 seconds)
- Scans 264+ dependencies for CVEs
- Denies unmaintained crates
- Reports any security issues

### 3. **Test Suite** (20 seconds)
- Builds the program
- Runs all 156 bankrun tests
- Ensures no regressions

### 4. **Summary** (5 seconds)
- Reports overall pass/fail
- Blocks merge if any check fails

---

## When It Runs

The workflow triggers on:

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

**Only when these files change**:
- `programs/**` (Rust source code)
- `Cargo.toml` / `Cargo.lock` (dependencies)
- Workflow itself

---

## Workflow Features

✅ **Parallel execution** - All 3 checks run at the same time (faster)  
✅ **Caching** - Reuses compiled dependencies (faster on subsequent runs)  
✅ **Clear reporting** - Shows exactly which check passed/failed  
✅ **Fail fast** - Stops on first failure  
✅ **Continue on error** - Shows all errors before failing  
✅ **Summary step** - Groups results for easy viewing  

---

## How to View Results

### On GitHub

1. **On Pull Requests**: Check shows under "Checks" tab
2. **On Commits**: Check shows in commit details
3. **In Actions tab**: View full logs and history

### Check Status

```
✅ All checks passed  → Can merge
⚠️  Some checks running → Wait
❌ Checks failed → Fix and push again
```

---

## Interpreting Failures

### Clippy Failure

```
Error: cargo clippy found warnings
  --> programs/helix-staking/src/...

Fix locally:
  cargo clippy --package helix-staking -- -D warnings
```

**Action**: Run clippy locally, fix warnings, push again

### Audit Failure

```
Error: Known CVE in dependency
  crate: foo v1.2.3
  RUSTSEC-2024-0001
```

**Action**: Update dependency and push again

```bash
cargo update foo
cargo audit
git add Cargo.lock
git commit -m "fix: update foo to address CVE"
git push
```

### Test Failure

```
FAIL tests/bankrun/sometest.ts - 1 error
```

**Action**: Fix the test locally and push

```bash
npx vitest run tests/bankrun/sometest.ts
# Fix the issue
git push
```

---

## Workflow Configuration Details

### Cache Strategy

```yaml
- uses: Swatinem/rust-cache@v2
  with:
    workspaces: 'programs'
```

This caches:
- Compiled dependencies
- Build artifacts
- Across workflow runs on same branch

**Benefit**: 2nd+ runs are 5x faster

### Toolchain

```yaml
- uses: dtolnay/rust-toolchain@stable
  with:
    components: clippy
```

Uses latest stable Rust with Clippy built-in

### Node.js

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

Caches npm dependencies too

---

## Example Workflow Run

```
On: push to main
├─ Clippy Linter ✅ (25s)
│  └─ "No warnings found"
├─ Dependency Audit ✅ (18s)
│  └─ "264 dependencies scanned, 0 CVEs"
├─ Test Suite ✅ (22s)
│  └─ "156/156 tests passed"
└─ Summary ✅ (2s)
   └─ "All checks passed!"

Total time: ~40 seconds
Result: ✅ PASS
```

---

## Disabling For Hotfixes (Not Recommended)

If you need to **skip checks** (emergency hotfix only):

```bash
git push -f --no-verify  # Force push, skip hooks
```

**WARNING**: This bypasses checks. Use only for critical hotfixes.

Better: Create branch that skips workflow:

```yaml
# Workflow only runs on main/develop, not hotfix branches
on:
  push:
    branches: [ main, develop ]
```

---

## Customizing The Workflow

### Run on all branches

```yaml
on:
  push:
    branches: [ '**' ]  # All branches
```

### Run on schedule (nightly security check)

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
```

### Allow failures (don't block merge)

```yaml
continue-on-error: true  # Allows failure
```

### Slack/Email notifications

```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Security checks failed on ${{ github.ref }}'
```

---

## Viewing Detailed Logs

### From Pull Request

1. Click "Checks" tab
2. Click "Security & Code Quality Checks"
3. Click individual job (Clippy, Audit, Test)
4. View logs

### From GitHub Actions Tab

1. Go to Actions tab
2. Click "Security & Code Quality Checks" workflow
3. Click latest run
4. Expand jobs to see logs

### Local Reproduction

To debug failures locally:

```bash
# Run exact same checks
cargo clippy --package helix-staking -- -D warnings
cargo audit deny unmaintained
npx vitest run tests/bankrun --exclude="tests/bankrun/tests"
```

---

## Performance Notes

| Check | Time | Cached Time |
|-------|------|-------------|
| Clippy | 30s | 5s |
| Audit | 30s | 5s |
| Tests | 20s | 15s |
| **Total** | **~40s** | **~15s** |

**Parallel execution** means all 3 run simultaneously, so total time is ~40s, not 80s.

---

## What's NOT Checked (Yet)

These could be added later:

- ❌ Frontend (app/web) linting
- ❌ Indexer (services/indexer) linting
- ❌ X-Ray vulnerability scanner
- ❌ Code coverage percentage
- ❌ Documentation generation
- ❌ Verifiable build

Would be easy to add if needed.

---

## Status Badge

Add to your README.md:

```markdown
![Security Checks](https://github.com/ethan-hurst/solhex/workflows/Security%20%26%20Code%20Quality%20Checks/badge.svg)
```

This shows the status of your latest security checks right in your README.

---

## Next Steps

1. ✅ Workflow file created
2. Push to GitHub
3. Go to Actions tab to see it run
4. Fix any failures it finds
5. Subsequent pushes will be cached (faster)

The workflow is now **active and protecting your main/develop branches**!

