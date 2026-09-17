#!/usr/bin/env bash

set -euo pipefail

echo "=== Pulling latest changes ==="
git pull --ff-only origin main

echo "=== Restoring source index.html ==="
git checkout -- index.html

echo "=== Building frontend ==="
export VITE_API_URL="${VITE_API_URL:-https://herz-dashboard.am.prompita.com/admin}"

npm ci --legacy-peer-deps
npm run build

echo "=== Publishing dist to web root ==="
cp -r dist/. .

echo "=== Cleaning build dependencies ==="
rm -rf node_modules

echo "=== Deploy complete ==="