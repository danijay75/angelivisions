
import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const INDEX_KEY = "newsletter_emails"

function subscriberKey(email: string): string {
    return `newsletter:${email.toLowerCase().trim()}`
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
        return NextResponse.json({ error: "Token requis" }, { status: 400 })
    }

    try {
        // Since we don't have a direct index by token, we have to search.
        // For a small list, iterating is fine. For larger, we'd need a secondary index.
        // Given this is a small newsletter, we'll iterate.
        // Optimization: In POST /api/newsletter, we could store `newsletter:token:<token>` -> email

        // Let's implement the search by iteration for now (as per existing structure)
        // Note: This is O(N) where N is number of subscribers.

        const emails = await redis.smembers(INDEX_KEY)
        // Also check legacy
        const legacyEmails = await redis.smembers("newsletter_subscribers")
        const allEmails = [...new Set([...emails, ...legacyEmails])]

        for (const email of allEmails) {
            const key = subscriberKey(email)
            const data = await redis.hgetall(key) as any

            if (data && data.token === token) {
                return NextResponse.json({
                    name: data.name,
                    email: data.email,
                    consentGiven: data.consentGiven
                })
            }
        }

        return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 404 })

    } catch (error) {
        console.error("Error fetching subscriber by token:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { token, action, name } = await req.json()

        if (!token) {
            return NextResponse.json({ error: "Token requis" }, { status: 400 })
        }

        // Find subscriber by token (reusing logic, ideally should be a helper)
        const emails = await redis.smembers(INDEX_KEY)
        const legacyEmails = await redis.smembers("newsletter_subscribers")
        const allEmails = [...new Set([...emails, ...legacyEmails])]

        let foundEmail: string | null = null;
        let foundData: any = null;

        for (const email of allEmails) {
            const key = subscriberKey(email)
            const data = await redis.hgetall(key) as any
            if (data && data.token === token) {
                foundEmail = email;
                foundData = data;
                break;
            }
        }

        if (!foundEmail || !foundData) {
            return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 404 })
        }

        const normalizedEmail = foundEmail;

        if (action === "unsubscribe") {
            await redis.del(subscriberKey(normalizedEmail))
            await redis.srem(INDEX_KEY, normalizedEmail)
            await redis.srem("newsletter_subscribers", normalizedEmail)
            return NextResponse.json({ success: true, message: "Désinscription confirmée" })
        } else if (action === "update") {
            const updatedData = {
                ...foundData,
                name: name || foundData.name
            }
            await redis.hset(subscriberKey(normalizedEmail), updatedData)
            return NextResponse.json({ success: true, message: "Préférences mises à jour" })
        }

        return NextResponse.json({ error: "Action invalide" }, { status: 400 })

    } catch (error) {
        console.error("Error updating preferences:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
