#!/usr/bin/env node
/**
 * Génère data/sitemap-lastmod.json : la date de dernière modification réelle
 * de chaque page du sitemap, lue dans l'historique git.
 *
 * Pourquoi : Google n'utilise `lastmod` que s'il le juge fiable. Un sitemap qui
 * date toutes les pages à l'heure du build lui apprend le contraire, et il finit
 * par ignorer le champ. On donne donc à chaque page la date de son dernier
 * commit, et rien du tout pour les contenus dynamiques (projets, services,
 * artistes) dont la fraîcheur vit dans Redis.
 *
 * Lancé par .agent/deploy.ps1 avant l'archive. Le fichier produit est ignoré
 * par git : il est recalculé à chaque déploiement.
 *
 *   node scripts/build-lastmod.mjs
 */
import { execFileSync } from "node:child_process"
import { writeFileSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const OUTPUT = join(ROOT, "data", "sitemap-lastmod.json")

/**
 * Une entrée par page statique. Seuls les fichiers qui portent réellement le
 * contenu de la page comptent : la navigation et le footer sont partagés par
 * tout le site et dateraient artificiellement chaque page à chaque retouche.
 */
const STATIC_ROUTES = {
    "": ["app/[lang]/page.tsx", "components/hero-section.tsx"],
    "/services": [
        "app/[lang]/services/page.tsx",
        "app/[lang]/services/ServicesClient.tsx",
        "data/services.ts",
    ],
    "/realisations": ["app/[lang]/realisations/page.tsx"],
    "/devis": ["app/[lang]/devis/page.tsx", "components/devis-form.tsx"],
    "/contacts": ["app/[lang]/contacts/page.tsx", "components/contact-section.tsx"],
    // Pages légales : un slug par langue, un fichier de contenu par langue.
    "/mentions-legales": [
        "app/[lang]/mentions-legales/page.tsx",
        "components/legal/legal-notice-page.tsx",
        "components/reclamations-form.tsx",
        "data/legal-content-fr.ts",
    ],
    "/legal-notice": [
        "app/[lang]/legal-notice/page.tsx",
        "components/legal/legal-notice-page.tsx",
        "components/reclamations-form.tsx",
        "data/legal-content-en.ts",
    ],
    "/aviso-legal": [
        "app/[lang]/aviso-legal/page.tsx",
        "components/legal/legal-notice-page.tsx",
        "components/reclamations-form.tsx",
        "data/legal-content-es.ts",
    ],
    "/politique-confidentialite": [
        "app/[lang]/politique-confidentialite/page.tsx",
        "components/legal/privacy-policy-page.tsx",
        "components/dpd-contact-form.tsx",
        "data/legal-content-fr.ts",
    ],
    "/privacy-policy": [
        "app/[lang]/privacy-policy/page.tsx",
        "components/legal/privacy-policy-page.tsx",
        "components/dpd-contact-form.tsx",
        "data/legal-content-en.ts",
    ],
    "/politica-de-privacidad": [
        "app/[lang]/politica-de-privacidad/page.tsx",
        "components/legal/privacy-policy-page.tsx",
        "components/dpd-contact-form.tsx",
        "data/legal-content-es.ts",
    ],
    "/politique-cookies": [
        "app/[lang]/politique-cookies/page.tsx",
        "components/legal/cookie-policy-page.tsx",
        "components/legal/verify-cookie-button.tsx",
        "data/legal-content-fr.ts",
    ],
    "/cookie-policy": [
        "app/[lang]/cookie-policy/page.tsx",
        "components/legal/cookie-policy-page.tsx",
        "components/legal/verify-cookie-button.tsx",
        "data/legal-content-en.ts",
    ],
    "/politica-de-cookies": [
        "app/[lang]/politica-de-cookies/page.tsx",
        "components/legal/cookie-policy-page.tsx",
        "components/legal/verify-cookie-button.tsx",
        "data/legal-content-es.ts",
    ],
}

/** La page mission a un contenu par langue, dans son propre fichier. */
const MISSION_ROUTES = {
    fr: ["data/notre-mission.ts", "components/mission-page.tsx"],
    en: ["data/our-mission.ts", "components/mission-page.tsx"],
    es: ["data/nuestra-mision.ts", "components/mission-page.tsx"],
}

/** Date du dernier commit touchant le fichier, en ISO court (AAAA-MM-JJ). */
function lastCommitDate(file) {
    try {
        const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {
            cwd: ROOT,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"],
        }).trim()
        return out || null
    } catch {
        return null
    }
}

/** La date la plus récente parmi plusieurs fichiers. */
function newest(files) {
    let best = null
    for (const file of files) {
        const date = lastCommitDate(file)
        if (date && (!best || date > best)) best = date
    }
    return best
}

const staticDates = {}
for (const [route, files] of Object.entries(STATIC_ROUTES)) {
    const date = newest(files)
    if (date) staticDates[route] = date
}

const missionDates = {}
for (const [lang, files] of Object.entries(MISSION_ROUTES)) {
    const date = newest(files)
    if (date) missionDates[lang] = date
}

const payload = {
    generatedAt: new Date().toISOString(),
    static: staticDates,
    mission: missionDates,
}

mkdirSync(dirname(OUTPUT), { recursive: true })
writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8")

const count = Object.keys(staticDates).length + Object.keys(missionDates).length
console.log(`[lastmod] ${count} date(s) ecrite(s) dans data/sitemap-lastmod.json`)
