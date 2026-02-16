import { NextResponse } from "next/server"
import { readAdmin } from "@/lib/server/storage"
import {
  getAdminRecordCookieFromRequest,
  getSessionCookieFromRequest,
  verifyAdminRecordToken,
  verifySessionToken,
} from "@/lib/server/jwt"

export async function GET(req: Request) {
  // Fichier
  const admin = await readAdmin().catch(() => null)
  let exists = !!admin

  // Fallback cookie signé
  if (!exists) {
    const adminToken = getAdminRecordCookieFromRequest(req)
    const record = adminToken ? await verifyAdminRecordToken(adminToken) : null
    exists = !!record
  }

  // Session
  const token = getSessionCookieFromRequest(req)
  const payload = token ? await verifySessionToken(token) : null

  return NextResponse.json({
    exists,
    authenticated: !!payload,
    email: payload?.sub ?? null,
  })
}
