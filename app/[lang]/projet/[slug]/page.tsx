import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { projects, type Project } from "@/data/projects"
import ProjectPageClient from "@/components/project-page-client"

const LOCALES = ["fr", "en", "es"] as const
type Locale = (typeof LOCALES)[number]

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const project = projects.find((p) => p.slug === resolvedParams.slug)
  const title = project ? `${project.title} – Angeli Visions` : "Projet introuvable – Angeli Visions"
  const description =
    project?.description ?? "Détails d’un projet réalisé par Angeli Visions: production musicale, événements et plus."
  const image = project?.image ?? "/placeholder.svg?height=630&width=1200"
  const url = `/${resolvedParams.lang}/projet/${resolvedParams.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      url,
      type: "article",
    },
    alternates: { canonical: url },
  }
}

export default async function LocalizedProjectPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>
}) {
  const resolvedParams = await params
  const project = projects.find((p) => p.slug === resolvedParams.slug) as Project | undefined
  if (!project) {
    return notFound()
  }
  return <ProjectPageClient project={project} />
}
