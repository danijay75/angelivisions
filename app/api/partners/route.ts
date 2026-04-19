import { NextResponse } from "next/server"
import { createPartner, getPartners } from "@/lib/server/partners"
import type { Partner } from "@/data/partners"

export async function GET() {
  try {
    const partners = await getPartners()
    return NextResponse.json({ ok: true, partners })
  } catch (error) {
    console.error("Partners API GET error:", error)
    return NextResponse.json({ ok: false, error: "Failed to fetch partners data" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Partner>
    if (!body?.name) {
      return NextResponse.json({ ok: false, error: "Missing name" }, { status: 400 })
    }
    const logo = body.logo || "/placeholder.svg?height=100&width=200"
    const created = await createPartner({
      name: body.name,
      logo,
      url: body.url || "",
    })
    return NextResponse.json({ ok: true, partner: created }, { status: 201 })
  } catch (error) {
    console.error("Partners API POST error:", error)
    return NextResponse.json({ ok: false, error: "Failed to create partner" }, { status: 500 })
  }
}
