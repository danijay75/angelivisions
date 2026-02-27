"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Mail,
  GripVertical,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Globe,
} from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"
import type { TeamMember, SocialLinks } from "@/data/team"

// dnd-kit
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableItem({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div
        className="absolute left-2 top-2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        {...attributes}
        {...listeners}
        aria-label="Drag handle"
        title="Déplacer"
      >
        <GripVertical className="w-4 h-4 text-white/60" />
      </div>
      {children}
    </div>
  )
}

export default function TeamManager() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [form, setForm] = useState<Partial<TeamMember>>({})
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const sortedTeam = useMemo(() => [...team].sort((a, b) => a.order - b.order), [team])

  async function loadTeam() {
    setLoading(true)
    try {
      const res = await fetch("/api/team", { cache: "no-store" })
      const json = (await res.json()) as { ok: boolean; team: TeamMember[] }
      if (json.ok) setTeam(json.team)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTeam()
  }, [])

  const startCreate = () => {
    setEditing(null)
    setForm({ name: "", title: "", email: "", photo: "", roles: [], socials: {} })
  }

  const startEdit = (m: TeamMember) => {
    setEditing(m)
    setForm({ ...m, roles: m.roles ? [...m.roles] : [], socials: m.socials ? { ...m.socials } : {} })
  }

  const cancel = () => {
    setEditing(null)
    setForm({})
  }

  const onImageChange = (images: string[]) => {
    setForm((prev) => ({ ...prev, photo: images[0] || "" }))
  }

  const setSocial = (key: keyof SocialLinks, value: string) => {
    setForm((prev) => ({ ...prev, socials: { ...(prev.socials || {}), [key]: value } }))
  }

  const setRolesFromText = (text: string) => {
    const tokens = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    setForm((prev) => ({ ...prev, roles: tokens }))
  }

  const save = async () => {
    if (!form.name || !form.title || !form.email) return
    if (editing) {
      const res = await fetch(`/api/team/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          title: form.title,
          email: form.email,
          photo: form.photo,
          roles: form.roles || [],
          socials: form.socials || {},
        }),
      })
      const json = await res.json()
      if (json.ok) {
        await loadTeam()
        cancel()
      }
    } else {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          title: form.title,
          email: form.email,
          photo: form.photo,
          roles: form.roles || [],
          socials: form.socials || {},
        }),
      })
      const json = await res.json()
      if (json.ok) {
        await loadTeam()
        cancel()
      }
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce membre ?")) return
    const res = await fetch(`/api/team/${id}`, { method: "DELETE" })
    const json = await res.json()
    if (json.ok) await loadTeam()
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sortedTeam.findIndex((i) => i.id === active.id)
    const newIndex = sortedTeam.findIndex((i) => i.id === over.id)
    const newOrder = arrayMove(sortedTeam, oldIndex, newIndex)
    setTeam(newOrder.map((m, i) => ({ ...m, order: i })))
    // Persist order
    await fetch("/api/team/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: newOrder.map((m) => m.id) }),
    })
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Équipe</CardTitle>
        <div className="flex gap-2">
          <Badge className="bg-emerald-600/80 text-white">{team.length} membres</Badge>
          <Button
            onClick={startCreate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau membre
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {(editing || form.name !== undefined) && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-3">
                <div>
                  <Label className="text-white mb-2 block">Nom</Label>
                  <Input
                    value={form.name || ""}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Poste</Label>
                  <Input
                    value={form.title || ""}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Email</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      value={form.email || ""}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white pl-9"
                      placeholder="prenom@domaine.com"
                      type="email"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Rôles (séparés par des virgules)</Label>
                  <Input
                    value={(form.roles || []).join(", ")}
                    onChange={(e) => setRolesFromText(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Programmation, Direction, ..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white mb-2 block">Instagram</Label>
                    <div className="relative">
                      <Instagram className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        value={form.socials?.instagram || ""}
                        onChange={(e) => setSocial("instagram", e.target.value)}
                        className="bg-white/10 border-white/20 text-white pl-9"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        value={form.socials?.linkedin || ""}
                        onChange={(e) => setSocial("linkedin", e.target.value)}
                        className="bg-white/10 border-white/20 text-white pl-9"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Twitter / X</Label>
                    <div className="relative">
                      <Twitter className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        value={form.socials?.twitter || ""}
                        onChange={(e) => setSocial("twitter", e.target.value)}
                        className="bg-white/10 border-white/20 text-white pl-9"
                        placeholder="https://x.com/..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">Facebook</Label>
                    <div className="relative">
                      <Facebook className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        value={form.socials?.facebook || ""}
                        onChange={(e) => setSocial("facebook", e.target.value)}
                        className="bg-white/10 border-white/20 text-white pl-9"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-white mb-2 block">Site web</Label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        value={form.socials?.website || ""}
                        onChange={(e) => setSocial("website", e.target.value)}
                        className="bg-white/10 border-white/20 text-white pl-9"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Photo</Label>
                <ImageUpload
                  images={form.photo ? [form.photo] : []}
                  onImagesChange={onImageChange}
                  maxImages={1}
                  label="Photo de profil"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={save} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
              <Button
                onClick={cancel}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 bg-white/5 rounded-xl border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <SortableContext items={sortedTeam.map((m) => m.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedTeam.map((m) => (
                  <SortableItem key={m.id} id={m.id}>
                    <Card className="bg-white/5 border-white/10 overflow-hidden">
                      <div className="relative h-40">
                        <img src={m.photo || "/placeholder.svg"} alt={m.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-white font-semibold">{String(m.name)}</div>
                            <div className="text-white/70 text-sm">{String(m.title)}</div>
                            <a href={`mailto:${String(m.email)}`} className="text-emerald-300 text-sm hover:text-emerald-200">
                              {String(m.email)}
                            </a>
                            {m.roles && m.roles.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {m.roles.map((r, i) => (
                                  <Badge key={i} className="bg-emerald-600/70 text-white">
                                    {String(r)}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => startEdit(m)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => remove(m.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}
