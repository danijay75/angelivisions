
import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import { Button } from "@/components/ui/button"

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
    <main className="min-h-screen bg-slate-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          {dictionary.legalPages?.cookiePolicy?.title || "Politique de Cookies"}
        </h1>

        <div className="space-y-8 text-slate-300">
          <section>
            <p>
              Cette politique explique comment Angeli Visions utilise des cookies et technologies similaires pour vous reconnaître lorsque vous visitez notre site Web.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier de données stocké sur votre appareil (ordinateur, tablette, mobile) lorsque vous naviguez sur un site. Il permet au site de mémoriser vos actions et préférences sur une période donnée.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Les cookies que nous utilisons</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Cookies Essentiels</h3>
                <p>Ces cookies sont nécessaires au fonctionnement technique du site. Ils ne peuvent pas être désactivés.</p>
                <ul className="list-disc pl-5 mt-2 text-sm text-slate-400">
                  <li>Sécurité (protection CSRF)</li>
                  <li>Session utilisateur</li>
                  <li>Préférences de langue</li>
                  <li>Préférences de cookies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-white mb-2">Cookies Analytiques</h3>
                <p>Ils nous aident à comprendre comment les visiteurs interagissent avec le site (pages vues, temps passé). Toutes les données sont anonymisées.</p>
              </div>

              <div>
                <h3 className="text-xl font-medium text-white mb-2">Cookies Marketing</h3>
                <p>Utilisés pour afficher des publicités pertinentes ou suivre l'efficacité de nos campagnes marketing sur d'autres plateformes.</p>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Gérer vos préférences</h2>
            <p className="mb-6">
              Vous pouvez modifier votre choix concernant les cookies à tout moment en cliquant sur le bouton ci-dessous :
            </p>
            {/* This button will trigger the cookie modal via JavaScript in the client component logic we will add globally */}
            <VerifyCookieButton />
          </section>
        </div>
      </div>
    </main>
  )
}

// Client component wrapper for the button interaction
import VerifyCookieButton from "./verify-cookie-button"
