---
name: session-log
description: Use at the end of a working session (the project owner says something like "let's end here" or "log progress for today"), or any time there's doubt about current project state at the start of a new session. Sweeps the full task tracker, writes a session log entry, and updates STATUS.md.
---

# Session log

## When this fires
End of a work session, on explicit signal from the project owner. Also worth running at the *start* of a session if there's any doubt about where things were left — read `STATUS.md` and the latest `/logs/` entry before starting new work.

## Procedure (closing a session)

1. **Sweep the entire task tracker, not just what was touched today.** Check every task currently `in progress` or `in review` in `TASKS.md` — confirm each one's status is still accurate. Nothing should be left silently stale.
2. Move any task that reached `done` into `TASKS_ARCHIVE.md`.
3. Write a new file at `/logs/session-YYYY-MM-DD.md` summarizing, in plain English: what was worked on, what shipped, what's still open, and any decisions made or deferred during the session.
4. Update `STATUS.md`: replace "Last session" with this session's summary, update "Pending / next session priority" with what should happen next, and add anything explicitly decided to postpone under "Decided / deferred" so it doesn't get silently re-litigated later.
5. **Never touch the `maturity:` field** — that's set only by the project owner, and only when the project's real-world status actually changes.

## Procedure (opening a session, if state is unclear)

1. Read `STATUS.md` in full.
2. Read the most recent file in `/logs/`.
3. Confirm against `TASKS.md` that nothing marked `in progress` was actually abandoned or finished without being recorded.

## Output
An accurate `TASKS.md`/`TASKS_ARCHIVE.md`, a new session log file, and an up-to-date `STATUS.md` — the three things a future session (or the project owner, at a glance) relies on instead of conversation memory.
