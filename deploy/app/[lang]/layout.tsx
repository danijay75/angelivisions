import type React from "react"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import CookieConsent from "@/components/cookie-consent"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Angeli Visions",
    url: BASE_URL,
    logo: `${BASE_URL}/images/angeli-visions-logo-white.png`,
    description:
      "Organisateur d'événements et maison de disque spécialisé dans la production musicale, l'organisation événementielle et les expériences immersives.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["French", "English", "Spanish"],
    },
    sameAs: [],
  }
}

// Server layout: fetch dictionary on the server and pass it to a Client Provider.
export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: Locale }>
  children: React.ReactNode
}) {
  const resolvedParams = await params
  const dict = await getDictionary(resolvedParams.lang)

  return (
    <I18nProvider lang={resolvedParams.lang} dictionary={dict}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildOrganizationJsonLd()),
        }}
      />
      <Navigation />
      <main className="pt-24">{children}</main>
      <Footer />
      <CookieConsent />
    </I18nProvider>
  )
}
