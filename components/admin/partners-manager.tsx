"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X, GripVertical, Globe } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"
import type { Partner } from "@/data/partners"

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

export default function PartnersManager() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [form, setForm] = useState<Partial<Partner>>({})
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const sortedPartners = useMemo(() => [...partners].sort((a, b) => a.order - b.order), [partners])

  async function loadPartners() {
    setLoading(true)
    try {
      const res = await fetch("/api/partners", { cache: "no-store" })
      const json = (await res.json()) as { ok: boolean; partners: Partner[] }
      if (json.ok) setPartners(json.partners)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPartners()
  }, [])

  const startCreate = () => {
    setEditing(null)
    setForm({ name: "", url: "", logo: "" })
  }

  const startEdit = (p: Partner) => {
    setEditing(p)
    setForm({ ...p })
  }

  const cancel = () => {
    setEditing(null)
    setForm({})
  }

  const onImageChange = (images: string[]) => {
    setForm((prev) => ({ ...prev, logo: images[0] || "" }))
  }

  const save = async () => {
    if (!form.name) return
    if (editing) {
      const res = await fetch(`/api/partners/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          url: form.url,
          logo: form.logo,
        }),
      })
      const json = await res.json()
      if (json.ok) {
        await loadPartners()
        cancel()
      }
    } else {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          url: form.url,
          logo: form.logo,
        }),
      })
      const json = await res.json()
      if (json.ok) {
        await loadPartners()
        cancel()
      }
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce partenaire ?")) return
    const res = await fetch(`/api/partners/${id}`, { method: "DELETE" })
    const json = await res.json()
    if (json.ok) await loadPartners()
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sortedPartners.findIndex((i) => i.id === active.id)
    const newIndex = sortedPartners.findIndex((i) => i.id === over.id)
    const newOrder = arrayMove(sortedPartners, oldIndex, newIndex)
    setPartners(newOrder.map((p, i) => ({ ...p, order: i })))
    // Persist order
    await fetch("/api/partners/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: newOrder.map((p) => p.id) }),
    })
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Partenaires</CardTitle>
        <div className="flex gap-2">
          <Badge className="bg-emerald-600/80 text-white">{partners.length} partenaires</Badge>
          <Button
            onClick={startCreate}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau partenaire
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {(editing || form.name !== undefined) && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-3">
                <div>
                  <Label className="text-white mb-2 block">Nom du partenaire</Label>
                  <Input
                    value={form.name || ""}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white mb-2 block">Lien web (URL)</Label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      value={form.url || ""}
                      onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white pl-9"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Logo</Label>
                <ImageUpload
                  images={form.logo ? [form.logo] : []}
                  onImagesChange={onImageChange}
                  maxImages={1}
                  label="Logo du partenaire"
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
            <SortableContext items={sortedPartners.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedPartners.map((p) => (
                  <SortableItem key={p.id} id={p.id}>
                    <Card className="bg-white/5 border-white/10 overflow-hidden">
                      <div className="relative h-32 flex items-center justify-center p-4 bg-white/10">
                        {p.logo ? (
                          <img src={p.logo} alt={p.name} className="max-w-full max-h-full object-contain mix-blend-screen" />
                        ) : (
                          <div className="text-white/30 text-sm">Aucun logo</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </div>
                      <CardContent className="p-3">
                        <div className="flex flex-col gap-2">
                          <div className="text-white font-semibold truncate" title={p.name}>{p.name}</div>
                          {p.url && (
                             <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-emerald-300 text-xs hover:text-emerald-200 truncate">
                               {p.url}
                             </a>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => startEdit(p)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1 bg-red-600 hover:bg-red-700"
                              onClick={() => remove(p.id)}
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
