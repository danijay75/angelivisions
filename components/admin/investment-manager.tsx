"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, Trash2, Save, X, TrendingUp, Clock } from "lucide-react"
import ImageUpload from "./image-upload"

interface InvestmentProject {
  id: string
  title: string
  category: string
  description: string
  targetAmount: number
  currentAmount: number
  expectedReturn: string
  duration: string
  risk: "Faible" | "Modéré" | "Élevé"
  highlights: string[]
  image: string
  isActive: boolean
}

const defaultProjects: InvestmentProject[] = [
  {
    id: "1",
    title: "Album Collectif Hip-Hop Émergent",
    category: "Musique",
    description:
      "Production d'un album collaboratif avec 8 artistes hip-hop émergents, distribution digitale et physique.",
    targetAmount: 50000,
    currentAmount: 32000,
    expectedReturn: "15-25%",
    duration: "12 mois",
    risk: "Modéré",
    highlights: ["Artistes avec 100K+ followers", "Partenariat label indépendant", "Droits d'auteur partagés"],
    image: "/hip-hop-studio.png",
    isActive: true,
  },
  {
    id: "2",
    title: "Spectacle Immersif VR",
    category: "Expérience Immersive",
    description: "Création d'un spectacle théâtral en réalité virtuelle combinant performance live et technologie.",
    targetAmount: 75000,
    currentAmount: 45000,
    expectedReturn: "20-30%",
    duration: "18 mois",
    risk: "Élevé",
    highlights: ["Technologie VR innovante", "Tournée internationale prévue", "Partenariat Meta"],
    image: "/vr-theater-immersive.png",
    isActive: true,
  },
]

export default function InvestmentManager() {
  const [mounted, setMounted] = useState(false)
  const [projects, setProjects] = useState<InvestmentProject[]>([])
  const [editingProject, setEditingProject] = useState<InvestmentProject | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<InvestmentProject>>({})

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("investment-projects")
      if (saved) {
        try {
          setProjects(JSON.parse(saved))
        } catch {
          setProjects(defaultProjects)
        }
      } else {
        setProjects(defaultProjects)
      }
    }
  }, [])

  useEffect(() => {
    if (mounted && projects.length > 0) {
      localStorage.setItem("investment-projects", JSON.stringify(projects))
    }
  }, [projects, mounted])

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
      category: "",
      description: "",
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

  const handleSave = () => {
    const projectData = {
      ...formData,
      id: editingProject?.id || Date.now().toString(),
    } as InvestmentProject

    if (editingProject) {
      setProjects(projects.map((p) => (p.id === editingProject.id ? projectData : p)))
    } else {
      setProjects([...projects, projectData])
    }

    setEditingProject(null)
    setIsCreating(false)
    setFormData({})
  }

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce projet d'investissement ?")) {
      setProjects(projects.filter((p) => p.id !== id))
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
                <Label className="text-white mb-2 block">Catégorie</Label>
                <select
                  value={formData.category || ""}
                  onChange={(e) => updateFormData("category", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Musique" className="bg-slate-800">
                    Musique
                  </option>
                  <option value="Théâtre" className="bg-slate-800">
                    Théâtre
                  </option>
                  <option value="Humour" className="bg-slate-800">
                    Humour
                  </option>
                  <option value="Expérience Immersive" className="bg-slate-800">
                    Expérience Immersive
                  </option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-white mb-2 block">Description</Label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => updateFormData("description", e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                rows={3}
                placeholder="Description détaillée du projet"
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
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
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
