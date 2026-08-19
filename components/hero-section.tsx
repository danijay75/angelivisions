"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Play, Phone } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n-provider"
import { SplitTitle } from "@/components/ui/split-title"

const slidingWords = [
  "la Captation Vidéo",
  "le Streaming Live",
  "le Podcast Vidéo"
]

export default function HeroSection() {
  const { t, lang } = useI18n()
  const { scrollY } = useScroll()
  const [mounted, setMounted] = useState(false)
  
  const [images, setImages] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)

  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    setMounted(true)
    
    // Fetch carousel images from API
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/hero-carousel")
        if (res.ok) {
          const data = await res.json()
          if (data.images && data.images.length > 0) {
            setImages(data.images)
          }
        }
      } catch (error) {
        console.error("Failed to load hero images:", error)
      }
    }
    
    fetchImages()
  }, [])

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [images.length])

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % slidingWords.length)
    }, 3000)
    return () => clearInterval(wordInterval)
  }, [])

  if (!mounted) return null

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Slideshow (Ken Burns & Fade) */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          {images.length > 0 ? (
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.15 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 1.5, ease: "easeInOut" },
                scale: { duration: 10, ease: "linear" } 
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={images[activeIndex]} 
                alt="Angeli Visions Stage" 
                className="object-cover w-full h-full"
              />
            </motion.div>
          ) : (
            // Fallback empty state
            <div className="absolute inset-0 bg-slate-900" />
          )}
        </AnimatePresence>
        
        {/* Assombrissement pour lisibilité (overlay sombre de 40%) */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 pt-40 md:pt-32 text-center relative z-20 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
           style={{ y: y1, opacity }}
           className="max-w-5xl mx-auto w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium leading-[1.2] tracking-tight drop-shadow-2xl flex flex-col items-center">
              <span className="text-white mb-2">{t("hero.titlePart1")}</span>
              <div className="flex items-center justify-center gap-[0.25em] mt-1">
                <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 whitespace-nowrap flex-shrink-0">
                  pour
                </span>
                <div className="relative h-[1.8em] overflow-x-visible overflow-y-clip min-w-[14ch] md:min-w-[16ch] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 whitespace-nowrap absolute left-0"
                    >
                      {slidingWords[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
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
              className="w-full sm:w-auto min-w-[240px] px-10 py-5 sunset-gradient text-white font-display font-medium rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5 fill-current" />
              {t("hero.cta")}
            </Link>

            <a 
              href="tel:+33663796742"
              className="w-full sm:w-auto min-w-[240px] px-10 py-5 bg-black/20 hover:bg-black/40 border border-white/20 text-white font-display font-medium rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-xl flex items-center justify-center gap-3 shadow-lg"
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
