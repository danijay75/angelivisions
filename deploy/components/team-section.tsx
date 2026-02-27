"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Instagram, Linkedin, Globe, Twitter, Facebook } from "lucide-react"
import { motion } from "framer-motion"
import type { TeamMember } from "@/data/team"
import { useI18n } from "@/components/i18n/i18n-provider"

type TeamSectionProps = {
  id?: string
  title?: string
  subtitle?: string
}

export default function TeamSection({
  id = "equipe",
  title,
  subtitle,
}: TeamSectionProps) {
  const { t } = useI18n()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  const sectionTitle = title || t("team.title")
  const sectionSubtitle = subtitle || t("team.subtitle")

  useEffect(() => {
    let mounted = true
      ; (async () => {
        try {
          const res = await fetch("/api/team", { cache: "no-store" })
          if (!res.ok) {
            console.error("[v0] Team API error:", res.status, res.statusText)
            return
          }
          const json = (await res.json()) as { ok: boolean; team: TeamMember[] }
          if (mounted && json.ok) setTeam(json.team)
        } catch (error) {
          console.error("[v0] Team fetch error:", error)
        } finally {
          if (mounted) setLoading(false)
        }
      })()
    return () => {
      mounted = false
    }
  }, [])

  const Socials = ({ m }: { m: TeamMember }) => {
    const s = m.socials || {}
    return (
      <div className="flex gap-3 mt-3">
        {s.instagram && (
          <a className="text-white/80 hover:text-white" href={s.instagram} target="_blank" rel="noreferrer">
            <Instagram className="w-4 h-4" />
            <span className="sr-only">Instagram</span>
          </a>
        )}
        {s.linkedin && (
          <a className="text-white/80 hover:text-white" href={s.linkedin} target="_blank" rel="noreferrer">
            <Linkedin className="w-4 h-4" />
            <span className="sr-only">LinkedIn</span>
          </a>
        )}
        {s.twitter && (
          <a className="text-white/80 hover:text-white" href={s.twitter} target="_blank" rel="noreferrer">
            <Twitter className="w-4 h-4" />
            <span className="sr-only">Twitter</span>
          </a>
        )}
        {s.facebook && (
          <a className="text-white/80 hover:text-white" href={s.facebook} target="_blank" rel="noreferrer">
            <Facebook className="w-4 h-4" />
            <span className="sr-only">Facebook</span>
          </a>
        )}
        {s.website && (
          <a className="text-white/80 hover:text-white" href={s.website} target="_blank" rel="noreferrer">
            <Globe className="w-4 h-4" />
            <span className="sr-only">{t("team.website")}</span>
          </a>
        )}
      </div>
    )
  }

  return (
    <section id={id} className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">{sectionTitle}</h2>
          <p className="text-white/70 max-w-2xl mx-auto">{sectionSubtitle}</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-xl border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 overflow-hidden hover:bg-white/10 transition-all rounded-2xl">
                  <div className="relative">
                    <img
                      src={m.photo || "/placeholder.svg?height=240&width=240&query=portrait%20team%20member"}
                      alt={`${t("team.photoAlt")} ${m.name}`}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-xl">{m.name}</CardTitle>
                    <p className="text-white/70">{m.title}</p>
                    {m.roles && m.roles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {m.roles.map((r, i) => (
                          <Badge key={i} className="bg-emerald-600/70 text-white">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0 pb-6">
                    <a
                      href={`mailto:${m.email}`}
                      className="inline-block text-emerald-300 hover:text-emerald-200 transition-colors"
                    >
                      {m.email}
                    </a>
                    <Socials m={m} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
