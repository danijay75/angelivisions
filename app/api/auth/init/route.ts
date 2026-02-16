import { NextResponse } from "next/server"
import { readAdmin, writeAdmin } from "@/lib/server/storage"
import { verifyHCaptcha } from "@/lib/server/hcaptcha"
import bcrypt from "bcryptjs"
import { createAdminRecordToken, setAdminRecordCookie } from "@/lib/server/jwt"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json()
    if (!email || !password) {
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
    const adminExists = await readAdmin()
    if (adminExists) {
      return NextResponse.json({ success: false, message: "Un administrateur existe déjà" }, { status: 400 })
    }

    const captchaOk = await verifyHCaptcha(captchaToken || "")
    if (!captchaOk) {
      return NextResponse.json({ success: false, message: "Captcha invalide" }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)
    const now = new Date().toISOString()

    // Tenter d'écrire sur disque, mais ne pas bloquer si l'environnement est read-only
    let persisted = true
    try {
      await writeAdmin({ email, passwordHash: hash, createdAt: now, updatedAt: now })
    } catch {
      persisted = false
    }

    // Écrire aussi un cookie httpOnly signé avec l'admin (fallback persistant)
    const adminRecordJwt = await createAdminRecordToken({ email, passwordHash: hash })
    const res = NextResponse.json({ success: true, persisted })
    setAdminRecordCookie(res, adminRecordJwt)
    return res
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
