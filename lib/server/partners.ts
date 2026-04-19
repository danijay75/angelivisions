import { defaultPartners, type Partner } from "@/data/partners"

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const PARTNERS_KEY = "partners:list"

const g = globalThis as any
if (!g.__AV_PARTNERS__) {
  g.__AV_PARTNERS__ = null as Partner[] | null
}

async function kvGetPartners(): Promise<Partner[] | null> {
  if (!KV_URL || !KV_TOKEN) return null
  try {
    const res = await fetch(`${KV_URL}/get/${PARTNERS_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    const j = await res.json().catch(() => ({}))
    const raw = (j as any)?.result
    if (!raw) return null
    try {
      return JSON.parse(raw) as Partner[]
    } catch {
      return null
    }
  } catch {
    return null
  }
}

async function kvSetPartners(partners: Partner[]): Promise<void> {
  if (!KV_URL || !KV_TOKEN) return
  try {
    const value = encodeURIComponent(JSON.stringify(partners))
    await fetch(`${KV_URL}/set/${PARTNERS_KEY}/${value}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    })
  } catch {
    // Ignore KV errors, fallback to memory
  }
}

export async function getPartners(): Promise<Partner[]> {
  try {
    const fromKV = await kvGetPartners()
    if (fromKV) {
      g.__AV_PARTNERS__ = fromKV
      return fromKV
        .map((p, idx) => ({ ...p, order: typeof p.order === "number" ? p.order : idx }))
        .sort((a, b) => a.order - b.order)
    }

    // Fallback to memory
    if (g.__AV_PARTNERS__) {
      return (g.__AV_PARTNERS__ as Partner[])
        .map((p, idx) => ({ ...p, order: typeof p.order === "number" ? p.order : idx }))
        .sort((a, b) => a.order - b.order)
    }

    // Final fallback to default partners
    return defaultPartners
  } catch (error) {
    console.error("getPartners error:", error)
    return defaultPartners
  }
}

export async function savePartners(partners: Partner[]): Promise<void> {
  try {
    // Always save to memory first
    g.__AV_PARTNERS__ = partners

    // Try to save to KV
    await kvSetPartners(partners)
  } catch (error) {
    console.error("savePartners error:", error)
    // Memory fallback already saved above
  }
}

export async function createPartner(input: Omit<Partner, "id" | "order">): Promise<Partner> {
  try {
    const partners = await getPartners()
    const nextOrder = partners.length
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `partner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const partner: Partner = {
      id,
      order: nextOrder,
      ...input,
    }
    const updated = [...partners, partner]
    await savePartners(updated)
    return partner
  } catch (error) {
    console.error("createPartner error:", error)
    throw new Error("Failed to create partner")
  }
}

export async function updatePartner(
  id: string,
  patch: Partial<Omit<Partner, "id" | "order">> & Partial<Pick<Partner, "order">>,
): Promise<Partner | null> {
  const partners = await getPartners()
  const idx = partners.findIndex((p) => p.id === id)
  if (idx === -1) return null
  const updated = [...partners]
  updated[idx] = { ...updated[idx], ...patch }
  await savePartners(updated)
  return updated[idx]
}

export async function deletePartner(id: string): Promise<boolean> {
  const partners = await getPartners()
  const filtered = partners.filter((p) => p.id !== id)
  if (filtered.length === partners.length) return false
  // Reindex order after deletion
  const reindexed = filtered.map((p, i) => ({ ...p, order: i }))
  await savePartners(reindexed)
  return true
}

export async function reorderPartners(ids: string[]): Promise<Partner[]> {
  const partners = await getPartners()
  const map = new Map(partners.map((p) => [p.id, p]))
  const reordered: Partner[] = []
  ids.forEach((id, index) => {
    const item = map.get(id)
    if (item) reordered.push({ ...item, order: index })
  })
  // Add any missing ids at the end (safety)
  partners.forEach((p) => {
    if (!ids.includes(p.id)) reordered.push({ ...p, order: reordered.length })
  })
  await savePartners(reordered)
  return reordered
}
