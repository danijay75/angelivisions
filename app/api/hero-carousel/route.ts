import { type NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { Redis } from "@upstash/redis"
import { getSessionCookieFromRequest, verifySessionToken } from "@/lib/server/jwt"

let redis: Redis | null = null

try {
  redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  })
} catch (error) {
  console.error("[AV] Redis initialization failed:", error)
}

const fallbackImages = [
    "/corporate-event-stage.jpg",
    "/business-networking.png",
    "/elegant-wedding-reception.png"
]

export async function GET() {
  try {
    if (!redis) {
      return NextResponse.json({ images: fallbackImages })
    }

    let imagesData = await redis.get("hero-carousel")
    
    // Parse if it is a string
    if (typeof imagesData === 'string' && imagesData.startsWith('[')) {
        imagesData = JSON.parse(imagesData)
    }

    if (Array.isArray(imagesData) && imagesData.length > 0) {
        return NextResponse.json({ images: imagesData })
    }

    return NextResponse.json({ images: fallbackImages })
  } catch (error) {
    console.error("[AV] Error fetching carousel:", error)
    return NextResponse.json({ images: fallbackImages })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionToken = getSessionCookieFromRequest(request)
    if (!sessionToken || !(await verifySessionToken(sessionToken))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { images } = await request.json()

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "Images must be an array" }, { status: 400 })
    }

    if (!redis) {
      return NextResponse.json({ error: "Redis not available" }, { status: 503 })
    }

    await redis.set("hero-carousel", JSON.stringify(images))

    return NextResponse.json({ success: true, images })
  } catch (error) {
    console.error("[AV] Error saving hero carousel:", error)
    return NextResponse.json({ error: "Failed to save carousel" }, { status: 500 })
  }
}
