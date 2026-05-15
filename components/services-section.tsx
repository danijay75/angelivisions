"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import { defaultServices, type ServiceItem, SERVICES_STORAGE_KEY } from "@/data/services"
import { useI18n } from "@/components/i18n/i18n-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { SplitTitle } from "@/components/ui/split-title"

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
            const valid = data.services.filter((s: any) => s && s.id && s.title && s.id !== "sport");
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
            const valid = parsed.filter((s: any) => s && s.id && s.title && s.id !== "sport");
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
      <section id="services" className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-slate-800/30 backdrop-blur-md border-slate-700/50 p-6">
                <Skeleton className="w-20 h-20 rounded-xl mb-4 bg-slate-700" />
                <Skeleton className="h-6 w-3/4 mb-4 bg-slate-700" />
                <Skeleton className="h-4 w-full mb-2 bg-slate-700" />
                <Skeleton className="h-4 w-full mb-2 bg-slate-700" />
                <Skeleton className="h-4 w-2/3 bg-slate-700" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="max-w-6xl mx-auto mb-20 text-center px-4"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-amber-500/40" />
            <div className="h-1 w-32 md:w-48 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-amber-500/40" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold">
            <SplitTitle text={t("services.sectionTitle")} />
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/${lang}/services/${service.id}`} className="block h-full group">
                <Card className="h-full border-white/10 bg-black/50 hover:bg-black/70 backdrop-blur-3xl transition-all duration-500 hover:scale-[1.02] flex flex-col shadow-2xl hover:shadow-white/5 rounded-[2.5rem] overflow-hidden">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain invert group-hover:invert-0 transition-all opacity-90"
                      />
                    </div>
                    <CardTitle className="text-2xl font-display font-medium transition-colors duration-300 drop-shadow-md">
                      <SplitTitle text={service.title} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <div 
                      className="text-slate-200 font-display mb-8 line-clamp-3 leading-relaxed flex-grow text-[15px]"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {(service.features || []).slice(0, 3).map((feature, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-[10px] text-slate-100 uppercase tracking-widest font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 flex items-center text-amber-500 font-display text-sm font-medium group/btn">
                      <span className="mr-2">{t("realisations.seeProject")}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
