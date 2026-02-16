"use client"

import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Home,
  LogOut,
  Shield,
  Layers,
  FolderKanban,
  Newspaper,
  Music4,
  UsersIcon,
  Users,
  TrendingUp,
} from "lucide-react"
import ServicesManager from "@/components/admin/services-manager"
import CategoryManager from "@/components/admin/category-manager"
import ImageUpload from "@/components/admin/image-upload"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X, Calendar, MapPin, ImageIcon as ImageIconLucide } from "lucide-react"
import BlogManager from "@/components/admin/blog-manager"
import AudioManager from "@/components/admin/audio-manager"
import TeamManager from "@/components/admin/team-manager"
import InvestmentManager from "@/components/admin/investment-manager"

interface Category {
  id: string
  label: string
  description?: string
  color: string
  projectCount: number
}

interface Project {
  id: number
  title: string
  slug: string
  category: string
  image: string
  gallery: string[]
  description: string
  fullDescription: string
  services: string[]
  client: string
  date: string
  guests: string
  location: string
  createdAt?: string
  updatedAt?: string
}

type AdminSection = "services" | "projects" | "blog" | "player" | "team" | "investment"

export default function AdminPage() {
  const { user, refresh, logout } = useAuth()
  const router = useRouter()

  const role = user?.role || "admin"
  const canEdit = role !== "guest"
  const canSeeUsers = role === "admin"

  const [section, setSection] = useState<AdminSection>("services")
  const [categories, setCategories] = useState<Category[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<Project>>({})

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    if (section === "projects") {
      loadProjectsData()
    }
  }, [section])

  const loadProjectsData = async () => {
    setLoading(true)
    try {
      console.log("Loading projects and categories from API...")

      // Charger les projets et catégories en parallèle
      const [projectsRes, categoriesRes] = await Promise.all([fetch("/api/projects"), fetch("/api/categories")])

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData.projects || [])
        console.log("Loaded projects:", projectsData.projects?.length || 0)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])
        console.log("Loaded categories:", categoriesData.categories?.length || 0)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

  const handleCategoriesChange = async (newCategories: Category[]) => {
    try {
      console.log("Saving categories...")
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: newCategories }),
      })

      if (response.ok) {
        setCategories(newCategories)
        console.log("Categories saved successfully")
      }
    } catch (error) {
      console.error("Error saving categories:", error)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData(project)
    setIsCreating(false)
    setSection("projects")
  }

  const handleCreate = () => {
    setEditingProject(null)
    setFormData({
      title: "",
      slug: "",
      category: "",
      image: "",
      gallery: [],
      description: "",
      fullDescription: "",
      services: [],
      client: "",
      date: "",
      guests: "",
      location: "",
    })
    setIsCreating(true)
    setSection("projects")
  }

  const handleSave = async () => {
    try {
      console.log("Saving project...")
      const slug = formData.slug || generateSlug(formData.title || "")
      const projectData = { ...(formData as Project), slug }

      const url = editingProject ? "/api/projects" : "/api/projects"
      const method = editingProject ? "PUT" : "POST"
      const body = editingProject ? { ...projectData, id: editingProject.id } : projectData

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Project saved:", result.project.id)

        // Recharger les données
        await loadProjectsData()

        // Réinitialiser le formulaire
        setEditingProject(null)
        setIsCreating(false)
        setFormData({})
      }
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer ce projet ?")) {
      try {
        console.log("Deleting project:", id)
        const response = await fetch(`/api/projects?id=${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          console.log("Project deleted successfully")
          await loadProjectsData()
        }
      } catch (error) {
        console.error("Error deleting project:", error)
      }
    }
  }

  const handleCancel = () => {
    setEditingProject(null)
    setIsCreating(false)
    setFormData({})
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === "title" && value) updated.slug = generateSlug(value)
      return updated
    })
  }

  const addService = (service: string) => {
    if (service.trim() && !formData.services?.includes(service.trim())) {
      updateFormData("services", [...(formData.services || []), service.trim()])
    }
  }

  const removeService = (service: string) => {
    updateFormData("services", formData.services?.filter((s) => s !== service) || [])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/angeli-visions-logo-white.png"
              alt="Angeli Visions"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-white font-bold text-xl">Administration</h1>
              <p className="text-white/60 text-xs">Gestion des contenus</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.open("/", "_blank")}
              variant="outline"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent"
            >
              <Home className="w-4 h-4 mr-2" />
              Voir le site
            </Button>
            <div className="text-white/80 hidden md:flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              {user?.email || "admin@bypass.local"}
            </div>
            {canSeeUsers && (
              <Button
                onClick={() => router.push("/admin/users")}
                variant="outline"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 bg-transparent"
              >
                <UsersIcon className="w-4 h-4 mr-2" />
                Utilisateurs
              </Button>
            )}
            <Button
              onClick={logout}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className={`container mx-auto px-4 py-6 ${canEdit ? "" : "pointer-events-none opacity-60 select-none"}`}>
        {/* Sections navigation */}
        <Card className="bg-white/5 border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-base text-center">Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={section === "services" ? "default" : "outline"}
                className={`${section === "services" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "border-white/30 text-white bg-transparent hover:bg-white/10"}`}
                onClick={() => setSection("services")}
              >
                <Layers className="w-4 h-4 mr-2" />
                Services
              </Button>
              <Button
                variant={section === "projects" ? "default" : "outline"}
                className={`${section === "projects" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "border-white/30 text-white bg-transparent hover:bg-white/10"}`}
                onClick={() => setSection("projects")}
              >
                <FolderKanban className="w-4 h-4 mr-2" />
                Projets / Réalisations
              </Button>
              <Button
                variant={section === "investment" ? "default" : "outline"}
                className={`${section === "investment" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "border-white/30 text-white bg-transparent hover:bg-white/10"}`}
                onClick={() => setSection("investment")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Investir dans la Culture
              </Button>
              <Button
                variant={section === "team" ? "default" : "outline"}
                className={`${section === "team" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "border-white/30 text-white bg-transparent hover:bg-white/10"}`}
                onClick={() => setSection("team")}
              >
                <Users className="w-4 h-4 mr-2" />
                Équipe
              </Button>
              <Button
                variant={section === "player" ? "default" : "outline"}
                className={`${section === "player" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "border-white/30 text-white bg-transparent hover:bg-white/10"}`}
                onClick={() => setSection("player")}
              >
                <Music4 className="w-4 h-4 mr-2" />
                Lecteur audio
              </Button>
              <Button
                variant={section === "blog" ? "default" : "outline"}
                className={`${section === "blog" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "border-white/30 text-white bg-transparent hover:bg-white/10"}`}
                onClick={() => setSection("blog")}
              >
                <Newspaper className="w-4 h-4 mr-2" />
                Blog (eSide Culture)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          {section === "services" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <ServicesManager />
            </motion.div>
          )}

          {section === "investment" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <InvestmentManager />
            </motion.div>
          )}

          {section === "blog" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <BlogManager />
            </motion.div>
          )}

          {section === "player" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <AudioManager />
            </motion.div>
          )}

          {section === "team" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <TeamManager />
            </motion.div>
          )}

          {section === "projects" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {loading && (
                <div className="text-center py-8">
                  <div className="text-white/60">Chargement des projets...</div>
                </div>
              )}

              {/* Category manager */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Catégories</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryManager
                    categories={categories}
                    onCategoriesChange={handleCategoriesChange}
                    projects={projects}
                  />
                </CardContent>
              </Card>

              {(isCreating || editingProject) && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {editingProject ? "Modifier le projet" : "Nouveau projet"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Informations générales */}
                    <div className="space-y-6">
                      <h3 className="text-white font-semibold text-lg border-b border-white/20 pb-2">
                        Informations générales
                      </h3>

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
                            placeholder="url-du-projet"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Catégorie</Label>
                        <select
                          value={formData.category || ""}
                          onChange={(e) => updateFormData("category", e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-slate-800">
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Description courte</Label>
                        <Textarea
                          value={formData.description || ""}
                          onChange={(e) => updateFormData("description", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Description complète</Label>
                        <Textarea
                          value={formData.fullDescription || ""}
                          onChange={(e) => updateFormData("fullDescription", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="space-y-6">
                      <h3 className="text-white font-semibold text-lg border-b border-white/20 pb-2">
                        Détails du projet
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-white mb-2 block">Client</Label>
                          <Input
                            value={formData.client || ""}
                            onChange={(e) => updateFormData("client", e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white mb-2 block">Date</Label>
                          <Input
                            value={formData.date || ""}
                            onChange={(e) => updateFormData("date", e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="ex: Juin 2024"
                          />
                        </div>
                        <div>
                          <Label className="text-white mb-2 block">Nombre d'invités</Label>
                          <Input
                            value={formData.guests || ""}
                            onChange={(e) => updateFormData("guests", e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="ex: 200 invités"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Lieu</Label>
                        <Input
                          value={formData.location || ""}
                          onChange={(e) => updateFormData("location", e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Lieu de l'événement"
                        />
                      </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-6">
                      <h3 className="text-white font-semibold text-lg border-b border-white/20 pb-2">
                        Images du projet
                      </h3>
                      <div>
                        <ImageUpload
                          images={formData.image ? [formData.image] : []}
                          onImagesChange={(images) => updateFormData("image", images[0] || "")}
                          maxImages={1}
                          label="Image principale"
                        />
                      </div>
                      <div>
                        <ImageUpload
                          images={formData.gallery || []}
                          onImagesChange={(images) => updateFormData("gallery", images)}
                          maxImages={15}
                          label="Galerie d'images"
                        />
                      </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-6">
                      <h3 className="text-white font-semibold text-lg border-b border-white/20 pb-2">
                        Services fournis
                      </h3>
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.services?.map((service, index) => (
                            <Badge
                              key={index}
                              className="bg-purple-600/80 text-white cursor-pointer"
                              onClick={() => removeService(service)}
                            >
                              {service} <X className="w-3 h-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            id="new-service"
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="Ajouter un service"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                const v = (e.target as HTMLInputElement).value
                                addService(v)
                                  ; (e.target as HTMLInputElement).value = ""
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById("new-service") as HTMLInputElement
                              addService(input.value)
                              input.value = ""
                            }}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-white/20">
                      <Button
                        onClick={handleSave}
                        disabled={!canEdit}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                        disabled={!canEdit}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Projets ({projects.length})</h2>
                <Button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={!canEdit}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau projet
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-md border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300">
                      <div className="relative overflow-hidden">
                        {/* Placeholder image if no image is available */}
                        {project.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <div className="text-white/60 text-center">
                              <ImageIconLucide className="w-12 h-12 mx-auto mb-2" />
                              <p className="text-sm">{project.title}</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-blue-600/80 text-white">
                            <ImageIconLucide className="w-3 h-3 mr-1" />
                            {project.gallery?.length || 0} photos
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-bold text-lg mb-1">{project.title}</h3>
                          <p className="text-white/80 text-sm">{project.client}</p>
                          <p className="text-white/60 text-xs">/{project.slug}</p>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <p className="text-white/80 mb-4 line-clamp-2">{project.description}</p>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center text-white/70">
                            <Calendar className="w-4 h-4 mr-2" />
                            {project.date}
                          </div>
                          <div className="flex items-center text-white/70">
                            <Users className="w-4 h-4 mr-2" />
                            {project.guests}
                          </div>
                          <div className="flex items-center text-white/70 col-span-2">
                            <MapPin className="w-4 h-4 mr-2" />
                            {project.location}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(project)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 flex-1"
                            disabled={!canEdit}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Modifier
                          </Button>
                          <Button
                            onClick={() => handleDelete(project.id)}
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                            disabled={!canEdit}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
