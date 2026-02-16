import type React from "react"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { I18nProvider } from "@/components/i18n/i18n-provider"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

// Server layout: fetch dictionary on the server and pass it to a Client Provider.
// No client-side Promises are created during render.
export default async function LangLayout({
  params,
  children,
}: {
  params: { lang: Locale }
  children: React.ReactNode
}) {
  const dict = await getDictionary(params.lang)

  return (
    <I18nProvider lang={params.lang} dictionary={dict}>
      <Navigation />
      <main className="pt-24">{children}</main>
      <Footer />
    </I18nProvider>
  )
}
