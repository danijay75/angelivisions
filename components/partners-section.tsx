"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Partner } from "@/data/partners"
import { useI18n } from "@/components/i18n/i18n-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { SplitTitle } from "@/components/ui/split-title"

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
      <section id="partenaires" className="py-8 bg-transparent border-t border-black/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {mounted ? t("partners.title") : "Nos partenaires"}
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 items-center">
             {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-[32px] bg-white/5" />
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-amber-500/40" />
            <div className="h-1 w-32 md:w-48 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-amber-500/40" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold">
            <SplitTitle text={t("partners.title")} />
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center max-w-5xl mx-auto mt-16">
          {partners.map((partner, index) => {
            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <a
                  href={partner.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group cursor-pointer block"
                >
                  {/* Glow Background that appears on hover */}
                  <div className="absolute inset-0 rounded-full bg-amber-500/0 group-hover:bg-amber-500/10 blur-xl transition-all duration-500" />
                  
                  <div className="relative w-[120px] h-[80px] md:w-[160px] md:h-[100px] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={160}
                      height={100}
                      className="w-full h-full object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                    />
                  </div>
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
