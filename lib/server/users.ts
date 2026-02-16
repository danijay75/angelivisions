// Upstash KV-backed users store (persistent if KV envs are set), with in-memory fallback for preview.

import crypto from "crypto"

export type Role = "admin" | "editor" | "guest"

export interface StoredUser {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  createdAt: string
  updatedAt: string
  passwordHash: string
  passwordSalt: string
}
export interface PublicUser {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  createdAt: string
  updatedAt: string
}

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const KV_KEY = "av:admin:users"

function toPublic(u: StoredUser): PublicUser {
  const { passwordHash, passwordSalt, ...pub } = u
  return pub
}
function nowISO() {
  return new Date().toISOString()
}
function hashPassword(password: string, salt: string) {
  return crypto
    .createHash("sha256")
    .update(password + salt, "utf8")
    .digest("hex")
}

// In-memory fallback (non-persistent in preview)
const g = globalThis as any
if (!g.__AV_USERS__) {
  g.__AV_USERS__ = [] as StoredUser[]
}
const mem = {
  async getAll(): Promise<StoredUser[]> {
    return g.__AV_USERS__ as StoredUser[]
  },
  async setAll(users: StoredUser[]) {
    g.__AV_USERS__ = users
  },
}

// Upstash helpers
async function kvGet(): Promise<StoredUser[] | null> {
  if (!KV_URL || !KV_TOKEN) return null
  try {
    console.log("KV GET attempt for users")
    const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    })
    console.log("KV GET response status:", res.status)
    if (!res.ok) {
      console.log("KV GET failed with status:", res.status)
      return null
    }
    const j = await res.json().catch(() => ({}))
    console.log("KV GET response data:", j)
    const raw = (j as any)?.result
    if (!raw) {
      console.log("KV GET no result, returning empty array")
      return []
    }
    try {
      const parsed = JSON.parse(raw) as StoredUser[]
      console.log("KV GET parsed users count:", parsed.length)
      return parsed
    } catch (e) {
      console.log("KV GET JSON parse error:", e)
      return []
    }
  } catch (e) {
    console.log("KV GET network error:", e)
    return null
  }
}
async function kvSet(users: StoredUser[]) {
  if (!KV_URL || !KV_TOKEN) return
  const value = encodeURIComponent(JSON.stringify(users))
  await fetch(`${KV_URL}/set/${KV_KEY}/${value}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  })
}

async function readUsers(): Promise<StoredUser[]> {
  const fromKV = await kvGet()
  if (fromKV) return fromKV
  return mem.getAll()
}
async function writeUsers(users: StoredUser[]) {
  if (KV_URL && KV_TOKEN) {
    await kvSet(users)
  } else {
    await mem.setAll(users)
  }
}

export async function listUsers(): Promise<PublicUser[]> {
  const users = await readUsers()
  return users.map(toPublic)
}
export async function countUsers(): Promise<number> {
  try {
    console.log("countUsers called")
    const users = await readUsers()
    console.log("countUsers result:", users.length)
    return users.length
  } catch (e) {
    console.log("countUsers error:", e)
    return 0
  }
}
export async function getUserById(id: string): Promise<StoredUser | null> {
  const users = await readUsers()
  return users.find((u) => u.id === id) || null
}
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const users = await readUsers()
  const e = email.trim().toLowerCase()
  return users.find((u) => u.email.toLowerCase() === e) || null
}
export async function verifyPassword(email: string, password: string): Promise<StoredUser | null> {
  const u = await findUserByEmail(email)
  if (!u) return null
  const computed = hashPassword(password, u.passwordSalt)
  if (computed !== u.passwordHash) return null
  return u
}
export async function createUser(input: {
  name: string
  email: string
  role: Role
  password: string
  active?: boolean
}): Promise<PublicUser> {
  const users = await readUsers()
  const email = input.email.trim().toLowerCase()
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("Email déjà utilisé")
  }
  const salt = crypto.randomBytes(16).toString("hex")
  const passwordHash = hashPassword(input.password, salt)
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    role: input.role,
    active: input.active ?? true,
    createdAt: nowISO(),
    updatedAt: nowISO(),
    passwordHash,
    passwordSalt: salt,
  }
  const next = [user, ...users]
  await writeUsers(next)
  return toPublic(user)
}
export async function updateUser(
  id: string,
  patch: Partial<{ name: string; email: string; role: Role; active: boolean; password: string }>,
): Promise<PublicUser> {
  const users = await readUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error("Utilisateur introuvable")
  const current = users[idx]

  let email = current.email
  if (typeof patch.email === "string" && patch.email.trim()) {
    const e = patch.email.trim().toLowerCase()
    if (e !== current.email.toLowerCase() && users.some((u) => u.email.toLowerCase() === e)) {
      throw new Error("Email déjà utilisé")
    }
    email = e
  }

  let passwordHash = current.passwordHash
  let passwordSalt = current.passwordSalt
  if (typeof patch.password === "string" && patch.password.length > 0) {
    passwordSalt = crypto.randomBytes(16).toString("hex")
    passwordHash = hashPassword(patch.password, passwordSalt)
  }

  const next: StoredUser = {
    ...current,
    name: typeof patch.name === "string" && patch.name.trim() ? patch.name.trim() : current.name,
    email,
    role: (patch.role as Role) ?? current.role,
    active: typeof patch.active === "boolean" ? patch.active : current.active,
    passwordHash,
    passwordSalt,
    updatedAt: nowISO(),
  }
  users[idx] = next
  await writeUsers(users)
  return toPublic(next)
}
export async function removeUser(id: string): Promise<void> {
  const users = await readUsers()
  const next = users.filter((u) => u.id !== id)
  if (next.length === users.length) throw new Error("Utilisateur introuvable")
  await writeUsers(next)
}
