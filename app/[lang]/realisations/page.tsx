"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, Eye, ImageIcon, ArrowLeft, Filter } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n-provider"

type Locale = "fr" | "en" | "es"

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
}

interface Category {
  id: string
  label: string
  color: string
  projectCount: number
}

const LOCALE_COPY: Record<
  Locale,
  {
    title: string
    subtitle: string
    filterAll: string
    seeProject: string
    photos: (n: number) => string
    backToHome: string
    noProjects: string
    projectsCount: (n: number) => string
    loading: string
  }
> = {
  fr: {
    title: "Nos Réalisations",
    subtitle:
      "Découvrez l'ensemble de nos créations : événements sur-mesure, productions musicales originales et spectacles audiovisuels innovants.",
    filterAll: "Tous les Projets",
    seeProject: "Voir le projet",
    photos: (n) => `${n} photos`,
    backToHome: "Retour à l'accueil",
    noProjects: "Aucun projet trouvé pour cette catégorie.",
    projectsCount: (n) => `${n} projet${n > 1 ? "s" : ""}`,
    loading: "Chargement des projets...",
  },
  en: {
    title: "Our Portfolio",
    subtitle:
      "Explore our complete collection of work: bespoke events, original music productions, and innovative audiovisual shows.",
    filterAll: "All Projects",
    seeProject: "View project",
    photos: (n) => `${n} photos`,
    backToHome: "Back to home",
    noProjects: "No projects found for this category.",
    projectsCount: (n) => `${n} project${n > 1 ? "s" : ""}`,
    loading: "Loading projects...",
  },
  es: {
    title: "Nuestro Portafolio",
    subtitle:
      "Descubre nuestra colección completa de trabajos: eventos a medida, producciones musicales originales y espectáculos audiovisuales innovadores.",
    filterAll: "Todos los Proyectos",
    seeProject: "Ver proyecto",
    photos: (n) => `${n} fotos`,
    backToHome: "Volver al inicio",
    noProjects: "No se encontraron proyectos para esta categoría.",
    projectsCount: (n) => `${n} proyecto${n > 1 ? "s" : ""}`,
    loading: "Cargando proyectos...",
  },
}

import { useMemo, useState, useEffect, use } from "react"
// ...
export default function RealisationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const router = useRouter()
  const { lang: contextLang } = useI18n()
  const resolvedParams = use(params)

  const lang = (resolvedParams?.lang || contextLang || "fr") as Locale
  const copy = LOCALE_COPY[lang]
  const [activeCategory, setActiveCategory] = useState("all")
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      console.log("[v0] Loading projects and categories from API...")

      const [projectsRes, categoriesRes] = await Promise.all([fetch("/api/projects"), fetch("/api/categories")])

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData.projects || [])
        console.log("[v0] Loaded projects:", projectsData.projects?.length || 0)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])
        console.log("[v0] Loaded categories:", categoriesData.categories?.length || 0)
      }
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const allCategories = useMemo(
    () => [
      { id: "all", label: copy.filterAll, color: "from-gray-500 to-gray-600", projectCount: projects.length },
      ...categories,
    ],
    [copy.filterAll, categories, projects.length],
  )

  const filteredProjects =
    activeCategory === "all" ? projects : projects.filter((project) => project.category === activeCategory)

  const handleProjectClick = (slug: string) => {
    router.push(`/${lang}/projet/${slug}`)
  }

  const getCategoryColor = (categoryId: string) =>
    allCategories.find((cat) => cat.id === categoryId)?.color || "from-gray-500 to-gray-600"

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/60 text-lg">{copy.loading}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Button
              variant="ghost"
              onClick={() => router.push(`/${lang}`)}
              className="mb-8 text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {copy.backToHome}
            </Button>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {copy.title}
              </span>
            </h1>

            <p className="text-xl text-white/80 max-w-4xl mx-auto mb-12">{copy.subtitle}</p>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center text-white/60 mr-4">
                <Filter className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Filtrer par catégorie :</span>
              </div>
              {allCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-full ${activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white hover:opacity-90`
                    : "border-white/30 text-white hover:bg-white/10 bg-transparent"
                    }`}
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-white text-xs">
                    {category.projectCount}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Projects Count */}
            <p className="text-white/60 text-sm mb-8">{copy.projectsCount(filteredProjects.length)}</p>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 pb-20">
        {filteredProjects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-white/60 text-lg">{copy.noProjects}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, index) => {
                const categoryColor = getCategoryColor(project.category)
                const categoryLabel =
                  allCategories.find((cat) => cat.id === project.category)?.label || "Sans catégorie"
                const galleryCount = (project.gallery || []).length

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -10 }}
                    className="group cursor-pointer"
                    onClick={() => handleProjectClick(project.slug)}
                  >
                    <Card className="bg-white/5 backdrop-blur-md border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 h-full">
                      <div className="relative overflow-hidden">
                        <div className="w-full h-64 bg-slate-900 flex items-center justify-center">
                          <div className="text-white/60 text-center">
                            <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">{project.title}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex space-x-3">
                            <Button size="sm" className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30">
                              <Eye className="w-4 h-4 mr-2" />
                              {copy.seeProject}
                            </Button>
                            {galleryCount > 1 && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-md"
                              >
                                <ImageIcon className="w-4 h-4 mr-2" />
                                {copy.photos(galleryCount)}
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="absolute top-4 right-4">
                          <Badge className={`bg-gradient-to-r ${categoryColor} text-white`}>{categoryLabel}</Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white font-bold text-lg mb-1">{project.title}</h3>
                          <p className="text-white/80 text-sm">{project.client}</p>
                        </div>
                      </div>
                      <CardContent className="p-6 flex-1 flex flex-col">
                        <p className="text-white/80 mb-4 line-clamp-3 flex-1">{project.description}</p>

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

                        <div className="flex flex-wrap gap-2">
                          {project.services.slice(0, 3).map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-white/10 text-white/80 text-xs">
                              {service}
                            </Badge>
                          ))}
                          {project.services.length > 3 && (
                            <Badge variant="secondary" className="bg-white/10 text-white/80 text-xs">
                              +{project.services.length - 3}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
