import type React from "react"
import type { Metadata } from "next"
import "./globals.css"


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
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 antialiased">

        {children}
      </body>
    </html>
  )
}
