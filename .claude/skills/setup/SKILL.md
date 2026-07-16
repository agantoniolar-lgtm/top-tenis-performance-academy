---
name: setup
description: Use when starting a brand new project, or retrofitting an already-running project that doesn't yet have these guardrails. Runs a short stack interview, generates CLAUDE.md and SETUP_CHECKLIST.md from the templates copied in alongside this skill, and — for existing projects — detects what's already there instead of assuming a clean slate.
---

# Setup

## When this fires
- **Greenfield:** a new project is being started and needs the full framework from day one.
- **Retrofit:** an existing, already-running project has none of these guardrails yet and needs them added without disrupting existing code.

Both cases use the same skill; only step 2 differs.

## Before this skill can even be read: the one-time manual copy

This skill only exists in a project because two folders were copied there from the `ae-setup` kit, as plain files — no Claude session needed for this part:

- `kit/.claude/` → copied to the target project's root as its own `.claude/` (so this file ends up at `<project>/.claude/skills/setup/SKILL.md` — the exact path Claude Code auto-discovers). Not nested under any other folder name.
- `kit/templates/` → copied to the target project's root as its own `templates/` (so the raw template sources end up at `<project>/templates/*.template`, sitting next to `.claude/`, not inside it).

After that copy, `.claude/` and `templates/` are siblings at the project root. Everything below assumes that's already true.

## Procedure

### 1. Run the interview (skip or shortcut anything already known)
Ask, or infer from the existing repo if retrofitting:
- Backend/data store — default: Supabase (Postgres + RLS).
- Does it use Supabase? If yes and on the free tier, branching is unavailable — the sandbox will be the second-project pattern (see `SETUP_CHECKLIST.md` template's reference block). If on a paid plan, Preview Branches can be used instead.
- AI-native features — any model calls in the shipped product, not just Claude writing the code? Default assumption: Supabase Edge Functions (Deno) if yes.
- Frontend — default: React + Vite.
- Does it have a UI at all? (Some projects are backend/data-only.)
- Package manager — default: npm.
- Testing — default: Vitest (+ Playwright if there's a UI).
- Current maturity — prototype / pre-users / live-users. This is a real-world fact the project owner must state; never infer it.

### 2a. Greenfield: install everything fresh
1. Confirm `.claude/skills/` and `templates/` both already exist at the project root (per the manual copy step above) — if not, stop and ask for that copy to happen first.
2. Generate `CLAUDE.md` from `templates/CLAUDE.md.template`, writing the result to the project root as `CLAUDE.md` (drop the `.template` extension), filling in the interview answers.
3. Copy `templates/.env.example` to the project root as `.env.example`, and confirm `.env*` (except `.env.example`) is in `.gitignore` before anything else touches real credentials.
4. Create `TASKS.md`, `TASKS_ARCHIVE.md`, `/logs/`, and `STATUS.md` at the project root from their `templates/` sources (same drop-the-`.template`-extension rule), with `maturity:` set from the interview.
5. Generate `SETUP_CHECKLIST.md` at the project root from `templates/SETUP_CHECKLIST.md.template`, with every box unchecked, and check them off live as each is actually confirmed in this same session (repo initialized, branch protection set, sandbox created, etc.) — don't check a box you haven't verified.
6. Generate `COWORK_PROJECT_INSTRUCTIONS.md` at the project root from `templates/COWORK_PROJECT_INSTRUCTIONS.md.template`, filled in with the project name. If this project will be worked on via Cowork (not just Claude Code), tell the project owner explicitly: this file needs to be pasted into that Cowork project's Settings → Project Instructions once — it cannot be set programmatically from here. Nothing loads automatically until that manual step happens.
7. `templates/` can stay at the project root afterward (harmless, just the raw sources) or be deleted once every generated file exists — either is fine.

### 2b. Retrofit: detect before assuming
1. **Read the existing repo first** — package.json/requirements, existing test setup, existing DB config, existing docs — before running the interview, so questions aren't asked about things that are already obvious.
2. Confirm `.claude/skills/` and `templates/` exist at the project root, same as greenfield — if the project already has its own `.claude/` folder, merge the new `skills/` entries in rather than overwriting anything unrelated that's already there.
3. Generate `CLAUDE.md` (from `templates/CLAUDE.md.template`, dropping the `.template` extension, written to the project root), but reflect the *actual* existing architecture and patterns rather than the default assumed stack, if they differ.
4. Generate `SETUP_CHECKLIST.md` and **go through it item by item against what actually exists today** — check only what's genuinely already in place (e.g., if strict typing is already on, check it; if there's no sandbox at all, leave it unchecked and flag it as the first real task). The output is a to-do list of what's missing, not a rubber stamp.
5. Do not touch existing task-tracking history (e.g., an existing Notion setup) as part of this step — that's a separate, optional migration (see the framework doc's retrofit-vs-migration split). Start `TASKS.md` fresh going forward regardless.

### 3. Confirm completion
Setup is only "done" once every box in `SETUP_CHECKLIST.md` is checked — not when the interview finishes. If closing out setup reveals work that can't be completed in this session (e.g., a sandbox that needs to be created outside the agent's reach), leave those boxes unchecked and record them as the top priority in `STATUS.md`'s "Pending" section.

## Output
`CLAUDE.md`, `SETUP_CHECKLIST.md` (accurately reflecting real state), `.env.example` and a confirmed `.gitignore` entry, `COWORK_PROJECT_INSTRUCTIONS.md` (with an explicit reminder that pasting it into Cowork Settings is a manual step), the already-copied `.claude/skills` directory, and (for greenfield) empty task-tracking files ready to use, or (for retrofit) a concrete, prioritized list of what's still missing.
