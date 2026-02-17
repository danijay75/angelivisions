import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { requireAdmin } from "@/lib/server/admin-session"

const redis = new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET(req: NextRequest) {
    const gate = await requireAdmin()
    if (!gate.ok) {
        return NextResponse.json(gate.body, { status: gate.status })
    }

    try {
        const subscribers = await redis.smembers("newsletter_subscribers")
        return NextResponse.json({ subscribers })
    } catch (error) {
        console.error("Error fetching subscribers:", error)
        return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Email invalide" }, { status: 400 })
        }

        // Add to Redis set (prevents duplicates)
        await redis.sadd("newsletter_subscribers", email.toLowerCase().trim())

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Newsletter subscription error:", error)
        return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 })
    }
}

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

        await redis.srem("newsletter_subscribers", email)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting subscriber:", error)
        return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 })
    }
}

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

        await redis.srem("newsletter_subscribers", oldEmail)
        await redis.sadd("newsletter_subscribers", newEmail.toLowerCase().trim())

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error updating subscriber:", error)
        return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 })
    }
}
