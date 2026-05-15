import type { Metadata } from "next"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import DevisForm from "@/components/devis-form"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

const META: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Devis gratuit",
    description:
      "Demandez un devis gratuit pour votre événement. Production musicale, DJ, organisation, murs LED, mapping vidéo. Réponse sous 48h.",
  },
  en: {
    title: "Free Quote",
    description:
      "Request a free quote for your event. Music production, DJ, event organization, LED walls, video mapping. Response within 48h.",
  },
  es: {
    title: "Presupuesto gratuito",
    description:
      "Solicite un presupuesto gratuito para su evento. Producción musical, DJ, organización, pantallas LED, video mapping. Respuesta en 48h.",
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
    alternates[l] = `${BASE_URL}/${l}/devis`
  })

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/devis`,
      languages: alternates,
    },
  }
}

export default function DevisPage() {
  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orb orb-orange animate-orb opacity-30" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orb orb-blue animate-orb opacity-20" />
      
      <DevisForm />
    </main>
  )
}
