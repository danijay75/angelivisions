# Audit d'indexation Google Search Console — angelivisions.com

**Date :** 9 novembre 2026  
**Propriété :** `sc-domain:angelivisions.com` (rôle `siteOwner`)  
**Méthode :** API Search Console (URL Inspection, Search Analytics, Sitemaps) + analyse du code et des réponses HTTP.

> Le rapport « Pages » de l'interface GSC n'est pas exposé par l'API. La couverture a donc été reconstruite URL par URL via l'API URL Inspection sur les **61 URL du sitemap**, plus 14 URL hors sitemap. Les agrégats peuvent différer légèrement de l'UI, qui inclut des URL non présentes dans le sitemap.

---

## 1. Chiffres clés

| Indicateur | Valeur |
| --- | --- |
| URL déclarées dans le sitemap | **61** |
| URL indexées (sitemap) | **34 (56 %)** |
| URL non indexées (sitemap) | **27 (44 %)** |
| Clics sur 90 jours | **16** |
| Impressions sur 90 jours | **331** |
| CTR moyen | **4,8 %** |
| Position moyenne | **7,25** |
| Sitemap | soumis le 2026-11-02, **0 erreur, 0 avertissement** |

**Tendance :** pic en avril 2026 (33 clics / 185 impressions), puis baisse continue (0 à 6 clics par mois depuis juin). Le trafic est presque exclusivement de la marque : la requête « angeli » représente 92 impressions et **0 clic**.

**Historique de l'ancien site www** (propriété `https://www.angelivisions.com/`, 16 mois) : **76 clics / 1 315 impressions**, concentrés sur l'accueil et sur des pages de contenu aujourd'hui disparues (mastering, mixage, blog, catalogue). C'est le principal gisement de trafic perdu.

---

## 2. Couverture détaillée des 61 URL du sitemap

### 2.1 Répartition

| Statut GSC | Nombre | Lecture |
| --- | --- | --- |
| Envoyée et indexée | 34 | OK |
| Google ne reconnaît pas cette URL | 10 | Google ne l'a jamais explorée |
| Détectée, actuellement non indexée | 8 | Connue, mais jugée non prioritaire / trop fine |
| Explorée, actuellement non indexée | 4 | Explorée, contenu jugé insuffisant |
| Autre page avec balise canonique correcte | 3 | Volontairement (ou involontairement) canonicalisée ailleurs |
| Page en double sans URL canonique sélectionnée | 1 | Signaux canoniques contradictoires |
| Page en double : Google n'a pas choisi la même URL canonique | 1 | Conflit `/` vs `/fr` |

### 2.2 Les 27 URL non indexées

| URL | Statut | Cause probable | Action |
| --- | --- | --- | --- |
| `/fr/captation-video-streaming-live-podcast` | Inconnue de Google | Rewrite vers `/fr/services`, canonical `/fr/services` | Rediriger 301 vers `/fr/services` |
| `/en/captation-video-streaming-live-podcast` | Inconnue de Google | idem | idem |
| `/es/captation-video-streaming-live-podcast` | Inconnue de Google | idem | idem |
| `/en/reclamations` | Inconnue de Google | Page utilitaire, aucun maillage | `noindex` + retirer du sitemap |
| `/es/reclamations` | Inconnue de Google | idem | idem |
| `/en/services/captation-video` | Inconnue de Google | Canonical `/en/services` + orpheline | Canonical self + lien interne |
| `/en/services/streaming-live` | Inconnue de Google | idem | idem |
| `/es/services/streaming-live` | Inconnue de Google | idem | idem |
| `/es/services/vj-video-mapping` | Inconnue de Google | idem | idem |
| `/es/realisations` | Inconnue de Google | Page rendue côté client (skeleton) | Rendu serveur |
| `/fr/realisations` | Détectée non indexée | Page rendue côté client (skeleton) | Rendu serveur + contenu |
| `/en/realisations` | Détectée non indexée | idem | idem |
| `/fr/reclamations` | Détectée non indexée | Page utilitaire, contenu très fin | `noindex` + retirer du sitemap |
| `/fr/standup-burlesque-show` | Détectée non indexée | Aucune metadata, canonical `/`, orpheline | Metadata + lien interne |
| `/fr/services/vj-video-mapping` | Détectée non indexée | Canonical `/fr/services` + orpheline | Canonical self + lien interne |
| `/en/services/podcast` | Détectée non indexée | Canonical `/en/services` + orpheline | idem |
| `/en/services/vj-video-mapping` | Détectée non indexée | idem | idem |
| `/es/spectacles` | Détectée non indexée | Contenu ES fin, peu maillé | Enrichir + mailler |
| `/fr/devis` | Explorée non indexée | Dernier crawl avril 2026, page trop fine | Enrichir (process, garanties, FAQ) |
| `/en/devis` | Explorée non indexée | idem | idem |
| `/es/devis` | Explorée non indexée | idem | idem |
| `/es` | Explorée non indexée | Accueil ES trop proche du FR / trop fin | Enrichir ou assumer |
| `/fr/newsletter/preferences` | Canonique vers `/` | Canonical hérité du root layout | `noindex` + retirer du sitemap |
| `/fr/symphonie-musicale-live` | Canonique vers `/` | Canonical hérité du root layout | Metadata + canonical self |
| `/fr/services/podcast` | Canonique vers `/fr/services` | Canonical imposé par `services/layout.tsx` | Canonical self |
| `/es/services/podcast` | Doublon sans canonical | Canonical absent / contradictoire | Canonical self |
| `/fr` | Doublon, canonical Google = `/` | `/` répond en 307 avec canonical `/` | Passer `/` en 308 permanent |

