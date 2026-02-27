"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { defaultServices, type ServiceItem, SERVICES_STORAGE_KEY } from "@/data/services"
import { useI18n } from "@/components/i18n/i18n-provider"

export default function ServicesSection() {
  const { t, lang } = useI18n()
  const [services, setServices] = useState<ServiceItem[]>(defaultServices)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services")
        if (res.ok) {
          const data = await res.json()
          if (data.services && Array.isArray(data.services)) {
            const valid = data.services.filter((s: any) => s && s.id && s.title);
            if (valid.length > 0) {
              setServices(valid)
              return
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch services:", error)
      }

      // Fallback to localStorage if API fails or returns no services
      try {
        const raw = localStorage.getItem(SERVICES_STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as ServiceItem[]
          if (Array.isArray(parsed)) {
            const valid = parsed.filter((s: any) => s && s.id && s.title);
            if (valid.length > 0) {
              setServices(valid)
            }
          }
        }
      } catch {
        // ignore and keep defaults
      }
    }

    fetchServices()
  }, [mounted])

  if (!mounted) {
    return (
      <section id="services" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("services.title")}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
                {t("services.subtitle")}
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">{t("services.description")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-800/30 backdrop-blur-md border-slate-700/50 rounded-lg p-6 animate-pulse">
                <div className="w-16 h-16 bg-slate-700 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("services.title")}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block">
              {t("services.subtitle")}
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">{t("services.description")}</p>
        </motion.div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const translatedTitle = t(`services.items.${service.id}.title`)
            const translatedDescription = t(`services.items.${service.id}.description`)
            // Only translate if the key exists (i.e. not the key itself)
            const displayTitle = translatedTitle !== `services.items.${service.id}.title` ? translatedTitle : service.title
            const displayDescription =
              translatedDescription !== `services.items.${service.id}.description`
                ? translatedDescription
                : service.description

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Link href={`/${lang}/services/${service.id}`} className="block h-full group">
                  <Card className="bg-slate-800/30 backdrop-blur-md border-slate-700/50 h-full hover:bg-slate-800/50 hover:border-slate-600/50 transition-all duration-300 relative overflow-hidden">
                    {/* Hover indicator overlay */}
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-blue-400" />
                    </div>
                    <CardHeader>
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 shadow-lg overflow-hidden group-hover:scale-110 transition-transform duration-500`}
                      >
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={displayTitle}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <CardTitle className="text-white text-xl group-hover:text-blue-400 transition-colors">
                        {displayTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 mb-6 line-clamp-2">{displayDescription}</p>
                      <div className="space-y-2">
                        {(service.features || []).slice(0, 3).map((feature, idx) => {
                          const translatedFeature = t(`services.items.${service.id}.features.${idx}`)
                          const displayFeature =
                            translatedFeature !== `services.items.${service.id}.features.${idx}`
                              ? translatedFeature
                              : feature
                          return (
                            <div key={`${service.id}-feat-${idx}`} className="flex items-center text-slate-400 text-sm">
                              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mr-3"></div>
                              {displayFeature}
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        En savoir plus <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full shadow-lg shadow-blue-500/25"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t("services.cta")}
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
