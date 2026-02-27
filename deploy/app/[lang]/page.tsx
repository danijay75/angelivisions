import type { Metadata } from "next"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import RealisationsSection from "@/components/realisations-section"
import ContactSection from "@/components/contact-section"
import AudioPlayer from "@/components/audio-player"


const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

const META: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Angeli Visions — Organisateur d'événements & Maison de disque",
    description:
      "Production musicale, organisation événementielle, DJ booking, murs LED et mapping vidéo. Créons ensemble votre événement inoubliable.",
  },
  en: {
    title: "Angeli Visions — Event Organizer & Record Label",
    description:
      "Music production, event organization, DJ booking, LED walls and video mapping. Let's create your unforgettable event together.",
  },
  es: {
    title: "Angeli Visions — Organizador de eventos & Sello discográfico",
    description:
      "Producción musical, organización de eventos, DJ booking, pantallas LED y video mapping. Creemos juntos su evento inolvidable.",
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = LOCALES.includes(lang) ? lang : "fr"
  const meta = META[locale]

  const alternates: Record<string, string> = {}
  LOCALES.forEach((l) => {
    alternates[l] = `${BASE_URL}/${l}`
  })

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: alternates,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE_URL}/${locale}`,
    },
  }
}

export default function LocalizedHomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <section id="accueil">
        <HeroSection />
      </section>

      <section id="services" className="scroll-mt-24">
        <ServicesSection />
      </section>

      <section id="realisations" className="scroll-mt-24">
        <RealisationsSection />
      </section>

      <section id="contact" className="scroll-mt-24">
        <ContactSection />
      </section>

      <AudioPlayer />

    </div>
  )
}
