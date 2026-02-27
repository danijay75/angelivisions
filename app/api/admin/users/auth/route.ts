import { NextResponse } from "next/server"
import { verifyPassword } from "@/lib/server/users"

// POST /api/admin/users/auth -> verify credentials and set role cookie
export async function POST(req: Request) {
  const { email, password } = (await req.json().catch(() => ({}))) as { email?: string; password?: string }
  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
  }
  const user = await verifyPassword(email, password)
  if (!user || !user.active) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
  }
  const body = {
    user: {
      email: user.email,
      role: user.role,
      name: user.name,
    },
  }
  const res = NextResponse.json(body, { status: 200 })
  // Simple role cookie used by server guards (replace with signed session for production)
  res.headers.set("Set-Cookie", `av_role=${user.role}; Path=/; SameSite=Lax`)
  return res
}

// DELETE /api/admin/users/auth -> logout (clear cookie)
export async function DELETE() {
  const res = NextResponse.json({ ok: true }, { status: 200 })
  res.headers.set("Set-Cookie", "av_role=; Max-Age=0; Path=/; SameSite=Lax")
  return res
}
