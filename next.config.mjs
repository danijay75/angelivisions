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
                {
                    source: '/:lang/captation-video-streaming-live-podcast',
                    destination: '/:lang/services',
                },
                {
                    source: '/:lang/spectacles',
                    destination: '/:lang/services/spectacles',
                },
                {
                    source: '/:lang/label-de-musique',
                    destination: '/:lang/services/spectacles',
                },
            ],
            fallback: [
                {
                    source: '/uploads/:path*',
                    destination: '/api/uploads/:path*',
                },
            ],
        };
    },
    async redirects() {
        return [
            {
                source: '/author/:path*',
                destination: '/',
                permanent: true,
            },
            {
                source: '/shop',
                destination: '/fr',
                permanent: true,
            },
            {
                source: '/backstage/:path*',
                destination: '/',
                permanent: true,
            },
            {
                source: '/:lang/contacts',
                destination: '/:lang#contact',
                permanent: true,
            },
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
                source: '/contacts',
                destination: '/#contact',
                permanent: true,
            }
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
