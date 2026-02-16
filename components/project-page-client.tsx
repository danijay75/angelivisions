"use client"

import Image from "next/image"
import type { Project } from "@/data/projects"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, FolderKanban, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

type Props = {
  project: Project
}

export default function ProjectPageClient({ project }: Props) {
  const pathname = usePathname() || "/fr"
  const lang = pathname.split("/")[1] || "fr"

  const mainSrc = project.image || "/placeholder.svg?height=720&width=1280"
  const gallery: string[] = project.gallery?.length ? project.gallery : ["/placeholder.svg?height=600&width=800"]
  const isRemote = /^https?:\/\//i.test(mainSrc)

  return (
    <main className="min-h-[60vh] py-10 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2 px-0 text-white/70 hover:text-white">
            <Link href={`/${lang}#realisations`} aria-label="Retour aux Réalisations">
              <ArrowLeft className="h-4 w-4" />
              {"Retour aux Réalisations"}
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
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Calendar className="h-4 w-4" />
                <span>{project.date}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
            )}
            {project.guests && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Users className="h-4 w-4" />
                <span>{project.guests}</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{project.title}</h1>
          {project.client && (
            <p className="text-sm text-white/70">
              {"Client: "}
              {project.client}
            </p>
          )}
        </header>

        <div className="grid gap-8 md:grid-cols-5">
          <Card className="md:col-span-3 overflow-hidden bg-white/5 border-white/10">
            <CardContent className="p-0">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={mainSrc || "/placeholder.svg"}
                  alt={`Image principale du projet ${project.title}`}
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
            {project.description && <p className="text-base leading-relaxed text-white/80">{project.description}</p>}
            {project.fullDescription && (
              <p className="text-sm leading-relaxed text-white/70">{project.fullDescription}</p>
            )}

            {project.services?.length > 0 && (
              <div>
                <h2 className="mb-2 text-sm font-semibold tracking-wide text-white/90">{"Prestations incluses"}</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.services.map((s, i) => (
                    <li key={i}>
                      <Badge className={cn("bg-white/10 text-white/90 border-white/10")}>{s}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {gallery.length > 0 && (
          <section className="mt-10">
            <h3 className="mb-4 text-lg font-semibold tracking-tight text-white">{"Galerie"}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {gallery.map((src, idx) => {
                const remote = /^https?:\/\//i.test(src)
                return (
                  <div
                    key={idx}
                    className="relative w-full aspect-[4/3] overflow-hidden rounded-lg border border-white/10"
                  >
                    <Image
                      src={src || "/placeholder.svg?height=600&width=800&query=galerie"}
                      alt={`Image ${idx + 1} du projet ${project.title}`}
                      fill
                      unoptimized={remote}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
