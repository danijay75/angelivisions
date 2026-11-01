#!/usr/bin/env node
/**
 * Signalement SEO après déploiement.
 *
 *   node scripts/seo-ping.mjs            # IndexNow + Search Console si configuré
 *   node scripts/seo-ping.mjs indexnow   # IndexNow seulement
 *   node scripts/seo-ping.mjs gsc        # Search Console seulement
 *
 * IndexNow prévient Bing, Yandex, Seznam et Naver en quelques secondes.
 * Google n'utilise pas IndexNow : la soumission passe par l'API Search Console,
 * qui exige un compte de service (voir .agent/gsc-service-account.example.json).
 *
 * Le script ne fait jamais échouer un déploiement : il sort en code 0 même en
 * cas d'erreur réseau, et se contente d'afficher un avertissement.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { createSign } from "node:crypto"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const SITE = process.env.SITE_URL || "https://angelivisions.com"
const SITEMAP_URL = `${SITE}/sitemap.xml`

const mode = process.argv[2] || "all"

function warn(message) {
    console.warn(`[seo] ${message}`)
}

function info(message) {
    console.log(`[seo] ${message}`)
}

async function fetchSitemapUrls() {
    const res = await fetch(SITEMAP_URL, { headers: { "user-agent": "angelivisions-seo-ping" } })
    if (!res.ok) throw new Error(`sitemap ${res.status}`)
    const xml = await res.text()
    const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1])
    if (urls.length === 0) throw new Error("sitemap vide")
    return urls
}

/** IndexNow : une requête suffit, 10 000 URL maximum par appel. */
async function runIndexNow() {
    // La clé vit dans public/<clé>.txt : c'est ce fichier qu'IndexNow vérifie.
    let key = process.env.INDEXNOW_KEY
    if (!key) {
        const keyFile = readdirSync(join(ROOT, "public")).find((name) => /^[a-f0-9]{32}\.txt$/.test(name))
        if (!keyFile) {
            warn("aucune cle IndexNow dans public/, étape ignorée")
            return
        }
        key = keyFile.replace(/\.txt$/, "")
    }
    const host = new URL(SITE).host

    let urlList
    try {
        urlList = await fetchSitemapUrls()
    } catch (error) {
        warn(`sitemap illisible (${error.message}), étape IndexNow ignorée`)
        return
    }

    const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({
            host,
            key,
            keyLocation: `${SITE}/${key}.txt`,
            urlList: urlList.slice(0, 10000),
        }),
    })

    // 200 = accepté, 202 = accepté avec clé encore en cours de validation.
    if (res.ok || res.status === 202) {
        info(`IndexNow : ${urlList.length} URL signalées (HTTP ${res.status})`)
    } else {
        warn(`IndexNow a répondu ${res.status} ${res.statusText}`)
    }
}

function base64url(input) {
    return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/**
 * Jeton d'accès Google via JWT signé par la clé du compte de service.
 * Évite d'ajouter googleapis en dépendance pour un seul appel.
 */
async function getGoogleAccessToken(credentials) {
    const now = Math.floor(Date.now() / 1000)
    const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
    const claims = base64url(
        JSON.stringify({
            iss: credentials.client_email,
            scope: "https://www.googleapis.com/auth/webmasters",
            aud: "https://oauth2.googleapis.com/token",
            iat: now,
            exp: now + 3600,
        }),
    )
    const signature = createSign("RSA-SHA256")
        .update(`${header}.${claims}`)
        .sign(credentials.private_key)
    const assertion = `${header}.${claims}.${base64url(signature)}`

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion,
        }),
    })
    if (!res.ok) throw new Error(`jeton Google refusé (${res.status})`)
    return (await res.json()).access_token
}

/** Propriétés Search Console visibles par le compte de service. */
async function fetchProperties(token) {
    const res = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
        headers: { authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error(`liste des propriétés indisponible (${res.status})`)
    const { siteEntry = [] } = await res.json()
    return siteEntry
}

/**
 * Choisit la propriété qui correspond au site, que Search Console la déclare
 * en propriété de domaine (`sc-domain:`) ou en préfixe d'URL (`https://…/`).
 * GSC_PROPERTY permet de forcer un choix explicite.
 */
function pickProperty(properties, host) {
    if (process.env.GSC_PROPERTY) return process.env.GSC_PROPERTY

    const bare = host.replace(/^www\./, "")
    const candidates = [
        `sc-domain:${bare}`,
        `https://${bare}/`,
        `http://${bare}/`,
        `https://www.${bare}/`,
    ]
    for (const candidate of candidates) {
        const match = properties.find((p) => p.siteUrl === candidate)
        if (match) return match.siteUrl
    }
    return null
}

/** Search Console : PUT sitemaps/submit, idempotent. */
async function runSearchConsole() {
    const path = process.env.GSC_CREDENTIALS_PATH || join(ROOT, ".agent", "gsc-service-account.json")
    if (!existsSync(path)) {
        warn(`identifiants Search Console absents (${path}), étape ignorée`)
        warn("voir .agent/gsc-service-account.example.json pour activer la soumission automatique")
        return
    }

    const credentials = JSON.parse(readFileSync(path, "utf8"))
    const host = new URL(SITE).host
    const token = await getGoogleAccessToken(credentials)
    const properties = await fetchProperties(token)

    if (properties.length === 0) {
        warn("le compte de service ne voit aucune propriété Search Console")
        warn(
            `ajoute ${credentials.client_email} comme utilisateur dans Search Console ` +
                `(Paramètres > Utilisateurs et autorisations)`,
        )
        return
    }

    const property = pickProperty(properties, host)
    if (!property) {
        warn(`aucune propriété Search Console ne correspond à ${host}`)
        info("propriétés accessibles :")
        for (const site of properties) info(`  ${site.siteUrl} (${site.permissionLevel})`)
        return
    }

    const endpoint =
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}` +
        `/sitemaps/${encodeURIComponent(SITEMAP_URL)}`

    const res = await fetch(endpoint, {
        method: "PUT",
        headers: { authorization: `Bearer ${token}` },
    })

    if (res.ok) {
        info(`Search Console : sitemap soumis pour ${property}`)
        return
    }

    // 403 : le compte de service est authentifié mais n'a pas les droits requis.
    if (res.status === 403) {
        warn(`droits insuffisants sur ${property}`)
        warn(
            `passe ${credentials.client_email} en « Propriétaire » dans Search Console > ` +
                `Paramètres > Utilisateurs et autorisations`,
        )
        return
    }

    warn(`Search Console a répondu ${res.status} : ${(await res.text()).slice(0, 300)}`)
}

const steps = {
    indexnow: runIndexNow,
    gsc: runSearchConsole,
}

const selected = mode === "all" ? ["indexnow", "gsc"] : [mode]

for (const name of selected) {
    const step = steps[name]
    if (!step) {
        warn(`étape inconnue : ${name}`)
        continue
    }
    try {
        await step()
    } catch (error) {
        warn(`${name} a échoué : ${error.message}`)
    }
}

process.exit(0)
