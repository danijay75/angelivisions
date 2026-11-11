# AGENTS.md — Angeli Visions

Contexte projet pour les agents (OpenCode). Voir aussi `docs/2026-10-31-etat-des-lieux.md`.

## Stack

- Next.js 15.2.8 (App Router), React 19, TypeScript, Tailwind CSS
- i18n par segment `app/[lang]` : `fr`, `en`, `es`
- Formulaires / API : Resend, Google Contacts, Upstash Redis (KV), Turnstile
- Admin : `app/admin/*` (JWT maison, voir `lib/server`)

## Commandes locales

```powershell
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000
npm run build
npx tsc --noEmit # doit rester propre (0 erreur)
```

⚠️ Le projet a été déplacé de `P:` (lecteur amovible : `EISDIR ... readlink` dans webpack, build impossible, et erreurs d'E/S à la copie) vers `C:\Users\danij\Projets IA\angeli-visions-website` le 31/10/2026.

## Production

| Élément | Valeur |
| --- | --- |
| Domaine | https://angelivisions.com (www → 301 vers le domaine nu, dans `/etc/nginx/sites-enabled/angelivisions`) |
| VPS | OVH `91.134.143.82` (`vps-86158205`, Ubuntu) |
| Racine | `/var/www/angelivisions` |
| Release active | `/var/www/angelivisions/current` → `releases/<horodatage>` |
| Données partagées | `/var/www/angelivisions/shared/` (`.env.local`, `uploads/`, `monitor.log`, `ecosystem.config.js`, `deploy.sh`) |
| Process | PM2 `angelivisions`, **ubuntu**, `next start` port 3000, cwd `.../current` |
| Reverse proxy | nginx → `127.0.0.1:3000`, TLS Let's Encrypt (certbot timer) |
| Logs | `/home/ubuntu/.pm2/logs/angelivisions-*.log` (rotation `/etc/logrotate.d/pm2-angelivisions`) |

## État au 11 novembre 2026 — Easy IP-Switch macOS 1.1.3

Le dépôt `main` contient déjà :

- `MAC_VERSION` et `MAC_APP_VERSION` en **1.1.3** ;
- `public/downloads/easy-ip-switch/easy-ip-switch-1.1.3-macos-intel.dmg` et
  `easy-ip-switch-1.1.3-macos-apple-silicon.dmg` ;
- la mise en avant « Conditions et RGPD » dans les quatre langues.

**La production n'a pas encore été déployée.** Depuis le poste Windows :

```powershell
cd "C:\Users\danij\Projets IA\angeli-visions-website"
git fetch origin
git reset --hard origin/main
Get-ChildItem public\downloads\easy-ip-switch\easy-ip-switch-1.1.3-macos-*.dmg
.\.agent\deploy.ps1
```

Puis vérifier <https://angelivisions.com/easy-ip-switch> et
<https://angelivisions.com/easy-ip-switch/en> : version 1.1.3, DMG Intel et
Apple Silicon téléchargeables, mention « Conditions et RGPD ».

⚠️ Ne pas déployer depuis une copie locale antérieure à `867dffb` : elle
écraserait le refactoring multilingue et les fichiers 1.1.3.

## Déployer

```powershell
.\.agent\deploy.ps1            # build sur le VPS, bascule atomique, zéro coupure
.\.agent\deploy.ps1 -Rollback  # retour à la release précédente
.\.agent\deploy.ps1 -SkipSeo   # déploie sans signaler le sitemap aux moteurs
```

Après la bascule, `scripts/seo-ping.mjs` signale les URL du sitemap à IndexNow
(Bing, Yandex, Seznam, Naver) via la clé `public/<clé>.txt`. La soumission à
Google Search Console est optionnelle : copier un compte de service dans
`.agent/gsc-service-account.json` (voir l'exemple à côté, fichier ignoré par git).

## SSH (repris de la config Antigravity)

Alias défini dans `~/.ssh/config` :

```powershell
ssh angelivisions            # root@91.134.143.82 (clé ~/.ssh/id_rsa)
scp fichier angelivisions:/tmp/
```

L'utilisateur `ubuntu` n'accepte **pas** la clé en SSH direct. Pour agir sur l'app :

```powershell
ssh angelivisions "su - ubuntu -c 'pm2 status'"
```

⚠️ `pm2` lancé en root ne voit **aucune** application : toujours passer par `su - ubuntu -c ...`.

## Règles de déploiement

1. Ne **jamais** écrire dans `releases/` ni dans `current` : ce sont des copies du dépôt, recréées à chaque déploiement. Les sources vivent en local / sur GitHub.
2. `.env.local`, `public/uploads` et `data/monitor.log` sont des **liens symboliques** vers `shared/` : les secrets et les fichiers uploadés survivent aux déploiements.
3. Passer **toujours** par `.agent/deploy.ps1` (ou `shared/deploy.sh`) : il builde dans une nouvelle release, teste sur `:3001`, puis bascule le lien. Ne jamais builder dans `current` en production.
4. Le `.git` résiduel du serveur (`/var/www/angelivisions/.git`) est divergent (HEAD `a30aa6a`) : la source de vérité est le dépôt local + GitHub `danijay75/angelivisions`.
5. Rollback : `.agent/deploy.ps1 -Rollback` (bascule sur la release précédente + `pm2 reload`, ~8 s).
