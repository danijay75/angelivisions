import { type NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { defaultServices, type ServiceItem } from "@/data/services"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const SERVICES_KEY = "av_services_v1"

// Use centralized default services as fallback
const fallbackServices: ServiceItem[] = defaultServices


export async function GET() {
  try {
    console.log("Fetching services from Redis...")

    const servicesData = await redis.get(SERVICES_KEY)
    
    console.log("Redis response type:", typeof servicesData)
    console.log("Redis response preview:", String(servicesData).substring(0, 100))

    let services: ServiceItem[] = fallbackServices

    if (servicesData && typeof servicesData === "string") {
      try {
        // Check if it's valid JSON
        if (servicesData.startsWith("{") || servicesData.startsWith("[")) {
          services = JSON.parse(servicesData)
          console.log("Successfully parsed services from Redis:", services.length, "services")
        } else {
          console.log("Redis returned non-JSON data, using fallback")
        }
      } catch (parseError) {
        console.log("JSON parse error, using fallback:", parseError)
      }
    } else if (servicesData && typeof servicesData === "object") {
      // Redis returned object directly
      services = Array.isArray(servicesData) ? servicesData : fallbackServices
      console.log("Used Redis object data:", services.length, "services")
    } else {
      console.log("No valid data from Redis, initializing with fallback")
      // Initialize Redis with fallback data
      try {
        await redis.set(SERVICES_KEY, JSON.stringify(fallbackServices))
        console.log("Initialized Redis with fallback services")
      } catch (initError) {
        console.log("Failed to initialize Redis:", initError)
      }
    }

    // Ultimate safety filter to ensure non-video services are NEVER returned
    const FORBIDDEN_SERVICES = ["sport", "label-de-musique", "spectacles"]
    const filteredServices = services.filter((s) => !FORBIDDEN_SERVICES.includes(s.id))

    return NextResponse.json({ services: filteredServices })
  } catch (error) {
    console.log("Redis operation failed:", error)
    return NextResponse.json({ services: fallbackServices })
  }
}

import { getSessionCookieFromRequest, verifySessionToken } from "@/lib/server/jwt"

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
    const { services } = await request.json()

    if (!Array.isArray(services)) {
      return NextResponse.json({ error: "Services must be an array" }, { status: 400 })
    }

    console.log("Saving services to Redis:", services.length, "services")

    // Preserve forbidden services (sport, label-de-musique, spectacles) in Redis
    const FORBIDDEN_SERVICES = ["sport", "label-de-musique", "spectacles"]
    let existingServices: ServiceItem[] = []
    try {
      const redisData = await redis.get(SERVICES_KEY)
      if (redisData) {
        if (typeof redisData === "string") {
          existingServices = JSON.parse(redisData)
        } else if (typeof redisData === "object" && Array.isArray(redisData)) {
          existingServices = redisData
        }
      }
    } catch (e) {
      console.log("Failed to fetch existing services for merge, using defaults fallback", e)
      existingServices = defaultServices
    }

    // Extract forbidden services from the existing database
    const existingForbidden = existingServices.filter((s) => FORBIDDEN_SERVICES.includes(s.id))
    
    // Ensure all forbidden services from defaults are represented if not present in existing
    const defaultForbidden = defaultServices.filter((s) => FORBIDDEN_SERVICES.includes(s.id))
    const forbiddenToKeep = [...existingForbidden]
    for (const defSrv of defaultForbidden) {
      if (!forbiddenToKeep.some((s) => s.id === defSrv.id)) {
        forbiddenToKeep.push(defSrv)
      }
    }

    // Merge new incoming services (with forbidden filtered out just in case) and forbidden services to keep
    const combinedServices = [
      ...services.filter((s) => !FORBIDDEN_SERVICES.includes(s.id)),
      ...forbiddenToKeep
    ]

    try {
      await redis.set(SERVICES_KEY, JSON.stringify(combinedServices))
      console.log("Successfully saved services to Redis, preserving forbidden services")
      return NextResponse.json({ success: true })
    } catch (redisError) {
      console.log("Redis save failed:", redisError)
      return NextResponse.json({ error: "Failed to save services" }, { status: 500 })
    }
  } catch (error) {
    console.log("Services POST error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
