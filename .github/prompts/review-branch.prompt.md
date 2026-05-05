---
agent: agent
description: Review the current branch by default, or review another branch or ref in a temporary worktree when one is specified.
---

Review a branch or ref as a code review.

Perform the review in the current agent. Do not delegate, spawn, or hand off any part of the review to other agents.

Mode selection:
- If the user does not specify another branch or ref, review the current checkout.
- If the user specifies a target branch, remote ref, or commit SHA, review that target in a temporary worktree instead of switching the current checkout.
- Use `origin/main` as the base branch unless the user explicitly specifies a different base.
- Refresh only the refs needed for comparison. Prefer targeted fetches such as `git fetch origin main` over broad commands like `git fetch --all --prune`.

Current checkout mode:
- Run `git fetch origin main` (or the chosen base) to ensure the local tracking ref is current.
- Run `git diff <base>...HEAD --stat` then `git diff <base>...HEAD` for the branch diff.
- Run `git diff HEAD --stat` then `git diff HEAD` to include uncommitted changes.

Temporary worktree mode:
- Do not switch branches in the user's current working tree.
- Review only the committed state of the target ref.
- Resolve the target ref from the user's message. Accept local branch names, remote refs such as `origin/feature/foo`, or commit SHAs. If the user clearly wants to review another branch but does not specify one, ask before proceeding.
- Fetch both the base ref and the target branch before creating the worktree, e.g. `git fetch origin main <name>`, to ensure the review uses the latest remote state for both. Use the remote tracking ref `origin/<name>` as the resolved target.
- Avoid repository-wide or destructive git operations such as `git gc`, `git prune`, `git fetch --all`, deleting refs, rewriting history, or removing other worktrees.
- Steps:
  1. `mkdir -p "$CONTAINER_WORKSPACE_ROOT/tmp/worktrees" && worktree_dir=$(mktemp -d "$CONTAINER_WORKSPACE_ROOT/tmp/worktrees/review.XXXXXX")`
  2. `git -C "$CONTAINER_WORKSPACE_ROOT" worktree add --detach "$worktree_dir" "$resolved_target_ref"`
  3. `git -C "$worktree_dir" diff "$base"...HEAD --stat` then `git -C "$worktree_dir" diff "$base"...HEAD`.
  4. `git -C "$CONTAINER_WORKSPACE_ROOT" worktree remove "$worktree_dir"`
- Always remove the worktree before finishing, even if the review is interrupted or encounters an error.

Scope:
- Inspect surrounding code in touched files and impacted callers or tests.
- Suggest targeted refactoring or simplification when it would materially reduce complexity, duplication, or maintenance cost.
- Do not edit files.

Priorities:
1. Bugs and behavioral regressions.
2. Security, authentication, authorization, or data exposure issues.
3. Missing, weak, or outdated tests.
4. Risky API, data, infrastructure, or configuration changes.
5. Contract drift between backend and frontend when API surface changes.
6. Incorrect assumptions about existing architecture or contracts.
7. Maintainability problems that are likely to cause near-term defects.
8. Opportunities for refactoring, simplification, or reducing unnecessary complexity.

Return:
- `Mode`: `current-checkout` or `temporary-worktree`.
- `Target`: the reviewed branch or ref.
- `Base`: the base ref used for comparison.
- `Change summary`: brief orientation of what the branch does.
- `Findings`: ordered by severity with concrete file references.
- `Open questions or assumptions`: anything unclear or assumed during the review.
- `Verification gaps`: checks or tests that appear to be missing.
- `Refactoring or simplification opportunities`: concise and concrete, only when worthwhile.

If there are no findings, say that explicitly and mention any residual risk or unverified area.
