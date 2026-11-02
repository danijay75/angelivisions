import { MetadataRoute } from 'next'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { LOCALES } from '@/lib/i18n/locales'
import { LOCALIZED_SLUGS } from '@/lib/i18n/routes'
import { projects as fallbackProjects } from '@/data/projects'
import { defaultServices as fallbackServices } from '@/data/services'
import { Redis } from "@upstash/redis"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://angelivisions.com'

/**
 * Dates réelles de dernière modification, calculées depuis git par
 * scripts/build-lastmod.mjs et embarquées au déploiement.
 * Google n'honore `lastmod` que s'il est crédible : mieux vaut l'omettre que
 * dater toutes les pages à l'heure du build.
 */
type LastmodDates = {
    static?: Record<string, string>
    mission?: Record<string, string>
}

function readLastmodDates(): LastmodDates {
    try {
        return JSON.parse(readFileSync(join(process.cwd(), 'data', 'sitemap-lastmod.json'), 'utf8'))
    } catch {
        // Fichier absent (dev local) : on n'annonce simplement aucune date.
        return {}
    }
}

const LASTMOD = readLastmodDates()

function lastModifiedFor(value?: string): Date | undefined {
    return value ? new Date(value) : undefined
}

/**
 * Les services et les projets sont édités depuis l'admin et stockés dans Redis :
 * la base fait foi, les fichiers statiques ne servent que de secours si Redis
 * est injoignable. Sans cela le sitemap annonce des pages supprimées (404).
 */
function readList(data: unknown): any[] | null {
    if (!data) return null
    if (typeof data === "string") {
        try {
            const parsed = JSON.parse(data)
            return Array.isArray(parsed) ? parsed : null
        } catch {
            return null
        }
    }
    if (typeof data === "object" && Array.isArray(data)) return data
    return null
}

async function getServices() {
    try {
        const redis = new Redis({
            url: process.env.KV_REST_API_URL || "",
            token: process.env.KV_REST_API_TOKEN || "",
        })
        const services = readList(await redis.get("av_services_v1"))
        if (services) return services
    } catch (e) {
        console.error("Sitemap: Failed to fetch services from Redis")
    }
    return fallbackServices
}

async function getProjects() {
    try {
        const redis = new Redis({
            url: process.env.KV_REST_API_URL || "",
            token: process.env.KV_REST_API_TOKEN || "",
        })
        const projects = readList(await redis.get("projects"))
        if (projects) return projects
    } catch (e) {
        console.error("Sitemap: Failed to fetch projects from Redis")
    }
    return fallbackProjects
}

async function getArtists() {
    try {
        const redis = new Redis({
            url: process.env.KV_REST_API_URL || "",
            token: process.env.KV_REST_API_TOKEN || "",
        })
        const artists = readList(await redis.get("artists"))
        if (artists) return artists
    } catch (e) {
        console.error("Sitemap: Failed to fetch artists from Redis")
    }
    return []
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes: MetadataRoute.Sitemap = []

    // Fetch dynamic content
    const [rawServices, projectList, artists] = await Promise.all([
        getServices(),
        getProjects(),
        getArtists()
    ])
    // Ids retirés de l'offre : ils ne doivent jamais être annoncés.
    const HIDDEN_SERVICE_IDS = ["sport", "booking"]
    const services = rawServices.filter((s: any) => s && !HIDDEN_SERVICE_IDS.includes(s.id))

    // Pages statiques réellement servies en 200 (pas de redirection, pas de 404).
    const staticRoutes = [
        '',
        '/captation-video-streaming-live-podcast',
        '/realisations',
        '/devis',
        '/reclamations',
        '/mentions-legales',
        '/politique-confidentialite',
        '/politique-cookies',
        '/newsletter/preferences',
    ]

    // Landing page de l'application Easy IP-Switch (URL non localisée).
    routes.push({
        url: `${BASE_URL}/easy-ip-switch`,
        changeFrequency: 'monthly',
        priority: 0.9,
    })

    LOCALES.forEach((lang) => {
        // Static pages — date du dernier commit touchant leur contenu
        staticRoutes.forEach((route) => {
            routes.push({
                url: `${BASE_URL}/${lang}${route}`,
                lastModified: lastModifiedFor(LASTMOD.static?.[route]),
                changeFrequency: route === '' ? 'daily' : 'weekly',
                priority: route === '' ? 1.0 : 0.8,
            })
        })

        // Mission page (localized slug, un fichier de contenu par langue)
        routes.push({
            url: `${BASE_URL}/${lang}/${LOCALIZED_SLUGS.mission[lang]}`,
            lastModified: lastModifiedFor(LASTMOD.mission?.[lang]),
            changeFrequency: 'monthly',
            priority: 0.8,
        })

        // Projects : la fraîcheur vit dans Redis (éditée depuis l'admin),
        // aucune date fiable à annoncer ici.
        projectList.forEach((project: any) => {
            if (!project?.slug) return
            routes.push({
                url: `${BASE_URL}/${lang}/projet/${project.slug}`,
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        })

        // Artists (Dynamic)
        artists.forEach((artist: any) => {
            if (!artist?.slug) return
            routes.push({
                url: `${BASE_URL}/${lang}/${artist.slug}`,
                changeFrequency: 'weekly',
                priority: 0.6,
            })
        })

        // Services (Dynamic) — une seule URL par service, sans doublon.
        const seenServicePaths = new Set<string>()
        services.forEach((service: any) => {
            if (!service?.id) return
            // « spectacles » et son ancien alias « label-de-musique » partagent
            // la même page publique : on ne l'annonce qu'une fois.
            const isTopLevel = service.id === "spectacles" || service.id === "label-de-musique"
            const urlPath = isTopLevel ? `/spectacles` : `/services/${service.id}`
            if (seenServicePaths.has(urlPath)) return
            seenServicePaths.add(urlPath)
            routes.push({
                url: `${BASE_URL}/${lang}${urlPath}`,
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        })
    })

    return routes
}
