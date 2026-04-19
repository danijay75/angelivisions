---
description: Déploiement complet des fichiers locaux vers le VPS et redémarrage PM2
---
# Ghost Buster Deployment Workflow

Ce workflow automatise le transfert des fichiers, nettoie les processus zombies et assure un redémarrage stable via PM2.

// turbo
1. Ghost Hunting : Nettoyage du port 3000 et arrêt PM2 (Action à faire sur le VPS)
ssh root@91.134.143.82 "fuser -k 3000/tcp ; pm2 stop angelivisions ; pm2 delete angelivisions"

// turbo
2. Synchronisation des fichiers essentiels
# Dossiers sources
scp -r "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\app" root@91.134.143.82:/var/www/angelivisions/
scp -r "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\components" root@91.134.143.82:/var/www/angelivisions/
scp -r "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\lib" root@91.134.143.82:/var/www/angelivisions/
scp -r "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\public" root@91.134.143.82:/var/www/angelivisions/
# Fichiers de config
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\package.json" root@91.134.143.82:/var/www/angelivisions/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\next.config.mjs" root@91.134.143.82:/var/www/angelivisions/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\ecosystem.config.js" root@91.134.143.82:/var/www/angelivisions/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\tailwind.config.ts" root@91.134.143.82:/var/www/angelivisions/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\tsconfig.json" root@91.134.143.82:/var/www/angelivisions/

// turbo
3. Build et Relance Stable sur le VPS
ssh root@91.134.143.82 "chown -R ubuntu:ubuntu /var/www/angelivisions ; cd /var/www/angelivisions ; rm -rf .next ; su ubuntu -c 'npm install --legacy-peer-deps ; npm run build ; pm2 start ecosystem.config.js'"

// turbo
4. Vérification finale
ssh root@91.134.143.82 "pm2 status angelivisions ; netstat -tulpn | grep :3000"
