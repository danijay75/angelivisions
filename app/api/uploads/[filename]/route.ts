import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    try {
        const { filename } = await params

        if (!filename) {
            return new NextResponse("Filename required", { status: 400 })
        }

        const uploadDir = join(process.cwd(), "public", "uploads")
        const filePath = join(uploadDir, filename)

        if (!existsSync(filePath)) {
            return new NextResponse("File not found", { status: 404 })
        }

        const fileBuffer = await readFile(filePath)

        // Determiner le type mime basique
        const ext = filename.split('.').pop()?.toLowerCase() || ''
        let contentType = 'application/octet-stream'
        if (['jpg', 'jpeg'].includes(ext)) contentType = 'image/jpeg'
        if (ext === 'png') contentType = 'image/png'
        if (ext === 'webp') contentType = 'image/webp'
        if (ext === 'gif') contentType = 'image/gif'
        if (ext === 'svg') contentType = 'image/svg+xml'
        if (ext === 'mp4') contentType = 'video/mp4'

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        })
    } catch (error) {
        console.error("[AV] Error serving uploaded file:", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
