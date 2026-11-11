#!/usr/bin/env bash
# Deploy Herz to the servers over SSH, after the code is pushed (scripts/push-all.sh).
#
#   bash scripts/deploy.sh            # backend + dashboard
#   bash scripts/deploy.sh backend    # Laravel API only
#   bash scripts/deploy.sh dashboard  # React dashboard only
#
# Backend:   pulls GitLab amasha-datapulse/herz into ~/public_html/herz, runs composer install
#            (only when composer files changed), migrations, config cache, queue restart.
# Dashboard: builds locally and uploads only dist/ to the web folder (no source or node_modules on the server).
#
# Targets can be overridden with env vars (defaults below). Hosts are ~/.ssh/config aliases.
set -euo pipefail

BACKEND_HOST="${HERZ_BACKEND_HOST:-herz-server}"
BACKEND_PORT="${HERZ_BACKEND_PORT:-1289}"
BACKEND_DIR="${HERZ_BACKEND_DIR:-public_html/herz}"

DASHBOARD_HOST="${HERZ_DASHBOARD_HOST:-herz-dashboard}"
DASHBOARD_DIR="${HERZ_DASHBOARD_DIR:-public_html/hirz}"

TARGET="${1:-all}"

remote() {
    local host="$1" port="$2" script="$3"
    # Login shell so cPanel's PATH (php, composer, node, npm) is loaded.
    ssh -p "$port" -o BatchMode=yes -o ConnectTimeout=20 "$host" 'bash -l -s' <<<"$script"
}

deploy_backend() {
    echo "=== Backend → $BACKEND_HOST:~/$BACKEND_DIR ==="
    remote "$BACKEND_HOST" "$BACKEND_PORT" "
set -euo pipefail
cd ~/$BACKEND_DIR
before=\$(git rev-parse HEAD)
git pull --ff-only origin main
after=\$(git rev-parse HEAD)
echo \"\$before -> \$after\"

if [ \"\$before\" != \"\$after\" ] && git diff --name-only \"\$before\" \"\$after\" | grep -qE '^composer\.(json|lock)\$'; then
    echo '--- composer install'
    composer install --no-dev --optimize-autoloader --no-interaction
fi

echo '--- migrate'
php artisan migrate --force

echo '--- caches'
php artisan route:clear
php artisan view:clear
php artisan config:cache

# The pm2 name laravel-queue is shared with car-erp, so never restart it by name.
echo '--- queue restart'
php artisan queue:restart

git log -1 --format='Backend now at %h %s'
"
}

deploy_dashboard() {
    # Builds locally and uploads only dist/ (see dp-dashboard/dpdashboard/scripts/deploy-cpanel.sh).
    echo "=== Dashboard → $DASHBOARD_HOST:~/$DASHBOARD_DIR ==="
    HERZ_DASHBOARD_HOST="$DASHBOARD_HOST" HERZ_DASHBOARD_WEB_DIR="$DASHBOARD_DIR"         bash "$(dirname "$0")/../dp-dashboard/dpdashboard/scripts/deploy-cpanel.sh"
    git log -1 --format='Dashboard now at %h %s'
}

case "$TARGET" in
    backend) deploy_backend ;;
    dashboard) deploy_dashboard ;;
    all) deploy_backend; deploy_dashboard ;;
    *) echo "Usage: bash scripts/deploy.sh [backend|dashboard|all]" >&2; exit 2 ;;
esac
