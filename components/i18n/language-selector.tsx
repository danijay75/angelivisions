"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, ChevronDown, Check } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLang } from "@/hooks/use-lang"
import { Button } from "@/components/ui/button"
import { LOCALES, type Locale } from "@/lib/i18n/locales"

const languageNames: Record<Locale, string> = {
    fr: "Français",
    en: "English",
    es: "Español",
}

const languageFlags: Record<Locale, string> = {
    fr: "🇫🇷",
    en: "🇬🇧",
    es: "🇪🇸",
}

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false)
    const lang = useLang()
    const pathname = usePathname()
    const router = useRouter()
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLanguageChange = (nextLang: Locale) => {
        if (nextLang === lang) {
            setIsOpen(false)
            return
        }

        const segments = pathname.split("/")
        segments[1] = nextLang
        const nextPath = segments.join("/") || `/${nextLang}`
        router.push(nextPath)
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={containerRef}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 flex items-center gap-2 px-3 py-2 transition-all duration-200"
            >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">{lang.toUpperCase()}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-3 h-3 opacity-60" />
                </motion.div>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-[60] overflow-hidden"
                    >
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Choisir la langue</span>
                        </div>
                        {LOCALES.map((l) => (
                            <button
                                key={l}
                                onClick={() => handleLanguageChange(l as Locale)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-200 group
                  ${lang === l
                                        ? "text-emerald-400 bg-emerald-500/10"
                                        : "text-slate-300 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg leading-none">{languageFlags[l as Locale]}</span>
                                    <span className={`${lang === l ? "font-semibold" : "font-normal"}`}>
                                        {languageNames[l as Locale]}
                                    </span>
                                </div>
                                {lang === l && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-4 h-4 flex items-center justify-center bg-emerald-500 rounded-full"
                                    >
                                        <Check className="w-2.5 h-2.5 text-slate-900" strokeWidth={4} />
                                    </motion.div>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
