---
name: commit
description: Use once verification (tests, evals, UI walkthrough as applicable) has passed for a task, to commit the work, update the task's status, and — after project owner approval — merge and clean up the branch. Also use standalone to sync a task's status in TASKS.md when no code changed (a doc, decision, or research task).
---

# Commit

## When this fires
After verification passes for a code-touching task. Also fires standalone for non-code tasks (documentation, decisions, research) that just need their `TASKS.md` status synced.

## Procedure

1. **Check for a stale `index.lock` before attempting to commit.** Check whether a git process is genuinely still running. If not, and a lock file is present, clear it and retry. If one is running, wait — do not force-remove a lock while a process might still be using it. **If this is a cloud Cowork session, clearing the lock may not be permitted from within the session at all** (the sandbox's own shell can lack permission to remove it, independent of whether a git process is actually running) — if removal fails for a reason that isn't "a process is using it," don't keep retrying; tell the project owner the lock needs clearing from their own terminal, the same as any other cloud-Cowork filesystem restriction.
2. Stage the intended changes and commit using this project's stated commit message convention (see `CLAUDE.md` → Git conventions). Default, if this project hasn't customized it:
   ```
   WHAT: <what changed, one line>
   WHY: <why, one line>
   RISK: <what could break, or "none identified">
   ```
   If this project uses a different established convention instead (recorded in `CLAUDE.md` during setup), use that one — never fall back to the default silently once a project convention is on record.
3. **Always report the outcome explicitly in chat** — the commit hash if it succeeded, or the specific reason if it didn't (including "found and cleared a stale lock, retried, succeeded" if that happened). Never leave the project owner to guess whether anything landed.
4. **If this project has CI/CD that runs on push (GitHub Actions, Vercel, or similar), verify the pushed commit's remote status before treating this task's work as settled — passing locally is not the same as passing on the tracked branch.**
   - For a branch-per-task project, this is naturally covered by the PR/merge checks later — no extra action here.
   - For a direct-to-main project where the project owner pushes manually (per this project's stated policy, see `CLAUDE.md` → Git conventions): after they confirm the push landed, run `.claude/skills/commit/scripts/check-deploy-status.sh <sha>` (requires `gh` CLI, authenticated; defaults to `HEAD` if `<sha>` is omitted, polls every 10s up to 15 times before giving up — pass different `max_attempts`/`sleep_seconds` args for a slower or longer-running pipeline). Exit `0` = all checks green, `1` = something failed, `2` = still unresolved after the poll budget, re-run to keep waiting. Don't guess or assume it passed — run it and read the result.
   - **If it exits `1`, treat that exactly like a failing local test: blocking.** Diagnose the real cause (don't assume it's the same issue as a prior failure — verify fresh), fix, recommit, ask the project owner to push again, and re-run the script until it exits `0`. Never move on to the next task, or a different unrelated task, while a known-red commit sits on the tracked branch — a broken build left unattended is a broken build a teammate or the next session inherits silently.
   - Report the resolved status in chat either way (green, or what failed and how it was fixed) — same visibility bar as step 3.
5. Update the task's entry in `TASKS.md`: set status to `in review` if this awaits the project owner's check, or `done` if pre-approved as trivial.
6. **The moment a task's status becomes `done`, move it out of `TASKS.md` immediately — do not wait for `session-log`'s end-of-session sweep.** Append the full entry (same format, plus a `done:` date) to `TASKS_ARCHIVE.md` — the current, un-split archive file — then delete it from `TASKS.md`. `TASKS.md` only ever holds `in progress`/`in review` work; a `done` entry sitting in it, even briefly, defeats the point of keeping that file short.

   **If this append brings `TASKS_ARCHIVE.md` to 50 entries, split it before continuing:**
   1. Move the current `TASKS_ARCHIVE.md` into `tasks-archive/TASKS_ARCHIVE_{start-date}_{end-date}.md` (creating the `tasks-archive/` folder the first time this happens), where `{start-date}` and `{end-date}` are the `done:` dates of the oldest and newest entries it now holds. Splits live in their own folder, not the project root, so the root doesn't accumulate a growing pile of dated files over the project's life.
   2. Add a row to `TASKS_ARCHIVE_INDEX.md`: file path (including the `tasks-archive/` prefix), start date, end date, entry count.
   3. Start a fresh, empty `TASKS_ARCHIVE.md` at the project root to collect whatever gets marked `done` next.

   This keeps the live `TASKS_ARCHIVE.md` a bounded, fast-to-scan file at all times — anyone looking for a recently completed task checks it first, and only opens `TASKS_ARCHIVE_INDEX.md` (to find the right dated file) when searching further back.
7. **Branch handling follows this project's stated branch policy** (`CLAUDE.md` → Git conventions). Default (branch-per-task): do not merge or delete the branch yet — only after the project owner reviews the task's audit-log entry (and UI walkthrough, if applicable) and explicitly approves. Once approved: merge into `main`, then delete the branch both locally and remotely. If this project's stated policy is direct-to-main instead, this step is skipped entirely — the commit in step 2 already landed on `main`, and there's no branch to clean up.
8. For non-code tasks (Category: doc/decision/research), skip the git steps (2, 4, and 7) entirely — just update the task's status and description in `TASKS.md`, and if the status is `done`, still perform the `TASKS.md` → `TASKS_ARCHIVE.md` move (and split check) from step 6.

## Output
A committed, reported change with an updated task entry, verified against the remote CI/deploy status rather than assumed; a `done` task moved into `TASKS_ARCHIVE.md` the moment it lands, with a split into a dated archive file (and an updated `TASKS_ARCHIVE_INDEX.md`) whenever that push the count to 50; a merged and cleaned-up branch once — and only once — the project owner has approved (skipped entirely for a direct-to-main project).
