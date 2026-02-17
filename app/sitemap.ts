import { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/i18n/locales'
import { projects } from '@/data/projects'
import { defaultPosts as blogPosts } from '@/data/blog'
import { defaultServices as services } from '@/data/services'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://angelivisions.com'

export default function sitemap(): MetadataRoute.Sitemap {
    const routes: MetadataRoute.Sitemap = []

    // Static routes for each language
    const staticRoutes = [
        '',
        '/services',
        '/realisations',
        '/eside-culture-blog',
        '/contacts',
        '/devis',
        '/investir-dans-la-culture',
        '/mentions-legales',
        '/politique-confidentialite',
        '/politique-cookies',
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

        // Blog posts
        blogPosts.forEach((post) => {
            if (post.published !== false) {
                routes.push({
                    url: `${BASE_URL}/${lang}/eside-culture-blog/${post.slug}`,
                    lastModified: new Date(post.date),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                })
            }
        })

        // Services
        services.forEach((service) => {
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
