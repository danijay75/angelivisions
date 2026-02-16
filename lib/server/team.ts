import { defaultTeam, type TeamMember } from "@/data/team"

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const TEAM_KEY = "team:members"

const MEM_TEAM: TeamMember[] | null = null

const g = globalThis as any
if (!g.__AV_TEAM__) {
  g.__AV_TEAM__ = null as TeamMember[] | null
}

async function kvGet<T>(key: string): Promise<T | null> {
  if (!KV_URL || !KV_TOKEN) return null
  try {
    const res = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    })

    if (!res.ok) return null

    const j = await res.json().catch(() => ({}))
    const raw = (j as any)?.result
    if (!raw) return null

    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  } catch (error) {
    console.error("[v0] KV get error:", error)
    return null
  }
}

async function kvSet<T>(key: string, value: T): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) return false
  try {
    const encodedValue = encodeURIComponent(JSON.stringify(value))
    const res = await fetch(`${KV_URL}/set/${key}/${encodedValue}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
      },
    })

    return res.ok
  } catch (error) {
    console.error("[v0] KV set error:", error)
    return false
  }
}

async function kvGetTeam(): Promise<TeamMember[] | null> {
  if (!KV_URL || !KV_TOKEN) return null
  try {
    const res = await fetch(`${KV_URL}/get/${TEAM_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    const j = await res.json().catch(() => ({}))
    const raw = (j as any)?.result
    if (!raw) return null
    try {
      return JSON.parse(raw) as TeamMember[]
    } catch {
      return null
    }
  } catch {
    return null
  }
}

async function kvSetTeam(members: TeamMember[]): Promise<void> {
  if (!KV_URL || !KV_TOKEN) return
  try {
    const value = encodeURIComponent(JSON.stringify(members))
    await fetch(`${KV_URL}/set/${TEAM_KEY}/${value}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    })
  } catch {
    // Ignore KV errors, fallback to memory
  }
}

export async function getTeam(): Promise<TeamMember[]> {
  try {
    const fromKV = await kvGetTeam()
    if (fromKV) {
      g.__AV_TEAM__ = fromKV
      return fromKV
        .map((m, idx) => ({ ...m, order: typeof m.order === "number" ? m.order : idx }))
        .sort((a, b) => a.order - b.order)
    }

    // Fallback to memory
    if (g.__AV_TEAM__) {
      return g.__AV_TEAM__
        .map((m, idx) => ({ ...m, order: typeof m.order === "number" ? m.order : idx }))
        .sort((a, b) => a.order - b.order)
    }

    // Final fallback to default team
    return defaultTeam
  } catch (error) {
    console.error("[v0] getTeam error:", error)
    return defaultTeam
  }
}

export async function saveTeam(members: TeamMember[]): Promise<void> {
  try {
    // Always save to memory first
    g.__AV_TEAM__ = members

    // Try to save to KV
    await kvSetTeam(members)
  } catch (error) {
    console.error("[v0] saveTeam error:", error)
    // Memory fallback already saved above
  }
}

export async function createMember(input: Omit<TeamMember, "id" | "order">): Promise<TeamMember> {
  try {
    const members = await getTeam()
    const nextOrder = members.length
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const member: TeamMember = {
      id,
      order: nextOrder,
      ...input,
    }
    const updated = [...members, member]
    await saveTeam(updated)
    return member
  } catch (error) {
    console.error("[v0] createMember error:", error)
    throw new Error("Failed to create team member")
  }
}

export async function updateMember(
  id: string,
  patch: Partial<Omit<TeamMember, "id" | "order">> & Partial<Pick<TeamMember, "order">>,
): Promise<TeamMember | null> {
  const members = await getTeam()
  const idx = members.findIndex((m) => m.id === id)
  if (idx === -1) return null
  const updated = [...members]
  updated[idx] = { ...updated[idx], ...patch }
  await saveTeam(updated)
  return updated[idx]
}

export async function deleteMember(id: string): Promise<boolean> {
  const members = await getTeam()
  const filtered = members.filter((m) => m.id !== id)
  if (filtered.length === members.length) return false
  // Reindex order after deletion
  const reindexed = filtered.map((m, i) => ({ ...m, order: i }))
  await saveTeam(reindexed)
  return true
}

export async function reorderMembers(ids: string[]): Promise<TeamMember[]> {
  const members = await getTeam()
  const map = new Map(members.map((m) => [m.id, m]))
  const reordered: TeamMember[] = []
  ids.forEach((id, index) => {
    const item = map.get(id)
    if (item) reordered.push({ ...item, order: index })
  })
  // Add any missing ids at the end (safety)
  members.forEach((m) => {
    if (!ids.includes(m.id)) reordered.push({ ...m, order: reordered.length })
  })
  await saveTeam(reordered)
  return reordered
}
