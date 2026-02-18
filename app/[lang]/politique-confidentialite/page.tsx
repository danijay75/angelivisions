
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

  return (
    <main className="min-h-screen bg-slate-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          {dictionary.legalPages?.privacyPolicy?.title || "Politique de Confidentialité"}
        </h1>

        <div className="space-y-10 text-slate-300">
          <section>
            <p>
              La protection de vos données personnelles est une priorité pour Angeli Visions.
              Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.
            </p>
          </section>

          {/* 1. Responsable du traitement */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données est la société <strong>Angeli Visions</strong>, représentée par son Président.
            </p>
            <div className="mt-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
              <p><strong className="text-white">Délégué à la Protection des Données (DPD) :</strong> M. Dani JELASSI</p>
            </div>
          </section>

          {/* 2. Données collectées */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Données collectées</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Formulaires de contact et devis :</strong> Nom, prénom, email, téléphone, détails du projet.</li>
              <li><strong>Newsletter :</strong> Adresse email, nom.</li>
              <li><strong>Navigation :</strong> Cookies (voir notre Politique de Cookies), adresse IP anonymisée.</li>
            </ul>
          </section>

          {/* 3. Finalités */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Finalités du traitement</h2>
            <p>Nous utilisons vos données pour :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Répondre à vos demandes de contact et de devis.</li>
              <li>Vous envoyer notre newsletter (uniquement avec votre consentement explicite).</li>
              <li>Améliorer l'expérience utilisateur sur notre site.</li>
              <li>Respecter nos obligations légales.</li>
            </ul>
          </section>

          {/* 4. Vos droits */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Vos droits RGPD</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Droit d'accès à vos données.</li>
              <li>Droit de rectification des données inexactes.</li>
              <li>Droit à l'effacement (droit à l'oubli).</li>
              <li>Droit à la limitation du traitement.</li>
              <li>Droit à la portabilité des données.</li>
              <li>Droit d'opposition au traitement.</li>
            </ul>
          </section>

          {/* 5. Contacter le DPD */}
          <section id="contact-dpd" className="scroll-mt-32">
            <h2 className="text-2xl font-semibold text-white mb-6">5. Exercer vos droits</h2>
            <p className="mb-6">
              Pour toute demande concernant vos données personnelles ou pour exercer vos droits, vous pouvez contacter notre Délégué à la Protection des Données (DPD) via le formulaire ci-dessous.
            </p>

            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium text-white mb-4">Contacter M. Dani JELASSI (DPD)</h3>
                <DpdContactForm />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}
