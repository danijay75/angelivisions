import { NextResponse } from "next/server"
import { createMember, getTeam } from "@/lib/server/team"
import type { TeamMember } from "@/data/team"

export async function GET() {
  try {
    const team = await getTeam()
    return NextResponse.json({ ok: true, team })
  } catch (error) {
    console.error("Team API GET error:", error)
    return NextResponse.json({ ok: false, error: "Failed to fetch team data" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<TeamMember>
    if (!body?.name || !body?.title || !body?.email) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 })
    }
    const photo = body.photo || "/placeholder.svg?height=240&width=240"
    const created = await createMember({
      name: body.name,
      title: body.title,
      email: body.email,
      photo,
      roles: Array.isArray(body.roles) ? body.roles : [],
      socials: body.socials ?? {},
    })
    return NextResponse.json({ ok: true, member: created }, { status: 201 })
  } catch (error) {
    console.error("Team API POST error:", error)
    return NextResponse.json({ ok: false, error: "Failed to create team member" }, { status: 500 })
  }
}
