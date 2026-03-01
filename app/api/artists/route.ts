import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
import { Redis } from "@upstash/redis"
import { defaultArtists, type Artist } from "@/data/artists"
import { getSessionCookieFromRequest, verifySessionToken } from "@/lib/server/jwt"

let redis: Redis | null = null

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

if (KV_URL && KV_TOKEN) {
    try {
        redis = new Redis({
            url: KV_URL,
            token: KV_TOKEN,
        })
    } catch (error) {
        console.error("[AV] Redis initialization failed:", error)
    }
} else {
    console.warn("[AV] Upstash Redis environment variables are missing. Using fallback strategy.")
}

// GET /api/artists - Fetch all artists
export async function GET() {
    try {
        if (!redis) {
            console.log("[AV] Redis not available, using default data")
            return NextResponse.json({ artists: defaultArtists })
        }

        let artists: Artist[] = []
        const data = await redis.get("artists")

        if (data) {
            let parsed = typeof data === "string" ? JSON.parse(data) : data
            // Migration: handle old schema where type and musicalGenre were objects
            artists = parsed.map((a: any) => ({
                ...a,
                type: Array.isArray(a.type) ? a.type : (a.type ? [a.type] : []),
                musicalGenre: Array.isArray(a.musicalGenre) ? a.musicalGenre : (a.musicalGenre ? [a.musicalGenre] : []),
                socials: a.socials || []
            }))
        } else {
            // Initialize with default data if empty
            artists = defaultArtists
            await redis.set("artists", JSON.stringify(artists))
        }

        return NextResponse.json({ artists: artists.sort((a, b) => (a.order || 0) - (b.order || 0)) })
    } catch (error) {
        console.error("[AV] Error in artists API:", error)
        return NextResponse.json({ artists: defaultArtists })
    }
}

// POST /api/artists - Create a new artist
export async function POST(request: NextRequest) {
    try {
        const sessionToken = getSessionCookieFromRequest(request)
        if (!sessionToken || !(await verifySessionToken(sessionToken))) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = (await request.json()) as Artist
        if (!redis) return NextResponse.json({ error: "Service indisponible" }, { status: 503 })

        const data = await redis.get("artists")
        const artists: Artist[] = data ? (typeof data === "string" ? JSON.parse(data) : data) : defaultArtists

        const newArtist: Artist = {
            ...body,
            id: body.id || `artist-${Date.now()}`,
            order: body.order || (artists.length > 0 ? Math.max(...artists.map(a => a.order || 0)) + 1 : 1)
        }

        artists.push(newArtist)
        await redis.set("artists", JSON.stringify(artists))

        return NextResponse.json({ artist: newArtist })
    } catch (error) {
        console.error("[AV] Error creating artist:", error)
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
    }
}

// PUT /api/artists - Update an artist
export async function PUT(request: NextRequest) {
    try {
        const sessionToken = getSessionCookieFromRequest(request)
        if (!sessionToken || !(await verifySessionToken(sessionToken))) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = (await request.json()) as Artist
        const { id, ...updateData } = body
        if (!redis) return NextResponse.json({ error: "Service indisponible" }, { status: 503 })

        const data = await redis.get("artists")
        let artists: Artist[] = data ? (typeof data === "string" ? JSON.parse(data) : data) : defaultArtists

        const index = artists.findIndex(a => a.id === id)
        if (index === -1) return NextResponse.json({ error: "Artiste non trouvé" }, { status: 404 })

        artists[index] = { ...artists[index], ...updateData }
        await redis.set("artists", JSON.stringify(artists))

        return NextResponse.json({ artist: artists[index] })
    } catch (error) {
        console.error("[AV] Error updating artist:", error)
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
    }
}

// DELETE /api/artists - Delete an artist
export async function DELETE(request: NextRequest) {
    try {
        const sessionToken = getSessionCookieFromRequest(request)
        if (!sessionToken || !(await verifySessionToken(sessionToken))) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id || !redis) return NextResponse.json({ error: "ID manquant ou service indisponible" }, { status: 400 })

        const data = await redis.get("artists")
        let artists: Artist[] = data ? (typeof data === "string" ? JSON.parse(data) : data) : defaultArtists

        const filtered = artists.filter(a => a.id !== id)
        await redis.set("artists", JSON.stringify(filtered))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[AV] Error deleting artist:", error)
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
    }
}
