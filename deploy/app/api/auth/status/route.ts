import { NextResponse } from "next/server"
import { countUsers } from "@/lib/server/users"
import {
  getSessionCookieFromRequest,
  verifySessionToken,
} from "@/lib/server/jwt"

export async function GET(req: Request) {
  // Count users from Redis
  const count = await countUsers()
  const exists = count > 0

  // Session verification
  const token = getSessionCookieFromRequest(req)
  const payload = token ? await verifySessionToken(token) : null

  return NextResponse.json({
    exists,
    authenticated: !!payload,
    email: payload?.sub ?? null,
  })
}
