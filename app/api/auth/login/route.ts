import { NextResponse } from "next/server"
import { verifyPassword } from "@/lib/server/users"
import { verifyCaptcha } from "@/lib/server/captcha"
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/server/jwt"

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Champs requis manquants" }, { status: 400 })
    }

    const captchaOk = await verifyCaptcha(captchaToken || "")
    if (!captchaOk) {
      return NextResponse.json({ success: false, message: "Captcha invalide" }, { status: 400 })
    }

    // Verify against Redis
    const user = await verifyPassword(email, password)

    if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ success: false, message: "Identifiants invalides" }, { status: 401 })
    }

    if (!user.active) {
      return NextResponse.json({ success: false, message: "Compte désactivé" }, { status: 403 })
    }

    const token = await createSessionToken(user.email)
    const res = NextResponse.json({ success: true, role: user.role })
    setSessionCookie(res, token)
    return res
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
