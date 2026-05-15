
import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import { Card, CardContent } from "@/components/ui/card"
import ReclamationsForm from "@/components/reclamations-form"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return {
    title: dictionary.legalPages?.mentionsLegales?.title || "Mentions Légales",
    description: "Mentions légales de la société Angeli Visions - Organisateur d'événements et Maison de disque.",
    alternates: {
      canonical: `${BASE_URL}/${lang}/mentions-legales`,
    },
  }
}

export default async function MentionsLegalesPage({
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
            {dictionary.legalPages?.mentionsLegales?.title || "Mentions Légales"}
          </span>
        </h1>

        <div className="space-y-12">
          {/* 1. Éditeur du site */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>1</StepNumber>
              <span className="title-gradient">Éditeur du site</span>
            </h2>
            <Card className="glassy-card border-white/10 rounded-[2rem] text-white overflow-hidden transition-all duration-500 hover:border-white/20">
              <CardContent className="p-8 space-y-4">
                <p className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Dénomination sociale</span>
                  <span className="font-semibold text-white">Angeli Visions</span>
                </p>
                <p className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Forme juridique</span>
                  <span className="font-semibold text-white">SASU</span>
                </p>
                <p className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Siège social</span>
                  <span className="font-semibold text-white">79 rue du Général Leclerc, 78400 Chatou</span>
                </p>
                <p className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Immatriculation</span>
                  <span className="font-semibold text-white">RCS Versailles 898 018 221</span>
                </p>
                <p className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">TVA</span>
                  <span className="font-semibold text-white">FR06898018221</span>
                </p>
                <p className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-slate-400">Licence spectacles</span>
                  <span className="font-semibold text-white">PLATESV-D-2022-000968</span>
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 2. Responsable de la publication */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>2</StepNumber>
              <span className="title-gradient">Directeur de la publication</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 text-lg leading-relaxed">
                M. <span className="title-gradient font-bold text-xl">Dani JELASSI</span>, en qualité de Président.
              </p>
              <p className="mt-4 flex items-center gap-2">
                <span className="text-slate-400">Contact :</span>
                <a href="mailto:contact@angelivisions.com" className="title-gradient font-bold hover:opacity-80 transition-opacity">
                  contact@angelivisions.com
                </a>
              </p>
            </div>
          </section>

          {/* 3. Hébergement */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>3</StepNumber>
              <span className="title-gradient">Hébergement du site</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 text-lg leading-relaxed">
                Le site est hébergé par <strong className="text-white">OVH SAS</strong>.<br />
                Siège social : 2 rue Kellermann - 59100 Roubaix - France.<br />
                Site web : <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="title-gradient font-bold hover:opacity-80 transition-opacity">www.ovhcloud.com</a>
              </p>
            </div>
          </section>

          {/* 4. Engagements */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>4</StepNumber>
              <span className="title-gradient">Engagements</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5 border-l-amber-500/50">
              <p className="text-slate-300 text-lg leading-relaxed mb-4 italic">
                La société Angeli Visions est adhérente de l'<strong>Économie Sociale et Solidaire (ESS)</strong>.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                Nous nous engageons activement dans la lutte contre toute forme de discrimination et de violence sexiste et sexuelle dans le milieu culturel et événementiel.
              </p>
            </div>
          </section>

          {/* 5. Propriété intellectuelle */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-5 group">
              <StepNumber>5</StepNumber>
              <span className="title-gradient">Propriété intellectuelle</span>
            </h2>
            <div className="glassy-card p-8 rounded-[2rem] border border-white/5">
              <p className="text-slate-300 text-lg leading-relaxed">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
                Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
            </div>
          </section>

          <section className="text-center pt-8">
            <div className="glassy-card p-10 rounded-[2.5rem] border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 sunset-gradient opacity-5 group-hover:opacity-10 transition-opacity duration-700" />
              <h2 className="text-3xl font-bold text-white mb-4 relative z-10">6. Une question ou un litige ?</h2>
              <p className="text-slate-300 mb-12 max-w-lg mx-auto relative z-10">
                Pour toute réclamation, veuillez remplir notre formulaire officiel ci-dessous. Nous traiterons votre demande sous 48h ouvrées.
              </p>
              
              <div className="max-w-2xl mx-auto text-left relative z-10 bg-slate-950/40 p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
                <ReclamationsForm lang={lang} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
