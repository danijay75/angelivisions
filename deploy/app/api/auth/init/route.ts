import { NextResponse } from "next/server"
import { createUser, countUsers } from "@/lib/server/users"
import { verifyCaptcha } from "@/lib/server/captcha"
import { createSessionToken, setSessionCookie } from "@/lib/server/jwt"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, message: "Champs requis manquants" }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: "Email invalide" }, { status: 400 })
    }
    if (String(password).length < 8) {
      return NextResponse.json(
        { success: false, message: "Mot de passe trop court (min. 8 caractères)" },
        { status: 400 },
      )
    }

    // Only allow init if no users exist
    const userCount = await countUsers()
    if (userCount > 0) {
      return NextResponse.json({ success: false, message: "Le système est déjà initialisé" }, { status: 400 })
    }

    const captchaOk = await verifyCaptcha(captchaToken || "")
    if (!captchaOk) {
      return NextResponse.json({ success: false, message: "Captcha invalide" }, { status: 400 })
    }

    // Create the first admin in Redis
    const createdUser = await createUser({
      name,
      email,
      role: "admin",
      password,
      active: true
    })

    // Auto-login the first admin
    const token = await createSessionToken(createdUser.email)
    const res = NextResponse.json({ success: true })
    setSessionCookie(res, token)

    return res
  } catch (error: any) {
    console.error("Init error:", error)
    return NextResponse.json({ success: false, message: error.message || "Erreur serveur" }, { status: 500 })
  }
}
