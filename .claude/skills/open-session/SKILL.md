---
name: open-session
description: Use at the start of a working session — the project owner says something like "open session," "let's continue," "what's next," or otherwise picks work back up — or any time there's doubt about current project state. Reads STATUS.md, the latest session log, TASKS.md, and BACKLOG.md, then recommends one concrete next action instead of just reporting status. The session-opening counterpart to session-log, which closes a session.
---

# Open session

## When this fires
The start of a working session, on a signal like "open session," "let's continue," "what's next," or simply picking a project back up after time away — this is the mirror of `session-log`, which runs at the *end* of a session. Also worth running any time there's doubt about where a project actually stands, even mid-session.

This skill answers two different questions, and both matter: "where did we leave off" (state) and "what should happen now" (direction). A skill that only answers the first leaves the project owner to do the prioritizing themselves every time — this one does the second part too.

## Procedure

1. **Read `STATUS.md` in full.** `maturity`, "Last session," "Pending / next session priority," and "Decided / deferred" together are usually enough to reconstruct where things stand without opening anything else.
2. **Read the most recent file in `/logs/`** (highest date in the filename; only reach into `/logs/archive/` if the detail needed predates everything currently in `/logs/`) for anything more granular than STATUS.md's summary — specific files touched, specific decisions made and why.
3. **Read `TASKS.md`.** This file should be short by construction (only `in progress`/`in review`). Note every entry's status and its `updated:` date.
4. **Read `BACKLOG.md`.** Not to promote anything yet — just to know what's waiting in case `TASKS.md` turns out to be empty.
5. **Check for staleness, or a prior session that wasn't closed cleanly, and surface anything found rather than silently working around it:**
   - A `TASKS.md` entry marked `in progress` or `in review` whose `updated:` date is older than the most recent `/logs/` file's date — the task wasn't touched during the session that log describes, which usually means it stalled or was abandoned without being recorded.
   - `TASKS.md` holding a `done` entry — `commit` should have moved it into `TASKS_ARCHIVE.md` the instant it finished; if one's still sitting here, `session-log` wasn't run cleanly last time either.
   - If this project has a `.ae-kit-version` file, compare it against `ae-setup/kit/VERSION` (the same check `setup/SKILL.md` runs at its own step 0) — flag if this project's kit copy has fallen behind.
   - A dirty or unpushed git state left over (uncommitted changes, or a branch that was never merged) — check with `git status`/`git log`, read-only. This is a signal to report, not to act on; never run `git add`/`git commit`/`git push` as part of this skill.
6. **Recommend exactly one next action**, in this priority order:
   - If anything is `in review` — surface it first and stop there. It's waiting on the project owner, not on more building; don't bury a pending review under a new recommendation.
   - Else if anything is `in progress` — recommend resuming it, and say specifically where it left off (cite the task's own audit-log lines in `TASKS.md` plus the last session log, not a vague "keep going").
   - Else if `TASKS.md` is empty but `BACKLOG.md` has entries — recommend the single item worth promoting next via `scope`, and say why that one: check `STATUS.md`'s "Pending / next session priority" first (the project owner's own steer from last time takes precedence over guessing), and only fall back to judgment (highest apparent impact, or what unblocks something else) if `STATUS.md` doesn't already point at one.
   - Else (both empty) — say so plainly and ask the project owner what to prioritize. Never invent a task just to look useful.
7. **Keep the whole thing short.** One paragraph of state, the flags from step 5 (if any — omit the section entirely if none), and the one recommended action with its reasoning. This replaces the project owner re-deriving state from conversation memory — it isn't a chance to re-summarize every file that was read.

## Output
A short opening brief — current state, any staleness flags, and one concrete recommended next action — read before any new `scope`/`build` work starts this session.
