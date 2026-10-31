#!/bin/bash
# ============================================================
# Déploiement atomique Angeli Visions
#   bash /var/www/angelivisions/shared/deploy.sh <release>   # déploie
#   bash /var/www/angelivisions/shared/deploy.sh rollback    # revient à la release précédente
#
# Structure :
#   /var/www/angelivisions/current   -> releases/<release>  (lien symbolique)
#   /var/www/angelivisions/releases/...                     (une version par déploiement)
#   /var/www/angelivisions/shared/    .env.local, uploads/, monitor.log, ecosystem.config.js
# ============================================================
set -uo pipefail

APP=/var/www/angelivisions
SHARED=$APP/shared
CURRENT=$APP/current
KEEP=3
PORT=3001
URL=https://angelivisions.com/fr

log() { echo "[$(date +%H:%M:%S)] $*"; }

current_release() { readlink -f "$CURRENT" 2>/dev/null | xargs -r basename; }

switch_to() {
    local rel=$1
    ln -sfn "releases/$rel" "$CURRENT"
    log "current -> $rel"
}

reload_app() {
    su - ubuntu -c "pm2 startOrReload $SHARED/ecosystem.config.js --update-env" >/dev/null 2>&1 \
        || su - ubuntu -c "pm2 restart angelivisions" >/dev/null 2>&1
    su - ubuntu -c "pm2 save" >/dev/null 2>&1
}

# ---------- rollback ----------
if [ "${1:-}" = "rollback" ]; then
    CUR=$(current_release)
    PREV=$(ls -1 "$APP/releases" | grep -v "^$CUR$" | sort | tail -1)
    if [ -z "$PREV" ]; then
        log "Aucune release précédente disponible."
        exit 1
    fi
    log "Rollback $CUR -> $PREV"
    switch_to "$PREV"
    reload_app
    sleep 6
    CODE=$(curl -s -o /dev/null -w '%{http_code}' "$URL")
    log "Après rollback : HTTP $CODE"
    [ "$CODE" = "200" ] || exit 1
    exit 0
fi

# ---------- déploiement ----------
REL=${1:?usage: deploy.sh <release> | rollback}
DIR=$APP/releases/$REL
[ -d "$DIR" ] || { log "Release absente : $DIR"; exit 1; }
PREV=$(current_release)

log "== Déploiement de $REL (release active : ${PREV:-aucune}) =="

# 1. Données partagées (jamais écrasées)
rm -f "$DIR/.env.local"          && ln -s ../../shared/.env.local "$DIR/.env.local"
rm -rf "$DIR/public/uploads"     && ln -s ../../../shared/uploads "$DIR/public/uploads"
rm -f "$DIR/data/monitor.log"    && ln -s ../../../shared/monitor.log "$DIR/data/monitor.log"
chown -R ubuntu:ubuntu "$DIR"

# 2. Dépendances
log "== npm install =="
su - ubuntu -c "cd $DIR && npm install --legacy-peer-deps --no-audit --no-fund" >/tmp/npm-$REL.log 2>&1
if [ $? -ne 0 ]; then
    log "ERREUR npm install - la production n'a pas bougé (voir /tmp/npm-$REL.log)"
    exit 1
fi

# 3. Build — la production continue de tourner sur l'ancienne release
log "== build =="
su - ubuntu -c "cd $DIR && NODE_ENV=production npm run build" >/tmp/build-$REL.log 2>&1
if [ $? -ne 0 ]; then
    log "ERREUR build - la production n'a pas bougé (voir /tmp/build-$REL.log)"
    exit 1
fi
log "build OK"

# 4. Test à blanc sur un port séparé
log "== test à blanc sur :$PORT =="
su - ubuntu -c "cd $DIR && nohup node_modules/.bin/next start -p $PORT > /tmp/smoke-$REL.log 2>&1 &"
OK=""
for _ in $(seq 1 30); do
    sleep 1
    CODE=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/api/health")
    [ "$CODE" = "200" ] && { OK=1; break; }
done
if [ -z "$OK" ]; then
    log "ERREUR test à blanc - la production n'a pas bougé (voir /tmp/smoke-$REL.log)"
    pkill -f "next start -p $PORT" 2>/dev/null
    exit 1
fi
H404=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/fr/artiste-inexistant")
log "test à blanc OK (health 200, 404 test = $H404)"
pkill -f "next start -p $PORT" 2>/dev/null
sleep 1

# 5. Bascule atomique + reload sans coupure
log "== bascule =="
switch_to "$REL"
reload_app
sleep 8

CODE=$(curl -s -o /dev/null -w '%{http_code}' "$URL")
log "Vérification publique : HTTP $CODE"
if [ "$CODE" != "200" ]; then
    log "Le site ne répond pas correctement - rollback automatique"
    if [ -n "$PREV" ]; then
        switch_to "$PREV"; reload_app; sleep 6
        log "Retour sur $PREV : HTTP $(curl -s -o /dev/null -w '%{http_code}' "$URL")"
    fi
    exit 1
fi

# 6. Nettoyage des vieilles releases
ls -1 "$APP/releases" | sort | head -n -$KEEP | while read -r old; do
    [ "$old" = "$(current_release)" ] && continue
    log "suppression de l'ancienne release $old"
    rm -rf "${APP:?}/releases/${old:?}"
done

log "== Terminé : $REL en ligne =="
su - ubuntu -c "pm2 list" | grep angelivisions
