import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { requireAdmin } from "@/lib/server/admin-session"

const redis = new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const INDEX_KEY = "newsletter_emails"

function subscriberKey(email: string): string {
    return `newsletter:${email.toLowerCase().trim()}`
}

interface Subscriber {
    name: string
    email: string
    subscribedAt: string
    consentGiven: boolean
}

// ---------- GET: list all subscribers (admin only) ----------
export async function GET(req: NextRequest) {
    const gate = await requireAdmin()
    if (!gate.ok) {
        return NextResponse.json(gate.body, { status: gate.status })
    }

    try {
        const emails = await redis.smembers(INDEX_KEY)

        // Also check legacy key for backward compatibility
        const legacyEmails = await redis.smembers("newsletter_subscribers")
        const allEmails = [...new Set([...emails, ...legacyEmails])]

        const subscribers: Subscriber[] = []

        for (const email of allEmails) {
            const data = await redis.hgetall(subscriberKey(email))
            if (data && Object.keys(data).length > 0) {
                subscribers.push(data as unknown as Subscriber)
            } else {
                // Legacy subscriber (email-only, no hash) — return minimal info
                subscribers.push({
                    name: "",
                    email,
                    subscribedAt: "",
                    consentGiven: false,
                })
            }
        }

        return NextResponse.json({ subscribers })
    } catch (error) {
        console.error("Error fetching subscribers:", error)
        return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
    }
}

// ---------- POST: subscribe (public) ----------
export async function POST(req: NextRequest) {
    try {
        const { email, name, consent } = await req.json()

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Email invalide" }, { status: 400 })
        }

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: "Nom requis" }, { status: 400 })
        }

        if (!consent) {
            return NextResponse.json({ error: "Le consentement RGPD est requis" }, { status: 400 })
        }

        const normalizedEmail = email.toLowerCase().trim()

        const subscriber: Subscriber = {
            name: name.trim(),
            email: normalizedEmail,
            subscribedAt: new Date().toISOString(),
            consentGiven: true,
        }

        // Store subscriber hash + add to index
        await redis.hset(subscriberKey(normalizedEmail), subscriber as unknown as Record<string, string>)
        await redis.sadd(INDEX_KEY, normalizedEmail)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Newsletter subscription error:", error)
        return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 })
    }
}

// ---------- DELETE: unsubscribe (admin only) ----------
export async function DELETE(req: NextRequest) {
    const gate = await requireAdmin()
    if (!gate.ok) {
        return NextResponse.json(gate.body, { status: gate.status })
    }

    try {
        const { email } = await req.json()
        if (!email) {
            return NextResponse.json({ error: "Email requis" }, { status: 400 })
        }

        const normalizedEmail = email.toLowerCase().trim()

        await redis.del(subscriberKey(normalizedEmail))
        await redis.srem(INDEX_KEY, normalizedEmail)
        // Also clean legacy key
        await redis.srem("newsletter_subscribers", normalizedEmail)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting subscriber:", error)
        return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 })
    }
}

// ---------- PATCH: update subscriber email (admin only) ----------
export async function PATCH(req: NextRequest) {
    const gate = await requireAdmin()
    if (!gate.ok) {
        return NextResponse.json(gate.body, { status: gate.status })
    }

    try {
        const { oldEmail, newEmail } = await req.json()
        if (!oldEmail || !newEmail) {
            return NextResponse.json({ error: "Emails requis" }, { status: 400 })
        }

        const oldNormalized = oldEmail.toLowerCase().trim()
        const newNormalized = newEmail.toLowerCase().trim()

        // Get existing data
        const existing = await redis.hgetall(subscriberKey(oldNormalized))

        // Delete old
        await redis.del(subscriberKey(oldNormalized))
        await redis.srem(INDEX_KEY, oldNormalized)
        await redis.srem("newsletter_subscribers", oldNormalized)

        // Create new
        const updatedData = {
            ...(existing || {}),
            email: newNormalized,
        }
        await redis.hset(subscriberKey(newNormalized), updatedData as Record<string, string>)
        await redis.sadd(INDEX_KEY, newNormalized)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating subscriber:", error)
        return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 })
    }
}
