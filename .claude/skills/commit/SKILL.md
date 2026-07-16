---
name: commit
description: Use once verification (tests, evals, UI walkthrough as applicable) has passed for a task, to commit the work, update the task's status, and — after project owner approval — merge and clean up the branch. Also use standalone to sync a task's status in TASKS.md when no code changed (a doc, decision, or research task).
---

# Commit

## When this fires
After verification passes for a code-touching task. Also fires standalone for non-code tasks (documentation, decisions, research) that just need their `TASKS.md` status synced.

## Procedure

1. **Check for a stale `index.lock` before attempting to commit.** Check whether a git process is genuinely still running. If not, and a lock file is present, clear it and retry. If one is running, wait — do not force-remove a lock while a process might still be using it.
2. Stage the intended changes and commit with the standing template:
   ```
   WHAT: <what changed, one line>
   WHY: <why, one line>
   RISK: <what could break, or "none identified">
   ```
3. **Always report the outcome explicitly in chat** — the commit hash if it succeeded, or the specific reason if it didn't (including "found and cleared a stale lock, retried, succeeded" if that happened). Never leave the project owner to guess whether anything landed.
4. Update the task's entry in `TASKS.md`: move status to `in review` if this awaits the project owner's check, or `done` if pre-approved as trivial.
5. **Do not merge or delete the branch yet.** Merging into `main` and deleting the branch only happens after the project owner reviews the task's audit-log entry (and UI walkthrough, if applicable) and explicitly approves. Once approved: merge into `main`, then delete the branch both locally and remotely.
6. For non-code tasks (Category: doc/decision/research), skip the git steps entirely — just update the task's status and description in `TASKS.md`.

## Output
A committed, reported change with an updated task entry; a merged and cleaned-up branch once — and only once — the project owner has approved.
