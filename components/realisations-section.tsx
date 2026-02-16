"use client"

import { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, Users, MapPin, Eye, ImageIcon } from "lucide-react"

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
    highlight: string
    subtitle: string
    filterAll: string
    seeProject: string
    photos: (n: number) => string
    viewAllCta: string
  }
> = {
  fr: {
    title: "Nos Créations,",
    highlight: "Spectacles et Projets auxquels nous avons participé",
    subtitle:
      "Découvrez nos réalisations marquantes : événements sur-mesure, productions musicales originales et spectacles audiovisuels innovants.",
    filterAll: "Tous les Projets",
    seeProject: "Voir le projet",
    photos: (n) => `${n} photos`,
    viewAllCta: "Voir tous nos Projets",
  },
  en: {
    title: "Our Creations",
    highlight: "Creative Portfolio",
    subtitle:
      "Explore our standout work: bespoke events, original music productions, and innovative audiovisual shows.",
    filterAll: "All projects",
    seeProject: "View project",
    photos: (n) => `${n} photos`,
    viewAllCta: "See all projects",
  },
  es: {
    title: "Nuestras Creaciones",
    highlight: "Portafolio Creativo",
    subtitle:
      "Descubre nuestros proyectos destacados: eventos a medida, producciones musicales originales y espectáculos audiovisuales innovadores.",
    filterAll: "Todos los proyectos",
    seeProject: "Ver proyecto",
    photos: (n) => `${n} fotos`,
    viewAllCta: "Ver todos los proyectos",
  },
}

export default function RealisationsSection() {
  const router = useRouter()
  const pathname = usePathname() || "/fr"
  const lang = useMemo<Locale>(() => {
    if (pathname.startsWith("/en")) return "en"
    if (pathname.startsWith("/es")) return "es"
    return "fr"
  }, [pathname])

  const copy = LOCALE_COPY[lang]
  const [activeCategory, setActiveCategory] = useState("all")
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])

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

  return (
    <section id="realisations" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {copy.title}
            <span className="block">
              {lang === "fr" ? (
                <>
                  <span className="text-white">{"Spectacles et Projets"}</span>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {" "}
                    {"auxquels nous avons participé"}
                  </span>
                </>
              ) : (
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {copy.highlight}
                </span>
              )}
            </span>
          </h2>

          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">{copy.subtitle}</p>

          <div className="flex flex-wrap justify-center gap-4">
            {allCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-full ${activeCategory === category.id ? `bg-gradient-to-r ${category.color} text-white hover:opacity-90` : "border-white/30 text-white hover:bg-white/10 bg-transparent"}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              const categoryColor = getCategoryColor(project.category)
              const categoryLabel = allCategories.find((cat) => cat.id === project.category)?.label || "Sans catégorie"
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
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
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

                      <div className="flex flex-wrap gap-2">
                        {project.services.slice(0, 2).map((service, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-white/10 text-white/80 text-xs">
                            {service}
                          </Badge>
                        ))}
                        {project.services.length > 2 && (
                          <Badge variant="secondary" className="bg-white/10 text-white/80 text-xs">
                            +{project.services.length - 2}
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

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <Button
            size="lg"
            onClick={() => router.push(`/${lang}/realisations`)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            {copy.viewAllCta}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
