#!/bin/bash

# Script de déploiement automatique pour VPS
echo "🚀 Démarrage du déploiement..."

# Mise à jour du code depuis GitHub
echo "📥 Récupération des dernières modifications..."
git pull origin main

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install --production=false

# Build du projet Next.js
echo "🏗️ Build du projet..."
npm run build

# Redémarrage du processus avec PM2
echo "🔄 Redémarrage de l'application..."
pm2 restart angelivisions || pm2 start npm --name "angelivisions" -- start

echo "✨ Déploiement terminé avec succès !"
