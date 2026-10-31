"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronDown, ChevronUp, Sparkles, Calendar, MapPin, Eye } from "lucide-react"
import type { ServiceItem } from "@/data/services"
import { motion, AnimatePresence } from "framer-motion"
import { useI18n } from "@/components/i18n/i18n-provider"
import { SplitTitle } from "@/components/ui/split-title"
import { useState } from "react"
import Image from "next/image"

interface Project {
  id: number
  title: string
  slug: string
  category: string
  image: string
  gallery: string[]
  description: string
  services: string[]
  serviceId?: string
  client: string
  date: string
  guests: string
  location: string
}

interface ServicesClientProps {
  servicesList: ServiceItem[]
  lang: string
  projects: Project[]
  pageConfig?: {
    title: string;
    subtitle?: string;
    showBadge?: boolean;
    badgeText?: string;
  }
}

// Services vidéo uniquement (exclure label-de-musique et booking)
const VIDEO_SERVICE_IDS = ["captation-video", "streaming-live", "podcast", "vj-video-mapping"]

function ProjectCard({ project, lang }: { project: Project; lang: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={() => window.location.href = `/${lang}/projet/${project.slug}`}
    >
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 h-full">
        <div className="relative overflow-hidden aspect-[16/10]">
          <div className="w-full h-full bg-slate-900 group-hover:scale-105 transition-transform duration-500">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                unoptimized={project.image.startsWith("http")}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <Sparkles className="w-8 h-8 opacity-30" />
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button size="sm" className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30">
              <Eye className="w-4 h-4 mr-2" />
              Voir le projet
            </Button>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <h4 className="text-white font-bold text-sm leading-tight drop-shadow-lg">{project.title}</h4>
            <p className="text-white/70 text-xs mt-0.5">{project.client}</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{project.date}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectsAccordion({ serviceId, projects, lang }: { serviceId: string; projects: Project[]; lang: string }) {
  const filtered = projects.filter(p => 
    p.serviceId === serviceId || p.serviceId === "tous"
  )

  if (filtered.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-white/40 text-sm italic">Aucune réalisation pour ce service pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      {filtered.map((project) => (
        <ProjectCard key={project.id} project={project} lang={lang} />
      ))}
    </div>
  )
}

export default function ServicesClient({ servicesList, lang, projects, pageConfig }: ServicesClientProps) {
  const { t } = useI18n()
  const [openServiceId, setOpenServiceId] = useState<string | null>(null)

  // Filter to video services only
  const videoServices = servicesList.filter(s => VIDEO_SERVICE_IDS.includes(s.id))

  const toggleAccordion = (serviceId: string) => {
    setOpenServiceId(prev => prev === serviceId ? null : serviceId)
  }

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orb orb-orange animate-orb opacity-40" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orb orb-blue animate-orb opacity-30" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-orb orb-white animate-orb opacity-20" />

      <div className="container mx-auto px-4 py-32 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          {pageConfig?.showBadge && pageConfig?.badgeText && (
            <Badge className="mb-6 bg-white/5 border-white/10 text-amber-500 px-4 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              {pageConfig.badgeText}
            </Badge>
          )}

          {pageConfig?.title ? (
            <h1 
              className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight"
              dangerouslySetInnerHTML={{ __html: pageConfig.title }} 
            />
          ) : (
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              <SplitTitle text="Notre Expertise" />
            </h1>
          )}

          {pageConfig?.subtitle && (
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {pageConfig.subtitle}
            </p>
          )}
        </motion.div>

        {/* Services — Vertical Stack with Accordion */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {videoServices.map((service, idx) => {
            const isOpen = openServiceId === service.id
            const projectCount = projects.filter(p => p.serviceId === service.id || p.serviceId === "tous").length

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                {/* Service Card */}
                <div className={`rounded-[2rem] overflow-hidden transition-all duration-500 border ${isOpen ? 'border-amber-500/30 shadow-2xl shadow-amber-500/10' : 'border-white/5 shadow-xl'}`}>
                  {/* Service Hero */}
                  <div className="relative h-[320px] md:h-[400px] flex flex-col justify-end">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0 bg-[#0A0A16]">
                      {service.image && !service.image.includes("placeholder") ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-70"
                        />
                      ) : (
                        <div className="w-full h-full sunset-gradient flex items-center justify-center opacity-60">
                          <Sparkles className="w-16 h-16 text-black/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent z-10" />
                    </div>

                    {/* Content */}
                    <div className="relative z-20 p-8 md:p-10">
                      <h2 className="text-3xl md:text-4xl font-bold mb-3">
                        <SplitTitle text={service.title} />
                      </h2>
                      <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
                        {service.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        {service.features?.slice(0, 4).map((feature, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="bg-white/10 border-white/20 text-white px-3 py-1 rounded-lg backdrop-blur-md text-xs md:text-sm font-medium"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div className="bg-[#020617] border-t border-white/5 px-8 md:px-10 py-5">
                    <button
                      onClick={() => toggleAccordion(service.id)}
                      className="w-full flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold text-lg group-hover:text-amber-400 transition-colors">
                          {isOpen ? "Masquer les projets" : "Découvrir nos projets"}
                        </span>
                        {projectCount > 0 && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                            {projectCount} projet{projectCount > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                      <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500/20 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5 text-white/60 group-hover:text-amber-400 transition-colors" />
                      </div>
                    </button>
                  </div>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden bg-[#020617]"
                      >
                        <div className="px-8 md:px-10 pb-8">
                          <div className="border-t border-white/5 pt-6">
                            <h3 className="text-lg font-semibold text-white/80 mb-4">
                              Nos réalisations en <span className="text-amber-400">{service.title}</span>
                            </h3>
                            <ProjectsAccordion serviceId={service.id} projects={projects} lang={lang} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Contact */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mt-32"
        >
          <div className="glassy-card rounded-[3rem] p-12 md:p-16 border border-white/10 relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500/5 blur-[100px] pointer-events-none" />
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Vous avez un projet ?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Contactez-nous pour discuter de votre vision et transformer votre événement en un moment d'exception.
            </p>
            <Link href={`/${lang}/devis`}>
              <Button
                size="lg"
                className="sunset-gradient hover:opacity-90 text-black font-extrabold px-12 h-16 rounded-2xl shadow-[0_20px_50px_-20px_rgba(217,119,6,0.5)] transition-all duration-500 hover:scale-105"
              >
                Parlons-en !
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
