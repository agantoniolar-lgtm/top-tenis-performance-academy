---
name: build
description: Use to write the actual implementation once scope is approved and design (if applicable) is confirmed. Writes code and its tests/evals together, never code first with verification bolted on after.
---

# Build

## When this fires
Immediately after `scope` (and `design`, if it ran) for the approved task, on the task's branch.

## Procedure

1. Implement the change described in the blueprint, staying within the file impact list agreed in `scope`. If the work reveals a need to touch a file outside that list, stop and flag it — don't silently expand scope.
2. **Write tests/evals as part of this step, not after.** Deterministic tests for anything with a defined expected output (including integration tests for any API/service endpoint's auth, status codes, and error handling). If the feature involves a model call with non-deterministic output, flag it explicitly for `verify-evals` rather than trying to write a unit test against a variable output.
3. Enforce {{STACK_LANGUAGE}} strict-mode compliance as you go — this is not a separate lint pass at the end, it's a constraint on every line written.
4. Update the task's `TASKS.md` entry as work progresses: what changed, when, and how — in plain English, not file-by-file. This is the audit log the project owner actually reads.
5. When implementation is complete, hand off to `verify-tests`, and to `verify-evals` and/or `verify-ui` if the task involves an AI-native feature or a UI surface respectively.

## Output
Implementation complete on the task branch, tests/evals written alongside it, and an updated task entry describing what was built in plain English.
