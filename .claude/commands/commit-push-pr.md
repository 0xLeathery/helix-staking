Commit, push, and open a PR for the current changes.

1. Run the full verification loop before committing:
   - `anchor build`
   - `npx vitest run tests/bankrun`
   - `cargo clippy --package helix-staking -- -D warnings`
   - `cargo fmt --package helix-staking --check`
2. If any step fails, fix the issue and re-run — do not skip verification
3. Stage the relevant changed files (never use `git add -A`)
4. Write a concise commit message: summarize the "why", not the "what"
5. Push to the current branch with `git push -u origin $(git branch --show-current)`
6. Create a PR using `gh pr create` with:
   - A short title (under 70 chars)
   - A body with ## Summary (bullet points) and ## Test plan
