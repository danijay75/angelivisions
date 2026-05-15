import { type NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { Redis } from "@upstash/redis"
import { getSessionCookieFromRequest, verifySessionToken } from "@/lib/server/jwt"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const CONFIG_KEY = "av_services_config_v1"

const fallbackConfig = {
  title: "Nos <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600\">Services</span>",
  subtitle: "",
  showBadge: false,
  badgeText: "Notre expertise"
}

export async function GET() {
  try {
    const configData = await redis.get(CONFIG_KEY)
    
    if (configData) {
      if (typeof configData === "string") {
        return NextResponse.json(JSON.parse(configData))
      } else if (typeof configData === "object") {
        return NextResponse.json(configData)
      }
    }
  } catch (error) {
    console.log("Redis operation failed:", error)
  }
  return NextResponse.json(fallbackConfig)
}

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
    const config = await request.json()
    await redis.set(CONFIG_KEY, JSON.stringify(config))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("Services config POST error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
