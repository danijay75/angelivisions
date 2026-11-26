/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
        ];
    },
    async rewrites() {
        return {
            beforeFiles: [
                // /{lang}/spectacles est l'URL canonique : elle réécrit vers
                // la page service « spectacles ».
                {
                    source: '/:lang/spectacles',
                    destination: '/:lang/services/spectacles',
                },
                {
                    source: '/:locale(fr|en|de|es)/av-ip-switch',
                    destination: '/av-ip-switch-page/:locale',
                },
                {
                    source: '/:locale(fr|en|de|es)/av-ip-switch/opengraph-image',
                    destination: '/av-ip-switch-page/:locale/opengraph-image',
                },
                // Les fichiers uploadés via l'admin sont servis dynamiquement
                // par la route API (lecture depuis shared/uploads sur le VPS).
                // Doit être en beforeFiles : en fallback, Next.js tente de
                // servir depuis public/ via le manifeste de build et retourne
                // 404 pour les fichiers uploadés après le dernier déploiement.
                {
                    source: '/uploads/:path*',
                    destination: '/api/uploads/:path*',
                },
            ],
        };
    },
    async redirects() {
        return [
            // Redirections Easy IP-Switch -> AV IP-Switch localisé.
            {
                source: '/easy-ip-switch',
                destination: '/fr/av-ip-switch',
                permanent: true,
            },
            {
                source: '/easy-ip-switch/:locale(fr|en|de|es)',
                destination: '/:locale/av-ip-switch',
                permanent: true,
            },
            {
                source: '/av-ip-switch',
                destination: '/fr/av-ip-switch',
                permanent: true,
            },
            {
                source: '/av-ip-switch/:locale(fr|en|de|es)',
                destination: '/:locale/av-ip-switch',
                permanent: true,
            },
            // Anciennes URL WordPress / erreurs historiques.
            {
                source: '/author/:path*',
                destination: '/',
                permanent: true,
            },
            {
                source: '/backstage/:path*',
                destination: '/',
                permanent: true,
            },
            {
                source: '/shop',
                destination: '/fr/spectacles',
                permanent: true,
            },
            {
                source: '/services',
                destination: '/fr/services',
                permanent: true,
            },
            {
                source: '/le-catalogue',
                destination: '/fr/spectacles',
                permanent: true,
            },
            {
                source: '/actualites',
                destination: '/fr/realisations',
                permanent: true,
            },
            {
                source: '/white-paper',
                destination: '/fr/realisations',
                permanent: true,
            },
            {
                source: '/contacts',
                destination: '/fr/contacts',
                permanent: true,
            },
            {
                source: '/artists',
                destination: '/fr/spectacles',
                permanent: true,
            },
            {
                source: '/artists/:slug*',
                destination: '/fr/spectacles',
                permanent: true,
            },
            {
                source: '/produit/:slug*',
                destination: '/fr/spectacles',
                permanent: true,
            },
            {
                source: '/categorie-produit/:slug*',
                destination: '/fr/realisations',
                permanent: true,
            },
            {
                source: '/etiquette-produit/:slug*',
                destination: '/fr/realisations',
                permanent: true,
            },
            {
                source: '/mastering-analogique-professionnel',
                destination: '/fr/services',
                permanent: true,
            },
            {
                source: '/mixage-professionnel-musique',
                destination: '/fr/services',
                permanent: true,
            },
            {
                source: '/comment-trouver-un-editeur-de-musique-quand-ont-est-artiste',
                destination: '/fr/services',
                permanent: true,
            },

            // Anciennes URL localisées / alias.
            {
                source: '/:lang/a-propos',
                destination: '/:lang/notre-mission',
                permanent: true,
            },
            {
                source: '/:lang/about',
                destination: '/:lang/our-mission',
                permanent: true,
            },
            {
                source: '/:lang/sobre-nosotros',
                destination: '/:lang/nuestra-mision',
                permanent: true,
            },
            {
                source: '/:lang/artists',
                destination: '/:lang/spectacles',
                permanent: true,
            },
            {
                source: '/:lang/actualites',
                destination: '/:lang/realisations',
                permanent: true,
            },
            {
                source: '/:lang/dj-dani-del-comte',
                destination: '/:lang/spectacles',
                permanent: true,
            },
            {
                source: '/:lang/captation-video-streaming-live-podcast',
                destination: '/:lang/services',
                permanent: true,
            },
            {
                source: '/:lang/label-de-musique',
                destination: '/:lang/spectacles',
                permanent: true,
            },
        ];
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
};

export default nextConfig;
