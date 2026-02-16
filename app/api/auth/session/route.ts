import { NextResponse } from "next/server"
import { getSessionCookieFromRequest, verifySessionToken } from "@/lib/server/jwt"

export async function GET(req: Request) {
  const token = getSessionCookieFromRequest(req)
  const payload = token ? await verifySessionToken(token) : null

  // Adapter la réponse au format attendu par AuthProvider.refresh() => j.user
  const user = payload
    ? {
        id: String(payload.sub),
        email: String(payload.sub),
        name: "Administrateur",
        twoFactorEnabled: false,
      }
    : null

  return NextResponse.json({
    authenticated: !!payload,
    user,
  })
}
