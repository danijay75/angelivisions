import { type NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { sendMail } from "@/lib/server/mailer"
import { verifyCaptcha } from "@/lib/server/captcha"
import { requireAdmin } from "@/lib/server/admin-session"

function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

const redis = getRedis()

const INDEX_KEY = "reclamation_submissions"

function reclamationKey(id: string): string {
  return `reclamation:${id}`
}

function generateReclamationNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `REC-${year}${month}-${randomStr}`
}

interface ReclamationPayload {
  id?: string
  number?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
  consent?: boolean
  captchaToken?: string
  createdAt?: string
}

function buildHtmlEmail(data: ReclamationPayload): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444, #991b1b); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Nouvelle Réclamation : ${data.number}</h1>
      </div>
      <div style="background: #1e1b4b; padding: 24px; color: #e2e8f0;">
        <h2 style="color: #f87171; border-bottom: 1px solid #374151; padding-bottom: 8px;">👤 Client</h2>
        <p><strong>Nom :</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email :</strong> <a href="mailto:${data.email}" style="color: #f87171;">${data.email}</a></p>
        ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ""}

        <h2 style="color: #f87171; border-bottom: 1px solid #374151; padding-bottom: 8px;">📝 Message</h2>
        <p><strong>Sujet :</strong> ${data.subject}</p>
        <br/>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      </div>
      <div style="background: #0f0d2e; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          Envoyé depuis le formulaire de réclamations — angelivisions.com
        </p>
      </div>
    </div>
  `
}

function buildConfirmationEmail(data: ReclamationPayload): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Accusé de réception - Réclamation ${data.number}</h1>
      </div>
      <div style="background: #1e1b4b; padding: 24px; color: #e2e8f0;">
        <p>Bonjour ${data.firstName},</p>
        <p>Nous accusons réception de votre réclamation portant la référence <strong>${data.number}</strong> concernant "${data.subject}".</p>
        <p>Notre équipe s'engage à étudier votre demande avec la plus grande attention et à vous apporter une réponse dans les meilleurs délais.</p>
        <p>En attendant, vous pouvez répondre à cet e-mail si vous souhaitez apporter des éléments complémentaires à votre dossier.</p>
        <p style="margin-top: 24px;">Cordialement,<br><strong>L'équipe Angeli Visions</strong></p>
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
    if (!redis) {
      return NextResponse.json({ success: true, reclamations: [] })
    }

    const ids = await redis.smembers(INDEX_KEY)
    const list: ReclamationPayload[] = []

    for (const id of ids) {
      const data = await redis.hgetall(reclamationKey(id))
      if (data && Object.keys(data).length > 0) {
        list.push(data as unknown as ReclamationPayload)
      }
    }

    list.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    return NextResponse.json({ success: true, reclamations: list })
  } catch (error) {
    console.error("[Reclamations API GET] Error:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des réclamations." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: ReclamationPayload = await req.json()

    if (!data.firstName || !data.lastName || !data.email || !data.message) {
      return NextResponse.json(
        { success: false, message: "Tous les champs obligatoires doivent être remplis." },
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

    const id = crypto.randomUUID()
    const number = generateReclamationNumber()
    
    const submission: ReclamationPayload = {
      ...data,
      id,
      number,
      createdAt: new Date().toISOString(),
    }
    delete submission.captchaToken

    if (redis) {
      await redis.hset(reclamationKey(id), submission as unknown as Record<string, string>)
      await redis.sadd(INDEX_KEY, id)
    } else {
      console.warn("Redis non configuré, sauvegarde ignorée en local.")
    }

    const adminEmail = process.env.RECLAMATIONS_EMAIL || "reclamations@angelivisions.com"

    try {
      await sendMail({
        to: adminEmail,
        subject: `⚠️ Nouvelle réclamation [${number}] — ${data.firstName} ${data.lastName}`,
        html: buildHtmlEmail(submission),
        replyTo: data.email,
      })
    } catch (mailError) {
      console.error("[Reclamations API] Admin mail error:", mailError)
    }

    try {
      await sendMail({
        to: data.email,
        subject: `Accusé de réception - Réclamation ${number}`,
        html: buildConfirmationEmail(submission),
        replyTo: adminEmail,
      })
    } catch (mailError) {
      console.error("[Reclamations API] Client mail error:", mailError)
    }

    return NextResponse.json({ success: true, number })
  } catch (error) {
    console.error("[Reclamations API POST] Error:", error)
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

    if (redis) {
      await redis.del(reclamationKey(id))
      await redis.srem(INDEX_KEY, id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Reclamations API DELETE] Error:", error)
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression." },
      { status: 500 }
    )
  }
}