---

## 3. Causes racines (par ordre d'impact)

### 3.1 Toute URL à un seul segment renvoie l'accueil en HTTP 200 (soft 404)

`app/[lang]/page.tsx` ne valide pas `lang`. Résultat : `/services/`, `/actualites/`, `/mastering-analogique-professionnel/`, `/le-catalogue/`, `/shop/`, etc. renvoient **HTTP 200 avec la page d'accueil** et un canonical `/fr`.

Conséquences :
- soft 404 en masse ;
- duplication de la page d'accueil ;
- gaspillage du budget de crawl ;
- aucune reprise du capital des anciennes URL WordPress (pas de 301).

**Correctif :** dans `app/[lang]/page.tsx`, vérifier `isLocale(lang)` et appeler `notFound()` sinon.

### 3.2 Canonical de l'accueil héritée par toutes les pages sans metadata

`app/layout.tsx` définit `alternates.canonical = BASE_URL` et `alternates.languages` globalement. Toute page qui ne redéfinit pas `alternates` hérite donc du canonical de l'accueil.

Pages concernées : `/fr/newsletter/preferences`, les 9 pages artistes (`/fr|en|es/{la-comedie-des-illusions, standup-burlesque-show, symphonie-musicale-live}`), `/es/artists`.

**Correctif :** retirer `alternates` du root layout ; définir canonical + hreflang page par page.

### 3.3 Canonical `/services` imposée à toutes les pages services

`app/[lang]/services/layout.tsx` force `canonical: /{lang}/services` et les hreflang correspondants. Les 4 pages service × 3 langues (captation, streaming, podcast, VJ mapping) et `/spectacles` sont donc canonicalisées vers le hub.

C'est la raison directe des statuts « Autre page avec balise canonique correcte », « Page en double sans URL canonique » et « Détectée non indexée » sur ces pages. Google a parfois ignoré le canonical (il a indexé `/fr/services/streaming-live`), ce qui crée des signaux incohérents.

**Correctif :** déplacer le canonical du layout vers `services/page.tsx` (hub) et `[serviceId]/page.tsx` (détail). Pour `spectacles` et `label-de-musique`, canonical = `/{lang}/spectacles`.

### 3.4 Page d'accueil `/` en 307 avec un canonical `/`

