import type { Metadata } from "next"
import { LOCALES, type Locale } from "@/lib/i18n/locales"
import { LOCALIZED_SLUGS, cookiesPath, legalPath, privacyPath } from "@/lib/i18n/routes"
import { getLegalContent } from "@/data/legal-content"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

type LegalPage = "legal" | "privacy" | "cookies"

const PATHS: Record<LegalPage, (lang: Locale) => string> = {
  legal: legalPath,
  privacy: privacyPath,
  cookies: cookiesPath,
}

const META: Record<LegalPage, (lang: Locale) => { title: string; description: string }> = {
  legal: (lang) => getLegalContent(lang).legalNotice.meta,
  privacy: (lang) => getLegalContent(lang).privacy.meta,
  cookies: (lang) => getLegalContent(lang).cookies.meta,
}

export function buildLegalMetadata(lang: Locale, page: LegalPage): Metadata {
  const { title, description } = META[page](lang)

  const languages: Record<string, string> = {}
  LOCALES.forEach((locale) => {
    languages[locale] = `${BASE_URL}/${locale}/${LOCALIZED_SLUGS[page][locale]}`
  })
  languages["x-default"] = `${BASE_URL}/fr/${LOCALIZED_SLUGS[page].fr}`

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${PATHS[page](lang)}`,
      languages,
    },
  }
}
