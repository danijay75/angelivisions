import { type NextRequest, NextResponse } from "next/server"
import { sendMail } from "@/lib/server/mailer"
import { verifyCaptcha } from "@/lib/server/captcha"
import { requireAdmin } from "@/lib/server/admin-session"
import { createGoogleContact } from "@/lib/server/google-contacts"

function generateDevisNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DEV-${year}${month}-${randomStr}`
}

interface DevisPayload {
  id?: string
  number?: string
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
  const servicesList = data.services && data.services.length
    ? data.services.map((s) => `<li>${s}</li>`).join("")
    : "<li>Non spécifié</li>"

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">📋 Nouvelle Demande de Devis : ${data.number}</h1>
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

function buildConfirmationEmail(name: string, number: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">✨ Merci pour votre demande !</h1>
      </div>
      <div style="background: #1e1b4b; padding: 24px; color: #e2e8f0;">
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre demande de devis (Référence : <strong>${number}</strong>) et nous l'étudierons dans les <strong>plus brefs délais</strong>.</p>
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

  // Les devis sont désormais stockés dans Google Forms/Sheets.
  // L'API renvoie un tableau vide pour ne pas faire planter l'interface Admin.
  return NextResponse.json({ success: true, devis: [] })
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

    const number = generateDevisNumber()

    // 4. Synchronisation avec Google Sheets (via Apps Script)
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL
    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "devis",
            number: number,
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            company: data.company || "",
            eventType: data.eventType || "",
            eventDate: data.eventDate || "",
            guestCount: data.guestCount || "",
            location: data.location || "",
            services: data.services ? data.services.join(", ") : "",
            description: data.description || "",
            consent: data.consent ? "Oui" : "Non"
          })
        })
      } catch (scriptError) {
        console.error("Erreur sync Google Sheets:", scriptError)
      }
    } else {
      console.warn("GOOGLE_SCRIPT_URL manquant. Les données n'ont pas été synchronisées avec Google Sheets.")
    }

    // 1. Sauvegarder dans Google Contacts
    try {
      const nameParts = data.name.trim().split(" ")
      const firstName = nameParts[0] || "Inconnu"
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined
      
      await createGoogleContact({
        firstName,
        lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        label: "Prospect (Devis)",
        notes: `Demande de Devis [${number}]: ${data.eventType || "Événement"}\nServices demandés: ${data.services ? data.services.join(", ") : "Aucun"}\nClient message: ${data.description || "Aucun message"}`
      })
    } catch (contactError) {
      console.error("[Devis API] Google Contact error:", contactError)
    }

    // 3. Envoyer Emails (Admin & Client)
    const adminEmail = process.env.ADMIN_EMAIL || "contact@angelivisions.com"
    const payloadWithNumber = { ...data, number }

    try {
      await sendMail({
        to: adminEmail,
        subject: `🎪 Nouveau devis [${number}] — ${data.name} (${data.eventType || "Événement"})`,
        html: buildHtmlEmail(payloadWithNumber),
        replyTo: data.email, 
      })
    } catch (mailError) {
      console.error("[Devis API] Admin mail error:", mailError)
    }

    try {
      await sendMail({
        to: data.email,
        subject: "Votre demande de devis — Angeli Visions",
        html: buildConfirmationEmail(data.name, number),
        replyTo: adminEmail, 
      })
    } catch (mailError) {
      console.error("[Devis API] Client mail error:", mailError)
    }

    return NextResponse.json({ success: true, number })
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

  // Désactivé : la gestion se fait depuis Google Sheets.
  return NextResponse.json({ success: true })
}
