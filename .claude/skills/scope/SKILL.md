---
name: scope
description: Use at the start of any non-trivial feature, refactor, or bug fix — before any file is touched. Produces the "blueprint" CLAUDE.md's plan-first rule requires and promotes the task into TASKS.md. Skip only for single-line fixes or pure copy/text changes with no side effects.
---

# Scope

## When this fires
Any request to build a feature, change existing behavior, or fix a bug that touches more than a single obvious line. If it's genuinely trivial (a typo, a copy change with zero logic impact), skip straight to `build` — but say so explicitly rather than silently deciding.

This skill is for work that's starting *now*. An idea worth keeping track of but not being started yet doesn't need this skill at all — just add a one-line entry to `BACKLOG.md` instead.

## Procedure

1. **Create or promote the task entry into `TASKS.md`.** If this task already has a one-line entry in `BACKLOG.md`, remove that line now and create the full entry in `TASKS.md` — id (reuse the backlog id if it had one), title, category, status `backlog`, created date. If it's a new ask with no prior backlog entry, create the full `TASKS.md` entry directly. Either way, do this before any other step — `TASKS.md` is the record of everything currently being scoped, built, or reviewed, so an entry needs to exist there the moment work starts, not once it's finished.
2. **Write the blueprint**, covering:
   - Proposed change: what logic changes and why, in plain English.
   - File impact list: exact files to be created, modified, or deleted.
   - Dependency warning: anything this could break elsewhere — other modules, other features, shared components.
   - Testing plan: which `verify-*` skills will apply (tests always; evals if this touches a model call; UI walkthrough if this touches a UI flow) and what "passing" looks like for this specific task.
3. **Move the task to `in progress`** only after posting the blueprint and pausing for explicit approval. Do not proceed to `design` or `build` without it, regardless of how confident the plan seems.
4. **Create the branch** at this point, named `ai/{{task-id}}-{{slug}}`, per the branch policy in `CLAUDE.md` — skip this step entirely if this project's stated policy is direct-to-main rather than branch-per-task.

## Output
An approved blueprint, a task entry in `TASKS.md` with status `in progress`, and (for a branch-per-task project) a branch ready for work. Hand off to `design` (if the task involves new data structure or a UI surface) or straight to `build` otherwise.
