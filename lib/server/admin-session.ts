import { headers, cookies } from "next/headers"
import { countUsers, findUserByEmail, type Role } from "./users"
import { verifySessionToken } from "./jwt"

function parseCookie(cookieHeader: string | null): Record<string, string> {
  const out: Record<string, string> = {}
  if (!cookieHeader) return out
  cookieHeader.split(";").forEach((p) => {
    const idx = p.indexOf("=")
    if (idx > -1) {
      const k = p.slice(0, idx).trim()
      const v = decodeURIComponent(p.slice(idx + 1).trim())
      out[k] = v
    }
  })
  return out
}

export async function isBootstrapOpen(): Promise<boolean> {
  try {
    const count = await countUsers()
    return count === 0
  } catch (e) {
    console.error("isBootstrapOpen error:", e)
    return true // Default to bootstrap mode if error
  }
}

export async function getRoleFromRequest(): Promise<Role | null> {
  const h = await headers()
  const ck = parseCookie(h.get("cookie"))
  const role = ck["av_role"] as Role | undefined
  if (role === "admin" || role === "editor" || role === "guest") return role
  return null
}

export async function requireAdmin() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("av_session")?.value

  if (!sessionToken) {
    return { ok: false as const, status: 401, body: { error: "Non connecté" } }
  }

  const payload = await verifySessionToken(sessionToken)
  if (!payload || !payload.sub) {
    return { ok: false as const, status: 401, body: { error: "Session invalide" } }
  }

  const email = payload.sub as string

  // Check if user (KV based) with role admin
  const user = await findUserByEmail(email)
  if (user && user.role === "admin" && user.active) {
    return { ok: true as const, status: 200, body: {} }
  }

  return { ok: false as const, status: 403, body: { error: "Accès refusé" } }
}
