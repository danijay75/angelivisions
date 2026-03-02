import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Project } from "@/data/projects"
import ProjectPageClient from "@/components/project-page-client"
import { Redis } from "@upstash/redis"

export const dynamic = "force-dynamic"

const LOCALES = ["fr", "en", "es"] as const
type Locale = (typeof LOCALES)[number]

let redis: Redis | null = null
try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }
} catch (error) {
  console.error("Redis initialization failed:", error)
}

async function getProject(slug: string): Promise<Project | undefined> {
  if (!redis) return undefined
  try {
    const data = await redis.get("projects")
    let projects: Project[] = []

    if (data && typeof data === "string") {
      projects = JSON.parse(data)
    } else if (data && typeof data === "object") {
      projects = Array.isArray(data) ? data : []
    }

    return projects.find((p) => p.slug === slug)
  } catch (error) {
    console.error("Failed to fetch projects for project page:", error)
    return undefined
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const project = await getProject(resolvedParams.slug)
  const title = project ? `${project.title} – Angeli Visions` : "Projet introuvable – Angeli Visions"
  // Nettoyage des balises HTML pour la balise meta description
  const cleanDescription = project?.description
    ? project.description.replace(/<[^>]*>?/gm, '')
    : "Détails d’un projet réalisé par Angeli Visions: production musicale, événements et plus."

  const image = project?.image ?? "/placeholder.svg?height=630&width=1200"
  const url = `/${resolvedParams.lang}/projet/${resolvedParams.slug}`

  return {
    title,
    description: cleanDescription,
    openGraph: {
      title,
      description: cleanDescription,
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
  const project = await getProject(resolvedParams.slug)

  if (!project) {
    return notFound()
  }
  return <ProjectPageClient project={project} />
}
