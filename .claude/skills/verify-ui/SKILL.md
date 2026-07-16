---
name: verify-ui
description: Use after build (and after verify-tests/verify-evals as applicable), only for tasks that touch a UI flow significantly enough that visual/behavioral correctness can't be confirmed by tests alone. Skip for isolated bug fixes or small changes where a targeted before/after check is enough — don't over-apply this to every tiny UI tweak.
---

# Verify — UI walkthrough

## When this fires
Any task that introduces or meaningfully changes a UI flow. Not every UI-touching change needs this — a one-line style fix or an isolated bug fix just needs a targeted before/after check, stated plainly in the task entry. This step is for builds significant enough that a reviewer needs to actually walk the flow to catch missing states or edge cases.

## Procedure

1. Walk the affected flow end to end as the relevant user role would (e.g., "as a coach, viewing an athlete's session log...").
2. Produce a summary **organized by flow, not by file** — describe what a reviewer would see and do at each step, and what changed, in plain English. Use Playwright to capture recordings/screenshots of the flow where useful; these double as the human-readable artifact, not just a pass/fail signal.
3. Call out anything that looks like a missing state or edge case discovered while walking the flow (empty states, error states, loading states) — this is often where real bugs surface, not in the code review.
4. Record the walkthrough in the task's `TASKS.md` entry so the project owner can go through the same motion themselves and confirm it matches what they expect.

## Output
A flow-organized walkthrough (plus recordings/screenshots if applicable) in the task's audit log, ready for the project owner to check by using the feature, not by reading anything.
