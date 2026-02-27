import { NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/server/users"
import { verifyCaptcha } from "@/lib/server/captcha"
import { SignJWT } from "jose"
import { sendMail } from "@/lib/server/mailer"

const ENC = new TextEncoder()
function getResetSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET non configuré")
  return ENC.encode(secret)
}

export async function POST(req: Request) {
  try {
    const { email, captchaToken } = await req.json()
    if (!email) {
      return NextResponse.json({ success: false, message: "Champs requis manquants" }, { status: 400 })
    }

    const validCaptcha = await verifyCaptcha(captchaToken || "")
    if (!validCaptcha) {
      return NextResponse.json({ success: false, message: "Captcha invalide" }, { status: 400 })
    }

    // Check Redis for user
    const user = await findUserByEmail(email)

    // Ne pas divulguer l'existence du compte
    if (!user || !user.active) {
      return NextResponse.json({ success: true, message: "Si un compte existe, un email a été envoyé." })
    }

    const token = await new SignJWT({ typ: "reset", email })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(email)
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(getResetSecret())

    const origin = new URL(req.url).origin
    const resetUrl = `${origin}/admin/reset?token=${encodeURIComponent(token)}`

    await sendMail({
      to: email,
      subject: "Réinitialisation du mot de passe – Angeli Visions",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🔐 Réinitialisation du mot de passe</h1>
          </div>
          <div style="background: #1e1b4b; padding: 24px; color: #e2e8f0;">
            <p>Bonjour ${user.name || ""},</p>
            <p>Pour réinitialiser votre mot de passe (valide 15 minutes) :</p>
            <p style="text-align: center; margin: 24px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Réinitialiser mon mot de passe
              </a>
            </p>
            <p style="font-size: 12px; color: #94a3b8;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          </div>
          <div style="background: #0f0d2e; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">angelivisions.com</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: "Si un compte existe, un email a été envoyé." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
