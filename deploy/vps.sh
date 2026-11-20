#!/usr/bin/env bash
# Publishes the site to the OVH web VPS (Strasbourg) from a Mac, as user ubuntu. Usually not
# needed: the GitHub Action (.github/workflows/deploy.yml) does it on every push to main,
# including the commits Decap CMS makes. It is needed to install a changed deploy/caddy.conf
# (the Action can't: the deploy user has no sudo), for a site's first deploy and to go back to
# an earlier version (git checkout <commit>, then this script).
#
# Copies deploy/caddy.conf to /etc/caddy/sites/collabria.caddy, validates it (restoring the
# previous one if it is invalid) and reloads Caddy; then builds HEAD in a clean temporary
# checkout and sends dist/ (as public/) to /usr/local/bin/deploy-static as user deploy, the
# same script the Action uses.
set -euo pipefail
SITE=collabria
TARGET=${WEB_VPS_TARGET:-ubuntu@51.91.127.232}
cd "$(dirname "$0")/.."
REV=$(git rev-parse --short HEAD)

TMP=$(mktemp -d)
trap 'git worktree remove --force "$TMP/src" >/dev/null 2>&1 || true; rm -rf "$TMP"' EXIT
git worktree add --detach "$TMP/src" HEAD >/dev/null
(cd "$TMP/src" && npm ci --no-audit --no-fund >/dev/null && npm run build >/dev/null)

ssh "$TARGET" "cat > /tmp/$SITE.caddy" < deploy/caddy.conf
ssh "$TARGET" "set -e
	sudo install -d -o deploy -g deploy /srv/sites/$SITE /srv/sites/$SITE/releases
	sudo cp -a /etc/caddy/sites/$SITE.caddy /tmp/$SITE.caddy.prev 2>/dev/null || sudo rm -f /tmp/$SITE.caddy.prev
	sudo install -m 644 /tmp/$SITE.caddy /etc/caddy/sites/$SITE.caddy
	if ! sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then
		echo 'deploy/caddy.conf is not valid: restoring the previous one.' >&2
		if [ -f /tmp/$SITE.caddy.prev ]; then sudo install -m 644 /tmp/$SITE.caddy.prev /etc/caddy/sites/$SITE.caddy; else sudo rm -f /etc/caddy/sites/$SITE.caddy; fi
		exit 1
	fi
	sudo systemctl reload caddy"
COPYFILE_DISABLE=1 tar --no-xattrs --no-mac-metadata -C "$TMP/src" -s ',^dist,public,' -cf - dist | ssh "$TARGET" \
	"sudo -u deploy SSH_ORIGINAL_COMMAND='static $SITE $REV' /usr/local/bin/deploy-static"
