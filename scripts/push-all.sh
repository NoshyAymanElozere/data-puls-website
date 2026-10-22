#!/usr/bin/env bash
# Push the committed dashboard to every remote:
#   1. GitHub `origin` (NoshyAymanElozere/data-puls-website) main
#   2. GitLab `gitlab` (amasha-datapulse/herz-front) main, whose root is dp-dashboard/dpdashboard
#   3. GitHub `hirz` monorepo (ahmdessam/hirz) main, by replacing only its Dashboard/ folder
# Targets 2 and 3 have unrelated histories, so each gets a normal commit on top of its main
# containing dp-dashboard/dpdashboard from HEAD (never force push).
# Uses Git's OpenSSL backend because Windows schannel fails with CRYPT_E_REVOCATION_OFFLINE here.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
git_net() { git -c http.sslBackend=openssl "$@"; }

DASHBOARD=dp-dashboard/dpdashboard
git remote get-url gitlab >/dev/null 2>&1 || git remote add gitlab https://gitlab.com/amasha-datapulse/herz-front.git
git remote get-url hirz >/dev/null 2>&1 || git remote add hirz https://github.com/ahmdessam/hirz.git

if [ -n "$(git status --porcelain)" ]; then
    echo "Note: uncommitted changes are not pushed; only HEAD is." >&2
fi

SUBJECT="$(git log -1 --format=%s)"
SHORT="$(git rev-parse --short HEAD)"

# push_tree <remote> <tree> <message>
push_tree() {
    local remote="$1" tree="$2" message="$3"

    if [ "$tree" = "$(git rev-parse "$remote/main^{tree}")" ]; then
        echo "$remote is already up to date."
        return
    fi

    local commit
    commit="$(git commit-tree "$tree" -p "$remote/main" -m "$message")"
    git_net push "$remote" "$commit:refs/heads/main"
}

git_net push origin main

git_net fetch gitlab main
push_tree gitlab "$(git rev-parse "HEAD:$DASHBOARD")" "chore: sync dashboard $SHORT $SUBJECT"

git_net fetch hirz main
index="$(mktemp -u)"
export GIT_INDEX_FILE="$index"
git read-tree hirz/main
git rm -r --cached -q --ignore-unmatch Dashboard
git read-tree --prefix=Dashboard/ "HEAD:$DASHBOARD"
tree="$(git write-tree)"
unset GIT_INDEX_FILE
rm -f "$index"
push_tree hirz "$tree" "chore(Dashboard): sync $SHORT $SUBJECT"
