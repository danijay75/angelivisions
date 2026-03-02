"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, Trash2, Save, X, TrendingUp, Clock, Loader2 } from "lucide-react"
import ImageUpload from "./image-upload"
import RichTextEditor from "./rich-text-editor"
import { type InvestmentProject } from "@/data/investments"

// Removed hardcoded defaultProjects as they are managed via API

export default function InvestmentManager() {
  const [mounted, setMounted] = useState(false)
  const [projects, setProjects] = useState<InvestmentProject[]>([])
  const [editingProject, setEditingProject] = useState<InvestmentProject | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<InvestmentProject>>({})
  const [globalCategories, setGlobalCategories] = useState<string[]>([])
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [newCategoryPreset, setNewCategoryPreset] = useState("")
  const [loading, setLoading] = useState(false)

  const DEFAULT_CATEGORIES = ["Musique", "Théâtre", "Humour", "Expérience Immersive", "Festival", "Événement Sportif"]

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/investments")
      const data = await res.json()
      if (data.projects) setProjects(data.projects)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchProjects()

    // Custom categories can stay in local storage for the editor's preference or we could sync them too.
    // Let's keep them in local storage for now as they are just presets for the UI.
    const savedCats = localStorage.getItem("investment-custom-categories")
    if (savedCats) {
      try {
        setCustomCategories(JSON.parse(savedCats))
      } catch { }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("investment-projects", JSON.stringify(projects))
      localStorage.setItem("investment-custom-categories", JSON.stringify(customCategories))
    }
  }, [projects, customCategories, mounted])

  useEffect(() => {
    const cats = new Set<string>(DEFAULT_CATEGORIES)
    // Add categories from custom list
    customCategories.forEach(c => cats.add(c))
    // Add categories from projects (in case some were added but not in custom list)
    projects.forEach(p => {
      if (p.category) cats.add(p.category)
    })
    setGlobalCategories(Array.from(cats).sort())
  }, [projects, customCategories])

  // Auto-generate slug from title
  useEffect(() => {
    if (isCreating || (editingProject && !formData.slug)) {
      if (formData.title && !formData.slug) {
        const generatedSlug = formData.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
        updateFormData("slug", generatedSlug)
      }
    }
  }, [formData.title, isCreating, editingProject])

  const handleBulkCategoryUpdate = async (oldCat: string, newCat: string | null) => {
    const action = newCat === null ? "supprimer" : `renommer en "${newCat}"`
    if (!confirm(`Voulez-vous ${action} la catégorie "${oldCat}" pour TOUS les projets ?`)) return

    setLoading(true)
    try {
      const affected = projects.filter(p => p.category === oldCat)
      for (const p of affected) {
        await fetch("/api/investments", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...p, category: newCat || "" })
        })
      }
      await fetchProjects()

      // Update local custom categories
      setCustomCategories(prev => {
        if (newCat === null) {
          return prev.filter(c => c !== oldCat)
        } else {
          const filtered = prev.filter(c => c !== oldCat)
          if (!DEFAULT_CATEGORIES.includes(newCat)) {
            return [...filtered, newCat]
          }
          return filtered
        }
      })
      alert("Mise à jour globale effectuée.")
    } catch (error) {
      console.error("Bulk update failed:", error)
      alert("Erreur lors de la mise à jour globale.")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="text-white">Chargement...</div>
        </CardContent>
      </Card>
    )
  }

  const handleCreate = () => {
    setEditingProject(null)
    setFormData({
      title: "",
      slug: "",
      category: "",
      description: "",
      fullDescription: "",
      targetAmount: 0,
      currentAmount: 0,
      expectedReturn: "",
      duration: "",
      risk: "Modéré",
      highlights: [],
      image: "",
      isActive: true,
    })
    setIsCreating(true)
  }

  const handleEdit = (project: InvestmentProject) => {
    setEditingProject(project)
    setFormData(project)
    setIsCreating(false)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const isNew = !editingProject
      const res = await fetch("/api/investments", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        await fetchProjects()
        setEditingProject(null)
        setIsCreating(false)
        setFormData({})
      } else {
        alert("Erreur lors de la sauvegarde")
      }
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce projet d'investissement ?")) {
      setLoading(true)
      try {
        const res = await fetch(`/api/investments?id=${id}`, { method: "DELETE" })
        if (res.ok) {
          await fetchProjects()
        }
      } catch (error) {
        console.error("Delete failed:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setEditingProject(null)
    setIsCreating(false)
    setFormData({})
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addHighlight = (highlight: string) => {
    if (highlight.trim() && !formData.highlights?.includes(highlight.trim())) {
      updateFormData("highlights", [...(formData.highlights || []), highlight.trim()])
    }
  }

  const removeHighlight = (highlight: string) => {
    updateFormData("highlights", formData.highlights?.filter((h) => h !== highlight) || [])
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Faible":
        return "bg-green-600/80"
      case "Modéré":
        return "bg-yellow-600/80"
      case "Élevé":
        return "bg-red-600/80"
      default:
        return "bg-gray-600/80"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Projets d'Investissement</h2>
          <p className="text-white/60">Gérez les projets culturels disponibles à l'investissement</p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      {(isCreating || editingProject) && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              {editingProject ? "Modifier le projet" : "Nouveau projet d'investissement"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white mb-2 block">Titre du projet</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Nom du projet"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Slug (URL)</Label>
                <Input
                  value={formData.slug || ""}
                  onChange={(e) => updateFormData("slug", e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="nom-du-projet"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Catégorie</Label>
                <div className="flex gap-2">
                  <select
                    value={formData.category || ""}
                    onChange={(e) => updateFormData("category", e.target.value)}
                    className="flex-1 bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {globalCategories.map(cat => (
                      <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {globalCategories.map(cat => (
                    <div key={cat} className="flex items-center gap-1 bg-white/5 rounded-md pr-1 hover:bg-white/10 transition-colors group">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-[10px] text-white/50 hover:text-white h-6 px-2"
                        onClick={() => updateFormData("category", cat)}
                      >
                        {cat}
                      </Button>
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            const name = prompt("Nouveau nom pour cette catégorie ?", cat)
                            if (name && name !== cat) handleBulkCategoryUpdate(cat, name)
                          }}
                          className="px-1 text-blue-400 hover:text-blue-300"
                          title="Renommer"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleBulkCategoryUpdate(cat, null)}
                          className="px-1 text-red-400 hover:text-red-300"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <Input
                    value={newCategoryPreset}
                    onChange={e => setNewCategoryPreset(e.target.value)}
                    placeholder="Nouvelle catégorie..."
                    className="bg-white/5 border-white/10 text-white text-sm h-8"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const val = newCategoryPreset.trim()
                      if (val) {
                        updateFormData("category", val)
                        if (!globalCategories.includes(val)) {
                          setCustomCategories(prev => [...prev, val])
                        }
                        setNewCategoryPreset("")
                      }
                    }}
                    className="h-8 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">Description courte (Liste)</Label>
              <RichTextEditor
                content={formData.description || ""}
                onChange={(content) => updateFormData("description", content)}
                placeholder="Description courte qui apparaîtra sur la liste des projets..."
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">Description complète (Page projet)</Label>
              <RichTextEditor
                content={formData.fullDescription || ""}
                onChange={(content) => updateFormData("fullDescription", content)}
                placeholder="Texte détaillé qui apparaîtra sur la page individuelle du projet..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white mb-2 block">Montant cible (€)</Label>
                <Input
                  type="number"
                  value={formData.targetAmount || ""}
                  onChange={(e) => updateFormData("targetAmount", Number.parseInt(e.target.value) || 0)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="50000"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Montant actuel (€)</Label>
                <Input
                  type="number"
                  value={formData.currentAmount || ""}
                  onChange={(e) => updateFormData("currentAmount", Number.parseInt(e.target.value) || 0)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="32000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-white mb-2 block">Rendement attendu</Label>
                <Input
                  value={formData.expectedReturn || ""}
                  onChange={(e) => updateFormData("expectedReturn", e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="15-25%"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Durée</Label>
                <Input
                  value={formData.duration || ""}
                  onChange={(e) => updateFormData("duration", e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="12 mois"
                />
              </div>
              <div>
                <Label className="text-white mb-2 block">Niveau de risque</Label>
                <select
                  value={formData.risk || "Modéré"}
                  onChange={(e) => updateFormData("risk", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                >
                  <option value="Faible" className="bg-slate-800">
                    Faible
                  </option>
                  <option value="Modéré" className="bg-slate-800">
                    Modéré
                  </option>
                  <option value="Élevé" className="bg-slate-800">
                    Élevé
                  </option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">Image du projet</Label>
              <ImageUpload
                images={formData.image ? [formData.image] : []}
                onImagesChange={(images) => updateFormData("image", images[0] || "")}
                maxImages={1}
                label="Image principale"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">Points forts</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.highlights?.map((highlight, index) => (
                  <Badge
                    key={index}
                    className="bg-emerald-600/80 text-white cursor-pointer"
                    onClick={() => removeHighlight(highlight)}
                  >
                    {highlight} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="new-highlight"
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Ajouter un point fort"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const v = (e.target as HTMLInputElement).value
                      addHighlight(v)
                        ; (e.target as HTMLInputElement).value = ""
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("new-highlight") as HTMLInputElement
                    addHighlight(input.value)
                    input.value = ""
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive || false}
                onChange={(e) => updateFormData("isActive", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isActive" className="text-white">
                Projet actif (visible sur le site)
              </Label>
            </div>

            <div className="flex gap-4 pt-6 border-t border-white/20">
              <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Enregistrer
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={loading}
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-white/5 border-white/10 overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-white font-bold text-lg leading-tight shadow-black drop-shadow-md">{String(project.title)}</h3>
                <p className="text-white/70 text-xs">{String(project.category)}</p>
              </div>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col">
              <h3 className="text-white font-bold text-lg mb-2">{String(project.title)}</h3>
              <p className="text-white/80 text-sm mb-4 line-clamp-2 flex-1">{String(project.description)}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Progression</span>
                    <span className="text-white">
                      {Math.round((project.currentAmount / (project.targetAmount || 1)) * 100)}%
                    </span>
                  </div>
                  <Progress value={(project.currentAmount / (project.targetAmount || 1)) * 100} className="h-2" />
                  <div className="flex justify-between text-xs mt-1 text-white/60">
                    <span>€{String(project.currentAmount.toLocaleString())}</span>
                    <span>€{String(project.targetAmount.toLocaleString())}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div className="flex items-center text-white/70 bg-white/5 p-2 rounded">
                    <TrendingUp className="h-4 w-4 mr-2 text-emerald-400" />
                    <span>{String(project.expectedReturn)}</span>
                  </div>
                  <div className="flex items-center text-white/70 bg-white/5 p-2 rounded">
                    <Clock className="h-4 w-4 mr-2 text-blue-400" />
                    <span>{String(project.duration)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleEdit(project)} size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
                  <Edit className="w-4 h-4 mr-2" /> Modifier
                </Button>
                <Button
                  onClick={() => handleDelete(project.id)}
                  size="sm"
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
