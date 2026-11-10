import type React from "react"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import CookieConsent from "@/components/cookie-consent"
import { HtmlLang } from "@/components/html-lang"

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
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
      <HtmlLang lang={resolvedParams.lang} />
      <Navigation />
      <main className="pt-36">{children}</main>
      <Footer />
      <CookieConsent />
    </I18nProvider>
  )
}
