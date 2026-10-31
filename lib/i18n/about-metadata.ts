import type { Metadata } from "next"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import { getAboutContent } from "@/data/about-content"
import { LOCALIZED_SLUGS, aboutPath } from "@/lib/i18n/routes"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

export function buildAboutMetadata(lang: Locale): Metadata {
  const content = getAboutContent(lang)

  const languages: Record<string, string> = {}
  LOCALES.forEach((locale) => {
    languages[locale] = `${BASE_URL}/${locale}/${LOCALIZED_SLUGS.about[locale]}`
  })
  languages["x-default"] = `${BASE_URL}/fr/${LOCALIZED_SLUGS.about.fr}`

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `${BASE_URL}${aboutPath(lang)}`,
      languages,
    },
  }
}
