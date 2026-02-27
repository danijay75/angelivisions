import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })


const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Angeli Visions — Organisateur d'événements & Maison de disque",
    template: "%s | Angeli Visions",
  },
  description:
    "Angeli Visions est un organisateur d'événements et maison de disque spécialisé dans la production musicale, l'organisation événementielle et les expériences immersives.",
  keywords: [
    "organisateur événements",
    "maison de disque",
    "production musicale",
    "DJ",
    "événementiel",
    "festival",
    "LED walls",
    "mapping vidéo",
    "Angeli Visions",
  ],
  authors: [{ name: "Angeli Visions" }],
  creator: "Angeli Visions",
  openGraph: {
    type: "website",
    siteName: "Angeli Visions",
    title: "Angeli Visions — Organisateur d'événements & Maison de disque",
    description:
      "Production musicale, organisation événementielle, DJ booking et expériences immersives.",
    url: BASE_URL,
    locale: "fr_FR",
    alternateLocale: ["en_US", "es_ES"],
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Angeli Visions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Angeli Visions — Organisateur d'événements & Maison de disque",
    description:
      "Production musicale, organisation événementielle, DJ booking et expériences immersives.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      fr: `${BASE_URL}/fr`,
      en: `${BASE_URL}/en`,
      es: `${BASE_URL}/es`,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-950 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${BASE_URL}/#organization`,
                  name: "Angeli Visions",
                  url: BASE_URL,
                  logo: {
                    "@type": "ImageObject",
                    url: `${BASE_URL}/apple-icon.png`,
                    width: 180,
                    height: 180,
                  },
                  description:
                    "Angeli Visions est un organisateur d'événements et maison de disque spécialisé dans la production musicale, l'organisation événementielle et les expériences immersives.",
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "FR",
                  },
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+33-6-63-79-67-42",
                    contactType: "customer service",
                    email: "contact@angelivisions.com",
                  },
                  sameAs: [
                    "https://facebook.com/angelivisions",
                    "https://instagram.com/angelivisions",
                    "https://tiktok.com/@angelivisions",
                    "https://x.com/angelivisions",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${BASE_URL}/#website`,
                  url: BASE_URL,
                  name: "Angeli Visions",
                  publisher: {
                    "@id": `${BASE_URL}/#organization`,
                  },
                },
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  )
}
