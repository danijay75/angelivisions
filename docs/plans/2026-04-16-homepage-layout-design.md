# Design Document: Homepage Layout Update (Hero & Services)

**Date**: 2026-04-16
**Status**: Approved

## 1. Objectif
Épurer la page d'accueil d'Angeli Visions en supprimant les redondances dans la présentation des services, afin de proposer une transition visuelle plus fluide, "sober et élégante", entre le Hero et la section détaillant les services.

## 2. Modifications de la section Hero (`HeroSection`)
- **Maintenu** : Le "statement" et phrase d'accroche principale *("Votre Partenaire Privilégié pour le spectacle et l'événementiel")*.
- **Maintenu** : La liste textuelle des spécialités ("Booking DJ • Production Musicale...").
- **Maintenu** : Les boutons d'appel à l'action.
- **Supprimé** : La grille asymétrique des 3 petites cartes ("Production Musicale", "Conception et organisation...", "Animations musicales"), afin de faire respirer l'interface et éviter un doublon logique avec les cartes complètes qui suivent.

## 3. Modifications de la section Services (`ServicesSection`)
- **Supprimé** : Le titre "Nos Services" classique et potentiellement son sous-titre explicatif qui alourdissent la transition.
- **Ajouté** : Une nouvelle accroche typographique de transition, centrée, fine et inspirant l'expertise (Style "Option A"). 
  - *Texte validé (à intégrer via le système i18n)* : "L'art de l'événementiel, maîtrisé de la conception à la lumière."
  - *Style visé* : Typographie allégée (`font-light`), espacements prononcés (`tracking-wide` ou `tracking-widest`), de couleur neutre/claire (`text-slate-300`).
- **Maintenu** : La grande grille des services (cards avec images et descriptions complètes).

## 4. Impact sur les Fichiers (.tsx & i18n)
- `components/hero-section.tsx` : Suppression du bloc JSX contenant les 3 "highlights".
- `components/services-section.tsx` : Remplacement de l'entête `{t("services.title")}` par le nouveau style statement et la nouvelle clé de traduction.
- `lib/i18n/dictionaries/*.ts` :
  - Suppression de `services.title` et `services.subtitle` existants ou ajout d'une nouvelle clé `services.statement` contenant "L'art de l'événementiel, maîtrisé de la conception à la lumière." (et traduction en EN/ES).
