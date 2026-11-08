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

# Public URL: explicit value, else https://DOMAIN, else plain http on the server IP
if [ -z "$NEXT_PUBLIC_SERVER_URL" ]; then
  if [ -n "$DOMAIN" ]; then export NEXT_PUBLIC_SERVER_URL="https://$DOMAIN"; else export NEXT_PUBLIC_SERVER_URL="http://localhost"; fi
fi

pnpm payload migrate
pnpm build
NODE_ENV=production exec pnpm start
