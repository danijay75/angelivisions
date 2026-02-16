import { NextResponse } from "next/server"
import { deleteMember, updateMember } from "@/lib/server/team"
import type { TeamMember } from "@/data/team"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = (await req.json()) as Partial<TeamMember>
  const updated = await updateMember(params.id, {
    name: body.name,
    title: body.title,
    email: body.email,
    photo: body.photo,
    roles: body.roles,
    socials: body.socials,
  })
  if (!updated) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true, member: updated })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = await deleteMember(params.id)
  if (!ok) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
