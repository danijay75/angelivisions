import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { getSessionCookieFromRequest, verifySessionToken } from "@/lib/server/jwt"

let redis: Redis | null = null

try {
  redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
} catch (error) {
  console.error("Redis initialization failed:", error)
}

export interface Category {
  id: string
  label: string
  description?: string
  color: string
  projectCount: number
}

// Catégories par défaut
const defaultCategories: Category[] = [
  {
    id: "corporate",
    label: "Entreprise",
    description: "Événements d'entreprise",
    color: "from-blue-500 to-cyan-500",
    projectCount: 0,
  },
  {
    id: "production",
    label: "Production Musicale",
    description: "Création musicale",
    color: "from-purple-500 to-pink-500",
    projectCount: 0,
  },
  {
    id: "mapping",
    label: "Vidéo Mapping",
    description: "Spectacles visuels",
    color: "from-indigo-500 to-purple-500",
    projectCount: 0,
  },
  {
    id: "media",
    label: "Captations et prises de vue",
    description: "Captations et podcasts",
    color: "from-green-500 to-emerald-500",
    projectCount: 0,
  },
]

// GET /api/categories - Récupérer toutes les catégories avec compteurs
export async function GET() {
  try {
    console.log("Fetching categories from Redis...")

    if (!redis) {
      console.log("Redis not available, using default categories")
      return NextResponse.json({ categories: defaultCategories })
    }

    let categories: Category[] = defaultCategories
    let projects: any[] = []

    try {
      const categoriesData = await redis.get("categories")
      const projectsData = await redis.get("projects")

      if (categoriesData) {
        if (typeof categoriesData === "string") {
          // Check if the string looks like JSON (starts with [ or {)
          if (categoriesData.trim().startsWith("[") || categoriesData.trim().startsWith("{")) {
            try {
              categories = JSON.parse(categoriesData)
            } catch (parseError) {
              console.error("Failed to parse categories data as JSON:", parseError)
              categories = defaultCategories
            }
          } else {
            console.log("Redis returned non-JSON string for categories:", categoriesData.substring(0, 50))
            categories = defaultCategories
          }
        } else if (typeof categoriesData === "object") {
          categories = categoriesData as Category[]
        }
      }

      if (projectsData) {
        if (typeof projectsData === "string") {
          // Check if the string looks like JSON (starts with [ or {)
          if (projectsData.trim().startsWith("[") || projectsData.trim().startsWith("{")) {
            try {
              projects = JSON.parse(projectsData)
            } catch (parseError) {
              console.error("Failed to parse projects data as JSON:", parseError)
              projects = []
            }
          } else {
            console.log("Redis returned non-JSON string for projects:", projectsData.substring(0, 50))
            projects = []
          }
        } else if (typeof projectsData === "object") {
          projects = projectsData as any[]
        }
      }
    } catch (redisError) {
      console.error("Redis operation failed:", redisError)
      // Use default data when Redis fails
      categories = defaultCategories
      projects = []
    }

    // Mettre à jour les compteurs de projets
    const updatedCategories = categories.map((cat) => ({
      ...cat,
      projectCount: projects.filter((p: any) => p.category === cat.id).length,
    }))

    console.log("Loaded categories:", updatedCategories.length)
    return NextResponse.json({ categories: updatedCategories })
  } catch (error) {
    console.error("Error in categories API:", error)
    // Always return valid JSON, even on error
    return NextResponse.json({ categories: defaultCategories })
  }
}

// POST /api/categories - Sauvegarder les catégories
export async function POST(request: NextRequest) {
  const sessionToken = getSessionCookieFromRequest(request)
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const session = await verifySessionToken(sessionToken)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { categories } = await request.json()
    console.log("Saving categories:", categories.length)

    if (!redis) {
      return NextResponse.json({ error: "Redis not available" }, { status: 503 })
    }

    try {
      await redis.set("categories", JSON.stringify(categories))
      console.log("Categories saved successfully")
    } catch (redisError) {
      console.error("Failed to save categories to Redis:", redisError)
      return NextResponse.json({ error: "Failed to save to Redis" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving categories:", error)
    return NextResponse.json({ error: "Failed to save categories" }, { status: 500 })
  }
}
