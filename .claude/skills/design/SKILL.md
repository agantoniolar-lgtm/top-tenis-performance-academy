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
2. If the change touches access rules for different roles/users, this is where the RLS-equivalent verification requirement gets flagged for `verify-tests` later — note it in the task's `TASKS.md` entry so it isn't missed at verification time.
3. Confirm the design against {{STACK_LANGUAGE}} strict-mode constraints before moving on — if the type checker would reject the shape, fix it here, not during build.

### If the task involves a new or changed UI surface
1. Invoke the relevant installed design skill(s) before writing any component code — typically `design-system` (consistency with existing patterns), `ux-copy` (any new microcopy, labels, error states), and `accessibility-review` (for anything non-trivial). Use `design-critique` if there's an existing mockup or screen to react to.
2. This is not optional or a nice-to-have step reserved for polish passes — a UI-touching task that skips this runs the risk of shipping something inconsistent that only gets caught in the `verify-ui` walkthrough, which is a more expensive place to catch it.
3. Record the design decisions in the task's `TASKS.md` entry in plain English (what the UI does, not implementation detail) so the eventual `verify-ui` walkthrough has something to check against.

## Output
A confirmed schema/type shape (if applicable) and a confirmed UI/UX design decision set (if applicable), both recorded in the task's audit-log entry, before `build` starts.
