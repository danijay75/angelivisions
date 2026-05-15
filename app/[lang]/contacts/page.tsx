import type { Metadata } from "next"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import ContactSection from "@/components/contact-section"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

const META: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Contact",
    description: "Contactez Angeli Visions pour vos projets événementiels et musicaux. Demandez un devis gratuit.",
  },
  en: {
    title: "Contact",
    description: "Contact Angeli Visions for your event and music projects. Get a free quote.",
  },
  es: {
    title: "Contacto",
    description: "Contacte a Angeli Visions para sus proyectos de eventos y música. Solicite un presupuesto gratuito.",
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
    alternates[l] = `${BASE_URL}/${l}/contacts`
  })

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/contacts`,
      languages: alternates,
    },
  }
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  
  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orb orb-orange animate-orb opacity-30" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orb orb-blue animate-orb opacity-20" />
      
      <div className="pt-28 relative z-10">
        <ContactSection />
      </div>
    </main>
  )
}
