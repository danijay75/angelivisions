import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import type { ServiceItem } from "@/data/services"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const SERVICES_KEY = "av_services_v1"

// Fallback data in case Redis fails
const fallbackServices: ServiceItem[] = [
  {
    id: "production",
    title: "Production Musicale",
    description: "Compositions originales, jingles personnalisés, musiques d'ambiance pour vos événements",
    features: ["Jingles d'entreprise", "Musiques d'ambiance", "Compositions originales", "Arrangements personnalisés"],
    color: "from-blue-500 to-cyan-500",
    image: "/music-production-setup.png",
  },
  {
    id: "organization",
    title: "Organisation d'Événements",
    description: "Gestion complète de vos événements : logistique, venue, traiteur, décoration et animation",
    features: ["Mariages clé-en-main", "Événements d'entreprise", "Soirées privées", "Conventions & séminaires"],
    color: "from-cyan-500 to-teal-500",
    image: "/event-organization.jpg",
  },
]

export async function GET() {
  try {
    console.log("[v0] Fetching services from Redis...")

    const servicesData = await redis.get(SERVICES_KEY)
    console.log("[v0] Redis response type:", typeof servicesData)
    console.log("[v0] Redis response preview:", String(servicesData).substring(0, 100))

    let services: ServiceItem[] = fallbackServices

    if (servicesData && typeof servicesData === "string") {
      try {
        // Check if it's valid JSON
        if (servicesData.startsWith("{") || servicesData.startsWith("[")) {
          services = JSON.parse(servicesData)
          console.log("[v0] Successfully parsed services from Redis:", services.length, "services")
        } else {
          console.log("[v0] Redis returned non-JSON data, using fallback")
        }
      } catch (parseError) {
        console.log("[v0] JSON parse error, using fallback:", parseError)
      }
    } else if (servicesData && typeof servicesData === "object") {
      // Redis returned object directly
      services = Array.isArray(servicesData) ? servicesData : fallbackServices
      console.log("[v0] Used Redis object data:", services.length, "services")
    } else {
      console.log("[v0] No valid data from Redis, initializing with fallback")
      // Initialize Redis with fallback data
      try {
        await redis.set(SERVICES_KEY, JSON.stringify(fallbackServices))
        console.log("[v0] Initialized Redis with fallback services")
      } catch (initError) {
        console.log("[v0] Failed to initialize Redis:", initError)
      }
    }

    return NextResponse.json({ services })
  } catch (error) {
    console.log("[v0] Redis operation failed:", error)
    return NextResponse.json({ services: fallbackServices })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { services } = await request.json()

    if (!Array.isArray(services)) {
      return NextResponse.json({ error: "Services must be an array" }, { status: 400 })
    }

    console.log("[v0] Saving services to Redis:", services.length, "services")

    try {
      await redis.set(SERVICES_KEY, JSON.stringify(services))
      console.log("[v0] Successfully saved services to Redis")
      return NextResponse.json({ success: true })
    } catch (redisError) {
      console.log("[v0] Redis save failed:", redisError)
      return NextResponse.json({ error: "Failed to save services" }, { status: 500 })
    }
  } catch (error) {
    console.log("[v0] Services POST error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
