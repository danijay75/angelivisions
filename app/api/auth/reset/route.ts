import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { readAdmin, writeAdmin } from "@/lib/server/storage"
import { verifyHCaptcha } from "@/lib/server/hcaptcha"

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

    const validCaptcha = await verifyHCaptcha(captchaToken || "")
    if (!validCaptcha) {
      return NextResponse.json({ success: false, message: "Captcha invalide" }, { status: 400 })
    }

    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] })
    if ((payload as any).typ !== "reset" || !payload.sub) {
      return NextResponse.json({ success: false, message: "Token invalide" }, { status: 400 })
    }

    const admin = await readAdmin()
    if (!admin || admin.email !== payload.sub) {
      return NextResponse.json({ success: false, message: "Compte introuvable" }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 10)
    await writeAdmin({
      ...admin,
      passwordHash: hash,
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
