"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, Instagram, Facebook, ArrowUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useLang } from "@/hooks/use-lang"
import { useI18n } from "@/components/i18n/i18n-provider"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [newsletterFirstName, setNewsletterFirstName] = useState("")
  const [newsletterLastName, setNewsletterLastName] = useState("")
  const [newsletterConsent, setNewsletterConsent] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const lang = useLang()
  const { t } = useI18n()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName: newsletterFirstName, lastName: newsletterLastName, consent: newsletterConsent, lang }),
      })
      if (res.ok) {
        setIsSubscribed(true)
        setTimeout(() => {
          setIsSubscribed(false)
          setEmail("")
          setNewsletterFirstName("")
          setNewsletterLastName("")
          setNewsletterConsent(false)
        }, 3000)
      } else {
        const data = await res.json()
        alert(data.error || "Une erreur est survenue")
      }
    } catch (error) {
      console.error("Newsletter error:", error)
      alert("Erreur de connexion")
    }
  }

  const footerLinks = {
    services: [
      { label: t("nav.prestation"), href: `/${lang}/services/prestation-technique-audiovisuelle` },
      { label: t("nav.artistes"), href: `/${lang}/artists` },
      { label: t("nav.label"), href: `/${lang}/services/label-musical` },
    ],
  }

  const socialLinks = [
    { icon: Facebook, url: "https://facebook.com/angelivisions", label: "Facebook" },
    { icon: Instagram, url: "https://instagram.com/angelivisions", label: "Instagram" },
    {
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.28-2.26.74-4.63 2.58-5.91 1.64-1.15 3.7-1.49 5.66-1.02v4.01c-1.25-.43-2.71-.14-3.67.76-.73.66-1.1 1.65-1.01 2.62.06.98.57 1.95 1.41 2.45.65.42 1.45.62 2.23.55.82-.04 1.6-.45 2.15-1.07.57-.63.86-1.48.83-2.33-.03-4.3-.01-8.59-.02-12.89z" />
        </svg>
      ),
      url: "https://tiktok.com/@angelivisions",
      label: "TikTok",
    },
    {
      icon: ({ className }: { className?: string }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.403 6.231H2.746l7.73-8.835L2.25 2.25h6.865l4.256 5.632 4.873-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: "https://x.com/angelivisions",
      label: "X (Twitter)",
    },
  ]

  return (
    <footer className="bg-[#020617] border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          {/* Brand & Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-8">
                <Image
                  src="/images/angeli-visions-logo-white.png"
                  alt="Angeli Visions"
                  width={200}
                  height={56}
                  className="h-16 w-auto object-contain opacity-90"
                />
              </div>
              <p className="text-slate-400 text-sm font-display leading-relaxed mb-8">
                {t("footer.description")}
              </p>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.1 }}
                    className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:bg-white/[0.08] hover:border-amber-500/30 transition-all duration-300 shadow-xl"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h3 className="text-white font-display font-medium text-lg mb-8 uppercase tracking-widest text-[10px]">
               {t("footer.contacts")}
            </h3>
            <div className="space-y-6">
              <div className="group flex items-center text-slate-300 hover:text-amber-500 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mr-4 group-hover:bg-white/[0.08] transition-colors">
                   <Phone className="w-4 h-4 text-amber-500" />
                </div>
                <a href="tel:+33663796742" className="text-sm font-display">
                  +33 6 63 79 67 42
                </a>
              </div>
              <div className="group flex items-center text-slate-300 hover:text-amber-500 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mr-4 group-hover:bg-white/[0.08] transition-colors">
                   <Mail className="w-4 h-4 text-amber-500" />
                </div>
                <a href="mailto:contact@angelivisions.com" className="text-sm font-display">
                  contact@angelivisions.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Services quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-white font-display font-medium text-lg mb-8 uppercase tracking-widest text-[10px]">
               {t("nav.services")}
            </h3>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-amber-500 font-display transition-all duration-300 flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/0 group-hover:bg-amber-500 mr-0 group-hover:mr-3 transition-all duration-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            id="newsletter"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-white font-display font-medium text-lg mb-8 uppercase tracking-widest text-[10px]">
               Newsletter
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t("footer.newsletterFirstName")}
                  value={newsletterFirstName}
                  onChange={(e) => setNewsletterFirstName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 font-display text-xs text-white p-4 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-500 backdrop-blur-md"
                />
                <input
                  type="text"
                  placeholder={t("footer.newsletterLastName")}
                  value={newsletterLastName}
                  onChange={(e) => setNewsletterLastName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 font-display text-xs text-white p-4 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-500 backdrop-blur-md"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 font-display text-xs text-white p-4 rounded-2xl focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-500 backdrop-blur-md"
              />
              
              {/* Consent Checkbox */}
              <div className="flex items-start gap-3 p-1 select-none">
                <input
                  type="checkbox"
                  id="newsletter-consent"
                  checked={newsletterConsent}
                  onChange={(e) => setNewsletterConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 accent-amber-500 cursor-pointer"
                  required
                />
                <label 
                  htmlFor="newsletter-consent" 
                  className="text-[10px] text-slate-500 leading-tight cursor-pointer hover:text-slate-300 transition-colors"
                >
                  {t("footer.newsletterConsent")}
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubscribed || !newsletterConsent}
                className="w-full sunset-gradient text-white font-display text-[10px] uppercase tracking-widest font-semibold py-4 rounded-2xl transition-all duration-500 hover:scale-[1.02] shadow-xl shadow-amber-500/10 active:scale-95 disabled:opacity-50"
              >
                {isSubscribed ? t("footer.subscribed") : t("footer.subscribe")}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest font-display text-slate-500">
          <div className="mb-6 md:mb-0">
            © 2025 Angeli Visions — {t("footer.rights")}
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href={`/${lang}/politique-confidentialite`} className="hover:text-amber-500 transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link href={`/${lang}/mentions-legales`} className="hover:text-amber-500 transition-colors">
              {t("footer.legal")}
            </Link>
            <Link href={`/${lang}/politique-cookies`} className="hover:text-amber-500 transition-colors">
              {t("footer.cookies")}
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 hover:text-amber-500 transition-colors group"
            >
              {t("footer.backToTop")}
              <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
