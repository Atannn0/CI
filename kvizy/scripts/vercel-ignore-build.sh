#!/usr/bin/env bash
# Vercel "Ignored Build Step" for the kvizy project (Root Directory: kvizy).
# Exit 0 cancels the deployment, exit 1 builds it. The repository root is an Obsidian vault that
# auto-commits notes, so only changes under kvizy/ (this directory) should deploy.
set -u

current="${VERCEL_GIT_COMMIT_SHA:-$(git rev-parse HEAD)}"
previous="${VERCEL_GIT_PREVIOUS_SHA:-}"

if [ -z "$previous" ]; then
  echo "No earlier successful deployment on this branch: building."
  exit 1
fi

if [ "$previous" = "$current" ]; then
  echo "Redeploy of the already deployed commit: building."
  exit 1
fi

# Vercel clones only the last 10 commits; the vault may have pushed more since the last deploy.
if ! git cat-file -e "${previous}^{commit}" 2>/dev/null; then
  git fetch --quiet --deepen=500 origin 2>/dev/null || true
fi

if git cat-file -e "${previous}^{commit}" 2>/dev/null; then
  base="$previous"
elif git rev-parse --quiet --verify "HEAD^" >/dev/null; then
  base="HEAD^"
  echo "Last deployed commit ${previous} is not in the clone; comparing with the parent commit."
else
  echo "Cannot find a commit to compare with: building."
  exit 1
fi

if git diff --quiet "$base" HEAD -- .; then
  echo "No changes in kvizy/ since ${base}: skipping the build."
  exit 0
fi

echo "kvizy/ changed since ${base}: building."
exit 1
