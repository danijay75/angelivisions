import { NextResponse } from "next/server"
import { getMailer } from "@/lib/server/mailer"
import { requireAdmin } from "@/lib/server/admin-session"

export async function POST(req: Request) {
  try {
    // Security check: require admin
    const gate = await requireAdmin()
    if (!gate.ok) {
      return NextResponse.json(gate.body, { status: gate.status })
    }

    const mailer = getMailer()
    if (!mailer) {
      return NextResponse.json(
        { success: false, message: "Envoi d’email non configuré. Définissez SMTP_*, FROM_EMAIL." },
        { status: 500 },
      )
    }

    const body = await req.json().catch(() => ({}))
    const to: string =
      (body?.to as string) || process.env.FROM_EMAIL || process.env.SMTP_USER || "contact@angelivisions.com"

    const origin = new URL(req.url).origin
    const now = new Date().toLocaleString("fr-FR", { hour12: false })

    await mailer.transport.sendMail({
      from: mailer.fromName ? `${mailer.fromName} <${mailer.from}>` : mailer.from!,
      to,
      subject: "Test SMTP – Angeli Visions",
      html: `
        <p>Bonjour,</p>
        <p>Ceci est un email de test envoyé depuis votre site Angeli Visions.</p>
        <ul>
          <li>Origine: ${origin}</li>
          <li>Date/heure: ${now}</li>
        </ul>
        <p>Si vous recevez cet email, la configuration SMTP fonctionne correctement.</p>
      `,
      replyTo: mailer.replyTo || mailer.from,
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, message: "Échec de l’envoi." }, { status: 500 })
  }
}
