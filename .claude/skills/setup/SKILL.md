---
name: setup
description: Use when starting a brand new project, or retrofitting an already-running project that doesn't yet have these guardrails. Runs a short stack interview, generates CLAUDE.md and SETUP_CHECKLIST.md from the templates copied in alongside this skill, and — for existing projects — detects what's already there instead of assuming a clean slate.
---

# Setup

## When this fires
- **Greenfield:** a new project is being started and needs the full framework from day one.
- **Retrofit:** an existing, already-running project has none of these guardrails yet and needs them added without disrupting existing code.

Both cases use the same skill; only step 2 differs.

## Before this skill can even be read: getting the kit files into the project

This skill only exists in a project because the kit's `.claude/skills/` and `templates/` folders were copied there first. Two ways to do that — pick whichever fits the situation:

- **Option A — direct copy**, when `ae-setup` is reachable on the same machine (locally, or connected as a folder in this session). Fast, no intermediate artifact.
- **Option B — install from the bundle (new in v0.9)**, when it isn't — a different machine, a session where only `ae-setup/kit/AE_KIT_BUNDLE.md` got attached or pasted, or just to get deterministic checksum-verified installs instead of hand-run `cp`. Also the right choice any time you want the guaranteed-no-silent-clobber behavior of a script instead of manual commands.

Both options land in the same place and both are merge-safe with an existing `.claude/`. **Check for existing `.claude/` and `templates/` folders in the target project before copying either way — don't blindly overwrite either.**

**If the target project has no `.claude/` folder yet:** either option installs cleanly, no conflict possible.

**If the target project already has a `.claude/` folder** (settings, hooks, other project-level config, or its own skills): do NOT replace the folder. Only bring in `kit/.claude/skills/*` — each individual skill folder (`setup/`, `scope/`, `design/`, `build/`, `verify-tests/`, `verify-evals/`, `verify-ui/`, `verify-rls/`, `commit/`, `session-log/`) — into the existing `<project>/.claude/skills/` (creating that subfolder if it doesn't exist yet). Everything else already under `.claude/` — `settings.json`, `hooks/`, `commands/`, any unrelated existing skills — stays untouched. **Check for overlap before copying any individual skill folder in — both by name and by purpose.** A name collision (the project already has its own `scope/` or `commit/` for something unrelated) is the easy case: flag it and rename the kit's version instead (e.g. `ae-commit/`). The harder, easy-to-miss case is *purpose* overlap under a different name — read every existing skill's full `SKILL.md` body, not just its frontmatter name and description, and compare its actual procedure against what each of the 10 incoming kit skills does. A project's own hand-built session-closing skill can cover exactly the same ground as this kit's `session-log` without either the name or the one-line description making that obvious — the only way to catch it is reading what each one actually does (a project's own hand-built RLS/access-control checklist and `verify-rls` is the same trap). Flag every apparent overlap to the project owner before finishing that skill's copy: keep the existing one, keep the kit's, or merge into one. Never let both silently coexist doing the same job — that's how a project ends up with two things updating the same task tracker or writing the same kind of session log, discovered only by accident weeks later.

**`templates/`** → copied to the target project's root as its own `templates/` folder, sitting next to `.claude/` (so raw template sources end up at `<project>/templates/*.template`). Check for a name collision here too — a web app can plausibly already have a `templates/` folder for something unrelated (email templates, scaffolding). If so, use a different name (e.g. `ae-templates/`) and note the substitution wherever this file says `templates/` below.

### Option A — exact commands for the direct copy

Run these locally (Terminal, or `device_bash` from a Cowork session where the target folder is connected), after the overlap check above has already decided what's safe to bring in. Don't rely on a Finder drag-and-drop or an assistant-run tool for this step — both `device_commit_files` and any tool that isn't a raw shell are blocked from writing into `.claude/`, and a manual drag is easy to get partially wrong (missed dotfiles, wrong destination) with no way to verify it landed correctly:

