---
description: Déploiement atomique des fichiers locaux vers le VPS (build sur place, bascule par lien symbolique, zéro coupure)
---
# Déploiement Angeli Visions (atomique)

Structure sur le serveur :

```
/var/www/angelivisions/
├── current -> releases/<release>        # ce que PM2 exécute
├── releases/
│   └── 20261031-204942/                 # sources + node_modules + .next
└── shared/
    ├── .env.local                       # secrets, jamais écrasés
    ├── uploads/                         # images/vidéos uploadées via l'admin
    ├── monitor.log
    ├── ecosystem.config.js              # cwd = /var/www/angelivisions/current
    └── deploy.sh                        # versionné dans .agent/server-deploy.sh
```

## Déployer

```powershell
.\.agent\deploy.ps1
```

1. Archive des sources locales (sans `node_modules`, `.next`, `.git`, `.env.local`)
2. `scp` vers `releases/<horodatage>`
3. `npm install` + `npm run build` **dans la nouvelle release** — l'ancienne continue de servir
4. Test à blanc sur le port 3001 (`/api/health` doit répondre 200, un slug inconnu 404)
5. Bascule `current` + `pm2 reload` (l'ancien process répond jusqu'à ce que le nouveau soit prêt)
6. Contrôle public `https://angelivisions.com/fr`, rollback automatique si ≠ 200
7. Suppression des releases au-delà de 3

## Revenir en arrière

```powershell
.\.agent\deploy.ps1 -Rollback
```

## Règles

- **Ne jamais** éditer les fichiers dans `releases/` ou `current` : ce sont des copies du dépôt.
- `.env.local`, `public/uploads` et `data/monitor.log` sont des liens vers `shared/` : ils survivent aux déploiements.
- Les commandes PM2 doivent tourner en tant que `ubuntu` (`su - ubuntu -c "pm2 ..."`). En root, PM2 ne voit aucune application.
- Logs du build : `/tmp/build-<release>.log`, `/tmp/smoke-<release>.log`.

## SSH

```powershell
ssh angelivisions                     # root@91.134.143.82, clé ~/.ssh/id_rsa
ssh angelivisions "su - ubuntu -c 'pm2 list'"
```

## Diagnostic rapide

```powershell
ssh angelivisions "curl -s https://angelivisions.com/api/health"
ssh angelivisions "su - ubuntu -c 'pm2 logs angelivisions --lines 40 --nostream'"
ssh angelivisions "ls -1 /var/www/angelivisions/releases; readlink /var/www/angelivisions/current"
ssh angelivisions "tail -40 /var/www/angelivisions/shared/monitor.log"
```
