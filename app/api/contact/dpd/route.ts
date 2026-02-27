
import { NextResponse } from "next/server"
import { sendMail } from "@/lib/server/mailer"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, requestType, message } = body

        if (!name || !email || !requestType || !message) {
            return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
        }

        // Mapping des types de demande pour l'objet du mail
        const requestTypes: Record<string, string> = {
            access: "Droit d'accès",
            rectification: "Rectification",
            deletion: "Suppression",
            portability: "Portabilité",
            other: "Autre demande",
        }

        const typeLabel = requestTypes[requestType] || requestType

        const htmlContent = `
      <h1>Nouvelle demande RGPD</h1>
      <p><strong>De :</strong> ${name} (${email})</p>
      <p><strong>Type de demande :</strong> ${typeLabel}</p>
      <hr />
      <h3>Message :</h3>
      <p style="white-space: pre-wrap;">${message}</p>
    `

        await sendMail({
            to: "contact@angelivisions.com",
            subject: `[RGPD] Demande : ${typeLabel} - ${name}`,
            html: htmlContent,
            replyTo: email,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("DPD Contact Error:", error)
        return NextResponse.json(
            { error: "Erreur lors de l'envoi du message" },
            { status: 500 }
        )
    }
}
