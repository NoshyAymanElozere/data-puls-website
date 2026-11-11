#!/usr/bin/env bash
# Build the dashboard locally and publish only dist/ to the cPanel web folder.
#
#   npm run deploy:cpanel          (from dp-dashboard/dpdashboard)
#
# The server gets no source, no .git and no node_modules: just the built files.
# The swap is near-atomic: upload to hirz.new, then rename. The previous release
# is kept outside the web root (~/hirz-releases/prev) for a quick rollback:
#   ssh herz-dashboard 'cd ~/public_html && mv hirz ~/hirz-releases/bad && mv ~/hirz-releases/prev hirz'
#
# Overridable: HERZ_DASHBOARD_HOST (ssh alias), HERZ_DASHBOARD_WEB_DIR, VITE_API_URL,
# SKIP_INSTALL=1 to reuse the local node_modules.
set -euo pipefail

cd "$(dirname "$0")/.."

HOST="${HERZ_DASHBOARD_HOST:-herz-dashboard}"
WEB_DIR="${HERZ_DASHBOARD_WEB_DIR:-public_html/hirz}"
export VITE_API_URL="${VITE_API_URL:-https://herz-dashboard.am.prompita.com/admin}"

# Local builds ship the working tree, so refuse uncommitted dashboard changes
# (ALLOW_DIRTY=1 to override). Uses the herz-frontend repo, not the stale nested .git.
if [ "${ALLOW_DIRTY:-0}" != "1" ] && [ -d ../../.git ]; then
    repo=(git -C ../..)
    if ! "${repo[@]}" diff --quiet --ignore-cr-at-eol HEAD -- dp-dashboard/dpdashboard \
        || [ -n "$("${repo[@]}" ls-files --others --exclude-standard -- dp-dashboard/dpdashboard/src)" ]; then
        echo "Uncommitted dashboard changes; commit them first or set ALLOW_DIRTY=1:" >&2
        "${repo[@]}" status --short -- dp-dashboard/dpdashboard >&2
        exit 1
    fi
    echo "=== Deploying commit $("${repo[@]}" log -1 --format='%h %s') ==="
fi

echo "=== Building (API: $VITE_API_URL) ==="
if [ "${SKIP_INSTALL:-0}" != "1" ]; then
    npm ci --legacy-peer-deps --no-audit --no-fund
fi
npm run build
test -f dist/index.html || { echo "dist/index.html missing, aborting" >&2; exit 1; }

echo "=== Uploading dist to $HOST:~/$WEB_DIR ==="
tar -C dist -czf - . | ssh -o BatchMode=yes -o ConnectTimeout=20 "$HOST" "
set -euo pipefail
cd ~
web=\"$WEB_DIR\"
new=\"\$web.new\"
mkdir -p hirz-releases
rm -rf \"\$new\"
mkdir -p \"\$new\"
tar -xzf - -C \"\$new\"
test -f \"\$new/index.html\"

rm -rf hirz-releases/prev
if [ -e \"\$web\" ]; then mv \"\$web\" hirz-releases/prev; fi
mv \"\$new\" \"\$web\"
echo \"Published: \$(ls \"\$web/assets\" | wc -l) asset files, \$(du -sh \"\$web\" | cut -f1)\"
"

echo "=== Dashboard deployed ==="
