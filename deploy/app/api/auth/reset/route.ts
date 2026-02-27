import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { findUserByEmail, updateUser } from "@/lib/server/users"
import { verifyCaptcha } from "@/lib/server/captcha"

const ENC = new TextEncoder()
function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET non configuré")
  return ENC.encode(secret)
}

export async function POST(req: Request) {
  try {
    const { token, password, captchaToken } = await req.json()
    if (!token || !password) {
      return NextResponse.json({ success: false, message: "Champs requis manquants" }, { status: 400 })
    }
    if (String(password).length < 8) {
      return NextResponse.json(
        { success: false, message: "Mot de passe trop court (min. 8 caractères)" },
        { status: 400 },
      )
    }

    const validCaptcha = await verifyCaptcha(captchaToken || "")
    if (!validCaptcha) {
      return NextResponse.json({ success: false, message: "Captcha invalide" }, { status: 400 })
    }

    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] })
    if ((payload as any).typ !== "reset" || !payload.sub) {
      return NextResponse.json({ success: false, message: "Token invalide" }, { status: 400 })
    }

    const email = payload.sub as string
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ success: false, message: "Compte introuvable" }, { status: 400 })
    }

    await updateUser(user.id, {
      password: password,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur (session expirée ou token invalide)" }, { status: 500 })
  }
}
