ssh root@91.134.143.82 "fuser -k 3000/tcp ; pm2 stop angelivisions ; pm2 delete angelivisions"
scp -r "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\app" root@91.134.143.82:/var/www/angelivisions/
scp -r "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\components" root@91.134.143.82:/var/www/angelivisions/
scp -r "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\lib" root@91.134.143.82:/var/www/angelivisions/
scp -r "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\public" root@91.134.143.82:/var/www/angelivisions/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\package.json" root@91.134.143.82:/var/www/angelivisions/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\next.config.mjs" root@91.134.143.82:/var/www/angelivisions/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\ecosystem.config.js" root@91.134.143.82:/var/www/angelivisions/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\tailwind.config.ts" root@91.134.143.82:/var/www/angelivisions/
scp "c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque\tsconfig.json" root@91.134.143.82:/var/www/angelivisions/
ssh root@91.134.143.82 "chown -R ubuntu:ubuntu /var/www/angelivisions; cd /var/www/angelivisions; rm -rf .next; su ubuntu -c 'npm install --legacy-peer-deps; npm run build; pm2 start ecosystem.config.js'"
ssh root@91.134.143.82 "pm2 status angelivisions ; netstat -tulpn | grep :3000"
