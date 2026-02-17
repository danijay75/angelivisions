import { NextResponse } from "next/server"
import { findUserByEmail, updateUser } from "@/lib/server/users"
import { verifyCaptcha } from "@/lib/server/captcha"
import { SignJWT } from "jose"
import nodemailer from "nodemailer"

const ENC = new TextEncoder()
function getResetSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET non configuré")
  return ENC.encode(secret)
}

function getMailer() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || "587")
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.FROM_EMAIL || user
  if (!host || !user || !pass || !from) return null
  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
  })
  return { transport, from, fromName: process.env.FROM_NAME, replyTo: process.env.REPLY_TO }
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

    // Ne pas divulguer l’existence du compte
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

    const mailer = getMailer()
    if (!mailer) {
      return NextResponse.json(
        { success: false, message: "Envoi d’email non configuré. Veuillez définir SMTP_* et FROM_EMAIL." },
        { status: 500 },
      )
    }
    await mailer.transport.sendMail({
      from: mailer.fromName ? `${mailer.fromName} <${mailer.from}>` : mailer.from!,
      to: email,
      subject: "Réinitialisation du mot de passe – Angeli Visions",
      html: `<p>Bonjour ${user.name || ""},</p><p>Pour réinitialiser votre mot de passe (valide 15 minutes) :</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      replyTo: mailer.replyTo || mailer.from,
    })

    return NextResponse.json({ success: true, message: "Si un compte existe, un email a été envoyé." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
