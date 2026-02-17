"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone } from "lucide-react"
import TeamSection from "@/components/team-section"
import { useI18n } from "@/components/i18n/i18n-provider"

export default function ContactSection() {
  const { t } = useI18n()
  const hours = {
    title: t("contact.hoursTitle"),
    content: t("contact.hoursContent"),
  }

  const address = "79 rue du Général Leclerc, 78400 Chatou"
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

  return (
    <section id="contact" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("contact.title")}</h2>
          <p className="text-white/80 max-w-2xl mx-auto">{t("contact.description")}</p>
        </motion.div>

        {/* Opening hours */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-2">{hours.title}</h3>
              <p className="text-white/80 whitespace-pre-line">{hours.content}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mb-6"
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <div className="absolute z-10 top-4 left-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-white">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">{address}</span>
                </div>
                <iframe
                  title={`Localisation - ${address}`}
                  src={mapSrc}
                  className="w-full h-72 md:h-96"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conciergerie de l'événement - vivid card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <Card className="bg-gradient-to-r from-fuchsia-600/30 via-rose-600/30 to-orange-500/30 border-pink-500/40 ring-1 ring-inset ring-white/10">
            <CardContent className="p-6 md:p-7">
              <h3 className="text-lg md:text-xl font-semibold uppercase tracking-wide text-white mb-3">
                {t("contact.conciergerieTitle")}
              </h3>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-white text-lg">{t("contact.conciergerieUrgencies")}</p>
                <a
                  href="tel:+33663796742"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-white px-3 py-2 font-semibold"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span>{"06.63.79.67.42"}</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team */}
        <TeamSection id="equipe" title={t("contact.teamTitle")} subtitle={t("contact.teamSubtitle")} />
      </div>
    </section>
  )
}
