import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/locales"
import ReclamationsForm from "@/components/reclamations-form"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  
  return {
    title: "Formulaire de Réclamations | Angeli Visions",
    description: "Soumettez une réclamation concernant nos services événementiels ou musicaux.",
    alternates: {
      canonical: `${BASE_URL}/${lang}/reclamations`,
      languages: {
        fr: `${BASE_URL}/fr/reclamations`,
        en: `${BASE_URL}/en/reclamations`,
        es: `${BASE_URL}/es/reclamations`,
      },
    },
  }
}

export default async function ReclamationsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  // Using French directly for legal/strict pages initially, but it gets language for i18n
  const dictionary = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-slate-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Réclamations
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Nous mettons tout en œuvre pour vous offrir le meilleur service possible. 
            Cependant, si vous souhaitez nous faire part d'une insatisfaction, veuillez 
            remplir ce formulaire. Nous vous répondrons dans les plus brefs délais.
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-6 md:p-8 outline outline-1 outline-slate-800 shadow-2xl">
          <ReclamationsForm lang={lang} />
        </div>
      </div>
    </main>
  )
}
