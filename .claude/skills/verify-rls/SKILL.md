---
name: verify-rls
description: Use whenever a table is created or modified in a database with per-user or per-role access control (Row Level Security in Postgres/Supabase, or the equivalent in another backend), or whenever policies governing that access are added or changed — or whenever the project owner reports symptoms of access misbehaving ("a user can see someone else's data", "a role that should see records sees nothing"). Access-control bugs are silent, not loud — no error, no crash, just the wrong data (or no data) showing up — so treat them with the same seriousness as a security bug. Covers both policy design (who can see/edit what, by role) and active verification (running real queries as each role) — a policy that "looks right" is not the same as one that's been verified.
---

# Verify access control (RLS or equivalent)

## Why this skill exists

Access-control bugs don't announce themselves. A user seeing another user's data doesn't throw an error — it just happens. A user blocked from data they should see doesn't crash either — they see an empty list and assume there's no data, not that there's a bug. "It compiled and nothing broke" is not the same claim as "it's safe." This skill exists because the only way to know a policy actually does what it says is to run real queries as each role and check — reading the SQL and deciding it "looks right" is not verification, it's a guess.

## 1. Document the role model before writing any policy

Every project using this skill needs a written, current table of who can see/edit what, by role, per table — living wherever this project keeps its schema docs (commonly `docs/db-schema.md` or similar; check `CLAUDE.md` for where this project puts it). If that table doesn't exist yet or hasn't been touched in a while, this is the moment to write or update it — not a side task to get to later. The general pattern is usually "a row is visible/editable by whoever owns it, matched via `auth.uid()` (or this backend's equivalent) against an owner column, direct or through a foreign key" — but any exception to that pattern (a role with no access to a table at all, a column that's only unlocked once some other field is set, an admin bypass) has to be written down explicitly. Don't assume the general pattern applies to a table without checking what that table's row in the doc actually says.

Before writing a policy for a new or changed table, answer explicitly: who should be able to read this row? Who should be able to edit it? Is there a state (an unlock flag, an approval status, a date) that gates access beyond just the role? Write the policy from those answers, then update the role-model doc so the next session (human or agent) doesn't have to re-derive it.

## 2. Schema and policy changes are migration files, sandbox first

This follows the same discipline as rule 7 in `CLAUDE.md` ("Ambiente de pruebas air-tight") and the sandbox setup in `SETUP_CHECKLIST.md` — nothing new here, just applied specifically to RLS: every schema or policy change is a migration file, applied to the sandbox first, verified there (section 3 below), and only pushed to production as an explicit, deliberate step after that verification passes and the project owner confirms — never automatic, never triggered by a merge or a push. If this project's sandbox is a second dedicated database instance (the free-tier pattern) rather than a branch, that's exactly why: the git branch you're on doesn't determine which database you're talking to, the environment config does, and in development that should always point at the sandbox. In this project specifically, that environment config is `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`, read from `.env.local` (sandbox by default) or Vercel's env vars (production only) — never hardcoded in `src/lib/supabase.js`. Migrations here are also enforced schema-only (no DML mixed into a versioned migration) via `scripts/check-migrations-schema-only.mjs`; a production push gets logged in `supabase/PROD_MIGRATIONS_LOG.md` the moment it happens.

## 3. Active verification — the step that can't be skipped

After creating or changing a policy, don't assume it works because the SQL reads correctly — run real queries as each role and confirm. Using this backend's own tooling (the Supabase MCP's `execute_sql`, a test client authenticated as each test user, or equivalent), check:

1. **As the owning user/role** — can they read/edit their own rows? (should succeed)
2. **As a different user of the same role** — can they read/edit rows that aren't theirs? (should fail — if it doesn't, that's the silent bug)
3. **As a different role entirely** — same check, from that role's side of the relationship.
4. **If the table has a state gate** (an unlock flag, an approval step, a visibility window), test explicitly on both sides of the gate — "before" and "after" — and the transition itself. Gates are where bugs hide most, because the policy can look correct in each state checked in isolation and still fail exactly at the transition.

If any case that "should fail" actually succeeds, or any case that "should succeed" actually fails, the table isn't ready to commit — regardless of how simple the policy looks.

## 4. Watch for timezone edge cases on date-range policies

Any policy or query whose access decision depends on a date or time range (`WHERE created_at >= this_month_start`, "this week's records," anything like that) can behave differently depending on the client's timezone versus the database server's (commonly UTC). If a policy or a query depends on a date range, explicitly test near a local-midnight boundary in the project's actual timezone — that's the edge where this class of bug hides, because it works fine the rest of the day and only breaks in a narrow window most manual testing never hits.

## 5. If you find a broken case

Don't defer it "because you're almost done." A broken access-control case blocks the commit exactly like a failing test. If the fix isn't trivial and can't be resolved in the moment, create a task for it now (category matching this project's convention, type `Bug` or equivalent) rather than trusting session memory to carry it forward.

## Output

An up-to-date role-model doc, a migration file for the schema/policy change, a sandbox where that migration was applied and verified against real per-role queries (not just read), and — only after that verification passes and the project owner confirms — the same migration applied to production as its own deliberate step.
