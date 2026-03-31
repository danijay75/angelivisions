import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/server/admin-session"
import { sendMail } from "@/lib/server/mailer"
import { getNewsletterConfirmationEmail, getAdminNotificationEmail } from "@/lib/emails/newsletter-templates"
import {
  createGoogleContact,
  listNewsletterContacts,
  updateGoogleContact,
  deleteGoogleContact,
} from "@/lib/server/google-contacts"

// ---------- GET: list all newsletter subscribers (admin only) ----------
export async function GET(req: NextRequest) {
  const gate = await requireAdmin()
  if (!gate.ok) {
    return NextResponse.json(gate.body, { status: gate.status })
  }

  try {
    const contacts = await listNewsletterContacts()

    // Map to the shape the frontend expects
    const subscribers = contacts.map((c) => ({
      resourceName: c.resourceName,
      name: c.name,
      email: c.email,
      subscribedAt: c.subscribedAt,
    }))

    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error("[Newsletter API GET] Error:", error)
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
  }
}

// ---------- POST: subscribe (public) ----------
export async function POST(req: NextRequest) {
  try {
    const { email, name, consent, lang = "fr" } = await req.json()

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
    const trimmedName = name.trim()
    const nameParts = trimmedName.split(" ")
    const firstName = nameParts[0] || "Inconnu"
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined

    // Create the contact in Google Contacts (single source of truth)
    const resourceName = await createGoogleContact({
      firstName,
      lastName,
      email: normalizedEmail,
      label: "Newsletter",
      notes: `Abonné à la newsletter depuis la langue : ${lang}`,
    })

    if (!resourceName) {
      return NextResponse.json({ error: "Erreur lors de la création du contact" }, { status: 500 })
    }

    // Send Confirmation Email
    try {
      const preferencesUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/newsletter/preferences?email=${encodeURIComponent(normalizedEmail)}`
      const emailContent = getNewsletterConfirmationEmail(trimmedName, preferencesUrl, lang)

      await sendMail({
        to: normalizedEmail,
        subject: emailContent.subject,
        html: emailContent.html,
      })
    } catch (mailError) {
      console.error("[Newsletter API] Confirmation mail error:", mailError)
    }

    // Send Admin Notification
    try {
      const adminContent = getAdminNotificationEmail(trimmedName, normalizedEmail)
      await sendMail({
        to: process.env.FROM_EMAIL || "contact@angelivisions.com",
        subject: adminContent.subject,
        html: adminContent.html,
      })
    } catch (mailError) {
      console.error("[Newsletter API] Admin notification mail error:", mailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Newsletter API POST] Error:", error)
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
    const { resourceName } = await req.json()
    if (!resourceName) {
      return NextResponse.json({ error: "resourceName requis" }, { status: 400 })
    }

    const ok = await deleteGoogleContact(resourceName)
    if (!ok) {
      return NextResponse.json({ error: "Échec de la suppression" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Newsletter API DELETE] Error:", error)
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 })
  }
}

// ---------- PATCH: update subscriber name/email (admin only) ----------
export async function PATCH(req: NextRequest) {
  const gate = await requireAdmin()
  if (!gate.ok) {
    return NextResponse.json(gate.body, { status: gate.status })
  }

  try {
    const { resourceName, name, email } = await req.json()
    if (!resourceName) {
      return NextResponse.json({ error: "resourceName requis" }, { status: 400 })
    }

    const updates: { name?: string; email?: string } = {}
    if (name !== undefined) updates.name = name
    if (email !== undefined) updates.email = email

    const ok = await updateGoogleContact(resourceName, updates)
    if (!ok) {
      return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Newsletter API PATCH] Error:", error)
    return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 })
  }
}
