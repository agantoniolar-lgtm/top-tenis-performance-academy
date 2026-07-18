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

This skill only exists in a project because two folders were copied there from the `ae-setup` kit, as plain files — no Claude session needed for this part. **Check for existing `.claude/` and `templates/` folders in the target project before copying — don't blindly overwrite either.**

**If the target project has no `.claude/` folder yet:** copy `kit/.claude/` wholesale to the project root as its own `.claude/`. No conflict possible.

**If the target project already has a `.claude/` folder** (settings, hooks, other project-level config, or its own skills): do NOT replace the folder. Only copy `kit/.claude/skills/*` — each individual skill folder (`setup/`, `scope/`, `design/`, `build/`, `verify-tests/`, `verify-evals/`, `verify-ui/`, `verify-rls/`, `commit/`, `session-log/`) — into the existing `<project>/.claude/skills/` (creating that subfolder if it doesn't exist yet). Everything else already under `.claude/` — `settings.json`, `hooks/`, `commands/`, any unrelated existing skills — stays untouched. **Check for overlap before copying any individual skill folder in — both by name and by purpose.** A name collision (the project already has its own `scope/` or `commit/` for something unrelated) is the easy case: flag it and rename the kit's version instead (e.g. `ae-commit/`). The harder, easy-to-miss case is *purpose* overlap under a different name — read every existing skill's full `SKILL.md` body, not just its frontmatter name and description, and compare its actual procedure against what each of the 10 incoming kit skills does. A project's own hand-built session-closing skill can cover exactly the same ground as this kit's `session-log` without either the name or the one-line description making that obvious — the only way to catch it is reading what each one actually does (a project's own hand-built RLS/access-control checklist and `verify-rls` is the same trap). Flag every apparent overlap to the project owner before finishing that skill's copy: keep the existing one, keep the kit's, or merge into one. Never let both silently coexist doing the same job — that's how a project ends up with two things updating the same task tracker or writing the same kind of session log, discovered only by accident weeks later.

**`templates/`** → copied to the target project's root as its own `templates/` folder, sitting next to `.claude/` (so raw template sources end up at `<project>/templates/*.template`). Check for a name collision here too — a web app can plausibly already have a `templates/` folder for something unrelated (email templates, scaffolding). If so, use a different name (e.g. `ae-templates/`) and note the substitution wherever this file says `templates/` below.

After the copy, `.claude/skills/` (merged or fresh) and `templates/` (or its renamed equivalent) both exist at the project root. Everything below assumes that's already true.

## Procedure

