import { NextResponse } from "next/server"
import { removeUser, updateUser } from "@/lib/server/users"
import { isBootstrapOpen, requireAdmin } from "@/lib/server/admin-session"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const bootstrap = await isBootstrapOpen()
  if (!bootstrap) {
    const gate = await requireAdmin()
    if (!gate.ok) return NextResponse.json(gate.body, { status: gate.status })
  } else {
    return NextResponse.json({ error: "Indisponible pendant l'initialisation" }, { status: 400 })
  }

  try {
    const patch = await req.json()
    const updated = await updateUser(params.id, patch)
    return NextResponse.json(updated, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Mise à jour impossible" }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const gate = await requireAdmin()
  if (!gate.ok) return NextResponse.json(gate.body, { status: gate.status })
  try {
    await removeUser(params.id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Suppression impossible" }, { status: 400 })
  }
}
