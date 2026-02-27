import { NextResponse } from "next/server"
import { sendMail } from "@/lib/server/mailer"
import { requireAdmin } from "@/lib/server/admin-session"

export async function POST(req: Request) {
  try {
    const gate = await requireAdmin()
    if (!gate.ok) {
      return NextResponse.json(gate.body, { status: gate.status })
    }

    const body = await req.json().catch(() => ({}))
    const to: string =
      (body?.to as string) ||
      process.env.ADMIN_EMAIL ||
      process.env.FROM_EMAIL ||
      "contact@angelivisions.com"

    const origin = new URL(req.url).origin
    const now = new Date().toLocaleString("fr-FR", { hour12: false })

    await sendMail({
      to,
      subject: "Test Email – Angeli Visions",
      html: `
        <p>Bonjour,</p>
        <p>Ceci est un email de test envoyé depuis votre site Angeli Visions.</p>
        <ul>
          <li>Origine: ${origin}</li>
          <li>Date/heure: ${now}</li>
        </ul>
        <p>Si vous recevez cet email, la configuration Resend fonctionne correctement. ✅</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[Email Test] Error:", e)
    return NextResponse.json(
      { success: false, message: "Échec de l'envoi." },
      { status: 500 },
    )
  }
}
