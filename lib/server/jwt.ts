import { SignJWT, jwtVerify, type JWTPayload } from "jose"
import type { NextResponse } from "next/server"

const ENC = new TextEncoder()
export const SESSION_COOKIE_NAME = "av_session"
const ADMIN_RECORD_COOKIE_NAME = "av_admin_record"

export const SESSION_COOKIE = SESSION_COOKIE_NAME

function getSecretKey() {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be set in production")
    }
    console.warn(
      "AUTH_SECRET non configuré - utilisation d'un secret de secours NON SÉCURISÉ. Définissez AUTH_SECRET en production.",
    )
    return ENC.encode("fallback-secret-use-AUTH_SECRET")
  }
  return ENC.encode(secret)
}

export function getSessionTtlSeconds(): number {
  const raw = process.env.SESSION_TTL_SECONDS
  const n = raw ? Number(raw) : 86400
  return Number.isFinite(n) && n > 0 ? n : 86400
}

export async function createSessionToken(sub: string, extra?: Record<string, unknown>) {
  const ttl = getSessionTtlSeconds()
  const payload: JWTPayload = { typ: "session", ...extra }
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] })
    if (payload.typ !== "session" || !payload.sub) return null
    return payload
  } catch (e) {
    // Token expired or invalid
    return null
  }
}

export function setSessionCookie(res: NextResponse, token: string) {
  const ttl = getSessionTtlSeconds()
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ttl,
  })
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: false, // idem
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })
}

export function getCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie")
  if (!header) return null
  const cookies = header.split(";").map((c) => c.trim())
  for (const c of cookies) {
    const [n, ...rest] = c.split("=")
    if (n === name) return rest.join("=")
  }
  return null
}

export function getSessionCookieFromRequest(req: Request): string | null {
  return getCookie(req, SESSION_COOKIE_NAME)
}

export function getCookieFromRequest(req: Request): string | null {
  return getSessionCookieFromRequest(req)
}

export function getAdminRecordCookieFromRequest(req: Request): string | null {
  return getCookie(req, ADMIN_RECORD_COOKIE_NAME)
}

// ---------- Admin Record JWT (fallback de persistance) -----------
export interface AdminRecordToken {
  email: string
  passwordHash: string
}

export async function createAdminRecordToken(record: AdminRecordToken) {
  // 180 jours
  return await new SignJWT({ typ: "admin-record", email: record.email, passwordHash: record.passwordHash })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(record.email)
    .setIssuedAt()
    .setExpirationTime("180d")
    .sign(getSecretKey())
}

export async function verifyAdminRecordToken(token: string): Promise<AdminRecordToken | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] })
    if (payload.typ !== "admin-record" || !payload.sub || !payload.email || !payload.passwordHash) return null
    return { email: String(payload.email), passwordHash: String(payload.passwordHash) }
  } catch {
    return null
  }
}

export function setAdminRecordCookie(res: NextResponse, token: string) {
  const maxAge = 60 * 60 * 24 * 180
  res.cookies.set(ADMIN_RECORD_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // idem
    sameSite: "lax",
    path: "/",
    maxAge,
  })
}

export function clearAdminRecordCookie(res: NextResponse) {
  res.cookies.set(ADMIN_RECORD_COOKIE_NAME, "", {
    httpOnly: true,
    secure: false, // idem
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  })
}
