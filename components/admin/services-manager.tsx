"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { defaultServices, type ServiceItem } from "@/data/services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Save, X, Trash2, Check, GripVertical, RefreshCw } from "lucide-react"
import ImagePicker from "@/components/admin/image-picker"

const colorOptions = [
  { id: "purple-pink", label: "Violet-Rose", value: "from-purple-500 to-pink-500" },
  { id: "blue-cyan", label: "Bleu-Cyan", value: "from-blue-500 to-cyan-500" },
  { id: "green-emerald", label: "Vert-Émeraude", value: "from-green-500 to-emerald-500" },
  { id: "orange-red", label: "Orange-Rouge", value: "from-orange-500 to-red-500" },
  { id: "indigo-purple", label: "Indigo-Violet", value: "from-indigo-500 to-purple-500" },
  { id: "teal-blue", label: "Sarcelle-Bleu", value: "from-teal-500 to-blue-500" },
  { id: "pink-rose", label: "Rose-Rosé", value: "from-pink-500 to-rose-500" },
  { id: "yellow-orange", label: "Jaune-Orange", value: "from-yellow-500 to-orange-500" },
]

function genId(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function ServicesManager() {
  const [services, setServices] = useState<ServiceItem[]>(defaultServices)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [featureInput, setFeatureInput] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const editSectionRef = useRef<HTMLDivElement>(null)

  const loadServices = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Loading services from API...")
      const response = await fetch("/api/services")
      if (response.ok) {
        const data = await response.json()
        if (data.services && Array.isArray(data.services)) {
          setServices(data.services)
          console.log("[v0] Loaded services from API:", data.services.length, "services")
        }
      } else {
        console.log("[v0] Failed to load services from API, using defaults")
      }
    } catch (error) {
      console.log("[v0] Error loading services:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load from API on mount
  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    if (editIndex !== null && editSectionRef.current) {
      setTimeout(() => {
        editSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }, [editIndex])

  const saveAll = async () => {
    setIsSaving(true)
    try {
      console.log("[v0] Saving services to API...")
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ services }),
      })

      if (response.ok) {
        console.log("[v0] Services saved successfully to API")
        alert("Services enregistrés avec succès.")
      } else {
        console.log("[v0] Failed to save services to API")
        alert("Erreur lors de l'enregistrement des services.")
      }
    } catch (error) {
      console.log("[v0] Error saving services:", error)
      alert("Erreur lors de l'enregistrement des services.")
    } finally {
      setIsSaving(false)
    }
  }

  const resetDefaults = () => {
    if (confirm("Réinitialiser les services aux valeurs par défaut ?")) {
      setServices(defaultServices)
      // Also save to API
      saveAll()
    }
  }

  const startEdit = (idx: number) => setEditIndex(idx)
  const cancelEdit = () => setEditIndex(null)

  const updateField = (idx: number, field: keyof ServiceItem, value: any) => {
    setServices((prev) => {
      const copy = [...prev]
      ;(copy[idx] as any)[field] = value
      if (field === "title") {
        copy[idx].id = genId(String(value || "service"))
      }
      return copy
    })
  }

  const addFeature = (idx: number) => {
    const v = featureInput.trim()
    if (!v) return
    setServices((prev) => {
      const copy = [...prev]
      const feats = new Set([...(copy[idx].features || []), v])
      copy[idx].features = Array.from(feats)
      return copy
    })
    setFeatureInput("")
  }

  const removeFeature = (idx: number, feat: string) => {
    setServices((prev) => {
      const copy = [...prev]
      copy[idx].features = (copy[idx].features || []).filter((f) => f !== feat)
      return copy
    })
  }

  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: genId("Nouveau service"),
        title: "Nouveau service",
        description: "",
        features: [],
        color: "from-purple-500 to-pink-500",
        image: undefined,
      },
    ])
    setEditIndex(services.length)
  }

  const deleteService = (idx: number) => {
    if (!confirm("Supprimer ce service ?")) return
    setServices((prev) => prev.filter((_, i) => i !== idx))
    setEditIndex(null)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", "")
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    setServices((prev) => {
      const newServices = [...prev]
      const draggedService = newServices[draggedIndex]

      // Supprimer l'élément de sa position actuelle
      newServices.splice(draggedIndex, 1)

      // L'insérer à la nouvelle position
      const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
      newServices.splice(insertIndex, 0, draggedService)

      return newServices
    })

    // Ajuster l'index d'édition si nécessaire
    if (editIndex !== null) {
      if (editIndex === draggedIndex) {
        const newEditIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
        setEditIndex(newEditIndex)
      } else if (editIndex > draggedIndex && editIndex <= dropIndex) {
        setEditIndex(editIndex - 1)
      } else if (editIndex < draggedIndex && editIndex >= dropIndex) {
        setEditIndex(editIndex + 1)
      }
    }

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-white mr-2" />
        <span className="text-white">Chargement des services...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Services ({services.length})</CardTitle>
          <p className="text-white/60 text-sm">Glissez-déposez pour réorganiser l'ordre d'affichage</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((s, idx) => (
            <div
              key={s.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 border rounded-lg transition-all cursor-move ${
                draggedIndex === idx
                  ? "bg-white/20 border-white/30 opacity-50"
                  : dragOverIndex === idx
                    ? "bg-white/15 border-white/40 scale-105"
                    : editIndex === idx
                      ? "bg-white/15 border-white/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="flex-shrink-0 text-white/40 hover:text-white/60 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5" />
              </div>

              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image || "/placeholder.svg?height=48&width=48&query=logo"}
                  alt={s.title}
                  className="w-12 h-12 rounded bg-white/10 object-contain flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`bg-gradient-to-r ${s.color} text-white`}>{s.title}</Badge>
                    <span className="text-white/40 text-xs">#{idx + 1}</span>
                    {editIndex === idx && <Badge className="bg-blue-600 text-white text-xs">En cours d'édition</Badge>}
                  </div>
                  <p className="text-white/60 text-sm line-clamp-1">{s.description || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  className={`min-w-[44px] min-h-[44px] md:min-w-auto md:min-h-auto ${
                    editIndex === idx ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={() => (editIndex === idx ? cancelEdit() : startEdit(idx))}
                >
                  {editIndex === idx ? "Fermer" : "Modifier"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="min-w-[44px] min-h-[44px] md:min-w-auto md:min-h-auto"
                  onClick={() => deleteService(idx)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Button onClick={addService} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un service
            </Button>
            <Button onClick={saveAll} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
              {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button onClick={loadServices} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recharger
            </Button>
            <Button
              onClick={resetDefaults}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      <div ref={editSectionRef}>
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              Édition
              {editIndex !== null && (
                <span className="text-white/60 text-base font-normal ml-2">- {services[editIndex]?.title}</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {editIndex === null ? (
              <div className="text-center py-8">
                <p className="text-white/60 mb-4">Sélectionnez un service dans la liste ci-dessus pour l'éditer.</p>
                <Button onClick={addService} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un nouveau service
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2 block">Titre</Label>
                    <Input
                      value={services[editIndex].title}
                      onChange={(e) => updateField(editIndex, "title", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white mb-2 block">ID (automatique)</Label>
                    <Input value={services[editIndex].id} readOnly className="bg-white/10 border-white/20 text-white" />
                  </div>
                </div>

                <div>
                  <Label className="text-white mb-2 block">Description</Label>
                  <Textarea
                    value={services[editIndex].description}
                    onChange={(e) => updateField(editIndex, "description", e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-white mb-2 block">Couleur</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {colorOptions.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => updateField(editIndex, "color", c.value)}
                        className={`relative p-3 rounded-lg border-2 transition-all ${
                          services[editIndex].color === c.value
                            ? "border-white scale-105"
                            : "border-white/20 hover:border-white/50"
                        }`}
                      >
                        <div className={`w-full h-8 rounded bg-gradient-to-r ${c.value}`} />
                        <p className="text-white text-xs mt-1">{c.label}</p>
                        {services[editIndex].color === c.value && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <ImagePicker
                  value={services[editIndex].image}
                  onChange={(v) => updateField(editIndex, "image", v)}
                  hint="PNG ou SVG carré recommandé (min. 128×128). Vous pouvez importer un fichier ou coller une URL."
                />

                <div>
                  <Label className="text-white mb-2 block">Caractéristiques (features)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(services[editIndex].features || []).map((f) => (
                      <Badge
                        key={f}
                        className="bg-purple-600/80 text-white cursor-pointer"
                        onClick={() => removeFeature(editIndex, f)}
                      >
                        {f} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Ajouter une caractéristique et Entrée"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addFeature(editIndex)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addFeature(editIndex)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveAll} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    Fermer l'édition
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
