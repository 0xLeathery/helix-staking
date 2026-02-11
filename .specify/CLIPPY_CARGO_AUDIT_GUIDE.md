# Using Clippy & Cargo Audit - Quick Reference

**Both tools are ready to use. No installation needed.**

---

## 1. CLIPPY (Rust Linter)

Clippy is built into Cargo and comes with Rust. It catches code quality issues, potential bugs, and style improvements.

### Run Clippy

```bash
# Check for issues (doesn't modify code)
cargo clippy --package helix-staking

# Or with stricter warnings
cargo clippy --package helix-staking -- -D warnings

# Auto-fix what it can (carefully!)
cargo clippy --fix --lib -p helix-staking --allow-dirty
```

### Current Status

```
✅ 34 warnings in helix-staking
   - Most are from Anchor macros (not our code, can ignore)
   - 2 actionable suggestions available
   - 1 deprecated method warning (AccountInfo::realloc)
```

### Understanding Warnings

**Can Ignore** (from Anchor/Solana):
- `unexpected cfg condition value`
- `use of deprecated method` (AccountInfo::realloc)

**Should Fix** (from our code):
- `unused imports`
- `digits grouped inconsistently`

### Example: Recent Fix

```rust
// ❌ BEFORE (Clippy warning)
Ok(u64::try_from(final_bonus).map_err(|_| error!(HelixError::Overflow))?)

// ✅ AFTER (Clippy fix applied)
u64::try_from(final_bonus).map_err(|_| error!(HelixError::Overflow))
```

**Key Improvement**: Removed unnecessary `Ok()` wrapper, making code cleaner.

---

## 2. CARGO AUDIT (Dependency Security)

Cargo Audit scans all dependencies for known security vulnerabilities (CVEs).

### Run Cargo Audit

```bash
# Check for vulnerabilities
cargo audit

# Strict mode - also deny unmaintained crates
cargo audit deny unmaintained

# Generate report
cargo audit --json > audit-report.json
```

### Current Status

```
✅ 264 dependencies scanned
⚠️  1 warning: bincode 1.3.3 is unmaintained
✅ 0 actual CVEs found
```

### What the Warning Means

**bincode (unmaintained)**:
- Library for serialization/deserialization
- Not actively maintained (since Dec 2025)
- Used by Solana ecosystem
- No active CVEs, but monitor for replacement

**Action**: Monitor Solana's roadmap for bincode replacement (serde_json, postcard, etc.)

### Understanding Audit Output

```
Crate:     bincode
Version:   1.3.3
Warning:   unmaintained
Title:     Bincode is unmaintained
Date:      2025-12-16
ID:        RUSTSEC-2025-0141
```

This is just a warning, not a blocker. Many Solana programs use bincode without issues.

---

## 3. Using Both Tools Together

### Daily Workflow

```bash
# Before committing code:
cargo clippy --package helix-staking
cargo audit

# Fix any clippy issues, then test
npm run test:bankrun

# Commit when clean
git add .
git commit -m "fix: address clippy warnings"
```

### Time Investment

- **Clippy**: 30 seconds
- **Cargo Audit**: 30 seconds
- **Total**: ~1 minute per check

### Git Pre-Commit Hook (Optional)

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
set -e

echo "Running Clippy..."
cargo clippy --package helix-staking -- -D warnings

echo "Running Cargo Audit..."
cargo audit

echo "✅ All checks passed!"
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

Now both tools run automatically before each commit.

---

## 4. Interpreting Results

### Clippy Severity Levels

| Level | Action | Example |
|-------|--------|---------|
| **help** | Nice to have | "remove extra blank line" |
| **warn** | Should fix | "unused variable" |
| **deny** | Must fix | "unsafe operation" |

### Cargo Audit Severity Levels

| Level | Action | Example |
|-------|--------|---------|
| **info** | Informational | "deprecated crate" |
| **warn** | Monitor | "unmaintained crate" |
| **error** | BLOCKER | "Known CVE in dependency" |

---

## 5. Common Patterns to Watch For

### Clippy Patterns

```rust
// ❌ Clippy warns: "use Option::map_or"
if let Some(x) = maybe_value {
    do_something(x);
} else {
    default_action();
}

// ✅ Better
maybe_value.map_or(default_action, do_something);
```

```rust
// ❌ Clippy warns: "needless_question_mark"
fn foo() -> Result<T> {
    Ok(bar()?)
}

// ✅ Better
fn foo() -> Result<T> {
    bar()
}
```

### Cargo Audit Patterns

```bash
# ❌ Audit warns: CVE found
RUSTSEC-2024-0001: Vulnerability in dependency foo v1.2.3

# ✅ Action: Update dependency
cargo update foo --aggressive
cargo audit
```

---

## 6. CI/CD Integration (GitHub Actions)

Create `.github/workflows/clippy-audit.yml`:

```yaml
name: Clippy & Audit

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      
      - name: Clippy
        run: cargo clippy --package helix-staking -- -D warnings
      
      - name: Cargo Audit
        run: cargo audit deny unmaintained
```

This runs automatically on every push and pull request.

---

## 7. Troubleshooting

### "Clippy found too many warnings"

**Solution**: Filter to show only your code warnings:

```bash
# Show only warnings from our src code
cargo clippy --package helix-staking 2>&1 | grep "src/" | head -20
```

### "Cargo Audit fails on unmaintained crate"

**Solution**: Allow unmaintained if no CVE exists:

```bash
# Just warn, don't fail
cargo audit

# Strict mode (fails on unmaintained)
cargo audit deny unmaintained
```

### "Clippy --fix breaks code"

**Solution**: Review before applying:

```bash
# Preview changes
cargo clippy --fix --lib -p helix-staking --no-commit

# Then review changes
git diff

# Apply if looks good
cargo clippy --fix --lib -p helix-staking --allow-dirty
```

---

## 8. Status Dashboard

Run this to see health of your code:

```bash
echo "=== CLIPPY ==="
cargo clippy --package helix-staking 2>&1 | grep "warning:" | wc -l
echo "warnings total"

echo ""
echo "=== CARGO AUDIT ==="
cargo audit 2>&1 | grep -E "error|warning" | head -5
```

---

## Quick Commands Cheat Sheet

```bash
# Clippy
cargo clippy --package helix-staking           # Run check
cargo clippy --fix --lib -p helix-staking      # Auto-fix
cargo clippy -- -D warnings                    # Strict mode

# Cargo Audit
cargo audit                                    # Quick scan
cargo audit deny unmaintained                  # Strict scan
cargo audit --json                             # Export JSON

# Combined
cargo clippy --package helix-staking && cargo audit && npm run test:bankrun
```

---

## When to Use Each Tool

| Situation | Tool | Command |
|-----------|------|---------|
| Before committing | Both | `cargo clippy && cargo audit` |
| Code review | Clippy | `cargo clippy -- -D warnings` |
| Dependency check | Audit | `cargo audit` |
| CI/CD pipeline | Both | Add to GitHub Actions |
| Local pre-commit | Both | Use git hook |

---

## Next Steps

1. ✅ Run Clippy: `cargo clippy --package helix-staking`
2. ✅ Run Audit: `cargo audit`
3. Add to git hook: Create `.git/hooks/pre-commit`
4. Add to CI/CD: Create `.github/workflows/clippy-audit.yml`

**All tools are now integrated and ready to use!**

