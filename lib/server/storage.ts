import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const ADMIN_FILE = path.join(DATA_DIR, "admin.json")

export type AdminRecord = {
  email: string
  passwordHash: string
  createdAt: string
  updatedAt: string
}

export async function readAdmin(): Promise<AdminRecord | null> {
  try {
    const raw = await fs.readFile(ADMIN_FILE, "utf8")
    return JSON.parse(raw) as AdminRecord
  } catch (e: any) {
    if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return null
    throw e
  }
}

export async function writeAdmin(record: AdminRecord) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(ADMIN_FILE, JSON.stringify(record, null, 2), "utf8")
}
