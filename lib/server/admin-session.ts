// Minimal server guards + bootstrap mode (open until first admin exists).
// For production, replace with a signed session.

import { headers } from "next/headers"
import { countUsers, type Role } from "./users"

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
    console.log("[v0] isBootstrapOpen called")
    const count = await countUsers()
    console.log("[v0] isBootstrapOpen user count:", count)
    const result = count === 0
    console.log("[v0] isBootstrapOpen result:", result)
    return result
  } catch (e) {
    console.log("[v0] isBootstrapOpen error:", e)
    return true // Default to bootstrap mode if error
  }
}

export function getRoleFromRequest(): Role | null {
  const h = headers()
  const ck = parseCookie(h.get("cookie"))
  const role = ck["av_role"] as Role | undefined
  if (role === "admin" || role === "editor" || role === "guest") return role
  return null
}

export async function requireAdmin() {
  const role = getRoleFromRequest()
  if (role === "admin") return { ok: true as const, status: 200, body: {} }
  return { ok: false as const, status: 401, body: { error: "Accès administrateur requis" } }
}