### 1. Run the interview (skip or shortcut anything already known)
Ask, or infer from the existing repo if retrofitting:
- Backend/data store — default: Supabase (Postgres + RLS).
- Does it use Supabase? If yes and on the free tier, branching is unavailable — the sandbox will be the second-project pattern (see `SETUP_CHECKLIST.md` template's reference block). If on a paid plan, Preview Branches can be used instead.
- Does any table have per-user or per-role access control (Postgres RLS, or the equivalent in another backend)? If yes, `verify-rls` applies — during setup, point it at this project's actual role model (which roles exist, which tables/rows each can touch) rather than leaving it generic; see that skill's own file for what it needs filled in.
- AI-native features — any model calls in the shipped product, not just Claude writing the code? Default assumption: Supabase Edge Functions (Deno) if yes.
- Frontend — default: React + Vite.
- Does it have a UI at all? (Some projects are backend/data-only.)
- Package manager — default: npm.
- Commit message convention — default: `WHAT: ... / WHY: ... / RISK: ...`, one line each. If retrofitting, check `git log --oneline -20` first to see whether a pattern is already in use (e.g. `feat:/fix:/chore:/refactor:` prefixes) before asking — don't assume the default just because nobody was asked. Whatever's confirmed here becomes `{{COMMIT_MESSAGE_FORMAT}}` in `CLAUDE.md`'s Git conventions section.
- Branch policy — default: one branch per task, named from the task ID, merged into `main` only after explicit owner approval. Ask directly whether this project already commits straight to `main` instead of branching per task — don't assume the default without asking, even if git history doesn't make it obvious either way. Whatever's confirmed here becomes `{{BRANCH_POLICY}}` in `CLAUDE.md`'s Git conventions section.
- Testing — default: Vitest (+ Playwright if there's a UI).
- Current maturity — prototype / pre-users / live-users. This is a real-world fact the project owner must state; never infer it.

### 2a. Greenfield: install everything fresh
1. Confirm `.claude/skills/` and `templates/` both already exist at the project root (per the manual copy step above) — if not, stop and ask for that copy to happen first.
2. Generate `CLAUDE.md` from `templates/CLAUDE.md.template`, writing the result to the project root as `CLAUDE.md` (drop the `.template` extension), filling in the interview answers — including the Git conventions section with the confirmed commit format and branch policy.
3. Copy `templates/.env.example` to the project root as `.env.example`, and confirm `.env*` (except `.env.example`) is in `.gitignore` before anything else touches real credentials.
4. Create `TASKS.md`, `BACKLOG.md`, `TASKS_ARCHIVE.md`, `TASKS_ARCHIVE_INDEX.md`, `/logs/`, and `STATUS.md` at the project root from their `templates/` sources (same drop-the-`.template`-extension rule), with `maturity:` set from the interview. `BACKLOG.md` and `TASKS_ARCHIVE_INDEX.md` both start empty — `TASKS_ARCHIVE_INDEX.md` stays empty until `TASKS_ARCHIVE.md` first reaches its 50-entry split, at which point the split file goes under a new `tasks-archive/` subfolder (not the project root) — don't create that folder now, it's created the first time a split actually happens.
5. Generate `SETUP_CHECKLIST.md` at the project root from `templates/SETUP_CHECKLIST.md.template`, with every box unchecked, and check them off live as each is actually confirmed in this same session (repo initialized, branch protection set, sandbox created, etc.) — don't check a box you haven't verified.
6. Generate `COWORK_PROJECT_INSTRUCTIONS.md` at the project root from `templates/COWORK_PROJECT_INSTRUCTIONS.md.template`, filled in with the project name. If this project will be worked on via Cowork (not just Claude Code), tell the project owner explicitly: this file needs to be pasted into that Cowork project's Settings → Project Instructions once — it cannot be set programmatically from here. Nothing loads automatically until that manual step happens.
7. `templates/` can stay at the project root afterward (harmless, just the raw sources) or be deleted once every generated file exists — either is fine.

### 2b. Retrofit: detect before assuming
1. **Read the existing repo first** — package.json/requirements, existing test setup, existing DB config, existing docs — before running the interview, so questions aren't asked about things that are already obvious.
2. **Before anything else, scan git history for already-committed secrets — with a real content-scanning tool, not a filename grep.** Run `gitleaks git .` (installed via brew/go/binary) against the full repo. A filename-based check (looking only at `.env`, `.pem`, `service-account*.json`, etc.) is not sufficient on its own — a real leak has already been found sitting in a plain `docs/*.md` file, complete with a written "don't commit this" warning right next to it that got committed anyway. Secrets hide in documentation, READMEs, comments, and seed scripts just as often as in the files you'd expect, and a human-written warning comment is not a safeguard. **If anything turns up, stop and tell the project owner immediately that the credential must be rotated or disabled at its source (Supabase, the API provider, etc.) before setup continues.** Removing the file from tracking or history afterward is cleanup, not remediation, and does not undo the exposure — do not let this get bundled in as just another checklist box ticked in passing. "The app no longer uses it" is not the same as "it's disabled" — confirm the credential itself is dead. Once clean, install `gitleaks` as a pre-commit hook (Husky or the `pre-commit` framework) *and* copy `templates/gitleaks-workflow.yml.template` to `.github/workflows/gitleaks.yml` (create the `workflows/` folder if it doesn't exist, merge in if other workflows are already there) — the hook blocks a secret before it's committed at all; the GitHub Action is the backstop that catches anything the hook missed (unhooked clone, `--no-verify`, a direct push). Both matter; neither alone is sufficient.
3. **For Supabase projects, also check whether the schema was ever built ad hoc** — compare the number of migrations applied in the Supabase dashboard against what actually exists in `supabase/migrations/` locally. A project with applied changes but no (or an incomplete) local migrations folder means schema was edited directly against the database at some point, with nothing reproducible left in git. If so, baseline it now: `supabase init` → `supabase link --project-ref <ref>` → `supabase db pull`. This isn't optional or deferrable — the Sandbox section of `SETUP_CHECKLIST.md` cannot be completed without it, since a reproducible sandbox depends on reproducible migrations.
4. Confirm `.claude/skills/` and `templates/` exist at the project root, same as greenfield — if the project already has its own `.claude/` folder, merge the new `skills/` entries in rather than overwriting anything unrelated that's already there, applying the name-and-purpose overlap check described in the manual copy step above.
5. Generate `CLAUDE.md` (from `templates/CLAUDE.md.template`, dropping the `.template` extension, written to the project root), but reflect the *actual* existing architecture, commit convention, and branch policy rather than the default assumptions, if they differ — see the interview's commit-convention and branch-policy questions above.
6. Generate `SETUP_CHECKLIST.md` and **go through it item by item against what actually exists today** — check only what's genuinely already in place (e.g., if strict typing is already on, check it; if there's no sandbox at all, leave it unchecked and flag it as the first real task). The output is a to-do list of what's missing, not a rubber stamp.
7. Do not touch existing task-tracking history (e.g., an existing Notion setup) as part of this step — that's a separate, optional migration (see the framework doc's retrofit-vs-migration split). Start `TASKS.md`/`BACKLOG.md` fresh going forward regardless.

### 3. Confirm completion
Setup is only "done" once every box in `SETUP_CHECKLIST.md` is checked — not when the interview finishes. If closing out setup reveals work that can't be completed in this session (e.g., a sandbox that needs to be created outside the agent's reach), leave those boxes unchecked and record them as the top priority in `STATUS.md`'s "Pending" section.

## Output
`CLAUDE.md` (with Git conventions filled in), `SETUP_CHECKLIST.md` (accurately reflecting real state), `.env.example` and a confirmed `.gitignore` entry, `COWORK_PROJECT_INSTRUCTIONS.md` (with an explicit reminder that pasting it into Cowork Settings is a manual step), the already-copied `.claude/skills` directory, and (for greenfield) empty task-tracking files — `TASKS.md`, `BACKLOG.md`, `TASKS_ARCHIVE.md`, `TASKS_ARCHIVE_INDEX.md`, `/logs/`, `STATUS.md` — ready to use, or (for retrofit) a concrete, prioritized list of what's still missing.
