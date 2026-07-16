---
name: verify-tests
description: Use after build, for every task, regardless of whether it also needs verify-evals or verify-ui. Runs deterministic tests and integration tests, self-corrects on failure, and only reports back once green.
---

# Verify — deterministic tests

## When this fires
After every `build`, unconditionally. This is the one verification step that always runs, even for tasks that also need `verify-evals` or `verify-ui`.

## Procedure

1. Run the full test suite command for this project (e.g. `{{STACK_TESTING}} run`).
2. If any deterministic test fails — including integration tests for APIs/services (auth, status codes, error handling) — do not report the failure to the project owner and ask for help. Read the failure, locate the root cause, fix the code, and re-run. Repeat until the suite passes.
3. **Hybrid features get split here, not lumped together.** If a task's endpoint has both a deterministic half (fetching data, auth) and a generative half (a model call), only the deterministic half is checked in this step — hand the generative half to `verify-evals`.
4. Only proceed past this step once the full suite passes. A failing test blocks the merge exactly like a failing eval would.
5. Report the result in plain English in the task's `TASKS.md` entry: what was tested, that it passed, and what (if anything) had to be fixed to get there.

## Output
A passing test suite, a plain-English pass confirmation in the task's audit log, and a handoff to `verify-evals` and/or `verify-ui` if applicable, or straight to `commit` if not.
