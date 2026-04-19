"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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

const SECTION_IDS = ["accueil"] // removed contact anchor; now a page

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
      { href: `/${lang}/services/prestation-technique-audiovisuelle`, label: t("nav.prestation") },
      { href: `/${lang}/artists`, label: t("nav.artistes") },
      { href: `/${lang}/services/label-musical`, label: t("nav.label") },
      { href: `/${lang}/devis`, label: t("nav.devis") },
      { href: `/${lang}/contacts`, label: t("nav.contact") },
    ],
    [lang, t],
  )

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
          ? "bg-white/40 backdrop-blur-xl border-b border-black/5 py-4" 
          : "bg-transparent py-8"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center">
            <Link 
              href={`/${lang}`} 
              title={t("nav.accueil")} 
              aria-label={t("nav.accueil")}
            >
              <Image
                src="/images/angeli-visions-logo-white.png"
                alt="Angeli Visions Logo"
                width={500}
                height={150}
                priority
                className="h-16 md:h-20 w-auto object-contain transition-all duration-500 brightness-0 opacity-80"
              />
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center">
            {items.map((item, index) => {
              const active = isItemActive(item)
              const isDevis = item.href.endsWith("/devis")
              
              // Map labels to have line breaks where requested/needed to match image
              let label = item.label;
              if (label === t("nav.prestation")) {
                label = "Prestation technique<br />audiovisuelle";
              } else if (label === t("nav.artistes")) {
                label = "Booking DJ &<br />Musiciens";
              } else if (label === t("nav.label")) {
                label = "Label<br />Musical";
              }

              const isPath = item.href.startsWith("/")

              // Define specific glow classes based on index
              const glowClass = !isDevis ? `glow-item-${(index % 3) + 1}` : "";
              
              const baseClass = isDevis ? "nav-pill-devis" : "nav-pill-identic";
              const itemClasses = isDevis ? "" : `${glowClass} text-slate-800 hover:text-slate-900`;

              return (
                <div key={`${item.href}-${item.label}`} className="flex items-center">
                  {index > 0 && (
                    <div className="dot-separator" />
                  )}
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    {isPath ? (
                      <Link
                        href={item.href}
                        className={`${baseClass} ${itemClasses}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span dangerouslySetInnerHTML={{ __html: label }} />
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className={`${baseClass} ${itemClasses}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span dangerouslySetInnerHTML={{ __html: label }} />
                      </a>
                    )}
                  </motion.div>
                </div>
              )
            })}
          </div>

          {/* Newsletter, Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <a
              href="#newsletter"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium border border-slate-900/10 rounded-full px-4 py-2 text-slate-600 hover:bg-slate-900/5 transition-all duration-300"
            >
              <Mail className="w-3.5 h-3.5" />
              {t("nav.newsletter")}
            </a>

            <div>
              <LanguageSelector />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-slate-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/70 backdrop-blur-xl rounded-2xl mt-2 p-4 border border-black/5 shadow-xl"
          >
            {items.map((item) => {
              const active = isItemActive(item)
              const isPath = item.href.startsWith("/")
              const mobileClass = `block py-2 transition-colors ${item.featured
                ? `text-emerald-200 hover:text-emerald-100 border border-emerald-400/50 rounded-lg px-3 py-2 bg-emerald-500/5 hover:bg-emerald-500/10 ring-1 ring-inset ring-emerald-400/30 ${active ? "bg-emerald-500/15 ring-emerald-400/60 text-emerald-50" : ""
                }`
                : `text-slate-800 hover:text-slate-900 ${item.bold ? "font-bold" : ""} ${active ? "text-slate-900" : ""}`
                }`

              return isPath ? (
                <Link
                  key={`${item.href}-${item.label}-mobile`}
                  href={item.href}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={mobileClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <span className="inline-flex mr-1.5 align-middle">{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <a
                  key={`${item.href}-${item.label}-mobile`}
                  href={item.href}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={mobileClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <span className="inline-flex mr-1.5 align-middle">{item.icon}</span>}
                  {item.label}
                </a>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