`/` répond en **307** vers `/fr`, mais la réponse contient un HTML complet avec `<link rel="canonical" href="https://angelivisions.com">`. Google a donc choisi `/` comme canonical de `/fr` (statut « Page en double : Google n'a pas choisi la même URL canonique »).

**Correctif :** utiliser `permanentRedirect("/fr")` (308) ou une redirection `permanent: true` dans `next.config.mjs`. Supprimer le contenu metadata de la page de redirection.

### 3.5 Sitemap en contradiction avec les canonicals

Le sitemap déclare des URL qui ne sont pas canoniques :

| URL du sitemap | Canonical réel | Problème |
| --- | --- | --- |
| `/{lang}/captation-video-streaming-live-podcast` | `/{lang}/services` | 3 URL inconnues de Google |
| `/{lang}/services/{id}` | `/{lang}/services` | 12 URL canonicalisées |
| `/{lang}/newsletter/preferences` | `/` | 3 URL canonicalisées |
| `/{lang}/reclamations` | self | pages fines non indexées |

À l'inverse, `/fr/services` (le hub réellement indexé) **n'est pas dans le sitemap**.

**Correctif :** le sitemap ne doit contenir que des URL canoniques, auto-canoniques, en 200. Ajouter `/{lang}/services`, retirer le rewrite et les pages utilitaires.

### 3.6 Contenu rendu uniquement côté client

Plusieurs pages n'ont pas de contenu dans le HTML initial :

| Élément | Cause | Conséquence |
| --- | --- | --- |
| Hero de la home | `if (!mounted) return null` dans `components/hero-section.tsx` | Aucun `<h1>`, aucun texte hero dans le HTML |
| Sections services / réalisations / partenaires de la home | `fetch("/api/...")` dans `useEffect` | Cartes absentes du HTML |
| `/realisations` | Page `"use client"` + état de chargement | Aucun `<h1>`, aucun projet dans le HTML |
| `/spectacles` | `ArtistsCatalogue` fetch `/api/artists` | Aucun lien vers les pages artistes |
| `/services` | Accordéon + `onClick`, pas de `<Link>` | Aucun lien vers les pages service |

C'est la cause profonde des pages « fines » et des pages orphelines. Googlebot sait rendre le JS, mais il faut que le contenu arrive, et le budget de rendu n'est pas garanti.

**Correctif :** charger les données côté serveur et passer les données en props aux composants clients ; rendre les cartes avec de vrais `<a href>`.

### 3.7 Maillage interne : pages orphelines

- **Pages service** (`/fr/services/captation-video`, etc.) : 0 lien interne dans le HTML. Seul le sitemap les déclare.
- **Pages artistes** (`/fr/la-comedie-des-illusions`, etc.) : 0 lien interne dans le HTML.
- **Pages projet** (`/fr/projet/...`) : 0 lien depuis `/fr/realisations` (rendu client).

Une page sans lien interne est découverte tardivement et rarement re-crawlée.

**Correctif :** liens `<a href>` descriptifs depuis `/services`, `/spectacles`, `/realisations` et la home.

### 3.8 Métadonnées

| Problème | Exemple | Correctif |
| --- | --- | --- |
| `<html lang="fr">` codé en dur | `/en`, `/es` | Rendre `lang` dynamique |
| Titre dupliqué | `Formulaire de Réclamations \| Angeli Visions \| Angeli Visions` | Retirer le suffixe manuel |
| Titre avec espace initial | ` SailGP 2025 - Geneva – Angeli Visions \| Angeli Visions` | Idem |
| hreflang absents | pages projet | Ajouter les 3 langues + `x-default` |
| hreflang faux | pages artistes → renvoient vers les accueils | Corriger |
| `x-default` absent | tout le site | Ajouter |
| Deux `Organization` JSON-LD | root layout + `[lang]/layout.tsx` | Fusionner |
| Aucun `H1` | `/fr`, `/en`, `/es`, `/fr/realisations` | Ajouter un H1 serveur |

### 3.9 Anciennes URL WordPress

Les URL historiques suivantes génèrent encore des impressions dans la propriété www, mais renvoient aujourd'hui **200 avec la page d'accueil** (soft 404) ou 404 :

| Ancienne URL | Impressions 16 mois | Position moy. | État actuel | Redirection recommandée |
| --- | --- | --- | --- | --- |
| `/comment-trouver-un-editeur-de-musique-quand-ont-est-artiste/` | 141 | 49,9 | 200 soft-404 | Recréer l'article (ou 301 vers un article équivalent) |
| `/mastering-analogique-professionnel/` | 97 | 35,8 | 200 soft-404 | Recréer une page service / article |
| `/services/` | 104 | 5,2 | 200 soft-404 | 301 → `/fr/services` |
| `/actualites/` | 62 | 7,4 | 200 soft-404 | 301 → `/fr/realisations` ou futur blog |
| `/shop/` | 61 | 5,7 | 200 soft-404 | 301 → `/fr/spectacles` ou `/fr/devis` |
| `/le-catalogue/` | 60 | 3,9 | 200 soft-404 | 301 → `/fr/spectacles` |
| `/white-paper/` | 41 | 13,1 | 200 soft-404 | 301 → `/fr/realisations` |
| `/mixage-professionnel-musique/` | 37 | 81,2 | 200 soft-404 | Recréer une page service |
| `/contacts/` | 33 | 3,5 | 200 soft-404 | 301 → `/fr/contacts` |
| `/artists/danidelcomte` | 18 | 9,7 | 404 | 301 → `/fr/spectacles` |
| `/produit/all-star-music-producer` | 21 | 4,3 | 404 | 301 → `/fr/spectacles` |
| `/produit/fame-producer/` | 28 | 15,4 | 404 | 301 → `/fr/spectacles` |
| `/produit/nft-music-producer/` | 29 | 56,5 | 404 | 301 → `/fr/spectacles` |
| `/categorie-produit/nft/` | 59 | 21,2 | 404 | 301 → `/fr/realisations` |

### 3.10 Pages utilitaires

- `/fr/newsletter/preferences` : page de gestion d'abonnement, aucune valeur de recherche → `noindex` + retirer du sitemap.
- `/fr/reclamations` : formulaire légal, très fin → `noindex` + retirer du sitemap (ou enrichir).
- `/fr/devis` : page commerciale, à conserver mais à enrichir (process, garanties, FAQ, témoignages).
- `/fr/contacts` : la page existe (`app/[lang]/contacts/page.tsx`) mais `next.config.mjs` la redirige vers `/{lang}#contact`. C'est une occasion manquée pour les requêtes « contact agence événementielle ».

---

## 4. Plan d'action priorisé

### P0 — cette semaine (technique, fort impact, risque faible)

| # | Action | Fichier(s) | Effet attendu |
| --- | --- | --- | --- |
| 1 | Valider `lang` et `notFound()` si invalide | `app/[lang]/page.tsx` | Supprime les soft 404 sur toutes les URL à un segment |
| 2 | Passer `/` en redirection permanente 308 | `app/page.tsx` | Consolide l'accueil sur `/fr` |
| 3 | Retirer `alternates` du root layout | `app/layout.tsx` | Corrige les canonical/hreflang hérités |
| 4 | Déplacer le canonical de `services/layout.tsx` vers le hub et les détails | `app/[lang]/services/layout.tsx`, `page.tsx`, `[serviceId]/page.tsx` | Réintègre les 12 pages service |
| 5 | Ajouter `generateMetadata` aux pages artistes | `app/[lang]/[slug]/page.tsx` | Titre, description, canonical, hreflang, OG |
| 6 | Rendre `<html lang>` dynamique | `app/layout.tsx` + middleware ou client | Signale la bonne langue à Google |
| 7 | Corriger les titres dupliqués | pages `reclamations`, `projet/[slug]` | Évite `\| Angeli Visions \| Angeli Visions` |
| 8 | Rendre le H1 de la home côté serveur | `components/hero-section.tsx` | H1 présent dans le HTML |
| 9 | Sitemap = URL canoniques uniquement | `app/sitemap.ts` | Supprime les contradictions |
| 10 | Ajouter les 301 des anciennes URL | `next.config.mjs` | Récupère le capital des URL historiques |

### P1 — 2 à 4 semaines (contenu et maillage)

| # | Action | Fichier(s) | Effet attendu |
| --- | --- | --- | --- |
| 11 | Charger les données de la home côté serveur | `app/[lang]/page.tsx`, sections | Contenu dans le HTML |
| 12 | Rendre `/realisations` côté serveur | `app/[lang]/realisations/page.tsx` | H1 + projets indexables |
| 13 | Remplacer `onClick` par des `<a href>` | `ServicesClient`, `ArtistsCatalogue`, `realisations` | Pages service/artiste/projet découvrables |
| 14 | Enrichir les pages fines | home, `/services`, `/realisations`, `/devis` | Passe les seuils de qualité |
| 15 | Recréer les contenus historiques | blog / pages service | Récupère 200+ impressions/mois |
| 16 | Ajouter les données structurées | `Service`, `BreadcrumbList`, `Person`, `VideoObject` | Rich results |
| 17 | Supprimer la redirection `/contacts` et enrichir la page | `next.config.mjs`, `app/[lang]/contacts/page.tsx` | Page contact indexable |

### P2 — continu

| # | Action | Effet attendu |
| --- | --- | --- |
| 18 | Stratégie de contenu (1 à 2 articles/mois) | Autorité thématique |
| 19 | Backlinks, Google Business Profile, réseaux | Autorité |
| 20 | Suivi GSC hebdomadaire + `seo-ping status` | Détection des régressions |

---

## 5. Pages à supprimer / désindexer / rediriger

### À désindexer (`noindex` + retrait du sitemap)

- `/{lang}/newsletter/preferences` (3 URL)
- `/{lang}/reclamations` (3 URL)

### À rediriger en 301

| Source | Destination |
| --- | --- |
| `/{lang}/captation-video-streaming-live-podcast` | `/{lang}/services` |
| `/{lang}/label-de-musique` | `/{lang}/spectacles` |
| `/services/` | `/fr/services` |
| `/le-catalogue/` | `/fr/spectacles` |
| `/shop/` | `/fr/spectacles` |
| `/actualites/` | `/fr/realisations` |
| `/white-paper/` | `/fr/realisations` |
| `/contacts/` | `/fr/contacts` |
| `/artists/danidelcomte` | `/fr/spectacles` |
| `/produit/*` | `/fr/spectacles` |
| `/categorie-produit/nft/` | `/fr/realisations` |
| `/mastering-analogique-professionnel/` | à recréer, sinon `/fr/services/streaming-live` |
| `/mixage-professionnel-musique/` | à recréer, sinon `/fr/services/captation-video` |

### À conserver et optimiser

- `/{lang}/services/{id}` (4 × 3) : canonical self, lien depuis le hub.
- `/{lang}/{artist-slug}` (3 × 3) : metadata + contenu + lien depuis `/spectacles`.
- `/{lang}/projet/{slug}` : hreflang + breadcrumbs + lien depuis `/realisations`.
- `/{lang}/devis` : enrichir.
- `/{lang}/contacts` : réactiver.
- `/easy-ip-switch` : conserver (4 clics / 23 impressions), mais c'est un produit distinct ; à terme, envisager un site dédié si le trafic grandit.

---

## 6. Suivi

Après déploiement des correctifs P0 :

1. Dans GSC, utiliser **Inspection de l'URL** puis **Demander une indexation** pour les 10 URL prioritaires :
   - `/fr`, `/en`, `/fr/services`, `/fr/services/captation-video`, `/fr/services/streaming-live`, `/fr/services/podcast`, `/fr/spectacles`, `/fr/la-comedie-des-illusions`, `/fr/realisations`, `/fr/devis`.
2. Relancer `node scripts/seo-ping.mjs status` pour vérifier le sitemap.
3. Relancer l'audit API (script `gsc-audit.mjs`) à J+7 et J+30.
4. Surveiller :
   - le nombre d'URL « Envoyée et indexée » (objectif : > 50) ;
   - la disparition des « Google ne reconnaît pas cette URL » ;
   - les impressions sur les requêtes non-marque.

---

## 7. Conclusion

Le site n'a pas un problème de « pénalité » : il a un problème de **signaux contradictoires** et de **contenu absent du HTML**. Les trois quarts des pertes sont réparables sans créer de contenu :

1. une seule canonical par page ;
2. un sitemap qui ne liste que ces canonicals ;
3. des redirections 301 au lieu de soft 404 ;
4. du contenu rendu côté serveur et maillé par des liens `<a>`.

Les 12 pages service et les 9 pages artistes sont les actifs les plus rentables à récupérer. Les anciennes URL WordPress (mastering, mixage, blog) représentent le principal gisement de trafic nouveau.

---

## 8. P0 implémenté et vérifié (2026-11-09)

Vérifications effectuées sur un build de production local (`next start`), puis en production après déploiement (release `20261109-164416`) :

| Contrôle | Résultat |
| --- | --- |
| `/` | 308 → `/fr` |
| `/services`, `/mastering-analogique-professionnel` | 308 → `/fr/services` |
| `/{lang}/captation-video-streaming-live-podcast` | 308 → `/{lang}/services` |
| `/{lang}/label-de-musique` | 308 → `/{lang}/spectacles` |
| Canonicals services / artistes / spectacles | self, avec hreflang + `x-default` |
| `/fr/services/spectacles` | canonical → `/fr/spectacles` |
| `/{lang}/newsletter/preferences`, `/{lang}/reclamations` | `noindex, follow` |
| `/fr`, `/fr/contacts`, `/fr/devis`, `/fr/realisations` | H1 présent dans le HTML initial |
| H1 `/en` et `/es` | connecteur localisé (`for` / `para`) |
| `sitemap.xml` | 58 URL, sans newsletter/reclamations/ancienne URL longue, avec `/{lang}/services` et `/{lang}/contacts` |

Déploiement : release `20261109-164416`. Sitemap soumis à Google Search Console
(58 URL, 0 erreur, 0 avertissement) et 58 URL signalées à IndexNow.

### Points laissés en P1

- Les pages `/en/services` et `/es/spectacles` affichent encore du contenu français
  (`Notre Expertise`, `Catalogue de spectacles`) : le hreflang pointe vers des
  traductions incomplètes.
- L'attribut `<html lang>` est corrigé côté client (`HtmlLang`) après hydratation ;
  le HTML initial reste `lang="fr"`. Une correction dans le HTML initial
  demanderait de rendre le layout racine dynamique ou de déplacer les layouts.
- `/easy-ip-switch` reste dans le sitemap alors que c'est un produit distinct.
