---
name: user-research
description: Use when a decision about what to build, or whether something already built is working, needs actual evidence from users rather than a guess — planning interviews, usability tests, or surveys, and making sense of what comes back. Not part of the default scope → design → build chain; invoke deliberately when a task's blueprint calls for evidence before (or after) building.
---

# User research

## When this fires
Any time "should we build this," "is this working," or "why are users doing X" needs real evidence rather than an assumption. This isn't a step every task runs through — most UI work goes straight through `design`'s existing branches — but when `scope`'s blueprint flags real uncertainty about user need or behavior, this is where that gets resolved before committing to a build.

## Procedure

1. **Pick the method that fits the actual question — don't default to interviews for everything:**
   - User interviews — deep understanding of needs/motivations (small sample, 5-8 people).
   - Usability testing — evaluating a specific existing design or flow (5-8 people).
   - Surveys — quantifying attitudes or preferences across a larger group (100+ responses).
   - Card sorting — information-architecture decisions (15-30 people).
   - Diary studies — understanding behavior over time (10-15 people, multi-week).
   - A/B testing — comparing two specific design choices, needs statistical significance.
2. **If running interviews or a usability test, structure the session**: warm-up (build rapport), context (their current workflow), deep dive (the actual topic), reaction (show the concept/prototype if there is one), wrap-up.
3. **When synthesizing what came back, use whichever framework fits**: affinity mapping (group observations into themes), impact/effort matrix (prioritize findings), journey mapping (visualize the experience over time), jobs-to-be-done (what the user is actually hiring the product to do). Keep raw observations ("5 of 8 users clicked the wrong button") separate from interpretations ("the button placement is confusing") — both matter, but conflating them hides which conclusions are solid and which are judgment calls.
4. **Produce a plain-English synthesis**: the themes found, supporting evidence (direct quotes or specific observations, not vague impressions), and what it implies for the product — prioritized recommendations, not just a list of themes.
5. **Record the research's conclusion and its evidence in the task's `TASKS.md` entry** (or, if this ran before a task existed, note it as the reason a subsequent task got scoped) — the same plain-English audit-trail requirement as every other kit skill.

## Output
A research plan (if planning) or a synthesis of themes, evidence, and prioritized recommendations (if analyzing), recorded in `TASKS.md` — informing what `scope` picks up next, not a standalone deliverable that sits unused.
