# État des lieux — 31 octobre 2026

Analyse du dépôt local, du site en production et du serveur, en préparation du passage de l'agent Antigravity à OpenCode.

## 1. Résumé

- Le site **répond correctement** (HTTPS 200, FR/EN/ES) mais tourne sur un build du **19 août 2026**.
- Le **code local correspond exactement à ce qui est en production**, mais **40 fichiers modifiés ne sont pas commités** (dont 4 fichiers non suivis utilisés en prod). Rien n'a été modifié depuis le 19/08 20:20.
- Le build local (`.next/`) est **incomplet et obsolète** (mai 2026, pas de `BUILD_ID`) : il ne peut pas servir de référence.
- Le serveur contient **~1,6 Go de sauvegardes obsolètes** et **~32 Mo de logs** sans rotation.
- Le workflow de déploiement Antigravity contient **deux bugs bloquants** liés à l'utilisateur PM2 (root vs ubuntu).

## 2. Environnement

| | Local (Windows) | Serveur |
| --- | --- | --- |
| Node | v24.13.1 | v22.22.0 |
| npm | 11.8.0 | 10.9.4 |
| Next.js | 15.2.8 | 15.2.8 |
| Divers | dépôt `P:\Projets IA\angeli-visions-website` | Ubuntu, 7,7 Go RAM, 58 Go libres, uptime 114 j |

## 3. Production

- `https://angelivisions.com/fr` → 200, ~72 Ko ; `/en` et `/es` → 200.
- Process : PM2 `angelivisions`, mode cluster (1 instance), PID 798030, **25 jours d'uptime**, 4 redémarrages, ~423 Mo de RAM.
- Commande réellement lancée : `node_modules/.bin/next start` dans `/var/www/angelivisions`.
- nginx actif, proxy `127.0.0.1:3000`, certificat valide jusqu'au **15/01/2027**, `certbot.timer` actif.
- Cron quotidien `scripts/monitor.js` : le site est vérifié chaque matin (journal `data/monitor.log`).

## 4. État du code

### Dépôt local

- Branche `main`, HEAD `f3eca60`.
- `git status` : **40 fichiers modifiés** (+1258 / −625) et **4 fichiers non suivis** :
  - `components/ui/button-retro.tsx`
  - `components/ui/gradient-button.tsx`
  - `scripts/clean-spam-newsletter.ts`
  - `scripts/monitor.js`
- Ces 4 fichiers **sont utilisés en production** (le menu utilise `button-retro.tsx`).
- Dernière modification source : `components/hero-section.tsx`, **19/08/2026 20:20**.
- Build serveur : `.next` **19/08/2026 20:21** → la production est bien le reflet du dossier de travail local.
- TypeScript : `npx tsc --noEmit` ne remonte que **2 erreurs**, toutes dans `scripts/fix-redis-encoding.ts` (module `dotenv` absent + regex invalide). Aucune erreur dans `app/`, `components/`, `lib/`.
- Dossiers/artefacts lourds au root du projet : `deploy.tar.gz` (13,8 Mo, suivi par git), `tsconfig.tsbuildinfo` (471 Ko), `build_output*.txt`, `tsc_errors*.txt`.

### Dépôt serveur

- HEAD `a30aa6a` (« Fix: revert mentions-legales… »), **absent de l'historique local** → les deux dépôts ont divergé.
- Le dossier de travail du serveur est également modifié (nombreux fichiers).
- Conclusion : le `.git` du serveur n'est pas une source de vérité, il ne sert qu'à l'historique. GitHub `danijay75/angelivisions` + dépôt local doivent primer.

### Variables d'environnement

- `.env.local` local : 12 clés (dont `CAPTCHA_BYPASS`).
- `.env.local` serveur : 15 clés (dont `ADMIN_EMAIL`, `FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`).
- Le script de déploiement ne copie **pas** `.env.local` (heureux hasard) : ne jamais l'écraser.

## 5. Déploiement (ancien workflow — corrigé le 31/10, voir §9)

1. `ssh root@… "fuser -k 3000/tcp ; pm2 stop angelivisions ; pm2 delete angelivisions"`
2. `scp -r` de `app`, `components`, `lib`, `public` + 5 fichiers de config
3. `chown` + `rm -rf .next` + `npm install` + `npm run build` + `pm2 start` en tant que `ubuntu`
4. `pm2 status` + `netstat`

### Problèmes constatés

- **Étapes 1 et 4 exécutées en root** : `pm2` root est vide (`pm2 list` ne montre rien, `pm2 describe angelivisions` répond « doesn’t exist »). L'arrêt/suppression ne fait donc rien, et la vérification finale ne vérifie rien.
- **Build sur place, application en marche** : `rm -rf .next` supprime les chunks servis ; nginx renvoie des 502 pendant toute la durée du build, et les clients qui avaient l'ancien build provoquent des erreurs `Failed to find Server Action "x"` (log d'erreur de **12 Mo**, encore alimenté aujourd'hui).
- **`scp -r` ne supprime rien** : les fichiers retirés du projet restent indéfiniment sur le serveur et sont recompilés.
- **`pm2 save` non relancé** : `dump.pm2` date du 20/07 alors que l'app tourne depuis le 19/08. `pm2-ubuntu` est `enabled` mais `inactive` (démon démarré manuellement) : après un reboot, la résurrection PM2 utilisera un dump périmé.
- **Pas de swap** et 7,7 Go de RAM : un `next build` sur le VPS peut passer, mais sature la machine et le site en même temps.

