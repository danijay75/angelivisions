"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Play, Phone, ChevronRight } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n-provider"

export default function HeroSection() {
  const { t, lang } = useI18n()
  const { scrollY } = useScroll()
  const [mounted, setMounted] = useState(false)

  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="container mx-auto px-4 pt-40 md:pt-32 text-center relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
           style={{ y: y1, opacity }}
           className="max-w-5xl mx-auto w-full"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <Image
              src="/images/angeli-visions-logo-white.png"
              alt="Angeli Visions"
              width={800}
              height={220}
              priority
              className="h-32 md:h-48 w-auto mx-auto object-contain brightness-0 opacity-80 drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-slate-900 leading-[1.1] tracking-tight">
              {t("hero.titlePart1")}<br />
              <span className="italic font-light text-slate-800/70">{t("hero.titlePart2")}</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-2xl mx-auto"
          >
            <Link 
              href={`/${lang}/realisations`}
              className="w-full sm:w-auto min-w-[240px] px-10 py-5 sunset-gradient text-white font-display font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5 fill-current" />
              {t("hero.cta")}
            </Link>

            <a 
              href="tel:+33663796742"
              className="w-full sm:w-auto min-w-[240px] px-10 py-5 bg-slate-900/5 hover:bg-slate-900/10 border-2 border-slate-900/10 text-slate-900 font-display font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              {t("hero.callUs")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
