---
name: scope
description: Use at the start of any non-trivial feature, refactor, or bug fix — before any file is touched. Produces the "blueprint" CLAUDE.md's plan-first rule requires, promotes the task into TASKS.md, and — for anything beyond a simple bug fix — a staged scope doc or PRD in /docs so every significant build leaves a durable, reviewable record of the problem and the plan. Skip entirely only for single-line fixes or pure copy/text changes with no side effects.
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
3. **Decide whether this task also needs a written doc in `/docs` — this call is mandatory to make explicitly, not something to skip quietly.** Default to writing one; the bar for skipping is real simplicity, not convenience:
   - **No doc — bug fix or simple, well-understood change.** Skip `/docs` when the cause and the fix are both already clear and confined to one obvious spot: no new or changed data structure, no new access policy, no genuine open question about the problem. The blueprint from step 2, plus the accumulating description in the task's `TASKS.md` entry, is the record — exactly as today. Nothing about this step changes that path.
   - **Scope doc — a standalone feature or complex change.** Write `docs/scope-{{slug}}.md` from `templates/scope-doc.md.template` when the task is its own self-contained unit of work with real complexity: it touches multiple files, introduces or changes a data structure or access policy, has open decisions that need the project owner's call before or during the build, or is gnarly enough to benefit from being broken into a few checkable sub-steps. A "complex feature" is this same template, not a separate one — a feature is standalone by nature, so it never needs the PRD's product-level framing below.
   - **PRD — a product or epic that will host multiple scopes.** Write `docs/prd-{{slug}}.md` from `templates/prd.md.template` when the ask is bigger than one feature: it's the umbrella for several distinct scopes/features that will each get their own scope doc over time, and the problem needs to be pinned down with the scoping questions in step 4 before it can be responsibly split into stages.
4. **For a PRD, work through these questions before drafting its "Fases" section — the problem has to be pinned down before it's split, not split first and rationalized after:**
   - What's failing or missing right now, evidenced concretely — not a hypothetical?
   - What does success look like, and for whom? (→ Objetivo)
   - What's explicitly out of scope for this doc — adjacent asks it will *not* cover, and why? (→ No-objetivos)
   - Is there a known failure mode, or a guiding principle, this design must protect against? (skip this if there genuinely isn't one — don't invent one to fill the section)
   - Does this touch the data model? If so, propose it now, verified against the real current schema — not assumed from a doc that might be stale.
   - What's the natural stage breakdown? Each stage should stand on its own — ships value by itself, is independently verifiable and committable — and the sequence should de-risk the riskiest or most foundational piece first.
   - Which stages gate on a prior stage finishing, and which gate on an external decision (a pending convention, a pending call from the project owner)? Name the gate explicitly, per stage — not just "this doc is blocked."
   - Of the decisions needed to proceed, which are already resolved and which are still open — and which *specific* stage does each open one block?
   - What does the verification plan look like per stage (which `verify-*` skills apply)?
   - What does this depend on, or relate to, elsewhere in the project?
5. **Move the task to `in progress`** only after posting the blueprint (and the doc, if step 3 called for one) and pausing for explicit approval. Do not proceed to `design` or `build` without it, regardless of how confident the plan seems.
6. **Create the branch** at this point, named `ai/{{task-id}}-{{slug}}`, per the branch policy in `CLAUDE.md` — skip this step entirely if this project's stated policy is direct-to-main rather than branch-per-task.
7. **If the doc defines multiple stages substantial enough to build and verify independently, stage them as separate `TASKS.md` entries** — one per stage, each referencing the doc and its stage number, rather than one entry covering the whole doc. Judge this at the discretion of complexity: how much context a single build session needs to hold to stay focused, and how precisely progress needs to stay trackable — not a fixed rule, and it applies the same way whether the doc is a scope doc's own "Fases" section or a full PRD. A stage's task only moves to `in progress`, or gets prioritized, once the stage(s) it depends on are `done` — don't start a dependent stage while its dependency is still open.

## Output
An approved blueprint, a task entry (or one per stage, for a staged doc) in `TASKS.md` with status `in progress`, a scope doc or PRD in `/docs` when step 3 called for one, and (for a branch-per-task project) a branch ready for work. Hand off to `design` (if the task involves new data structure or a UI surface) or straight to `build` otherwise.
