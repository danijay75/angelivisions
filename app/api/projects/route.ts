import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

let redis: Redis | null = null

try {
  redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
} catch (error) {
  console.error("[v0] Redis initialization failed:", error)
}

export interface Project {
  id: number
  title: string
  slug: string
  category: string
  image: string
  gallery: string[]
  description: string
  fullDescription: string
  services: string[]
  client: string
  date: string
  guests: string
  location: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  label: string
  description?: string
  color: string
  projectCount: number
}

const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "Mariage de Luxe - Château de Versailles",
    slug: "mariage-chateau-versailles",
    category: "wedding",
    image: "/elegant-wedding-ceremony.png",
    gallery: ["/elegant-wedding-reception.png", "/wedding-dance-floor.jpg", "/elegant-wedding-decor.png"],
    description: "Un mariage d'exception dans les jardins du château avec sonorisation premium et éclairage féerique.",
    fullDescription:
      "Organisation complète d'un mariage de prestige avec sonorisation haute qualité, éclairage d'ambiance, DJ professionnel et coordination technique parfaite pour une journée inoubliable.",
    services: ["Sonorisation", "Éclairage", "DJ", "Coordination technique"],
    client: "M. et Mme Dubois",
    date: "Juin 2024",
    guests: "150 invités",
    location: "Château de Versailles",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Événement Corporate - Lancement Produit",
    slug: "evenement-corporate-lancement",
    category: "corporate",
    image: "/corporate-event-stage.jpg",
    gallery: ["/corporate-presentation.jpg", "/business-networking.png"],
    description: "Lancement produit avec spectacle audiovisuel immersif et sonorisation professionnelle.",
    fullDescription:
      "Création d'un événement corporate mémorable avec mapping vidéo, sonorisation multi-zones et coordination technique complète pour le lancement d'un nouveau produit.",
    services: ["Vidéo Mapping", "Sonorisation", "Éclairage scénique", "Régie technique"],
    client: "TechCorp Industries",
    date: "Mars 2024",
    guests: "300 invités",
    location: "Palais des Congrès, Paris",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// GET /api/projects - Récupérer tous les projets
export async function GET() {
  try {
    console.log("[v0] Fetching projects from Redis...")

    if (!redis) {
      console.log("[v0] Redis not available, using fallback data")
      return NextResponse.json({ projects: fallbackProjects })
    }

    let projects: Project[] = []

    try {
      const projectsData = await redis.get("projects")

      if (projectsData && typeof projectsData === "string") {
        // Check if the string looks like JSON (starts with [ or {)
        if (projectsData.trim().startsWith("[") || projectsData.trim().startsWith("{")) {
          try {
            projects = JSON.parse(projectsData)
          } catch (parseError) {
            console.error("[v0] Failed to parse Redis data as JSON:", parseError)
            projects = fallbackProjects
          }
        } else {
          console.log("[v0] Redis returned non-JSON string:", projectsData.substring(0, 50))
          projects = fallbackProjects
        }
      } else if (projectsData && typeof projectsData === "object") {
        // Redis might return parsed object directly
        projects = projectsData as Project[]
      } else {
        // No data found, initialize with fallback
        projects = fallbackProjects
        try {
          await redis.set("projects", JSON.stringify(projects))
          console.log("[v0] Initialized Redis with fallback projects")
        } catch (setError) {
          console.error("[v0] Failed to initialize Redis:", setError)
        }
      }
    } catch (redisError) {
      console.error("[v0] Redis operation failed:", redisError)
      // Use fallback data when Redis fails
      projects = fallbackProjects
    }

    console.log("[v0] Loaded projects:", projects.length)
    return NextResponse.json({ projects })
  } catch (error) {
    console.error("[v0] Error in projects API:", error)
    // Always return valid JSON, even on error
    return NextResponse.json({ projects: fallbackProjects })
  }
}

import { getSessionCookieFromRequest, verifySessionToken } from "@/lib/server/jwt"

