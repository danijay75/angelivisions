import { type NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import { Redis } from "@upstash/redis"
import { defaultInvestmentProjects, type InvestmentProject } from "@/data/investments"
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
}

// GET /api/investments - Fetch all projects or a specific one
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        const slug = searchParams.get("slug")

        if (!redis) {
            const allProjects = defaultInvestmentProjects
            if (id) return NextResponse.json({ project: allProjects.find(p => p.id === id) })
            if (slug) return NextResponse.json({ project: allProjects.find(p => p.slug === slug) })
            return NextResponse.json({ projects: allProjects })
        }

        const data = await redis.get("investments")
        let projects: InvestmentProject[] = data ? (typeof data === "string" ? JSON.parse(data) : data) : defaultInvestmentProjects

        if (!data) {
            await redis.set("investments", JSON.stringify(defaultInvestmentProjects))
        }

        if (id) return NextResponse.json({ project: projects.find(p => p.id === id) })
        if (slug) return NextResponse.json({ project: projects.find(p => p.slug === slug) })

        return NextResponse.json({ projects })
    } catch (error) {
        console.error("[AV] Error in investments API:", error)
        return NextResponse.json({ projects: defaultInvestmentProjects })
    }
}

// POST /api/investments - Create new project
export async function POST(request: NextRequest) {
    try {
        const sessionToken = getSessionCookieFromRequest(request)
        if (!sessionToken || !(await verifySessionToken(sessionToken))) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = (await request.json()) as InvestmentProject
        if (!redis) return NextResponse.json({ error: "Service indisponible" }, { status: 503 })

        const data = await redis.get("investments")
        const projects: InvestmentProject[] = data ? (typeof data === "string" ? JSON.parse(data) : data) : defaultInvestmentProjects

        const newProject: InvestmentProject = {
            ...body,
            id: body.id || `invest-${Date.now()}`
        }

        projects.push(newProject)
        await redis.set("investments", JSON.stringify(projects))

        return NextResponse.json({ project: newProject })
    } catch (error) {
        console.error("[AV] Error creating investment:", error)
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 })
    }
}

// PUT /api/investments - Update project
export async function PUT(request: NextRequest) {
    try {
        const sessionToken = getSessionCookieFromRequest(request)
        if (!sessionToken || !(await verifySessionToken(sessionToken))) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = (await request.json()) as InvestmentProject
        const { id, ...updateData } = body
        if (!redis) return NextResponse.json({ error: "Service indisponible" }, { status: 503 })

        const data = await redis.get("investments")
        let projects: InvestmentProject[] = data ? (typeof data === "string" ? JSON.parse(data) : data) : defaultInvestmentProjects

        const index = projects.findIndex(p => p.id === id)
        if (index === -1) return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 })

        projects[index] = { ...projects[index], ...updateData }
        await redis.set("investments", JSON.stringify(projects))

        return NextResponse.json({ project: projects[index] })
    } catch (error) {
        console.error("[AV] Error updating investment:", error)
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
    }
}

// DELETE /api/investments - Delete project
export async function DELETE(request: NextRequest) {
    try {
        const sessionToken = getSessionCookieFromRequest(request)
        if (!sessionToken || !(await verifySessionToken(sessionToken))) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id || !redis) return NextResponse.json({ error: "ID manquant ou service indisponible" }, { status: 400 })

        const data = await redis.get("investments")
        let projects: InvestmentProject[] = data ? (typeof data === "string" ? JSON.parse(data) : data) : defaultInvestmentProjects

        const filtered = projects.filter(p => p.id !== id)
        await redis.set("investments", JSON.stringify(filtered))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[AV] Error deleting investment:", error)
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
    }
}
