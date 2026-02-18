import type { Metadata } from "next"
import type React from "react"
import { LOCALES, type Locale } from "@/lib/i18n/locales"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

const META: Record<Locale, { title: string; description: string }> = {
    fr: {
        title: "Nos Réalisations",
        description:
            "Découvrez nos événements, productions musicales et spectacles audiovisuels. Festivals, événements d'entreprise, soirées privées.",
    },
    en: {
        title: "Our Portfolio",
        description:
            "Discover our events, music productions and audiovisual shows. Festivals, corporate events, private parties.",
    },
    es: {
        title: "Nuestro Portafolio",
        description:
            "Descubra nuestros eventos, producciones musicales y espectáculos audiovisuales. Festivales, eventos corporativos, fiestas privadas.",
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
        alternates[l] = `${BASE_URL}/${l}/realisations`
    })

    return {
        title: meta.title,
        description: meta.description,
        alternates: {
            canonical: `${BASE_URL}/${locale}/realisations`,
            languages: alternates,
        },
    }
}

export default function RealisationsLayout({ children }: { children: React.ReactNode }) {
    return children
}
