
import { NextResponse } from "next/server"
import { sendMail } from "@/lib/server/mailer"
import { createGoogleContact } from "@/lib/server/google-contacts"

export async function POST(req: Request) {
    console.log("[DPD API] Début du traitement de la requête");
    try {
        const body = await req.json()
        const { name, email, requestType, message } = body

        if (!name || !email || !requestType || !message) {
            console.error("[DPD API] Champs manquants:", { name: !!name, email: !!email, requestType: !!requestType, message: !!message });
            return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
        }

        // Mapping des types de demande
        const requestTypes: Record<string, string> = {
            access: "Droit d'accès",
            rectification: "Rectification",
            deletion: "Suppression",
            portability: "Portabilité",
            opposition: "Opposition",
            other: "Autre demande",
        }

        const typeLabel = requestTypes[requestType] || requestType

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
                <h1 style="color: #1e1b4b; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">🛡️ Nouvelle demande RGPD</h1>
                <p style="font-size: 16px;"><strong>Client :</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                <p style="font-size: 16px;"><strong>Type de demande :</strong> <span style="background: #fbbf24; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${typeLabel}</span></p>
                <div style="background: #f8fafc; border-left: 4px solid #cbd5e1; padding: 15px; margin-top: 20px;">
                    <h3 style="margin-top: 0;">Message :</h3>
                    <p style="white-space: pre-wrap; line-height: 1.5;">${message}</p>
                </div>
                <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
                <p style="font-size: 12px; color: #64748b; text-align: center;">Angeli Visions - Protection des données personnelles</p>
            </div>
        `

        console.log(`[DPD API] Tentative d'envoi d'email pour ${name}...`);
        
        // On essaie d'envoyer le mail. On ne met pas de timeout complexe ici pour laisser le mailer gérer.
        // Si le mailer échoue, on attrape l'erreur plus bas.
        try {
            await sendMail({
                to: "contact@angelivisions.com",
                subject: `🛡️ [RGPD] ${typeLabel} - ${name}`,
                html: htmlContent,
                replyTo: email,
            });
            console.log("[DPD API] Email envoyé avec succès");
        } catch (mailError: any) {
            console.error("[DPD API] Échec de l'envoi de l'email:", mailError.message);
            // On continue pour le contact Google, mais on signalera l'erreur si besoin
        }
        
        // Synchronisation avec Google Contacts en arrière-plan
        try {
            const nameParts = name.trim().split(" ");
            const firstName = nameParts[0] || "Inconnu";
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;
            
            await createGoogleContact({
                firstName,
                lastName,
                email: email,
                label: "RGPD",
                notes: `Demande RGPD [${typeLabel}]\nMessage: ${message}`
            });
            console.log("[DPD API] Contact Google créé/mis à jour");
        } catch (contactError) {
            console.error("[DPD API] Erreur Google Contact (non bloquant):", contactError)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("[DPD API] Erreur critique:", error)
        return NextResponse.json(
            { error: "Une erreur interne est survenue. Veuillez nous contacter directement par email." },
            { status: 500 }
        )
    }
}
