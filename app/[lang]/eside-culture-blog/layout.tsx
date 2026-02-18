import type { Metadata } from "next"
import type React from "react"
import { LOCALES, type Locale } from "@/lib/i18n/locales"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

const META: Record<Locale, { title: string; description: string }> = {
    fr: {
        title: "Blog — Eside Culture",
        description:
            "Actualités, tendances et conseils dans l'événementiel et la production musicale. Le blog d'Angeli Visions.",
    },
    en: {
        title: "Blog — Eside Culture",
        description:
            "News, trends and tips in events and music production. The Angeli Visions blog.",
    },
    es: {
        title: "Blog — Eside Culture",
        description:
            "Noticias, tendencias y consejos en eventos y producción musical. El blog de Angeli Visions.",
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
        alternates[l] = `${BASE_URL}/${l}/eside-culture-blog`
    })

    return {
        title: meta.title,
        description: meta.description,
        alternates: {
            canonical: `${BASE_URL}/${locale}/eside-culture-blog`,
            languages: alternates,
        },
    }
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children
}
