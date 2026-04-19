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
    <section id="partenaires" className="py-8 bg-slate-900 border-t border-slate-800/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t("partners.title")}
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 items-center">
          {partners.map((partner, index) => {
            const PartnerLogo = (
              <div className="relative w-[110px] h-[110px] md:w-[140px] md:h-[140px] group grayscale hover:grayscale-0 transition-all duration-500 transform hover:scale-105 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-xl flex items-center justify-center">
                <div className="relative w-full h-full p-2">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all duration-500"
                  />
                </div>
              </div>
            )

            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {partner.url ? (
                  <a href={partner.url} target="_blank" rel="noopener noreferrer" className="block outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl p-1" title={partner.name}>
                    {PartnerLogo}
                  </a>
                ) : (
                  <div title={partner.name} className="p-1">
                    {PartnerLogo}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
