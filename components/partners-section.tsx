"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Partner } from "@/data/partners"
import { useI18n } from "@/components/i18n/i18n-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function PartnersSection() {
  const { t, lang } = useI18n()
  const [partners, setPartners] = useState<Partner[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/partners")
        if (res.ok) {
          const data = await res.json()
          if (data && data.partners && Array.isArray(data.partners)) {
            setPartners(data.partners)
          }
        }
      } catch (error) {
        console.error("Failed to fetch partners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [mounted])

  if (!mounted || loading) {
    return (
      <section id="partenaires" className="py-8 bg-slate-900 border-t border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {mounted ? t("partners.title") : "Nos partenaires"}
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6 items-center">
             {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-[110px] h-[110px] md:w-[140px] md:h-[140px] rounded-3xl bg-slate-800/50" />
             ))}
          </div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) return null

  return (
    <section id="partenaires" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="sunset-gradient bg-clip-text text-transparent text-[10px] uppercase tracking-[0.3em] font-display mb-4 block font-bold">
             Expertises & Réseaux
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-white">
            {t("partners.title")}
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 items-center max-w-5xl mx-auto opacity-50 hover:opacity-100 transition-opacity duration-700">
          {partners.map((partner, index) => {
            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="w-[120px] h-[120px] rounded-[32px] bg-white/[0.05] border border-white/10 flex items-center justify-center p-6 grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:bg-white/[0.08] group-hover:border-white/20 group-hover:scale-110 shadow-lg">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