## 6. Problèmes côté site

1. **Soft 404** : la route catch-all `app/[lang]/[slug]` (fiche artiste) répond **200** pour n'importe quelle URL inconnue. Ex. `/fr/artiste-inexistant` → 200, `/api/health` → 200 avec du HTML. Seul `/fr/projet/<slug>` renvoie correctement 404. Impact SEO (pages fantômes indexables) et monitoring faussé.
2. **Catalogue artistes vide en production** : la clé Upstash `artists` contient `[]` → `/api/artists` renvoie une liste vide, `/fr/spectacles` affiche un catalogue vide et toutes les fiches artistes tombent sur « Artiste non trouvé » (en 200, donc invisible). L'ancien code ne ré-amorçait jamais une liste vide (seulement une clé absente).
2. **Pas de healthcheck réel** : `scripts/monitor.js` teste la page d'accueil ; il considérerait « online » un site qui renvoie une page d'erreur en 200.
3. **Logs** : `angelivisions-error-0.log` 12 Mo, `pm2.log` 20 Mo, aucune rotation.
4. **Espace serveur** : `next_build.tar` 1,1 Go, `full_source.tar.gz` 262 Mo, `next_build.zip` 236 Mo, `next_build.tar.gz` 18 Mo, `deploy.zip` 4,5 Mo — tous du 05/04/2026, inutiles. `.next` pèse 2,3 Go.
5. **Erreurs TS** dans un script utilitaire (sans impact sur le build Next, mais `tsc` échoue).
6. **Mot de passe / clés** : `.env.local` est bien ignoré par git, mais le dossier projet contient plusieurs archives de déploiement suivies par git (`deploy.tar.gz`).

## 7. SSH — migration Antigravity → OpenCode

