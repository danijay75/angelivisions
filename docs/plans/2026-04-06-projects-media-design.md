# Design : Galerie de Médias et Slug des Projets

## 1. Génération Intelligente du Slug (URL)
**Problème :** Actuellement, le slug (le lien URL) est conservé tel quel même si le titre change (ex: modification de Gala vers SailGP), et les caractères spéciaux/accents sont mal gérés.
**Solution :**
- Développement d'une fonction `slugify` robuste qui nettoie les accents (é -> e, à -> a), supprime les caractères spéciaux et remplace les espaces par des tirets (`-`).
- Lors de la sauvegarde dans le `ProjectsManager`, le slug sera **re-généré automatiquement** à partir du titre actuel, garantissant que l'URL (`/projet/...`) reflète toujours le vrai titre.
- Ajout d'un petit texte informatif sous le champ "Titre" dans l'admin montrant l'URL finale générée.

## 2. Le Nouveau Composant `ImageGallery` (Admin)
**Fonctionnalité :**
- Création d'un composant de téléchargement multiple pour les photos de la galerie (glisser-déposer, aperçu, suppression).
- Il fonctionnera exactement comme la section vidéo actuelle (`VideoUpload`).
- Intégration dans le formulaire de l'administration `ProjectsManager` sous la vignette principale.

## 3. L'Interface Publique (ProjectPageClient)
**Mise en page à 2 colonnes :**
- Sous la description du projet, nous allons créer une section fluide avec CSS Grid : `grid-cols-1 md:grid-cols-2 gap-8`.
- **Colonne de Gauche : Photo / Galerie**. Suppression des fausses images. Affichage des vraies photos ajoutées via l'admin, présentées dans une belle grille (ou un diaporama maçonnerie).
- **Colonne de Droite : Vidéos**. Affichage des players vidéo (locaux + liens externes YouTube/Vimeo) de manière compacte.
- Si le projet n'a que des vidéos ou que des photos, la colonne occupée prendra toute la largeur automatiquement pour éviter un vide disgracieux.
