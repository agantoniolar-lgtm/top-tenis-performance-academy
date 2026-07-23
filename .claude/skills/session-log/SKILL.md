---
name: session-log
description: Use at the end of a working session (the project owner says something like "let's end here" or "log progress for today"). Sweeps the full task tracker, writes a session log entry, and updates STATUS.md. For the start of a session, or any doubt about current state, use `open-session` instead.
---

# Session log

## When this fires
End of a work session, on explicit signal from the project owner. This is the closing half of a pair — see `open-session` for the opening half (reading `STATUS.md`/`/logs/` at the *start* of a session and recommending what to do next).

## Procedure

1. **Sweep the entire task tracker, not just what was touched today.** Check every task currently `in progress` or `in review` in `TASKS.md` — confirm each one's status is still accurate. Nothing should be left silently stale.
2. **Confirm no `done` task was left behind in `TASKS.md`.** `commit` moves a task into `TASKS_ARCHIVE.md` the instant it reaches `done`, so this should normally find nothing — but if one was somehow missed (a status was hand-edited, or a non-code task was marked done outside the `commit` flow), move it into `TASKS_ARCHIVE.md` now using the same procedure `commit` uses: append the entry with a `done:` date, and if that pushes the archive to 50 entries, split it (move it into `tasks-archive/TASKS_ARCHIVE_{start-date}_{end-date}.md`, creating that folder if needed, log the row in `TASKS_ARCHIVE_INDEX.md`, start a fresh empty `TASKS_ARCHIVE.md` at the project root).
3. Write a new file at `/logs/session-YYYY-MM-DD.md` summarizing, in plain English: what was worked on, what shipped, what's still open, and any decisions made or deferred during the session.
4. **Check the size of `/logs/`.** Count the session files directly in `/logs/` (not counting an `archive/` subfolder if one already exists). If it's now over 30, move the oldest file(s) into `/logs/archive/` (create that folder if it doesn't exist yet) until `/logs/` holds 30 or fewer. Leave file names untouched (`session-YYYY-MM-DD.md`) — the date in the name is already the index, so no separate index file is needed for logs the way `TASKS_ARCHIVE_INDEX.md` is needed for tasks (a single archive file there can hold many different tasks' dates at once; a log file is always exactly one session, so its own name already tells you what it covers).
5. Update `STATUS.md`: replace "Last session" with this session's summary, update "Pending / next session priority" with what should happen next, and add anything explicitly decided to postpone under "Decided / deferred" so it doesn't get silently re-litigated later.
6. **Never touch the `maturity:` field** — that's set only by the project owner, and only when the project's real-world status actually changes.

## Output
An accurate `TASKS.md`/`TASKS_ARCHIVE.md` (with `TASKS_ARCHIVE_INDEX.md` updated if a split happened), a new session log file (with `/logs/archive/` kept to the 30-file cap), and an up-to-date `STATUS.md` — the three things a future session (or the project owner, at a glance) relies on instead of conversation memory. Combined with `open-session` at the start of the next one, this closes the loop: nothing about project state has to live in anyone's head.
