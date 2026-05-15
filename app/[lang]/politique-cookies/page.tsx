import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import { Button } from "@/components/ui/button"
import VerifyCookieButton from "./verify-cookie-button"
import { Sparkles } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return {
    title: dictionary.legalPages?.cookiePolicy?.title || "Politique de Cookies",
    description: "Informations sur l'utilisation des cookies sur le site Angeli Visions.",
    alternates: {
      canonical: `${BASE_URL}/${lang}/politique-cookies`,
    },
  }
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden pt-32 pb-20">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orb orb-orange animate-orb opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orb orb-blue animate-orb opacity-10" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-16 text-center tracking-tight leading-tight">
          <span className="title-gradient">
            {dictionary.legalPages?.cookiePolicy?.title || "Politique de Cookies"}
          </span>
        </h1>

        <div className="space-y-12">
          <section className="glassy-card p-10 rounded-[2.5rem] border border-white/5">
            <p className="text-slate-300 text-lg leading-relaxed">
              Cette politique explique avec transparence comment <span className="text-white font-bold">Angeli Visions</span> utilise des cookies et technologies similaires pour vous reconnaître lorsque vous visitez notre site Web. Nous nous engageons à respecter votre vie privée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg sunset-gradient text-black flex items-center justify-center text-sm font-bold shadow-[0_0_15px_-3px_rgba(251,191,36,0.5)]">?</span>
              Qu'est-ce qu'un cookie ?
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 text-lg leading-relaxed">
                Un cookie est un petit fichier de données stocké sur votre appareil (ordinateur, tablette, mobile) lorsque vous naviguez sur un site. Il permet au site de mémoriser vos actions et préférences sur une période donnée pour fluidifier votre navigation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg sunset-gradient text-black flex items-center justify-center text-sm font-bold shadow-[0_0_15px_-3px_rgba(251,191,36,0.5)]">
                <Sparkles className="w-4 h-4" />
              </span>
              Les cookies que nous utilisons
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  title: "Cookies Essentiels",
                  desc: "Ces cookies sont nécessaires au fonctionnement technique du site. Ils ne peuvent pas être désactivés pour garantir votre sécurité.",
                  items: ["Sécurité (protection CSRF)", "Session utilisateur", "Préférences de langue", "Préférences de cookies"]
                },
                {
                  title: "Cookies Analytiques",
                  desc: "Ils nous aident à comprendre comment les visiteurs interagissent avec le site (pages vues, temps passé). Toutes les données sont anonymisées.",
                  items: ["Statistiques de visite", "Performance serveur", "Parcours utilisateur"]
                },
                {
                  title: "Cookies Marketing",
                  desc: "Utilisés pour afficher des publicités pertinentes ou suivre l'efficacité de nos campagnes marketing sur d'autres plateformes.",
                  items: ["Audience publicitaire", "Retargeting", "Conversion tracking"]
                }
              ].map((group, idx) => (
                <div key={idx} className="glassy-card p-8 rounded-[2rem] border border-white/5 group hover:border-amber-500/30 transition-all">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">{group.title}</h3>
                  <p className="text-slate-400 mb-6">{group.desc}</p>
                  {group.items && (
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full text-xs text-slate-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="text-center pt-8">
            <div className="glassy-card p-12 rounded-[3rem] border-white/10 sunset-gradient bg-opacity-5">
              <h2 className="text-3xl font-bold text-white mb-4">Gérer vos préférences</h2>
              <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                Vous pouvez modifier votre choix concernant les cookies à tout moment. Votre confort et votre vie privée sont notre priorité.
              </p>
              <VerifyCookieButton />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
