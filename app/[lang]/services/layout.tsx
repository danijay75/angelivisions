import type { Metadata } from "next"
import type React from "react"
import { LOCALES, type Locale } from "@/lib/i18n/locales"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

const META: Record<Locale, { title: string; description: string }> = {
    fr: {
        title: "Nos Services",
        description:
            "Production musicale, organisation d'événements, DJ booking, murs LED, mapping vidéo et captation média. Tous nos services événementiels.",
    },
    en: {
        title: "Our Services",
        description:
            "Music production, event organization, DJ booking, LED walls, video mapping and media capture. All our event services.",
    },
    es: {
        title: "Nuestros Servicios",
        description:
            "Producción musical, organización de eventos, DJ booking, pantallas LED, video mapping y captura de medios. Todos nuestros servicios.",
    },
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
    const { lang } = await params
    const locale = LOCALES.includes(lang) ? lang : "fr"
    const meta = META[locale]

    const alternates: Record<string, string> = {}
    LOCALES.forEach((l) => {
        alternates[l] = `${BASE_URL}/${l}/services`
    })

    return {
        title: meta.title,
        description: meta.description,
        alternates: {
            canonical: `${BASE_URL}/${locale}/services`,
            languages: alternates,
        },
    }
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children
}
