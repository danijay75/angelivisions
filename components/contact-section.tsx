"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Sparkles, Mail } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/components/i18n/i18n-provider"
import { useLang } from "@/hooks/use-lang"
import { SplitTitle } from "@/components/ui/split-title"

export default function ContactSection() {
  const { t } = useI18n()
  const lang = useLang()
  const hours = {
    title: t("contact.hoursTitle"),
    content: t("contact.hoursContent"),
  }

  const address = "79 rue du Général Leclerc, 78400 Chatou"
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2622.9729765420843!2d2.149269112446479!3d48.896852171217816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66306b8822dd1%3A0xd365d4b747fcc77f!2s79%20Rue%20du%20G%C3%A9n%C3%A9ral%20Leclerc%2C%2078400%20Chatou!5e0!3m2!1sfr!2sfr!4v1771968268008!5m2!1sfr!2sfr"

  return (
    <section id="contact" className="py-20 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <SplitTitle text={t("contact.title")} />
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t("contact.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Opening hours */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <Card className="glassy-card border-white/10 rounded-[2rem] overflow-hidden group hover:border-amber-500/30 transition-all duration-500 h-full">
                <CardContent className="p-8 md:p-10 h-full flex flex-col justify-center">
                  <div className="flex flex-col h-full justify-center space-y-10">
                    {/* Header: Icon + Title */}
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 shrink-0 rounded-[1.25rem] border border-white/10 bg-slate-950/60 flex items-center justify-center text-amber-500 shadow-sm">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-bold text-white leading-tight pt-1">
                        {hours.title}
                      </h3>
                    </div>

                    {/* Hours Text */}
                    <p className="text-slate-300 whitespace-pre-line text-xl leading-relaxed">
                      {hours.content}
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-5 group/item">
                        <div className="w-14 h-14 shrink-0 rounded-[1.25rem] border border-white/10 bg-slate-950/60 flex items-center justify-center text-amber-500 transition-all duration-300 group-hover/item:bg-amber-500/10 group-hover/item:border-amber-500/30">
                          <Phone className="w-6 h-6" />
                        </div>
                        <a href="tel:+33663796742" className="text-white text-lg font-medium hover:text-amber-500 transition-colors">
                          +33 6 63 79 67 42
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-5 group/item">
                        <div className="w-14 h-14 shrink-0 rounded-[1.25rem] border border-white/10 bg-slate-950/60 flex items-center justify-center text-amber-500 transition-all duration-300 group-hover/item:bg-amber-500/10 group-hover/item:border-amber-500/30">
                          <Mail className="w-6 h-6" />
                        </div>
                        <a href="mailto:contact@angelivisions.com" className="text-white text-lg font-medium hover:text-amber-500 transition-colors">
                          contact@angelivisions.com
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Map Column */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <Card className="glassy-card border-white/10 rounded-[2.5rem] overflow-hidden h-full group hover:border-white/20 transition-all duration-500">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-amber-500" aria-hidden="true" />
                    <span className="text-white font-medium">{address}</span>
                  </div>
                  <div className="relative flex-grow min-h-[400px]">
                    <iframe
                      title={`Localisation - ${address}`}
                      src={mapSrc}
                      className="absolute inset-0 w-full h-full grayscale-[0.8] invert-[0.9] hue-rotate-[180deg] opacity-80"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Réclamations link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-block glassy-card px-8 py-4 rounded-2xl border border-white/5">
            <p className="text-slate-400 text-lg">
              {t("contact.reclamationsQuestion")}{" "}
              <Link 
                href={`/${lang}/reclamations`} 
                className="title-gradient inline-block underline font-bold transition-all hover:opacity-80"
                aria-label={t("contact.reclamationsCta")}
              >
                {t("contact.reclamationsCta")}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
