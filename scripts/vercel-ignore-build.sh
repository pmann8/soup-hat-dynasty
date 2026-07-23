#!/usr/bin/env bash
# Vercel Ignored Build Step
# Exit 0 = skip the build | Exit 1 = proceed with the build
#
# Skips deploys when the commit only touches docs/meta files
# (Markdown, license, GitHub workflows, etc.).
#
# In Vercel: Project → Settings → Build and Deployment → Ignored Build Step
# Command: bash scripts/vercel-ignore-build.sh

set -euo pipefail

PREVIOUS_SHA="${VERCEL_GIT_PREVIOUS_SHA:-}"
CURRENT_SHA="${VERCEL_GIT_COMMIT_SHA:-HEAD}"

# First deploy / missing previous SHA → always build
if [[ -z "$PREVIOUS_SHA" || "$PREVIOUS_SHA" == "0000000000000000000000000000000000000000" ]]; then
  echo "✅ No previous SHA — proceeding with build"
  exit 1
fi

# Diff everything except ignored pathspecs.
# If this is quiet (exit 0), only ignored files changed → skip build.
if git diff --quiet "$PREVIOUS_SHA" "$CURRENT_SHA" -- . \
  ':(exclude)**/*.md' \
  ':(exclude)**/*.mdx' \
  ':(exclude)**/*.txt' \
  ':(exclude).github/**' \
  ':(exclude)LICENSE' \
  ':(exclude)**/.gitignore' \
  ':(exclude)**/.editorconfig' \
  ':(exclude)**/.prettierignore' \
  ':(exclude)**/.prettierrc' \
  ':(exclude)**/.prettierrc.*'
then
  echo "⏭ Only docs/meta files changed — skipping build"
  exit 0
fi

echo "✅ App-relevant changes detected — proceeding with build"
exit 1
