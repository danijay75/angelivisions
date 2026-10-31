#!/bin/bash
# ============================================================
# Rotation du token Upstash (KV_REST_API_TOKEN) sur le VPS
#
#   ssh angelivisions
#   bash /var/www/angelivisions/shared/rotate-kv-token.sh NOUVEAU_TOKEN
#
# - sauvegarde shared/.env.local avant modification
# - remplace la ligne KV_REST_API_TOKEN
# - redémarre l'application
# - vérifie que Redis répond bien avec le nouveau token
# ============================================================
set -uo pipefail

ENV=/var/www/angelivisions/shared/.env.local
TOKEN=${1:?usage: rotate-kv-token.sh <nouveau_token>}

if [ ! -f "$ENV" ]; then
    echo "ERREUR : $ENV introuvable"
    exit 1
fi

if grep -q '^KV_REST_API_TOKEN=' "$ENV"; then
    cp -a "$ENV" "$ENV.bak-$(date +%Y%m%d-%H%M%S)"
    sed -i "s|^KV_REST_API_TOKEN=.*|KV_REST_API_TOKEN=$TOKEN|" "$ENV"
else
    echo 'KV_REST_API_TOKEN introuvable dans .env.local' >&2
    exit 1
fi

echo "Token mis à jour, redémarrage de l'application..."
su - ubuntu -c "pm2 restart angelivisions" >/dev/null 2>&1
sleep 8

CODE=$(curl -s -o /dev/null -w '%{http_code}' https://angelivisions.com/api/health)
echo "healthcheck : HTTP $CODE"

echo "Test de connexion Redis avec le nouveau token :"
cd /var/www/angelivisions/current || exit 1
node -e '
const fs = require("fs");
const { Redis } = require("@upstash/redis");
const line = fs.readFileSync("/var/www/angelivisions/shared/.env.local", "utf8")
  .split(/\r?\n/).find((l) => l.startsWith("KV_REST_API_TOKEN="));
const urlLine = fs.readFileSync("/var/www/angelivisions/shared/.env.local", "utf8")
  .split(/\r?\n/).find((l) => l.startsWith("KV_REST_API_URL="));
const redis = new Redis({ url: urlLine.split("=")[1].trim(), token: line.split("=")[1].trim() });
redis.get("artists").then((v) => {
  console.log("OK - clé artists accessible, longueur:", v ? String(v).length : 0);
}).catch((e) => {
  console.error("ECHEC Redis:", e.message || e);
  process.exit(1);
});
'
