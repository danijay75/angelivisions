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
    <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <Image
                  src="/images/angeli-visions-logo-white.png"
                  alt="Angeli Visions"
                  width={200}
                  height={56}
                  className="h-20 w-auto object-contain"
                />
              </div>
              <h3 className="text-white font-semibold text-lg mb-4">Angeli Visions</h3>
              <p className="text-white mb-4">{t("footer.description")}</p>

              {/* Legal Information */}
              <div className="space-y-2 text-sm text-slate-200">
                <p>{t("footer.legalInfo1")}</p>
                <p>{t("footer.legalInfo2")}</p>
                <p className="mt-4">
                  {t("footer.essInfo")}
                  <a 
                    href="/docs/attestation-vss.jpg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 ml-1"
                  >
                    {t("footer.kitLink")}
                  </a>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h3 className="text-white font-semibold text-lg mb-6">{t("footer.contacts")}</h3>
            <div className="space-y-4">
              <div className="flex items-center text-white">
                <Phone className="w-5 h-5 mr-3 text-blue-400" />
                <a href="tel:+33663796742" className="hover:text-white transition-colors">
                  +33 6 63 79 67 42
                </a>
              </div>
              <div className="flex items-center text-white">
                <Mail className="w-5 h-5 mr-3 text-blue-400" />
                <a href="mailto:contact@angelivisions.com" className="hover:text-white transition-colors">
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
            <h3 className="text-white font-semibold text-lg mb-6">{t("nav.services")}</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-200 hover:text-white transition-colors duration-200">
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
            <h3 className="text-white font-semibold text-lg mb-6">{t("footer.newsletterTitle")}</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  id="newsletterFirstName"
                  name="newsletterFirstName"
                  placeholder={t("footer.newsletterFirstName")}
                  value={newsletterFirstName}
                  onChange={(e) => setNewsletterFirstName(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 flex-1"
                  aria-label={t("footer.newsletterFirstName")}
                />
                <Input
                  type="text"
                  id="newsletterLastName"
                  name="newsletterLastName"
                  placeholder={t("footer.newsletterLastName")}
                  value={newsletterLastName}
                  onChange={(e) => setNewsletterLastName(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 flex-1"
                  aria-label={t("footer.newsletterLastName")}
                />
              </div>
              <Input
                type="email"
                id="newsletterEmail"
                name="newsletterEmail"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                aria-label="Email"
              />
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="newsletterConsent"
                  name="newsletterConsent"
                  checked={newsletterConsent}
                  onChange={(e) => setNewsletterConsent(e.target.checked)}
                  className="mt-1 accent-blue-500 min-w-[16px]"
                  required
                />
                <span className="text-xs text-slate-200 leading-relaxed">
                  {t("footer.newsletterConsent")}
                </span>
              </label>
              <Button
                type="submit"
                disabled={isSubscribed || !newsletterConsent}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg disabled:opacity-50"
              >
                {isSubscribed ? t("footer.subscribed") : t("footer.subscribe")}
              </Button>
            </form>

            {/* Social Links */}
            <div className="mt-8">
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-slate-800/50 backdrop-blur-md rounded-lg flex items-center justify-center border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <social.icon className="w-5 h-5 text-slate-300" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="border-t border-slate-700/50 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-slate-200 text-sm mb-4 md:mb-0">
              © 2025 {t("footer.rights")} |
              <Link href={`/${lang}/politique-confidentialite`} className="hover:text-white ml-1 text-white">
                {t("footer.privacy")}
              </Link>{" "}
              |
              <Link href={`/${lang}/mentions-legales`} className="hover:text-white ml-1 text-white">
                {t("footer.legal")}
              </Link>{" "}
              |
              <Link href={`/${lang}/politique-cookies`} className="hover:text-white ml-1 text-white">
                {t("footer.cookies")}
              </Link>{" "}
              |
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  window.openCookiePreferences?.()
                }}
                className="hover:text-white ml-1 text-white"
                aria-label={t("footer.manageCookies")}
              >
                {t("footer.manageCookies")}
              </a>{" "}
              |
              <a href="/sitemap.html" className="hover:text-white ml-1 text-white">
                {t("footer.sitemap")}
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={scrollToTop}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                {t("footer.backToTop")}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
