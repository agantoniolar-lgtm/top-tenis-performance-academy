---
name: ux-copy
description: Use whenever a task introduces or changes user-facing text — a button label, an error message, an empty state, a confirmation dialog, onboarding copy, a tooltip. Invoked from `design`'s UI branch for any new or changed microcopy; also fine standalone when reviewing existing copy that reads awkwardly or inconsistently.
---

# UX copy

## When this fires
Any task that introduces or changes user-facing text, as part of `design`'s UI branch. Also fine standalone — reviewing an existing error message, confirmation dialog, or empty state that isn't landing well.

## Procedure

1. **Establish context before writing anything**: what screen or flow this is, what the user is trying to do, their likely emotional state in that moment (frustrated at an error, relieved at success, unsure during onboarding), and any hard constraints (a character limit, a tone already established elsewhere in the product).
2. **Apply these patterns by copy type:**
   - CTAs — start with a verb, be specific about the outcome ("Create account," not "Submit").
   - Error messages — what happened + why + how to fix it ("Payment declined. Your card was declined by your bank. Try a different card or contact your bank.").
   - Empty states — what this is + why it's empty + how to start.
   - Confirmation dialogs — state the action plainly ("Delete 3 files?" not "Are you sure?"), describe the consequence ("This can't be undone"), and label the buttons with the actual action ("Delete files" / "Keep files," not "OK" / "Cancel").
   - Onboarding — one concept at a time, progressive disclosure rather than a wall of text up front.
3. **Give a recommended copy option plus two or three alternatives**, each with its reasoning (clarity, tone match, length) — a wording decision made deliberately, with something to compare against, rather than just whatever felt right first.
4. **Record the final copy in the task's `TASKS.md` entry** — the recommended text, and which alternative was chosen if not the default — so it's part of the plain-English audit trail.

## Output
Recommended copy (plus alternatives and rationale) for the task's user-facing text, recorded in `TASKS.md` before `build` implements it.
