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
  Mail,
  UserCog,
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
import NewsletterManager from "@/components/admin/newsletter-manager"
import UsersManager from "@/components/admin/users-manager"

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

type AdminSection = "services" | "projects" | "blog" | "player" | "team" | "investment" | "newsletter" | "users"

export default function AdminPage() {
  const { user, refresh, logout, loading: authLoading } = useAuth()
  const router = useRouter()

  const role = user?.role
  const canEdit = role === "admin" || role === "editor"
  const canSeeUsers = role === "admin"

  const [section, setSection] = useState<AdminSection>("services")
  const [categories, setCategories] = useState<Category[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<Project>>({})

  useEffect(() => {
    // Si on n'est pas en train de charger et qu'il n'y a pas d'utilisateur, redirection
    if (!authLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return null // Eviter le flash de contenu avant la redirection
  }

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
        if (projectsData.projects && Array.isArray(projectsData.projects)) {
          // Sanitize projects
          try {
            const validProjects = projectsData.projects.map((p: any) => ({
              ...p,
              title: typeof p.title === "string" ? p.title : "Projet sans titre",
              slug: typeof p.slug === "string" ? p.slug : String(p.id),
              category: typeof p.category === "string" ? p.category : "",
              image: typeof p.image === "string" ? p.image : "",
              gallery: Array.isArray(p.gallery) ? p.gallery.filter((g: any) => typeof g === "string") : [],
              description: typeof p.description === "string" ? p.description : "",
              fullDescription: typeof p.fullDescription === "string" ? p.fullDescription : "",
              services: Array.isArray(p.services) ? p.services.filter((s: any) => typeof s === "string") : [],
              client: typeof p.client === "string" ? p.client : "",
              date: typeof p.date === "string" ? p.date : "",
              guests: typeof p.guests === "string" ? p.guests : "",
              location: typeof p.location === "string" ? p.location : "",
            }))
            setProjects(validProjects)
            console.log("Loaded projects:", validProjects.length)
          } catch (e) {
            console.error("Error sanitizing projects:", e)
            setProjects([])
          }
        } else {
          setProjects([])
        }
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
          // Sanitize categories
          try {
            const validCategories = categoriesData.categories.map((c: any) => ({
              ...c,
              id: typeof c.id === "string" ? c.id : String(c.id || Math.random()),
              label: typeof c.label === "string" ? c.label : "Catégorie sans nom",
              description: typeof c.description === "string" ? c.description : "",
              color: typeof c.color === "string" ? c.color : "from-gray-500 to-gray-500",
              projectCount: typeof c.projectCount === "number" ? c.projectCount : 0,
            }))
            setCategories(validCategories)
            console.log("Loaded categories:", validCategories.length)
          } catch (e) {
            console.error("Error sanitizing categories:", e)
            setCategories([])
          }
        } else {
          setCategories([])
        }
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
              {String(user?.email || "")}
            </div>
            {canSeeUsers && (
              <Button
                onClick={() => setSection("users")}
                variant="outline"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 bg-transparent"
              >
                <UserCog className="w-4 h-4 mr-2" />
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
      <div className={`container mx-auto px-4 py-6`}>
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
              <Button
                variant={section === "newsletter" ? "default" : "outline"}
                className={`${section === "newsletter" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "border-white/30 text-white bg-transparent hover:bg-white/10"}`}
                onClick={() => setSection("newsletter")}
              >
                <Mail className="w-4 h-4 mr-2" />
                Newsletter
              </Button>
              <Button
                variant={section === "users" ? "default" : "outline"}
                className={`${section === "users" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "border-white/30 text-white bg-transparent hover:bg-white/10"}`}
                onClick={() => setSection("users")}
              >
                <UserCog className="w-4 h-4 mr-2" />
                Utilisateurs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-6">
          <div className="bg-white/10 p-6 rounded-xl text-white">
            TEST RENDU - SECTION: {String(section)} - USER: {String(user?.email)}
          </div>
          {/* 
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

          {section === "users" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <UsersManager />
            </motion.div>
          )}

          {section === "newsletter" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <NewsletterManager />
            </motion.div>
          )}
          */}

          {/* 
          {section === "projects" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              ...
            </motion.div>
          )}
          */}
        </div>
      </div>
    </div >
  )
}