- La connexion Antigravity était documentée dans `.agent/workflows/ssh.md` : `ssh root@91.134.143.82`, sans fichier `~/.ssh/config`.
- Authentification par clé déjà fonctionnelle : **`~/.ssh/id_rsa`** (la clé `id_ed25519` n'est pas autorisée sur le serveur).
- Un alias a été créé dans `C:\Users\danij\.ssh\config` :

```sshconfig
Host angelivisions
    HostName 91.134.143.82
    User root
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes
    ServerAliveInterval 30
    ServerAliveCountMax 4
```

- Vérifié : `ssh angelivisions "hostname"` → `vps-86158205`, et `scp` via l'alias fonctionne.
- `ubuntu@91.134.143.82` refuse la clé : passer par `ssh angelivisions "su - ubuntu -c '…'"`.

## 8. Recommandations (par ordre de priorité)

1. **Committer l'état actuel** (les 40 fichiers + 4 non suivis) pour arrêter de perdre l'historique ; pousser sur GitHub.
2. **Corriger le workflow de déploiement** : tout exécuter via `su - ubuntu`, builder dans `releases/<timestamp>` puis basculer le lien symbolique `current` (déploiement atomique, zéro downtime), enfin `pm2 reload` + `pm2 save`.
3. **Ajouter `notFound()`** dans la page `[slug]` quand l'artiste n'existe pas, et un vrai endpoint `/api/health` (statut + version du build).
4. **Nettoyer** les 1,6 Go d'archives et activer `pm2 install pm2-logrotate` (ou logrotate système).
5. **Réparer `scripts/fix-redis-encoding.ts`** ou l'exclure du `tsconfig`.
6. **Sauvegarder** `.env.local` du serveur hors du dossier de l'app, et documenter les clés manquantes en local.

## 9. Travaux réalisés le 31/10/2026

### Point 3 — soft 404 + healthcheck (fait, **déployé le 31/10 à 20:53**)

| Fichier | Changement |
| --- | --- |
| `lib/server/artists.ts` | **nouveau** : `getArtists()` / `getArtistBySlug()`, source unique (Redis + fallback `data/artists.ts`), ré-amorçage si la liste KV est vide |
| `app/api/artists/route.ts` | GET réécrit sur `getArtists()` (plus de duplication de la logique Redis) |
| `app/[lang]/[slug]/page.tsx` | devient un **Server Component** : `notFound()` si slug inconnu ou langue invalide → vrai 404 |
| `app/[lang]/[slug]/artist-detail-content.tsx` | **nouveau** : l'ancien composant client, qui reçoit maintenant l'artiste en props (plus de fetch client, plus d'écran « Chargement ») |
| `app/api/health/route.ts` | **nouveau** : JSON `{status, service, buildId, uptime}` en `no-store` |
| `scripts/monitor.js` | vérifie `/api/health` (JSON + `status:ok`) en plus de la page d'accueil, retombe sur l'ancien comportement si la route n'existe pas encore |

Vérifié en local (build de production, port 3100) :

```
/fr                            -> 200
/fr/la-comedie-des-illusions   -> 200
/fr/artiste-inexistant         -> 404   (avant : 200)
/fr/spectacles                 -> 200
/api/health                    -> 200 application/json
/en/standup-burlesque-show     -> 200
```

### Point 4 — espace disque + rotation des logs (fait sur le VPS)

Archives supprimées dans `/var/www/angelivisions` (toutes du 05/04/2026) : `next_build.tar` (1,1 Go), `full_source.tar.gz` (262 Mo), `next_build.zip` (236 Mo), `next_build.tar.gz` (18 Mo), `deploy.zip` (4,5 Mo), `deploy-artists.tar.gz`, `deploy_optim.tar.gz`, `temp_html.html`, `tsconfig.tsbuildinfo`, `en.ts`/`es.ts`/`fr.ts` et `page.tsx` (restes à la racine), `build_output*.txt`, `tsc_errors*.txt`.

- `.next/cache` (791 Mo de cache de build, inutile au runtime) purgé.
- Logs tronqués : `angelivisions-error-0.log` (12 Mo), `pm2.log` (20 Mo), `nginx/error.log`.
- Rotation créée : `/etc/logrotate.d/pm2-angelivisions` (quotidienne, 14 rotations, compression, `maxsize 50M`, `copytruncate`).
- `pm2 save` relancé → `dump.pm2` à jour (il datait du 20/07).

Résultat : dossier de 5,2 Go → **2,9 Go**, disque 14 Go → 12 Go utilisés, site toujours 200 (aucun redémarrage, uptime préservé).

### Point 2 — déploiement atomique (fait et testé)

Nouvelle structure sur le VPS :

```
/var/www/angelivisions/
├── current -> releases/20261031-205308   # ce que PM2 exécute
├── releases/                             # 1 dossier par déploiement (3 conservés)
└── shared/
    ├── .env.local                        # secrets, jamais écrasés
    ├── uploads/                           # 96 Mo d'images uploadées (partagées)
    ├── monitor.log
    ├── ecosystem.config.js               # cwd = .../current
    └── deploy.sh                         # = .agent/server-deploy.sh
```

- `.agent/deploy.ps1` : archive locale → `scp` → `releases/<horodatage>` → build sur le VPS → test à blanc sur `:3001` → bascule du lien `current` → `pm2 startOrReload` → vérification publique → purge des releases > 3.
- `.agent/server-deploy.sh` (installé en `shared/deploy.sh`) : toute la logique, plus `rollback`.
- `.agent/workflows/deploy-vps.md` : documentation du workflow.

Mesures réelles du premier déploiement atomique : `npm install` 11 s, `npm run build` 60 s, test à blanc 2 s, bascule + reload 9 s — **sans jamais toucher la version en service**. Rollback testé : retour à la release précédente en 8 s, HTTP 200.

Ancien dossier racine nettoyé (les sources ne vivent plus que dans `releases/`) : dossiers `app/`, `components/`, `public/`, `node_modules/`, `.next/`, etc. supprimés. Cron de surveillance repointé sur `current` et `shared/monitor.log`.

## 10. Note : build local impossible depuis `P:`

`P:` est un **lecteur amovible** dont le pilote répond `EISDIR` à `readlink`. Webpack (Next 15) appelle `readlink` pendant la résolution de modules :

```
Error: EISDIR: illegal operation on a directory, readlink '...app/api/admin/users/[id]/route.ts'
```

`next build` échoue donc systématiquement depuis `P:`. Contournement utilisé : copie du projet dans `C:\Users\danij\AppData\Local\Temp\av-build` (node_modules réinstallé sur C:). Recommandation : déplacer le projet sur le disque système (C:) pour pouvoir builder en local.

## 11. Incident sécurité — identifiants Upstash exposés (31/10/2026)

`scripts/reset-redis-services.js` et `scripts/fix-redis-encoding.js` contenaient en clair
l'URL et le **token REST de la base Upstash de production**, dans un dépôt **public**
(`github.com/danijay75/angelivisions`). Ce token donne un accès lecture/écriture à toutes
les données : artistes, projets, services, devis, réclamations, abonnés newsletter,
utilisateurs admin.

Traitement :

1. Scripts réécrits : identifiants lus dans `.env.local` (`scripts/_env.js`), plus aucun secret dans le code.
2. Historique git réécrit (`git filter-repo --replace-text`) puis force-push : le token n'apparaît plus dans aucun commit. Effet secondaire : `.git` passe de 1,6 Go à 41 Mo.
3. Scripts de la release en service nettoyés sur le VPS.
4. **Le token doit encore être révoqué dans la console Upstash.** GitHub conserve les objets orphelins : l'ancien fichier reste lisible via `raw.githubusercontent.com/danijay75/angelivisions/56a3e23/scripts/reset-redis-services.js`.

Rotation : console Upstash → base `engaged-quetzal-20185` → REST API → Rotate token, puis
`bash /var/www/angelivisions/shared/rotate-kv-token.sh <nouveau_token>`
(= `.agent/rotate-kv-token.sh` : sauvegarde l'env, redémarre l'app et vérifie Redis).
