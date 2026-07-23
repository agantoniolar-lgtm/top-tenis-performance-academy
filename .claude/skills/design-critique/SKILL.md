---
name: design-critique
description: Use to get structured feedback on an existing screen, mockup, or built UI — before final polish or as a gut-check mid-build. Invoked from `design`'s UI branch when there's an existing mockup or screen to react to, as opposed to designing from a blank page (that's `design-system`'s Extend mode instead).
---

# Design critique

## When this fires
Whenever there's something concrete to react to — an existing mockup, a screenshot, a live screen — rather than a blank-page design task. Fires from `design`'s UI branch when the task is revising or polishing something that already exists, and stands alone any time the project owner just wants a second look at a screen.

## Procedure

1. **Establish the design's context and stage first**: what it is, who it's for, and whether this is early exploration or near-final polish — the bar for feedback differs (early exploration gets direction-level feedback; near-final gets precision-level feedback).
2. **Work through these dimensions, in order:**
   - First impression — what draws the eye first, is that the right thing, is the purpose immediately clear.
   - Usability — can the user actually accomplish their goal, is navigation obvious, are there unnecessary steps.
   - Visual hierarchy — is there a clear reading order, is whitespace doing its job, is the right thing emphasized.
   - Consistency — does it match the existing design system (check against a recent `design-system` audit if one exists).
   - Accessibility at a glance — contrast, touch target size, text readability. This is a quick sanity check, not a substitute for a dedicated accessibility audit if this project ever adds one.
3. **Give specific, actionable feedback** — "the CTA competes with the navigation for attention," not "the layout feels busy" — and always pair a problem with a suggested fix, plus what's already working well (not just a list of complaints).
4. **Prioritize the findings**: which change matters most, second, third — not a flat list the project owner has to weigh unassisted.
5. **Record the critique's priority findings in the task's `TASKS.md` entry**, so what got flagged and what got fixed is traceable later.

## Output
A prioritized, plain-English critique (what works, what to fix, in priority order) recorded in the task's `TASKS.md` entry.