```bash
KIT=/absolute/path/to/ae-setup/kit
PROJECT=/absolute/path/to/target/project

# Greenfield — no .claude/ yet:
cp -r "$KIT/.claude" "$PROJECT/.claude"
cp -r "$KIT/templates" "$PROJECT/templates"

# Merge — .claude/ already exists (only after the overlap check above):
# Use the trailing "/." on the source, not "/*" — a shell glob doesn't match
# dotfiles (silently skips .env.example) and, when the destination directory
# already exists, "cp -r src dst" nests src inside dst instead of merging
# into it. "cp -r src/. dst/" copies all contents, dotfiles included, into
# an already-existing destination correctly. Confirmed bug (2026-07-19):
# the glob form shipped here initially and silently skipped .env.example
# during a real Top Tennis sync.
mkdir -p "$PROJECT/.claude/skills" "$PROJECT/templates"
cp -r "$KIT/.claude/skills/." "$PROJECT/.claude/skills/"
cp -r "$KIT/templates/." "$PROJECT/templates/"

# Verify — should print nothing if the copy is complete and byte-identical:
diff -rq "$KIT/.claude/skills" "$PROJECT/.claude/skills"
diff -rq "$KIT/templates" "$PROJECT/templates"

# Record which kit version this project is now running (new in v0.9) —
# any future retrofit or staleness check reads this file:
echo "$(cat "$KIT/VERSION") — installed $(date -u +%Y-%m-%d) via direct copy from $KIT" > "$PROJECT/.ae-kit-version"
```

Once copied this way, `<project>/.claude/skills/` is read identically to any hand-authored `.claude/skills/` — Claude Code (CLI, and cloud sessions working on a cloned repo) discovers skills purely by filesystem path, not by where the content originated. **This copy does not, by itself, make the skill fire inside a live Cowork session.** Cowork sessions never read any project's `.claude/skills/`, copied or not — they only load skills enabled for the claude.ai account, synced at session start. See the framework's Cowork-vs-CLI skill-loading note for the full breakdown. The physical copy is still required regardless: it's what makes the skill real, portable, git-tracked infrastructure for Claude Code CLI and cloud sessions, independent of whatever happens to be enabled in any given Cowork session.

A skill-level symlink (`.claude/skills/setup` → a directory elsewhere on disk) is also supported by Claude Code and would auto-propagate future kit updates without re-copying. It's intentionally not used here: the symlink target would be an absolute path on one machine, so cloning or sharing the project elsewhere leaves a dangling symlink instead of a working skill. A physical, committed copy is what survives `git clone`.

### Option B — install from the portable bundle (new in v0.9)

`kit/AE_KIT_BUNDLE.md` is a single, generated, self-contained snapshot of the entire kit — every skill and every template concatenated with a version header and a sha256 checksum per file — regenerated by `kit/build_bundle.sh` whenever kit content changes (never hand-edited). It lets a project be set up **with zero dependency on `ae-setup` being locally reachable** — the bundle file alone is enough, even attached to a completely different session on a completely different machine.

```bash
# From wherever the bundle and installer scripts are reachable:
bash /path/to/ae-setup/kit/install_from_bundle.sh /path/to/ae-setup/kit/AE_KIT_BUNDLE.md /absolute/path/to/target/project
```

The installer is deterministic and merge-safe by construction: it never overwrites a destination file that already exists and differs from the bundle's copy (reports it as a conflict for manual review instead — resolve the same way as the overlap check above, then rerun with `--force` if the kit's version should win), verifies every written file's sha256 against the checksum recorded in the bundle, and writes `.ae-kit-version` at the project root automatically once everything's clean. If neither the bundle nor the installer script is available in the current session — only `AE_KIT_BUNDLE.md`'s contents got pasted somewhere, say — the bundle's own header explains the manual fallback: for each `### FILE:` block, write its content to that path, verify the checksum, then write `.ae-kit-version` by hand.

Either option's end state is the same: `.claude/skills/` (merged or fresh), `templates/` (or its renamed equivalent), and `.ae-kit-version` all exist at the project root. Everything below assumes that's already true.

## Procedure

### 0. Confirm the kit copy is current (new in v0.9)

`.ae-kit-version` at the project root (written automatically by Option B, or by the `echo` line in Option A's commands) records which kit version this project is running. Compare it against `ae-setup/kit/VERSION` before anything else:

- **Missing entirely** → the copy step above wasn't run with the current kit's commands, or this project predates v0.9. Go back and run Option A or B before continuing — for an already-set-up project, this just backfills the marker without disturbing anything else.
- **Present but older than `ae-setup/kit/VERSION`** → the project's skills/templates have drifted from the kit (a skill was fixed or a template changed since this project last synced — the same silent drift that let Top Tennis and investing run a stale `setup/SKILL.md` for a week, caught only by hand-running `diff -rq` on 2026-07-19). Re-run the copy step (Option A's merge commands, or Option B with `--force` after reviewing any reported conflicts) before proceeding, so the interview/retrofit below runs against current kit content, not a stale copy.
- **Present and matching** → already current, continue.

