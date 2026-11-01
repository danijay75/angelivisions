import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import MissionPage from "@/components/mission-page"
import { isLocale } from "@/lib/i18n/locales"
import { LOCALIZED_SLUGS } from "@/lib/i18n/routes"
import { buildMissionMetadata } from "@/lib/i18n/mission-metadata"

const SLUG = "notre-mission"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return buildMissionMetadata(lang)
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  if (LOCALIZED_SLUGS.mission[lang] !== SLUG) {
    permanentRedirect(`/${lang}/${LOCALIZED_SLUGS.mission[lang]}`)
  }
  return <MissionPage lang={lang} />
}
