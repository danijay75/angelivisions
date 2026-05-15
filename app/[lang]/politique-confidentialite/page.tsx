
import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import { Card, CardContent } from "@/components/ui/card"
import DpdContactForm from "@/components/dpd-contact-form"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return {
    title: dictionary.legalPages?.privacyPolicy?.title || "Politique de Confidentialité",
    description: "Politique de confidentialité et protection des données personnelles d'Angeli Visions.",
    alternates: {
      canonical: `${BASE_URL}/${lang}/politique-confidentialite`,
    },
  }
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  const StepNumber = ({ children }: { children: React.ReactNode }) => (
    <span className="w-10 h-10 rounded-xl gold-bg-gradient text-black flex items-center justify-center text-sm font-black shadow-[0_0_20px_-5px_rgba(255,215,0,0.5)] transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
      {children}
    </span>
  )

  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden pt-32 pb-20">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orb orb-orange animate-orb opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orb orb-blue animate-orb opacity-10" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-16 text-center tracking-tight leading-tight">
          <span className="title-gradient">
            {dictionary.legalPages?.privacyPolicy?.title || "Politique de Confidentialité"}
          </span>
        </h1>

        <div className="space-y-12">
          <section className="glassy-card p-10 rounded-[2.5rem] border border-white/5">
            <p className="text-slate-300 text-lg leading-relaxed">
              La protection de vos données personnelles est une priorité absolue pour <span className="text-white font-bold text-xl ml-1">Angeli Visions</span>.
              Cette politique de confidentialité explique avec transparence quelles données nous collectons, comment nous les utilisons et quels sont vos droits fondamentaux.
            </p>
          </section>

          {/* 1. Responsable du traitement */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>1</StepNumber>
              <span className="title-gradient">Responsable du traitement</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Le responsable du traitement des données est la société <strong className="text-white">Angeli Visions</strong>, représentée par son Président dans le cadre strict du RGPD.
              </p>
              <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                <p className="flex flex-col sm:flex-row sm:justify-between items-center gap-2">
                  <span className="text-slate-400">Délégué à la Protection des Données (DPD)</span>
                  <span className="font-bold title-gradient text-xl">M. Dani JELASSI</span>
                </p>
              </div>
            </div>
          </section>

          {/* 2. Données collectées */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>2</StepNumber>
              <span className="title-gradient">Données collectées</span>
            </h2>
            <Card className="glassy-card border-white/10 rounded-[2rem] overflow-hidden">
              <CardContent className="p-8">
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] mt-2.5 shrink-0 shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
                    <div>
                      <strong className="text-white text-lg block mb-1">Formulaires de contact et devis</strong>
                      <p className="text-slate-400 leading-relaxed">Nom, prénom, email, téléphone, détails du projet événementiel ou musical.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] mt-2.5 shrink-0 shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
                    <div>
                      <strong className="text-white text-lg block mb-1">Newsletter</strong>
                      <p className="text-slate-400 leading-relaxed">Adresse email et nom (collectés uniquement sur consentement).</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] mt-2.5 shrink-0 shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
                    <div>
                      <strong className="text-white text-lg block mb-1">Navigation</strong>
                      <p className="text-slate-400 leading-relaxed">Cookies techniques et analytiques (adresse IP anonymisée).</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* 3. Finalités */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>3</StepNumber>
              <span className="title-gradient">Finalités du traitement</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 mb-6 text-lg">Nous utilisons vos données exclusivement pour :</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Réponse aux demandes de devis",
                  "Envoi de la newsletter (Opt-in)",
                  "Optimisation de l'expérience site",
                  "Respect des obligations fiscales"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl transition-all hover:bg-white/[0.05]">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8C00] shadow-[0_0_5px_rgba(255,215,0,0.5)]" />
                    <span className="text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Vos droits */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>4</StepNumber>
              <span className="title-gradient">Vos droits fondamentaux (RGPD)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: "Droit d'accès", desc: "Consulter vos données stockées" },
                { title: "Rectification", desc: "Modifier vos informations" },
                { title: "Effacement", desc: "Droit à l'oubli définitif" },
                { title: "Limitation", desc: "Suspendre le traitement" },
                { title: "Portabilité", desc: "Récupérer vos fichiers" },
                { title: "Opposition", desc: "Refuser l'usage marketing" }
              ].map((right, idx) => (
                <div key={idx} className="glassy-card p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
                  <h3 className="text-white font-bold mb-2 group-hover:text-amber-500 transition-colors">{right.title}</h3>
                  <p className="text-slate-400 text-sm">{right.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Contacter le DPD */}
          <section id="contact-dpd" className="scroll-mt-32">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg gold-bg-gradient text-black flex items-center justify-center text-sm font-bold shadow-[0_0_15px_-3px_rgba(251,191,36,0.5)]">5</span>
              Exercer vos droits
            </h2>
            <div className="glassy-card p-1 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
              <div className="bg-[#020617]/50 backdrop-blur-xl p-8 sm:p-12">
                <div className="max-w-2xl mx-auto space-y-8 text-center pb-8 border-b border-white/5 mb-8">
                  <h3 className="text-3xl font-bold tracking-tight">
                    <span className="title-gradient">Contacter M. Dani JELASSI (DPD)</span>
                  </h3>
                  <p className="text-slate-300 leading-relaxed max-w-lg mx-auto">
                    Pour toute demande concernant vos données personnelles ou pour exercer vos droits, veuillez utiliser ce formulaire sécurisé.
                  </p>
                </div>
                <div className="max-w-2xl mx-auto">
                  <DpdContactForm />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
