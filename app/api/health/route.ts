import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import path from "path"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function readBuildId(): string | null {
    try {
        return readFileSync(path.join(process.cwd(), ".next", "BUILD_ID"), "utf8").trim()
    } catch {
        return null
    }
}

/**
 * Healthcheck réel : contrairement à la route catch-all, cette URL ne renvoie
 * jamais de HTML. 200 = application Next.js démarrée.
 */
export async function GET() {
    return NextResponse.json(
        {
            status: "ok",
            service: "angelivisions",
            buildId: readBuildId(),
            uptime: Math.round(process.uptime()),
            timestamp: new Date().toISOString(),
        },
        {
            headers: {
                "Cache-Control": "no-store, max-age=0",
            },
        },
    )
}
