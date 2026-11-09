#!/bin/sh
# Generates any missing secret once and keeps it on the data volume,
# so the app works with zero configuration and survives restarts.
set -e
mkdir -p /app/data
SECRETS=/app/data/secrets.env
[ -f "$SECRETS" ] || touch "$SECRETS"
for v in PAYLOAD_SECRET CRON_SECRET PREVIEW_SECRET; do
  eval cur=\${$v:-}
  [ -n "$cur" ] && continue
  grep -q "^$v=" "$SECRETS" || echo "$v=$(head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')" >> "$SECRETS"
  export "$(grep "^$v=" "$SECRETS")"
done

# Public URL used in emails, sitemap, feeds and brochures.
if [ -z "$SITE_URL" ]; then
  if [ -n "$DOMAIN" ]; then export SITE_URL="https://$DOMAIN"; fi
fi

pnpm payload migrate
NODE_ENV=production exec pnpm start
