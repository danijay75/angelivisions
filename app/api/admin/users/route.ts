import { NextResponse } from "next/server"
import { createUser, listUsers, type Role } from "@/lib/server/users"
import { isBootstrapOpen, requireAdmin } from "@/lib/server/admin-session"

// GET /api/admin/users -> list users (open during bootstrap; admin-only otherwise)
export async function GET() {
  try {
    console.log("GET /api/admin/users called")
    const bootstrap = await isBootstrapOpen()
    console.log("Bootstrap mode:", bootstrap)
    if (!bootstrap) {
      const gate = await requireAdmin()
      if (!gate.ok) return NextResponse.json(gate.body, { status: gate.status })
    }
    const users = await listUsers()
    console.log("Users loaded:", users.length)
    return NextResponse.json(users, { status: 200 })
  } catch (e) {
    console.log("GET /api/admin/users error:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/admin/users -> create user (forces role=admin if bootstrap)
export async function POST(req: Request) {
  const { name, email, role, password, active } = (await req.json().catch(() => ({}))) as {
    name?: string
    email?: string
    role?: Role
    password?: string
    active?: boolean
  }

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Champs requis: name, email, password" }, { status: 400 })
  }

  const bootstrap = await isBootstrapOpen()
  if (!bootstrap) {
    const gate = await requireAdmin()
    if (!gate.ok) return NextResponse.json(gate.body, { status: gate.status })
  }

  try {
    const created = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: bootstrap ? "admin" : role || "editor",
      password,
      active: typeof active === "boolean" ? active : true,
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Création impossible" }, { status: 400 })
  }
}
