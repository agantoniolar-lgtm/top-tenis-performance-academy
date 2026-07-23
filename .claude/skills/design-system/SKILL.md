---
name: design-system
description: Use when a UI task needs consistency checked against what already exists — audit existing components for inconsistency, document a component's variants/states/props, or design a new pattern that fits the existing system rather than reinventing it. Invoked from `design`'s UI branch for any non-trivial UI surface; also fine to invoke standalone as a periodic consistency check.
---

# Design system

## When this fires
Any UI-touching task from `design`'s procedure — before writing component code, not after. Also fine standalone: a periodic audit, or documenting a component that's grown organically without documentation.

## Procedure

1. **Decide which of three modes applies, and say which one out loud before starting:**
   - **Audit** — check existing components/screens for inconsistency: a hardcoded value (a raw hex color, a raw pixel spacing) where a shared token should be used instead, the same UI concept (a primary action button, an error banner) styled differently in different places, or a missing state (no defined hover/disabled/loading look for something interactive).
   - **Document** — write up an existing component's variants, states, props, and accessibility notes so it isn't just tribal knowledge held by whoever built it last.
   - **Extend** — design a new component or pattern, checked first against what already exists so it doesn't quietly duplicate something that's almost the same thing under a different name.
2. **For Audit**, produce a plain-English findings list: what's inconsistent, where (which components/screens), and what the fix is (which existing token or pattern to adopt instead). Prioritize by how visible or frequent the inconsistency is, not by how easy the fix happens to be.
3. **For Document**, cover: what the component is and when to use it; its variants and when each applies; its states (default, hover, active, disabled, loading, error) and what happens in each; accessibility notes (ARIA role, keyboard behavior, what a screen reader announces).
4. **For Extend**, cover: the problem the new component solves; the closest existing pattern and why it isn't enough (this is what catches "we already have something 90% like this" before it gets built twice); the proposed variants, states, and props; open questions that need a decision before `build` starts.
5. **Record the outcome in the task's `TASKS.md` entry** in plain English — the decision made, or the inconsistency found and its fix — so it's part of the audit trail the project owner reviews, and so the eventual `verify-ui` walkthrough has something concrete to check the built result against.

## Output
A plain-English audit finding, component doc, or new-pattern proposal (whichever mode applied), recorded in the task's `TASKS.md` entry before `build` starts on anything the finding or proposal touches.
