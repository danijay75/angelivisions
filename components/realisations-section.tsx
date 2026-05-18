"use client"

import { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, Users, MapPin, Eye, ImageIcon, ChevronRight, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLang } from "@/hooks/use-lang"
import { useI18n } from "@/components/i18n/i18n-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { SplitTitle } from "@/components/ui/split-title"

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

export default function RealisationsSection() {
  const router = useRouter()
  const lang = useLang()
  const { t } = useI18n()
  const [activeCategory, setActiveCategory] = useState("all")
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([fetch("/api/projects"), fetch("/api/categories")])

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData.projects || [])
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.categories || [])
      }
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const allCategories = useMemo(
    () => [
      {
        id: "all",
        label: t("realisations.filterAll"),
        color: "from-gray-500 to-gray-600",
        projectCount: projects.length,
      },
      ...categories,
    ],
    [t, categories, projects.length],
  )

  const filteredProjects =
    activeCategory === "all" ? projects : projects.filter((project) => project.category === activeCategory)

  const handleProjectClick = (slug: string) => {
    router.push(`/${lang}/projet/${slug}`)
  }

  const getCategoryColor = (categoryId: string) =>
    allCategories.find((cat) => cat.id === categoryId)?.color || "from-gray-500 to-gray-600"

  return (
    <section id="realisations" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto mb-20 text-center px-4"
        >
          <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight leading-tight mb-8 drop-shadow-2xl">
            <span className="block mb-2 text-white">
              {t("realisations.titlePart1")}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 italic opacity-90 block">
              {t("realisations.titlePart2")}
            </span>
          </h2>
          <div className="w-24 h-[2px] sunset-gradient mx-auto" />
        </motion.div>

        {/* Categories / Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {allCategories.map((category) => {
            const active = activeCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-8 py-3 rounded-2xl font-display text-sm border transition-all duration-500 ${
                  active 
                    ? "sunset-gradient text-white border-transparent shadow-xl shadow-amber-500/10 scale-105 font-semibold" 
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <ProjectSkeleton key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const categoryLabel =
                  allCategories.find((cat) => cat.id === project.category)?.label || t("realisations.noCategory")

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="group"
                    onClick={() => handleProjectClick(project.slug)}
                  >
                    <div className="glassy-card rounded-[2.5rem] overflow-hidden h-full flex flex-col transition-all duration-500 hover:scale-[1.03] cursor-pointer">
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            unoptimized={project.image.startsWith("http")}
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:scale-110 transition-transform duration-700">
                             <ImageIcon className="w-12 h-12 text-white/10" />
                          </div>
                        )}
                        
                        <div className="absolute top-6 left-6 z-20">
                           <span className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white uppercase tracking-widest font-medium">
                             {categoryLabel}
                           </span>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80 pointer-events-none" />
                      </div>

                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-amber-500 text-[10px] uppercase tracking-widest mb-4 font-semibold">
                             <Calendar className="w-3.5 h-3.5" />
                             {project.date}
                          </div>
                          <h3 className="text-2xl font-display font-medium text-white mb-2 group-hover:text-amber-500 transition-colors duration-300">
                            {project.title}
                          </h3>
                          <p className="text-slate-300 text-sm font-display mb-6 line-clamp-2 leading-relaxed">
                             {project.client}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5 mt-auto">
                           {(project.services || []).map((s, i) => (
                             <span key={i} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-white/70 uppercase tracking-wider backdrop-blur-md font-medium group-hover:border-amber-500/30 group-hover:text-amber-500 transition-all duration-300">
                                {s}
                             </span>
                           ))}
                        </div>
                        <div className="absolute bottom-8 right-8 w-12 h-12 rounded-2xl sunset-gradient text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                           <ChevronRight className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <Link 
            href={`/${lang}/realisations`}
            className="group inline-flex items-center gap-3 px-10 py-5 sunset-gradient text-white font-display font-medium rounded-2xl transition-all duration-500 hover:scale-105 shadow-2xl"
          >
            {t("realisations.viewAllCta")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function ProjectSkeleton() {
  return (
    <Card className="bg-white/40 backdrop-blur-md border-black/5 overflow-hidden h-full">
      <div className="relative">
        <Skeleton className="w-full h-48 bg-black/5" />
        <div className="absolute top-4 right-4">
          <Skeleton className="h-6 w-16 rounded-full bg-black/5" />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <Skeleton className="h-6 w-3/4 mb-2 bg-black/10" />
          <Skeleton className="h-4 w-1/2 bg-black/5" />
        </div>
      </div>
      <CardContent className="p-6">
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full bg-white/10" />
          <Skeleton className="h-4 w-full bg-white/10" />
          <Skeleton className="h-4 w-2/3 bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Skeleton className="h-4 w-20 bg-white/10" />
          <Skeleton className="h-4 w-20 bg-white/10" />
          <Skeleton className="h-4 w-28 col-span-2 bg-white/10" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
          <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
        </div>
      </CardContent>
    </Card>
  )
}
