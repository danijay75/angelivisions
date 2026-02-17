import { type NextRequest, NextResponse } from "next/server"
import { sendMail } from "@/lib/server/mailer"
import { verifyCaptcha } from "@/lib/server/captcha"

interface DevisPayload {
    eventType: string
    services: string[]
    eventDate: string
    guestCount: string
    budget: string
    location: string
    name: string
    email: string
    phone: string
    company: string
    description: string
    captchaToken?: string
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
        <p><strong>Budget :</strong> ${data.budget || "Non spécifié"}</p>

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
        <p>Nous avons bien reçu votre demande de devis et nous vous recontacterons dans les <strong>48 heures</strong>.</p>
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

export async function POST(req: NextRequest) {
    try {
        const data: DevisPayload = await req.json()

        if (!data.name || !data.email) {
            return NextResponse.json(
                { success: false, message: "Nom et email requis." },
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

        const adminEmail = process.env.ADMIN_EMAIL || "contact@angelivisions.com"

        // Send notification to admin
        await sendMail({
            to: adminEmail,
            subject: `🎪 Nouveau devis — ${data.name} (${data.eventType || "Événement"})`,
            html: buildHtmlEmail(data),
            replyTo: data.email,
        })

        // Send confirmation to client
        await sendMail({
            to: data.email,
            subject: "Votre demande de devis — Angeli Visions",
            html: buildConfirmationEmail(data.name),
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[Devis API] Error:", error)
        return NextResponse.json(
            { success: false, message: "Erreur lors de l'envoi." },
            { status: 500 }
        )
    }
}
