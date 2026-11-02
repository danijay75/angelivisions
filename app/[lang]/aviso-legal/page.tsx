import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import LegalNoticePage from "@/components/legal/legal-notice-page"
import { isLocale } from "@/lib/i18n/locales"
import { LOCALIZED_SLUGS } from "@/lib/i18n/routes"
import { buildLegalMetadata } from "@/lib/i18n/legal-metadata"

const SLUG = "aviso-legal"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return buildLegalMetadata(lang, "legal")
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  if (LOCALIZED_SLUGS.legal[lang] !== SLUG) {
    permanentRedirect(`/${lang}/${LOCALIZED_SLUGS.legal[lang]}`)
  }
  return <LegalNoticePage lang={lang} />
}
