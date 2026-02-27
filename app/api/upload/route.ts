import { type NextRequest, NextResponse } from "next/server"
import { getSessionCookieFromRequest, verifySessionToken } from "@/lib/server/jwt"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
    try {
        const sessionToken = getSessionCookieFromRequest(request)
        if (!sessionToken || !(await verifySessionToken(sessionToken))) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const data = await request.formData()
        const file = data.get("file") as unknown as File

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Sanitize filename
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

        // Ensure directory exists
        const uploadDir = join(process.cwd(), "public", "uploads")
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        const filePath = join(uploadDir, filename)
        await writeFile(filePath, buffer)

        return NextResponse.json({ success: true, url: `/uploads/${filename}` })
    } catch (error) {
        console.error("[AV] Error uploading file:", error)
        return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
    }
}
