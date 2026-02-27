import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { sendMail } from "@/lib/server/mailer"
import { verifyCaptcha } from "@/lib/server/captcha"
import { requireAdmin } from "@/lib/server/admin-session"

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const INDEX_KEY = "devis_submissions"

function devisKey(id: string): string {
  return `devis:${id}`
}

interface DevisPayload {
  id?: string
  eventType: string
  services: string[]
  eventDate: string
  guestCount: string
  location: string
  name: string
  email: string
  phone: string
  company: string
  description: string
  consent?: boolean
  captchaToken?: string
  createdAt?: string
}

function buildHtmlEmail(data: DevisPayload): string {
  const servicesList = data.services.length
    ? data.services.map((s) => `<li>${s}</li>`).join("")
    : "<li>Non spécifié</li>"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📋 Nouvelle Demande de Devis</h1>
      </div>
      <div style="background: #1e1b4b; padding: 24px; color: #e2e8f0;">
        <h2 style="color: #c084fc; border-bottom: 1px solid #374151; padding-bottom: 8px;">👤 Contact</h2>
        <p><strong>Nom :</strong> ${data.name}</p>
        <p><strong>Email :</strong> <a href="mailto:${data.email}" style="color: #c084fc;">${data.email}</a></p>
        ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ""}
        ${data.company ? `<p><strong>Entreprise :</strong> ${data.company}</p>` : ""}

        <h2 style="color: #c084fc; border-bottom: 1px solid #374151; padding-bottom: 8px;">🎪 Événement</h2>
        <p><strong>Type :</strong> ${data.eventType || "Non spécifié"}</p>
        ${data.eventDate ? `<p><strong>Date :</strong> ${data.eventDate}</p>` : ""}
        ${data.guestCount ? `<p><strong>Nombre d'invités :</strong> ${data.guestCount}</p>` : ""}
        ${data.location ? `<p><strong>Lieu :</strong> ${data.location}</p>` : ""}

        <h2 style="color: #c084fc; border-bottom: 1px solid #374151; padding-bottom: 8px;">🎵 Services demandés</h2>
        <ul>${servicesList}</ul>

        ${data.description ? `
        <h2 style="color: #c084fc; border-bottom: 1px solid #374151; padding-bottom: 8px;">📝 Description</h2>
        <p>${data.description.replace(/\n/g, "<br>")}</p>
        ` : ""}
      </div>
      <div style="background: #0f0d2e; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          Envoyé depuis le formulaire de devis — angelivisions.com
        </p>
      </div>
    </div>
  `
}

function buildConfirmationEmail(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">✨ Merci pour votre demande !</h1>
      </div>
      <div style="background: #1e1b4b; padding: 24px; color: #e2e8f0;">
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre demande de devis et nous vous recontacterons dans les <strong>plus brefs délais</strong>.</p>
        <p>En attendant, n'hésitez pas à nous contacter directement si vous avez des questions.</p>
        <p style="margin-top: 24px;">À très bientôt,<br><strong>L'équipe Angeli Visions</strong></p>
      </div>
      <div style="background: #0f0d2e; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          angelivisions.com — Organisateur d'événements &amp; Maison de disque
        </p>
      </div>
    </div>
  `
}

export async function GET(req: NextRequest) {
  const gate = await requireAdmin()
  if (!gate.ok) {
    return NextResponse.json(gate.body, { status: gate.status })
  }

  try {
    const ids = await redis.smembers(INDEX_KEY)
    const devisList: DevisPayload[] = []

    for (const id of ids) {
      const data = await redis.hgetall(devisKey(id))
      if (data && Object.keys(data).length > 0) {
        devisList.push(data as unknown as DevisPayload)
      }
    }

    // Sort by most recent
    devisList.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    return NextResponse.json({ success: true, devis: devisList })
  } catch (error) {
    console.error("[Devis API GET] Error:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des devis." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: DevisPayload = await req.json()

    if (!data.name || !data.email) {
      return NextResponse.json(
        { success: false, message: "Nom et email requis." },
        { status: 400 }
      )
    }

    if (!data.consent) {
      return NextResponse.json(
        { success: false, message: "Le consentement RGPD est requis." },
        { status: 400 }
      )
    }
    const captchaOk = await verifyCaptcha(data.captchaToken || "")
    if (!captchaOk) {
      return NextResponse.json(
        { success: false, message: "Captcha invalide." },
        { status: 400 }
      )
    }

    // Save to Redis
    const id = crypto.randomUUID()
    const submission: DevisPayload = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    }
    // Remove sensitive/unused fields for storage
    delete submission.captchaToken

    await redis.hset(devisKey(id), submission as unknown as Record<string, string>)
    await redis.sadd(INDEX_KEY, id)

    const adminEmail = process.env.ADMIN_EMAIL || "contact@angelivisions.com"

    // Send notification to admin
    try {
      await sendMail({
        to: adminEmail,
        subject: `🎪 Nouveau devis — ${data.name} (${data.eventType || "Événement"})`,
        html: buildHtmlEmail(data),
        replyTo: data.email, // L'admin peut répondre directement au client
      })
    } catch (mailError) {
      console.error("[Devis API] Admin mail error:", mailError)
    }

    // Send confirmation to client
    try {
      await sendMail({
        to: data.email,
        subject: "Votre demande de devis — Angeli Visions",
        html: buildConfirmationEmail(data.name),
        replyTo: adminEmail, // Le client peut répondre à contact@angelivisions.com
      })
    } catch (mailError) {
      console.error("[Devis API] Client mail error:", mailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Devis API] Error:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'envoi." },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const gate = await requireAdmin()
  if (!gate.ok) {
    return NextResponse.json(gate.body, { status: gate.status })
  }

  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ success: false, message: "ID requis." }, { status: 400 })
    }

    await redis.del(devisKey(id))
    await redis.srem(INDEX_KEY, id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Devis API DELETE] Error:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression." },
      { status: 500 }
    )
  }
}
