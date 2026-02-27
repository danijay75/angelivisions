---
description: Déploiement complet des fichiers locaux vers le VPS et redémarrage PM2
---
# Turbo Deployment Workflow

Ce workflow automatise le transfert des fichiers critiques et la compilation sur le serveur.

// turbo
1. Transférer les dictionnaires
scp -r "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\lib\i18n\dictionaries\*" root@91.134.143.82:/var/www/angelivisions/lib/i18n/dictionaries/

// turbo
2. Transférer les composants et API mis à jour
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\components\services-section.tsx" root@91.134.143.82:/var/www/angelivisions/components/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\components\admin\sidebar.tsx" root@91.134.143.82:/var/www/angelivisions/components/admin/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\components\admin\devis-manager.tsx" root@91.134.143.82:/var/www/angelivisions/components/admin/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\app\api\devis\route.ts" root@91.134.143.82:/var/www/angelivisions/app/api/devis/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\lib\server\mailer.ts" root@91.134.143.82:/var/www/angelivisions/lib/server/

// turbo
3. Appliquer les droits et lancer le build sur le VPS
ssh root@91.134.143.82 "chown -R ubuntu:ubuntu /var/www/angelivisions && cd /var/www/angelivisions && rm -rf .next && su ubuntu -c 'npm run build && pm2 restart all'"
