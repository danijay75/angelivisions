"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RetroButton } from "@/components/ui/button-retro"
import GradientButton from "@/components/ui/gradient-button"
import { Menu, X, Globe, Mail } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLang } from "@/hooks/use-lang"
import { useI18n } from "@/components/i18n/i18n-provider"
import LanguageSelector from "@/components/i18n/language-selector"

type MenuItem = {
  href: string
  label: string
  bold?: boolean
  featured?: boolean
  icon?: React.ReactNode
}

const SECTION_IDS = ["accueil", "services", "realisations", "partenaires", "contact"]

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeHref, setActiveHref] = useState<string>("")
  const pathname = usePathname() || "/fr"
  const router = useRouter()
  const lang = useLang()
  const { t } = useI18n()
  const observerRef = useRef<IntersectionObserver | null>(null)

  const items: MenuItem[] = useMemo(
    () => [
      { href: `/${lang}/services`, label: t("nav.prestation") },
      { href: `/${lang}/spectacles`, label: t("nav.label") },
      { href: `/${lang}/devis`, label: t("nav.devis") },
      { href: `/${lang}#contact`, label: t("nav.contact") },
    ],
    [lang, t],
  )

  const getTwoLineLabel = (href: string, originalLabel: string, currentLang: string) => {
    const isPrestation = href.includes("/services")
    const isSpectacles = href.includes("spectacles") || href.includes("label-de-musique")
    const isDevis = href.endsWith("/devis")
    const isContact = href.includes("#contact")

    if (currentLang === "en") {
      if (isPrestation) return "Audiovisual<br />Production"
      if (isSpectacles) return "Shows<br />Catalog"
      if (isDevis) return "Free<br />Quote"
      if (isContact) return "Contact<br />Us"
    } else if (currentLang === "es") {
      if (isPrestation) return "Grabación - Streaming<br />Podcast"
      if (isSpectacles) return "Catálogo<br />Espectáculos"
      if (isDevis) return "Presupuesto<br />Gratis"
      if (isContact) return "Contactar<br />Nosotros"
    } else {
      // Default to French
      if (isPrestation) return "Captation - Streaming<br />Podcast"
      if (isSpectacles) return "Catalogue<br />Spectacles"
      if (isDevis) return "Devis<br />Gratuit"
      if (isContact) return "Nous<br />contacter"
    }
    return originalLabel
  }

  // Scroll spy only on localized one-page home
  useEffect(() => {
    if (!["/fr", "/en", "/es"].includes(pathname)) return

    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!sections.length) return

    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id")
            if (id) setActiveHref(`#${id}`)
          }
        })
      },
      { root: null, rootMargin: "0px 0px -40% 0px", threshold: 0.4 },
    )
    sections.forEach((el) => observerRef.current?.observe(el))

    const handleHashChange = () => {
      if (location.hash) setActiveHref(location.hash)
    }
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      observerRef.current?.disconnect()
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [pathname])

  const isItemActive = (item: MenuItem) => {
    if (item.href.startsWith("/")) return pathname === item.href
    return activeHref === item.href || (typeof window !== "undefined" && window.location.hash === item.href)
  }

  // Removed switchLanguage function as it's now handled by LanguageSelector component

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-black/60 backdrop-blur-2xl border-b border-white/5 py-4" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-auto min-h-[5rem]">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center z-10">
            <Link 
              href={`/${lang}`} 
              title={t("nav.accueil")} 
              aria-label={t("nav.accueil")}
              className="block"
            >
              <Image
                src="/images/angeli-visions-logo-white.png"
                alt="Angeli Visions Logo"
                width={500}
                height={150}
                priority
                className="h-[150px] w-auto object-contain transition-all duration-500 hover:opacity-100"
              />
            </Link>
          </motion.div>

          {/* Desktop Menu - High-End AV Rack Control Panel */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center bg-[#0d0f14]/90 backdrop-blur-xl border border-white/5 shadow-[0px_4px_16px_rgba(0,0,0,0.8),_inset_0px_1px_2px_rgba(255,255,255,0.05)] rounded-[8px] p-2.5 gap-3 overflow-hidden z-20">
            {/* Subtle rack handles or metallic screws simulation at the edges */}
            <div className="absolute left-[3px] top-[3px] w-[4px] h-[4px] rounded-full bg-neutral-600 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)] opacity-60" />
            <div className="absolute right-[3px] top-[3px] w-[4px] h-[4px] rounded-full bg-neutral-600 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)] opacity-60" />
            <div className="absolute left-[3px] bottom-[3px] w-[4px] h-[4px] rounded-full bg-neutral-600 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)] opacity-60" />
            <div className="absolute right-[3px] bottom-[3px] w-[4px] h-[4px] rounded-full bg-neutral-600 shadow-[inset_0.5px_0.5px_0px_rgba(255,255,255,0.3)] opacity-60" />

            {items.map((item, index) => {
              const active = isItemActive(item)
              const isDevis = item.href.endsWith("/devis")
              const isContact = item.href.includes("#contact")
              
              const label = getTwoLineLabel(item.href, item.label, lang)

              const isRewritten = item.href.includes("label-de-musique") || item.href.includes("spectacles")
              const isPath = item.href.startsWith("/") && !isRewritten

              // Choose the button design style
              let variant: "default" | "darkGray" | "gray" | "lightGray" | "white" | "amber" | "orange" | "red" | "emerald" = "darkGray";
              if (isDevis) {
                variant = "amber"; // Devis is a glowing amber CTA button
              } else if (isContact) {
                variant = "gray"; // Contact is slightly different gray
              } else if (active) {
                variant = "darkGray";
              }

              return (
                <div key={`${item.href}-${item.label}`} className="flex items-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <RetroButton
                      asChild
                      variant={variant}
                      size="nav"
                      isActive={active}
                    >
                      {isPath ? (
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span dangerouslySetInnerHTML={{ __html: label }} />
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span dangerouslySetInnerHTML={{ __html: label }} />
                        </a>
                      )}
                    </RetroButton>
                  </motion.div>
                </div>
              )
            })}
          </div>

          {/* Newsletter, Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <a href="#newsletter" className="hidden md:block">
              <GradientButton height="36px">
                <Mail className="w-3.5 h-3.5 mr-1.5" />
                {t("nav.newsletter")}
              </GradientButton>
            </a>

            <div>
              <LanguageSelector />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Stacked AV Console Panel */}
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0d0f14]/95 backdrop-blur-3xl rounded-xl mt-2 p-3 border border-white/10 shadow-2xl flex flex-col gap-3 relative overflow-hidden"
          >
            {/* Subtle rack handles or metallic screws simulation */}
            <div className="absolute left-[3px] top-[3px] w-[3px] h-[3px] rounded-full bg-neutral-600 opacity-60" />
            <div className="absolute right-[3px] top-[3px] w-[3px] h-[3px] rounded-full bg-neutral-600 opacity-60" />
            <div className="absolute left-[3px] bottom-[3px] w-[3px] h-[3px] rounded-full bg-neutral-600 opacity-60" />
            <div className="absolute right-[3px] bottom-[3px] w-[3px] h-[3px] rounded-full bg-neutral-600 opacity-60" />

            {items.map((item) => {
              const active = isItemActive(item)
              const isDevis = item.href.endsWith("/devis")
              const isContact = item.href.includes("#contact")
              
              const label = getTwoLineLabel(item.href, item.label, lang)

              const isRewritten = item.href.includes("label-de-musique") || item.href.includes("spectacles")
              const isPath = item.href.startsWith("/") && !isRewritten

              // Choose the button design style for mobile
              let variant: "default" | "darkGray" | "gray" | "lightGray" | "white" | "amber" | "orange" | "red" | "emerald" = "darkGray";
              if (isDevis) {
                variant = "amber";
              } else if (isContact) {
                variant = "gray";
              } else if (active) {
                variant = "darkGray";
              }

              return (
                <div key={`${item.href}-${item.label}-mobile`} className="w-full">
                  <RetroButton
                    asChild
                    variant={variant}
                    size="fullNav"
                    isActive={active}
                  >
                    {isPath ? (
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon && <span className="inline-flex mr-1.5 align-middle">{item.icon}</span>}
                        <span dangerouslySetInnerHTML={{ __html: label }} />
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon && <span className="inline-flex mr-1.5 align-middle">{item.icon}</span>}
                        <span dangerouslySetInnerHTML={{ __html: label }} />
                      </a>
                    )}
                  </RetroButton>
                </div>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
