
import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import { Card, CardContent } from "@/components/ui/card"

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
  // Default to French for legal content as it is the official language of the company
  const dictionary = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-slate-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          {dictionary.legalPages?.mentionsLegales?.title || "Mentions Légales"}
        </h1>

        <div className="space-y-8 text-slate-300">
          {/* 1. Éditeur du site */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Éditeur du site</h2>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6 space-y-2">
                <p><strong className="text-white">Dénomination sociale :</strong> Angeli Visions</p>
                <p><strong className="text-white">Forme juridique :</strong> Société par Actions Simplifiée (SAS)</p>
                <p><strong className="text-white">Capital social :</strong> Variable</p>
                <p><strong className="text-white">Siège social :</strong> 79 rue du Général Leclerc, 78400 Chatou, France</p>
                <p><strong className="text-white">Immatriculation :</strong> RCS de Versailles n° 898 018 221</p>
                <p><strong className="text-white">Numéro de TVA intracommunautaire :</strong> FR06898018221</p>
                <p><strong className="text-white">Activité :</strong> Organisateur d'événements culturels et producteur de musique</p>
                <p><strong className="text-white">Licence entrepreneur de spectacles :</strong> PLATESV-D-2022-000968</p>
              </CardContent>
            </Card>
          </section>

          {/* 2. Responsable de la publication */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Directeur de la publication</h2>
            <p>M. Dani JELASSI, en qualité de Président.</p>
            <p className="mt-2">
              <strong className="text-white">Contact :</strong> <a href="mailto:contact@angelivisions.com" className="text-blue-400 hover:underline">contact@angelivisions.com</a>
            </p>
          </section>

          {/* 3. Hébergement */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Hébergement du site</h2>
            <p>
              Le site est hébergé par <strong>OVH SAS</strong>.<br />
              Siège social : 2 rue Kellermann - 59100 Roubaix - France.<br />
              Site web : <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">www.ovhcloud.com</a>
            </p>
          </section>

          {/* 4. ESS et Engagements */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Engagements</h2>
            <p className="mb-4">
              La société Angeli Visions est adhérente de l'<strong>Économie Sociale et Solidaire (ESS)</strong>.
            </p>
            <p>
              Nous nous engageons activement dans la lutte contre toute forme de discrimination et de violence sexiste et sexuelle dans le milieu culturel et événementiel.
            </p>
          </section>

          {/* 5. Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
