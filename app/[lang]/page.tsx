import type { Metadata } from "next"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import RealisationsSection from "@/components/realisations-section"
import PartnersSection from "@/components/partners-section"
import ContactSection from "@/components/contact-section"
import { getDictionary } from "@/lib/i18n/get-dictionary"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = LOCALES.includes(lang) ? lang : "fr"
  const dict = await getDictionary(locale)
  
  const title = dict.hero.titlePart1 + " " + dict.hero.titlePart2
  const description = dict.hero.description || (locale === 'fr' ? "Production audiovisuelle, murs LED et mapping vidéo pour des événements d'exception." : "Audiovisual production, LED walls and video mapping for exceptional events.")

  const alternates: Record<string, string> = {}
  LOCALES.forEach((l) => {
    alternates[l] = `${BASE_URL}/${l}`
  })

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}`,
    },
  }
}

export default function LocalizedHomePage() {
  return (
    <div className="min-h-screen bg-transparent">
      <section id="accueil">
        <HeroSection />
      </section>

      <section id="services" className="scroll-mt-24">
        <ServicesSection />
      </section>

      <section id="realisations" className="scroll-mt-24">
        <RealisationsSection />
      </section>

      <section id="partenaires" className="scroll-mt-24">
        <PartnersSection />
      </section>

      <section id="contact" className="scroll-mt-24">
        <ContactSection />
      </section>
    </div>
  )
}
