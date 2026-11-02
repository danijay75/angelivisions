import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import PrivacyPolicyPage from "@/components/legal/privacy-policy-page"
import { isLocale } from "@/lib/i18n/locales"
import { LOCALIZED_SLUGS } from "@/lib/i18n/routes"
import { buildLegalMetadata } from "@/lib/i18n/legal-metadata"

const SLUG = "politica-de-privacidad"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return buildLegalMetadata(lang, "privacy")
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  if (LOCALIZED_SLUGS.privacy[lang] !== SLUG) {
    permanentRedirect(`/${lang}/${LOCALIZED_SLUGS.privacy[lang]}`)
  }
  return <PrivacyPolicyPage lang={lang} />
}
