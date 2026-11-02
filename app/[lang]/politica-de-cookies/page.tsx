import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import CookiePolicyPage from "@/components/legal/cookie-policy-page"
import { isLocale } from "@/lib/i18n/locales"
import { LOCALIZED_SLUGS } from "@/lib/i18n/routes"
import { buildLegalMetadata } from "@/lib/i18n/legal-metadata"

const SLUG = "politica-de-cookies"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return buildLegalMetadata(lang, "cookies")
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  if (LOCALIZED_SLUGS.cookies[lang] !== SLUG) {
    permanentRedirect(`/${lang}/${LOCALIZED_SLUGS.cookies[lang]}`)
  }
  return <CookiePolicyPage lang={lang} />
}
