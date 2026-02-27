import { NextResponse } from "next/server"
import { reorderMembers } from "@/lib/server/team"

export async function POST(req: Request) {
  const body = (await req.json()) as { ids?: string[] }
  if (!Array.isArray(body.ids)) {
    return NextResponse.json({ ok: false, error: "ids required" }, { status: 400 })
  }
  const team = await reorderMembers(body.ids)
  return NextResponse.json({ ok: true, team })
}
