"use client"

import Image from "next/image"
import type { Project } from "@/data/projects"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, FolderKanban, ArrowLeft, Linkedin, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useI18n } from "@/components/i18n/i18n-provider"
import { useState } from "react"
import VideoLightbox from "./video-lightbox"
import VideoPlayerSmart from "./video-player-smart"
import { Play } from "lucide-react"

type Props = {
  project: Project
}

export default function ProjectPageClient({ project }: Props) {
  const { t, lang } = useI18n()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0)

  const mainSrc = project.image || "/placeholder.svg?height=720&width=1280"
  const gallery = project.gallery || []
  const videos = project.videos || []
  const isRemote = /^https?:\/\//i.test(mainSrc)

  return (
    <main className="min-h-[60vh] py-10 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2 px-0 text-white hover:text-white/80">
            <Link href={`/${lang}#realisations`} aria-label={t("realisations.backToList")}>
              <ArrowLeft className="h-4 w-4" />
              {t("realisations.backToList")}
            </Link>
          </Button>
        </div>

        <header className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="capitalize bg-white/10 text-white border-white/20">
              <FolderKanban className="mr-1 h-3.5 w-3.5" />
              {project.category}
            </Badge>
            {project.date && (
              <div className="flex items-center gap-2 text-sm text-white">
                <Calendar className="h-4 w-4" />
                <span>{project.date}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center gap-2 text-sm text-white">
                <MapPin className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
            )}
            {project.guests && (
              <div className="flex items-center gap-2 text-sm text-white">
                <Users className="h-4 w-4" />
                <span>{project.guests}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{project.title}</h1>
              {project.client && (
                 <p className="text-sm text-white mt-1">
                  {t("realisations.clientLabel")}{" "}
                  {project.client}
                </p>
              )}
            </div>
            {project.linkedinUrl && (
              <Button asChild className="bg-[#0A66C2] hover:bg-[#004182] text-white w-fit">
                <a href={project.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  Voir sur LinkedIn
                </a>
              </Button>
            )}
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-5">
          <Card className="md:col-span-3 overflow-hidden bg-white/5 border-white/10">
            <CardContent className="p-0">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={mainSrc || "/placeholder.svg"}
                  alt={`${t("audio.coverAlt")} ${project.title}`}
                  fill
                  priority
                  unoptimized={isRemote}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
          <div className="md:col-span-2 space-y-6">
            {project.description && (
              <div
                className="text-base leading-relaxed text-white rich-text-content"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            )}


            {project.services && project.services.length > 0 && (
              <div>
                <h2 className="mb-2 text-sm font-semibold tracking-wide text-white">{t("realisations.servicesLabel")}</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.services.map((s: string, i: number) => (
                    <li key={i}>
                      <Badge className={cn("bg-white/10 text-white border-white/10")}>{s}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Media Layout: 2 Columns if both exist, otherwise 1 column */}
        {(gallery.length > 0 || videos.length > 0) && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Gallery Section */}
            {gallery.length > 0 && (
              <section className={videos.length === 0 ? "md:col-span-2" : ""}>
                <h3 className="mb-6 text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-500" />
                  {t("realisations.galleryLabel") || "Galerie Photos"}
                </h3>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${videos.length === 0 ? "md:grid-cols-3 lg:grid-cols-4" : ""}`}>
                  {gallery.map((src, idx) => {
                    const remote = /^https?:\/\//i.test(src)
                    return (
                      <div
                        key={idx}
                        className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-white/10 group"
                      >
                        <Image
                          src={src || "/placeholder.svg?height=600&width=800"}
                          alt={`Image ${idx + 1} du projet ${project.title}`}
                          fill
                          unoptimized={remote}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Videos Section */}
            {videos.length > 0 && (
              <section className={gallery.length === 0 ? "md:col-span-2" : ""}>
                <h3 className="mb-6 text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-500 fill-purple-500" />
                  {t("realisations.videosLabel") || "Vidéos du projet"}
                </h3>
                <div className={`grid grid-cols-1 gap-4 ${gallery.length === 0 ? "sm:grid-cols-2 md:grid-cols-3" : ""}`}>
                  {videos.map((src, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedVideoIndex(idx)
                        setLightboxOpen(true)
                      }}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black cursor-pointer hover:border-purple-500/50 transition-all"
                    >
                      <VideoPlayerSmart
                        src={src}
                        muted
                        loop
                        autoplay={false}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <VideoLightbox
        videos={project.videos || []}
        isOpen={lightboxOpen}
        initialIndex={selectedVideoIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </main>
  )
}
