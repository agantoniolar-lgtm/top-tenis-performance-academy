---
name: design
description: Use after a scope is approved, before build starts, whenever the task introduces or changes data structure (new table, new schema, new access rules) or a UI surface (new screen, new flow, changed component). Covers both halves — don't run only the data-structure half and skip the UI/UX half when a task has both.
---

# Design

## When this fires
Any approved task from `scope` that has a data-structure component, a UI component, or both. A backend-only change with no new data shape and no UI impact skips straight to `build`.

## Procedure

### If the task involves new or changed data structure
1. Design the schema/type change explicitly before writing implementation code — table shape, types, relationships.
2. **For Supabase projects: write the change as a migration file (`supabase migration new <name>`), never as SQL run directly against the database by hand.** Check `SETUP_CHECKLIST.md` section 3b first — if `supabase/migrations/` doesn't exist or doesn't reflect the actual current schema, that's a retrofit gap to close (baseline via `supabase db pull`) before this task's schema change can be added as a migration on top of it. Ad hoc SQL against any database, even for something that feels small, is exactly the fragile, unreproducible pattern this framework exists to prevent.
3. If the change touches access rules for different roles/users, this is where the RLS-equivalent verification requirement gets flagged for `verify-tests` later — note it in the task's `TASKS.md` entry so it isn't missed at verification time.
4. Confirm the design against {{STACK_LANGUAGE}} strict-mode constraints before moving on — if the type checker would reject the shape, fix it here, not during build.

### If the task involves a new or changed UI surface
1. Invoke the relevant kit design skill(s) before writing any component code — typically `design-system` (consistency with existing patterns) and `ux-copy` (any new microcopy, labels, error states). Use `design-critique` instead of, or after, `design-system`'s Extend mode when there's an existing mockup or screen to react to rather than a blank page. Use `user-research` only when the task's blueprint from `scope` flagged real uncertainty about user need or behavior — most UI work doesn't need it.
2. This is not optional or a nice-to-have step reserved for polish passes — a UI-touching task that skips this runs the risk of shipping something inconsistent that only gets caught in the `verify-ui` walkthrough, which is a more expensive place to catch it.
3. Record the design decisions in the task's `TASKS.md` entry in plain English (what the UI does, not implementation detail) so the eventual `verify-ui` walkthrough has something to check against.

## Output
A confirmed schema/type shape (if applicable) and a confirmed UI/UX design decision set (if applicable), both recorded in the task's audit-log entry, before `build` starts.
