"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLang } from "@/hooks/use-lang"
import { useI18n } from "@/components/i18n/i18n-provider"
import LanguageSelector from "@/components/i18n/language-selector"

type MenuItem = {
  href: string
  label: string
  bold?: boolean
  featured?: boolean
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
      { href: `/${lang}#accueil`, label: t("nav.accueil") },
      { href: `/${lang}/services`, label: t("nav.services") },
      { href: `/${lang}#realisations`, label: t("nav.realisations"), bold: true },
      { href: `/${lang}/artists`, label: t("nav.artistes") },
      { href: `/${lang}/investir-dans-la-culture`, label: t("nav.investissement") },
      { href: `/${lang}/devis`, label: t("nav.devis") },
      { href: `/${lang}/contacts`, label: t("nav.contact") }, // now a page
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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <Link href={`/${lang}`} title="Angeli Visions – Accueil" aria-label="Retour à l'accueil">
              <img
                src="/images/angeli-visions-logo-white.png"
                alt="Angeli Visions"
                className="h-20 w-auto object-contain"
              />
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => {
              const active = isItemActive(item)
              const baseLink =
                "transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded-md"
              const normalClasses = ["text-slate-300 hover:text-white", item.bold ? "font-bold" : ""]
                .filter(Boolean)
                .join(" ")
              const featuredClasses = [
                "text-emerald-200 hover:text-emerald-100",
                "border border-emerald-400/40",
                "rounded-full px-3 py-1",
                "bg-emerald-500/5 hover:bg-emerald-500/10",
                "ring-1 ring-inset ring-emerald-400/20",
                "shadow-[0_0_0_1px_rgba(16,185,129,0.10)]",
                active
                  ? "bg-emerald-500/15 ring-emerald-400/60 shadow-[0_0_0_2px_rgba(16,185,129,0.15)] text-emerald-50"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")

              const className = `${baseLink} ${item.featured ? featuredClasses : normalClasses}`

              const isPath = item.href.startsWith("/")
              return (
                <motion.div key={`${item.href}-${item.label}`} whileHover={{ y: -2 }}>
                  {isPath ? (
                    <Link
                      href={item.href}
                      title={item.label}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      className={className}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                      {!item.featured && (
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300 ${active ? "w-full opacity-100" : "w-0 opacity-80 group-hover:w-full"
                            }`}
                        />
                      )}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      title={item.label}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      className={className}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                      {!item.featured && (
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300 ${active ? "w-full opacity-100" : "w-0 opacity-80 group-hover:w-full"
                            }`}
                        />
                      )}
                    </a>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-slate-800/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
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
            className="md:hidden bg-slate-800/90 backdrop-blur-md rounded-lg mt-2 p-4"
          >
            {items.map((item) => {
              const active = isItemActive(item)
              const isPath = item.href.startsWith("/")
              const mobileClass = `block py-2 transition-colors ${item.featured
                ? `text-emerald-200 hover:text-emerald-100 border border-emerald-400/50 rounded-lg px-3 py-2 bg-emerald-500/5 hover:bg-emerald-500/10 ring-1 ring-inset ring-emerald-400/30 ${active ? "bg-emerald-500/15 ring-emerald-400/60 text-emerald-50" : ""
                }`
                : `text-slate-300 hover:text-white ${item.bold ? "font-bold" : ""} ${active ? "text-white" : ""}`
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
