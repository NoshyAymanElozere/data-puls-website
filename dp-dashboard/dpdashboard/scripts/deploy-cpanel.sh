#!/usr/bin/env bash
set -euo pipefail

echo "=== Pulling latest changes ==="
git pull --ff-only origin main

echo "=== Restoring source index.html ==="
git checkout -- index.html

echo "=== Building frontend ==="
export VITE_API_URL="${VITE_API_URL:-https://herz-dashboard.am.prompita.com/admin}"
npm run build

echo "=== Publishing dist to web root ==="
# Copy build output including dotfiles (.htaccess SPA fallback is required for /hirz/login etc.)
cp -r dist/. .

echo "=== Deploy complete ==="
