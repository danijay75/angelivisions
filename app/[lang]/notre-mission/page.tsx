import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import AboutPage from "@/components/about-page"
import { isLocale } from "@/lib/i18n/locales"
import { LOCALIZED_SLUGS } from "@/lib/i18n/routes"
import { buildAboutMetadata } from "@/lib/i18n/about-metadata"

const SLUG = "notre-mission"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return buildAboutMetadata(lang)
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  if (LOCALIZED_SLUGS.about[lang] !== SLUG) {
    permanentRedirect(`/${lang}/${LOCALIZED_SLUGS.about[lang]}`)
  }
  return <AboutPage lang={lang} />
}