This is a fast, mechanical check — don't skip it just because the skill files look fine at a glance; the whole point of versioning the kit is that this kind of drift is silent until checked.

### 1. Run the interview (skip or shortcut anything already known)

**"Not yet" and "never" are both legitimate answers, not gaps to fill with a default.** A project that's barely getting started may genuinely have no backend, no typed language, no test framework, and no UI at all yet — that's a real state, tracked explicitly in `SETUP_CHECKLIST.md` section 0 as **Deferred** (not built yet, will be introduced later) or **Not applicable** (this project will never need it — requires the owner's explicit confirmation, never inferred). Don't force an interview answer toward the framework default just because a default exists; the default is what gets used *if and when* that piece is actually built, not a placeholder to accept as already true.

Ask, or infer from the existing repo if retrofitting:
- Backend/data store — default: Supabase (Postgres + RLS). If nothing is built yet, ask whether this is the intended eventual stack (→ Deferred) or genuinely not applicable to this project (→ Not applicable, e.g. a local-only script with no persistence).
- Does it use Supabase? If yes and on the free tier, branching is unavailable — the sandbox will be the second-project pattern (see `SETUP_CHECKLIST.md` template's reference block). If on a paid plan, Preview Branches can be used instead.
- Does any table have per-user or per-role access control (Postgres RLS, or the equivalent in another backend)? If yes, `verify-rls` applies — during setup, point it at this project's actual role model (which roles exist, which tables/rows each can touch) rather than leaving it generic; see that skill's own file for what it needs filled in. If there's no database yet at all, this is Deferred, not a "no."
- AI-native features — any model calls in the shipped product, not just Claude writing the code? Default assumption: Supabase Edge Functions (Deno) if yes.
- Frontend — default: React + Vite.
- Does it have a UI at all? (Some projects are backend/data-only.)
- Package manager — default: npm.
- Commit message convention — default: `WHAT: ... / WHY: ... / RISK: ...`, one line each. If retrofitting, check `git log --oneline -20` first to see whether a pattern is already in use (e.g. `feat:/fix:/chore:/refactor:` prefixes) before asking — don't assume the default just because nobody was asked. Whatever's confirmed here becomes `{{COMMIT_MESSAGE_FORMAT}}` in `CLAUDE.md`'s Git conventions section.
- Branch policy — default: one branch per task, named from the task ID, merged into `main` only after explicit owner approval. Ask directly whether this project already commits straight to `main` instead of branching per task — don't assume the default without asking, even if git history doesn't make it obvious either way. Whatever's confirmed here becomes `{{BRANCH_POLICY}}` in `CLAUDE.md`'s Git conventions section.
- Testing — default: Vitest (+ Playwright if there's a UI). If no test framework is installed yet because there's no code to test yet, that's Deferred, tracked in section 0 — don't install a test harness with nothing to exercise just to check a box early.
- Current maturity — prototype / pre-users / live-users. This is a real-world fact the project owner must state; never infer it.

### 2a. Greenfield: install everything fresh
1. Confirm `.claude/skills/` and `templates/` both already exist at the project root (per the manual copy step above) — if not, stop and ask for that copy to happen first.
2. Generate `CLAUDE.md` from `templates/CLAUDE.md.template`, writing the result to the project root as `CLAUDE.md` (drop the `.template` extension), filling in the interview answers — including the Git conventions section with the confirmed commit format and branch policy. Any Stack field with a genuinely Deferred or Not applicable answer gets written as `TBD — deferred` (or similar), never a guessed default value standing in for a real decision.
3. Copy `templates/.env.example` to the project root as `.env.example`, and confirm `.env*` (except `.env.example`) is in `.gitignore` before anything else touches real credentials.
4. Create `TASKS.md`, `BACKLOG.md`, `TASKS_ARCHIVE.md`, `TASKS_ARCHIVE_INDEX.md`, `/logs/`, and `STATUS.md` at the project root from their `templates/` sources (same drop-the-`.template`-extension rule), with `maturity:` set from the interview. `BACKLOG.md` and `TASKS_ARCHIVE_INDEX.md` both start empty — `TASKS_ARCHIVE_INDEX.md` stays empty until `TASKS_ARCHIVE.md` first reaches its 50-entry split, at which point the split file goes under a new `tasks-archive/` subfolder (not the project root) — don't create that folder now, it's created the first time a split actually happens.
5. Generate `SETUP_CHECKLIST.md` at the project root from `templates/SETUP_CHECKLIST.md.template`, with every box unchecked, **and section 0's tri-state markers set accurately from the interview answers** (Not applicable / Deferred / Active per optional piece — see step 1 above) before checking anything else off live as it's actually confirmed in this same session (repo initialized, branch protection set, sandbox created, etc.). Don't check a box you haven't verified, and don't mark something Active in section 0 unless it's genuinely built and in place right now.
6. Generate `COWORK_PROJECT_INSTRUCTIONS.md` at the project root from `templates/COWORK_PROJECT_INSTRUCTIONS.md.template`, filled in with the project name. If this project will be worked on via Cowork (not just Claude Code), tell the project owner explicitly: this file needs to be pasted into that Cowork project's Settings → Project Instructions once — it cannot be set programmatically from here. Nothing loads automatically until that manual step happens.
7. `templates/` can stay at the project root afterward (harmless, just the raw sources) or be deleted once every generated file exists — either is fine.

### 2b. Retrofit: detect before assuming
1. **Read the existing repo first** — package.json/requirements, existing test setup, existing DB config, existing docs — before running the interview, so questions aren't asked about things that are already obvious.
2. **Before anything else, scan git history for already-committed secrets — with a real content-scanning tool, not a filename grep.** Run `gitleaks git .` (installed via brew/go/binary) against the full repo. A filename-based check (looking only at `.env`, `.pem`, `service-account*.json`, etc.) is not sufficient on its own — a real leak has already been found sitting in a plain `docs/*.md` file, complete with a written "don't commit this" warning right next to it that got committed anyway. Secrets hide in documentation, READMEs, comments, and seed scripts just as often as in the files you'd expect, and a human-written warning comment is not a safeguard. **If `gitleaks` itself can't be installed in the current execution environment** (e.g. a cloud agent sandbox with restricted network access to GitHub or the Go proxy — confirmed to happen), fall back to an equivalent full-content scanner across the same full history (`detect-secrets` plus a manual regex sweep of the complete diff, for example) — the requirement is a real content scan across every commit, not that specific binary; note in `STATUS.md` or the session log which tool was actually used and why, so it isn't silently rediscovered next time. **If anything turns up, stop and tell the project owner immediately that the credential must be rotated or disabled at its source (Supabase, the API provider, etc.) before setup continues.** Removing the file from tracking or history afterward is cleanup, not remediation, and does not undo the exposure — do not let this get bundled in as just another checklist box ticked in passing. "The app no longer uses it" is not the same as "it's disabled" — confirm the credential itself is dead. Once clean, install `gitleaks` as a pre-commit hook (Husky or the `pre-commit` framework) *and* copy `templates/gitleaks-workflow.yml.template` to `.github/workflows/gitleaks.yml` (create the `workflows/` folder if it doesn't exist, merge in if other workflows are already there) — the hook blocks a secret before it's committed at all; the GitHub Action is the backstop that catches anything the hook missed (unhooked clone, `--no-verify`, a direct push). Both matter; neither alone is sufficient. The GitHub Action runs on GitHub's own runners regardless of what environment ran the local scan, so it's unaffected by any network restriction that forced a fallback tool above.
3. **For Supabase projects, also check whether the schema was ever built ad hoc** — compare the number of migrations applied in the Supabase dashboard against what actually exists in `supabase/migrations/` locally. A project with applied changes but no (or an incomplete) local migrations folder means schema was edited directly against the database at some point, with nothing reproducible left in git. If so, baseline it now: `supabase init` → `supabase link --project-ref <ref>` → `supabase db pull`. This isn't optional or deferrable — the Sandbox section of `SETUP_CHECKLIST.md` cannot be completed without it, since a reproducible sandbox depends on reproducible migrations.
4. Confirm `.claude/skills/` and `templates/` exist at the project root, same as greenfield — if the project already has its own `.claude/` folder, merge the new `skills/` entries in rather than overwriting anything unrelated that's already there, applying the name-and-purpose overlap check described in the manual copy step above.
5. **Check whether `CLAUDE.md` already exists and is doing real work before generating anything.** A stub, a placeholder, or nothing at all → generate `CLAUDE.md` from `templates/CLAUDE.md.template` as usual (dropping the `.template` extension, written to the project root), reflecting the *actual* existing architecture, commit convention, and branch policy rather than the default assumptions, if they differ — see the interview's commit-convention and branch-policy questions above. Any Stack field with a genuinely Deferred or Not applicable answer gets written as `TBD — deferred`, same as greenfield. A mature, already-working `CLAUDE.md` (working rules, an established process, real project-specific content a team already relies on) → do **not** regenerate it from the template; that would silently destroy content nobody asked to lose. Instead, read the existing file in full and make a targeted, additive edit: add a `## Skills` section (or extend an existing one) documenting how the newly added generic kit skills (`scope`/`design`/`build`/`verify-tests`/`verify-evals`/`verify-ui`/`verify-rls`/`commit`/`session-log`, plus `setup` itself) relate to any of the project's own custom skills — which generic skill maps to which step of the project's existing workflow, and which custom skills stay bespoke because nothing in the kit covers their purpose. Confirm the existing Git conventions section already matches what the interview confirmed (commit format, branch policy); note the difference rather than overwriting it if it doesn't. If the project has other pre-existing top-level docs the kit doesn't generate (a `ROADMAP.md`, `SYSTEM.md`, or similar), don't restate their content in `CLAUDE.md` — add one line per doc pointing to it and naming what it's for, the same way `CLAUDE.md` should point to `TASKS.md`/`BACKLOG.md` rather than duplicate them. Every apparent purpose overlap between an existing doc and a kit-generated one (most commonly: an existing roadmap/planning doc vs. the kit's own `TASKS.md`/`BACKLOG.md`) gets flagged to the project owner before assuming which one governs going forward — same discipline as the skill-overlap check in the manual-copy step above, just applied to documents instead of skills.
6. Generate `SETUP_CHECKLIST.md` and **go through it item by item against what actually exists today** — check only what's genuinely already in place (e.g., if strict typing is already on, check it; if there's no sandbox at all, leave it unchecked and flag it as the first real task). **Set section 0's tri-state markers first, honestly, before working through the rest** — a project with no Supabase, no typed language, no RLS, and no test framework isn't necessarily an incomplete retrofit; if those pieces genuinely don't exist in the codebase yet, mark them Deferred (or Not applicable, with the owner's confirmation) rather than flagging every corresponding section as a missing gap to close today. The output is a to-do list of what's actually due now, not a rubber stamp and not a demand to build stack pieces the project doesn't need yet.
7. Do not touch existing task-tracking history (e.g., an existing Notion setup) as part of this step — that's a separate, optional migration (see the framework doc's retrofit-vs-migration split). Start `TASKS.md`/`BACKLOG.md` fresh going forward regardless.

