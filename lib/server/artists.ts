import { Redis } from "@upstash/redis"
import { defaultArtists, type Artist } from "@/data/artists"

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

let redis: Redis | null = null

if (KV_URL && KV_TOKEN) {
    try {
        redis = new Redis({
            url: KV_URL,
            token: KV_TOKEN,
        })
    } catch (error) {
        console.error("[AV] Redis initialization failed:", error)
    }
}

/** Migre les anciens schémas (type / musicalGenre en objet) vers des tableaux. */
function normalizeArtists(raw: unknown): Artist[] {
    const list = Array.isArray(raw) ? raw : []
    return list.map((a: any) => ({
        ...a,
        type: Array.isArray(a.type) ? a.type : a.type ? [a.type] : [],
        musicalGenre: Array.isArray(a.musicalGenre) ? a.musicalGenre : a.musicalGenre ? [a.musicalGenre] : [],
        socials: a.socials || [],
    }))
}

/**
 * Source unique des artistes (Redis + fallback sur les données par défaut).
 * Utilisé par l'API /api/artists et par la page de détail serveur.
 */
export async function getArtists(): Promise<Artist[]> {
    try {
        if (!redis) {
            return [...defaultArtists]
        }

        const data = await redis.get("artists")
        if (!data) {
            await redis.set("artists", JSON.stringify(defaultArtists))
            return [...defaultArtists]
        }

        const parsed = typeof data === "string" ? JSON.parse(data) : data
        const normalized = normalizeArtists(parsed)

        // Liste vide en KV alors que le code fournit un catalogue par défaut :
        // on ré-amorce (sinon /fr/<artiste> tombe en 404 et la page Spectacles
        // reste vide). Cf. incident du 31/10/2026.
        if (normalized.length === 0 && defaultArtists.length > 0) {
            console.warn("[AV] Liste d'artistes vide en KV - ré-amorçage avec les données par défaut")
            await redis.set("artists", JSON.stringify(defaultArtists))
            return [...defaultArtists]
        }

        return normalized.sort((a, b) => (a.order || 0) - (b.order || 0))
    } catch (error) {
        console.error("[AV] getArtists error:", error)
        return [...defaultArtists]
    }
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
    const artists = await getArtists()
    return artists.find((a) => a.slug === slug) || null
}
