import { NextResponse } from "next/server"
import { deletePartner, updatePartner } from "@/lib/server/partners"
import type { Partner } from "@/data/partners"

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const body = (await req.json()) as Partial<Partner>
  const updated = await updatePartner(params.id, {
    name: body.name,
    logo: body.logo,
    url: body.url,
  })
  if (!updated) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true, partner: updated })
}

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const ok = await deletePartner(params.id)
  if (!ok) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
