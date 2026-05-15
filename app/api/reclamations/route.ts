import { type NextRequest, NextResponse } from "next/server"
import { sendMail } from "@/lib/server/mailer"
import { verifyCaptcha } from "@/lib/server/captcha"
import { requireAdmin } from "@/lib/server/admin-session"
import { createGoogleContact } from "@/lib/server/google-contacts"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

const RECLAMATIONS_KEY = "av:reclamations:list"

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
    const data = await redis.get(RECLAMATIONS_KEY)
    return NextResponse.json({ 
      success: true, 
      reclamations: data || [] 
    })
  } catch (error) {
    console.error("[Reclamations API GET] Redis error:", error)
    return NextResponse.json({ success: false, reclamations: [] }, { status: 500 })
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

    const number = generateReclamationNumber()
    const createdAt = new Date().toISOString()
    const newReclamation = { ...data, id: crypto.randomUUID(), number, createdAt }

    // 0. Sauvegarder dans Redis pour l'Admin
    try {
      const existing = await redis.get<any[]>(RECLAMATIONS_KEY) || []
      await redis.set(RECLAMATIONS_KEY, [newReclamation, ...existing.slice(0, 499)])
    } catch (redisError) {
      console.error("[Reclamations API] Redis Save Error:", redisError)
    }

    const submissionData = { ...data, number }

    // 1. Emails Admin et Client
    const adminEmail = process.env.ADMIN_EMAIL || process.env.RECLAMATIONS_EMAIL || "contact@angelivisions.com"
    console.log(`[Reclamations API] Target admin email: ${adminEmail}`)

    try {
      console.log("[Reclamations API] Sending admin notification...")
      await sendMail({
        to: adminEmail,
        subject: `⚠️ Nouvelle réclamation [${number}] — ${data.firstName} ${data.lastName}`,
        html: buildHtmlEmail(submissionData),
        replyTo: data.email,
      })
      console.log("[Reclamations API] Admin notification sent successfully.")
    } catch (mailError) {
      console.error("[Reclamations API] CRITICAL: Admin mail failed:", mailError)
      throw new Error(`Erreur lors de l'envoi de l'email de notification : ${mailError instanceof Error ? mailError.message : String(mailError)}`)
    }

    try {
      console.log("[Reclamations API] Sending client confirmation...")
      await sendMail({
        to: data.email,
        subject: `Accusé de réception - Réclamation ${number}`,
        html: buildConfirmationEmail(submissionData),
        replyTo: adminEmail,
      })
      console.log("[Reclamations API] Client confirmation sent successfully.")
    } catch (mailError) {
      console.error("[Reclamations API] Client mail warning (ignored):", mailError)
      // On ne bloque pas tout si seul l'email client échoue, mais on le logue
    }

    // 4. Synchronisation avec Google Sheets (via Apps Script)
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "reclamation",
            number: number,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || "",
            subject: data.subject || "",
            message: data.message || "",
            consent: data.consent ? "Oui" : "Non"
          })
        })
      } catch (scriptError) {
        console.error("Erreur sync Google Sheets:", scriptError)
      }
    } else {
      console.warn("GOOGLE_SCRIPT_URL manquant. Les données n'ont pas de lien avec Google Sheets.")
    }

    // 3. Sauvegarder dans Google Contacts
    try {
      await createGoogleContact({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        label: "Réclamation",
        notes: `Réclamation [${number}]\nSujet: ${data.subject}\nMessage: ${data.message}`
      })
    } catch (contactError) {
      console.error("[Reclamations API] Google Contact error:", contactError)
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

  // Désactivé
  return NextResponse.json({ success: true })
}
