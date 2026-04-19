import { NextResponse } from "next/server"
import { reorderPartners } from "@/lib/server/partners"

export async function POST(req: Request) {
  const body = (await req.json()) as { ids?: string[] }
  if (!Array.isArray(body.ids)) {
    return NextResponse.json({ ok: false, error: "ids required" }, { status: 400 })
  }
  const partners = await reorderPartners(body.ids)
  return NextResponse.json({ ok: true, partners })
}
