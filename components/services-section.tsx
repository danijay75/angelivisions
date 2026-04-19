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
      <section id="services" className="py-20 bg-slate-800/50">
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
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="mb-16 text-left"
        >
          <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">
            Nos Expertises
          </h2>
          <p className="text-white/60 font-display max-w-xl">
             Des solutions sur mesure pour vos événements et votre carrière musicale.
          </p>
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
                <Card className="glassy-card h-full border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 hover:scale-[1.02] flex flex-col">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain filter brightness-110"
                      />
                    </div>
                    <CardTitle className="text-2xl font-display font-medium text-white group-hover:text-sunset-orange transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <div 
                      className="text-white/60 font-display mb-8 line-clamp-3 leading-relaxed flex-grow"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {(service.features || []).slice(0, 3).map((feature, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 uppercase tracking-wider"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 flex items-center text-sunset-light font-display text-sm font-medium group/btn">
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
