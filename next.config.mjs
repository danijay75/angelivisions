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
            }
        ];
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
