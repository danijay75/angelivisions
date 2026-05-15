import { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/i18n/locales'
import { projects } from '@/data/projects'
import { defaultServices as fallbackServices } from '@/data/services'
import { Redis } from "@upstash/redis"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://angelivisions.com'

async function getServices() {
    try {
        const redis = new Redis({
            url: process.env.KV_REST_API_URL || "",
            token: process.env.KV_REST_API_TOKEN || "",
        })
        const servicesData = await redis.get("av_services_v1")
        if (servicesData) {
            if (typeof servicesData === "string") return JSON.parse(servicesData)
            if (typeof servicesData === "object" && Array.isArray(servicesData)) return servicesData
        }
    } catch (e) {
        console.error("Sitemap: Failed to fetch services from Redis")
    }
    return fallbackServices
}

async function getArtists() {
    try {
        const redis = new Redis({
            url: process.env.KV_REST_API_URL || "",
            token: process.env.KV_REST_API_TOKEN || "",
        })
        const data = await redis.get("artists")
        if (data) {
            return typeof data === "string" ? JSON.parse(data) : data
        }
    } catch (e) {
        console.error("Sitemap: Failed to fetch artists from Redis")
    }
    return []
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes: MetadataRoute.Sitemap = []
    
    // Fetch dynamic content
    const [rawServices, artists] = await Promise.all([
        getServices(),
        getArtists()
    ])
    const services = rawServices.filter((s: any) => s.id !== "sport")

    // Static routes for each language
    const staticRoutes = [
        '',
        '/services',
        '/realisations',
        '/contacts',
        '/devis',
        '/mentions-legales',
        '/politique-confidentialite',
        '/politique-cookies',
        '/newsletter',
    ]

    LOCALES.forEach((lang) => {
        // Static pages
        staticRoutes.forEach((route) => {
            routes.push({
                url: `${BASE_URL}/${lang}${route}`,
                lastModified: new Date(),
                changeFrequency: route === '' ? 'daily' : 'weekly',
                priority: route === '' ? 1.0 : 0.8,
            })
        })

        // Projects
        projects.forEach((project) => {
            routes.push({
                url: `${BASE_URL}/${lang}/projet/${project.slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        })

        // Artists (Dynamic)
        artists.forEach((artist: any) => {
            routes.push({
                url: `${BASE_URL}/${lang}/${artist.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.6,
            })
        })

        // Services (Dynamic)
        services.forEach((service: any) => {
            routes.push({
                url: `${BASE_URL}/${lang}/services/${service.id}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        })
    })

    return routes
}
