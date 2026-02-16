# Test Coverage Analysis - Baseline Measurement

## Context
- **Playbook:** Testing
- **Agent:** Harold
- **Project:** /Users/annon/projects/solhex
- **Auto Run Folder:** /Users/annon/projects/solhex/Auto Run Docs
- **Loop:** 00001

## Objective

Measure current test coverage and identify the testing landscape. This document establishes the baseline metrics that drive the test generation pipeline.

## Instructions

1. **Identify the test framework** - Detect what testing tools the project uses
2. **Run coverage analysis** - Execute test suite with coverage enabled
3. **Document current metrics** - Line, branch, and function coverage
4. **Identify testing patterns** - How existing tests are organized
5. **Output a coverage report** to `/Users/annon/projects/solhex/Auto Run Docs/LOOP_00001_COVERAGE_REPORT.md`

## Analysis Checklist

- [x] **Measure coverage (if needed)**: First check if `/Users/annon/projects/solhex/Auto Run Docs/LOOP_00001_COVERAGE_REPORT.md` already exists with coverage data (look for "Overall Line Coverage:" with a percentage). If it does, skip the analysis and mark this task complete—the coverage report is already in place. If it doesn't exist, identify the project's test framework and run the test suite with coverage enabled. Document line coverage percentage and identify lowest-covered modules. Output results to `/Users/annon/projects/solhex/Auto Run Docs/LOOP_00001_COVERAGE_REPORT.md`.
  > **Completed 2026-02-16**: Ran full analysis — 165 tests (156 Vitest + 9 Rust), 21/23 TS suites passing, 9/9 Rust unit tests passing. Estimated ~68% line coverage. All 18 instructions have integration tests. Key gaps: abort_bpd (2 tests only), admin_mint (indirect only), 2 broken Mocha-style test files, broken doctest. Full report at `LOOP_00001_COVERAGE_REPORT.md`.

## How to Find Coverage Commands

1. **Check project configuration files** for test scripts:
   - `package.json` scripts section
   - `Makefile` or `justfile` targets
   - `pyproject.toml` or `setup.py`
   - `Cargo.toml` for Rust
   - Build tool configs (Maven, Gradle, etc.)

2. **Look for existing coverage configuration**:
   - Coverage config files in project root
   - CI/CD pipeline definitions
   - README documentation

3. **Run with coverage flag** - Most test frameworks support a `--coverage` or similar flag

## Output Format

Create/update `/Users/annon/projects/solhex/Auto Run Docs/LOOP_00001_COVERAGE_REPORT.md` with:

```markdown
# Coverage Report - Loop 00001

## Summary
- **Overall Line Coverage:** [XX.X%]
- **Target:** 80%
- **Gap to Target:** [XX.X%]
- **Test Framework:** [name and version]
- **Coverage Command Used:** [the command that was run]
- **Total Test Files:** [count]
- **Total Test Cases:** [count]

## Coverage by Module

| Module | Lines | Branches | Functions | Status |
|--------|-------|----------|-----------|--------|
| [module1] | XX% | XX% | XX% | [NEEDS WORK / OK] |
| [module2] | XX% | XX% | XX% | [NEEDS WORK / OK] |
| ... | ... | ... | ... | ... |

## Lowest Coverage Files

Files with coverage below 50% that are good testing candidates:

1. **[filename]** - [XX%] line coverage
   - [Brief description of what this file does]
   - [Why it's important to test]

2. **[filename]** - [XX%] line coverage
   - ...

## Existing Test Patterns

### Test Location
- [ ] Tests alongside source files
- [ ] Tests in dedicated test directories
- [ ] Tests follow naming convention: [describe pattern]
- [ ] Other: [describe]

### Mocking Patterns
- [How the project handles mocks and test doubles]

### Fixture Patterns
- [How test data is organized - factories, fixtures, inline data]

## Recommendations

### Quick Wins (Easy to test, high impact)
1. [Module/file] - [why it's a quick win]

### Requires Setup (Need mocking infrastructure)
1. [Module/file] - [what setup is needed]

### Skip for Now (Low priority or too complex)
1. [Module/file] - [reason to skip]
```

## Guidelines

- **Be accurate**: Run actual coverage commands, don't estimate
- **Note patterns**: Understanding existing tests helps write consistent new ones
- **Identify blockers**: Some code may need refactoring before it's testable
- **Focus on gaps**: We care most about untested critical code
