import type { Metadata } from "next"
import ProjectDetailPageClient from "./ProjectDetailPageClient"
import type { Locale } from "@/lib/i18n/locales"

interface Props {
    params: Promise<{ lang: Locale; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params

    // In a real SEO scenario, we would fetch the project title here.
    // For now, we'll use a generic title or fetch via a server-side util.
    return {
        title: `Projet d'Investissement | Angeli Visions`,
        description: "Découvrez les détails de ce projet culturel et les opportunités d'investissement associées.",
        alternates: {
            canonical: `/${lang}/investir-dans-la-culture/${slug}`,
        },
    }
}

export default async function ProjectPage({ params }: Props) {
    const resolvedParams = await params
    return <ProjectDetailPageClient slug={resolvedParams.slug} />
}