### 3. Confirm completion
Setup is only "done" once every box in `SETUP_CHECKLIST.md` is checked or legitimately left unchecked under a Not applicable / Deferred section-0 status — not when the interview finishes. If closing out setup reveals work that can't be completed in this session (e.g., a sandbox that needs to be created outside the agent's reach), leave those boxes unchecked and record them as the top priority in `STATUS.md`'s "Pending" section.

## Output
`CLAUDE.md` (with Git conventions filled in, Stack fields marked `TBD — deferred` where genuinely undecided), `SETUP_CHECKLIST.md` (section 0's tri-state markers set honestly, and the rest accurately reflecting real state), `.env.example` and a confirmed `.gitignore` entry, `COWORK_PROJECT_INSTRUCTIONS.md` (with an explicit reminder that pasting it into Cowork Settings is a manual step), the already-copied `.claude/skills` directory, `.ae-kit-version` confirmed present and current (new in v0.9 — written by step 0 or the copy step, not regenerated here), and (for greenfield) empty task-tracking files — `TASKS.md`, `BACKLOG.md`, `TASKS_ARCHIVE.md`, `TASKS_ARCHIVE_INDEX.md`, `/logs/`, `STATUS.md` — ready to use, or (for retrofit) a concrete, prioritized list of what's actually missing right now, distinct from what's simply deferred to a later stage of the project.
