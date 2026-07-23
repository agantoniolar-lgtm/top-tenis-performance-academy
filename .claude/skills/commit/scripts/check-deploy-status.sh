#!/usr/bin/env bash
# check-deploy-status.sh — poll a commit's remote CI/deploy status until it resolves.
#
# Used by the `commit` skill's step 4 (direct-to-main projects): once the project owner
# confirms a push landed, this polls GitHub's combined commit status API for that SHA until
# it's no longer "pending", then reports each check (e.g. "CI", "Vercel", "gitleaks") with
# its individual state. Exits 0 only if every check succeeded; exits 1 if any failed or the
# combined state is anything but "success"; exits 2 on timeout (still pending after max tries)
# so the caller can decide whether to keep waiting.
#
# Requires: gh CLI, authenticated, run from inside the target git repo (uses `gh api
# repos/{owner}/{repo}/...`, which resolves {owner}/{repo} from the current repo automatically).
#
# Usage:
#   check-deploy-status.sh [sha] [max_attempts] [sleep_seconds]
#     sha            commit SHA to check — defaults to HEAD
#     max_attempts   how many polls before giving up — default 15
#     sleep_seconds  delay between polls — default 10 (so default max wait ~2.5 min)

set -uo pipefail
# No "set -e": the polling loop deliberately tolerates transient `gh api` failures (e.g. the
# SHA not yet visible on the remote right after a push) instead of aborting the whole script.

SHA="${1:-$(git rev-parse HEAD)}"
MAX_ATTEMPTS="${2:-15}"
SLEEP_SECONDS="${3:-10}"

echo "Checking deploy/CI status for commit ${SHA}..."

state="pending"
for ((i = 1; i <= MAX_ATTEMPTS; i++)); do
  raw="$(gh api "repos/{owner}/{repo}/commits/${SHA}/status" --jq '.state' 2>/dev/null)"
  rc=$?
  if [[ $rc -ne 0 || -z "$raw" ]]; then
    # Commit not found yet (just pushed, not propagated) or a transient API error — keep polling.
    echo "  attempt ${i}/${MAX_ATTEMPTS}: not resolvable yet (SHA not found on remote, or API error) — retrying"
    state="pending"
  else
    state="$raw"
    echo "  attempt ${i}/${MAX_ATTEMPTS}: ${state}"
    if [[ "$state" != "pending" ]]; then
      break
    fi
  fi
  sleep "$SLEEP_SECONDS"
done

echo ""
echo "Individual checks:"
checks="$(gh api "repos/{owner}/{repo}/commits/${SHA}/status" \
  --jq '.statuses[] | "  " + .context + ": " + .state + (if .description then " — " + .description else "" end)' \
  2>/dev/null)"
checks_rc=$?
if [[ $checks_rc -eq 0 && -n "$checks" ]]; then
  echo "$checks"
else
  echo "  (no individual statuses reported — SHA may not exist on the remote yet)"
fi

echo ""
if [[ "$state" == "success" ]]; then
  echo "✓ All checks passed for ${SHA}."
  exit 0
elif [[ "$state" == "pending" ]]; then
  echo "⏳ Still pending/unresolved after ${MAX_ATTEMPTS} attempts — not resolved yet, re-run to keep waiting."
  exit 2
else
  echo "✗ Deploy/CI failed for ${SHA} (state: ${state}) — treat as blocking, do not move on."
  exit 1
fi
