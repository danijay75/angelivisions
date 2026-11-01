import type { Metadata } from "next"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import { getMissionContent } from "@/data/mission-content"
import { LOCALIZED_SLUGS, missionPath } from "@/lib/i18n/routes"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

export function buildMissionMetadata(lang: Locale): Metadata {
  const content = getMissionContent(lang)

  const languages: Record<string, string> = {}
  LOCALES.forEach((locale) => {
    languages[locale] = `${BASE_URL}/${locale}/${LOCALIZED_SLUGS.mission[locale]}`
  })
  languages["x-default"] = `${BASE_URL}/fr/${LOCALIZED_SLUGS.mission.fr}`

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `${BASE_URL}${missionPath(lang)}`,
      languages,
    },
  }
}