// POST /api/projects - Créer un nouveau projet
export async function POST(request: NextRequest) {
  try {
    const sessionToken = getSessionCookieFromRequest(request)
    if (!sessionToken || !(await verifySessionToken(sessionToken))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Creating new project:", body.title)

    if (!redis) {
      return NextResponse.json({ error: "Redis not available" }, { status: 503 })
    }

    // Récupérer les projets existants
    let projects: Project[] = fallbackProjects

    try {
      const projectsData = await redis.get("projects")
      if (
        projectsData &&
        typeof projectsData === "string" &&
        (projectsData.trim().startsWith("[") || projectsData.trim().startsWith("{"))
      ) {
        projects = JSON.parse(projectsData)
      }
    } catch (error) {
      console.error("[v0] Error fetching existing projects:", error)
      projects = fallbackProjects
    }

    // Générer un nouvel ID
    const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1

    // Créer le nouveau projet
    const newProject: Project = {
      ...body,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Ajouter le projet à la liste
    projects.push(newProject)

    // Sauvegarder dans Redis
    try {
      await redis.set("projects", JSON.stringify(projects))
      console.log("[v0] Project created with ID:", newId)
    } catch (error) {
      console.error("[v0] Failed to save to Redis:", error)
    }

    return NextResponse.json({ project: newProject })
  } catch (error) {
    console.error("[v0] Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

// PUT /api/projects - Mettre à jour un projet
export async function PUT(request: NextRequest) {
  try {
    const sessionToken = getSessionCookieFromRequest(request)
    if (!sessionToken || !(await verifySessionToken(sessionToken))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    console.log("[v0] Updating project:", id)

    if (!redis) {
      return NextResponse.json({ error: "Redis not available" }, { status: 503 })
    }

    // Récupérer les projets existants
    let projects: Project[] = fallbackProjects

    try {
      const projectsData = await redis.get("projects")
      if (
        projectsData &&
        typeof projectsData === "string" &&
        (projectsData.trim().startsWith("[") || projectsData.trim().startsWith("{"))
      ) {
        projects = JSON.parse(projectsData)
      }
    } catch (error) {
      console.error("[v0] Error fetching existing projects:", error)
      projects = fallbackProjects
    }

    // Trouver et mettre à jour le projet
    const projectIndex = projects.findIndex((p) => p.id === id)
    if (projectIndex === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    }

    // Sauvegarder dans Redis
    try {
      await redis.set("projects", JSON.stringify(projects))
      console.log("[v0] Project updated:", id)
    } catch (error) {
      console.error("[v0] Failed to save to Redis:", error)
    }

    return NextResponse.json({ project: projects[projectIndex] })
  } catch (error) {
    console.error("[v0] Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE /api/projects - Supprimer un projet
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = getSessionCookieFromRequest(request)
    if (!sessionToken || !(await verifySessionToken(sessionToken))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = Number.parseInt(searchParams.get("id") || "0")

    console.log("[v0] Deleting project:", id)

    if (!redis) {
      return NextResponse.json({ error: "Redis not available" }, { status: 503 })
    }

    // Récupérer les projets existants
    let projects: Project[] = fallbackProjects

    try {
      const projectsData = await redis.get("projects")
      if (
        projectsData &&
        typeof projectsData === "string" &&
        (projectsData.trim().startsWith("[") || projectsData.trim().startsWith("{"))
      ) {
        projects = JSON.parse(projectsData)
      }
    } catch (error) {
      console.error("[v0] Error fetching existing projects:", error)
      projects = fallbackProjects
    }

    // Filtrer le projet à supprimer
    const filteredProjects = projects.filter((p) => p.id !== id)

    if (filteredProjects.length === projects.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Sauvegarder dans Redis
    try {
      await redis.set("projects", JSON.stringify(filteredProjects))
      console.log("[v0] Project deleted:", id)
    } catch (error) {
      console.error("[v0] Failed to save to Redis:", error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
