import { NextResponse } from "next/server"
import { readAdmin } from "@/lib/server/storage"
import { verifyHCaptcha } from "@/lib/server/hcaptcha"
import bcrypt from "bcryptjs"
import {
  createSessionToken,
  setSessionCookie,
  getAdminRecordCookieFromRequest,
  verifyAdminRecordToken,
} from "@/lib/server/jwt"

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Champs requis manquants" }, { status: 400 })
    }

    const captchaOk = await verifyHCaptcha(captchaToken || "")
    if (!captchaOk) {
      return NextResponse.json({ success: false, message: "Captcha invalide" }, { status: 400 })
    }

    // 1) Tenter via fichier
    let admin = await readAdmin().catch(() => null)

    // 2) Fallback via cookie signé s'il n'y a pas de fichier
    if (!admin) {
      const adminToken = getAdminRecordCookieFromRequest(req)
      const record = adminToken ? await verifyAdminRecordToken(adminToken) : null
      if (record) {
        admin = { email: record.email, passwordHash: record.passwordHash, createdAt: "", updatedAt: "" }
      }
    }

    if (!admin || admin.email !== email) {
      return NextResponse.json({ success: false, message: "Identifiants invalides" }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, admin.passwordHash)
    if (!ok) {
      return NextResponse.json({ success: false, message: "Identifiants invalides" }, { status: 401 })
    }

    const token = await createSessionToken(admin.email)
    const res = NextResponse.json({ success: true })
    setSessionCookie(res, token)
    return res
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 })
  }
}
