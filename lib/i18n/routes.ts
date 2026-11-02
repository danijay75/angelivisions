import type { Locale } from "./locales"

/**
 * Slugs localisés des pages statiques dont l'URL change selon la langue.
 * Ajouter ici toute nouvelle page concernée.
 */
export const LOCALIZED_SLUGS: Record<string, Record<Locale, string>> = {
  mission: { fr: "notre-mission", en: "our-mission", es: "nuestra-mision" },
  legal: { fr: "mentions-legales", en: "legal-notice", es: "aviso-legal" },
  privacy: {
    fr: "politique-confidentialite",
    en: "privacy-policy",
    es: "politica-de-privacidad",
  },
  cookies: {
    fr: "politique-cookies",
    en: "cookie-policy",
    es: "politica-de-cookies",
  },
}

export function missionPath(lang: Locale): string {
  return `/${lang}/${LOCALIZED_SLUGS.mission[lang]}`
}

export function legalPath(lang: Locale): string {
  return `/${lang}/${LOCALIZED_SLUGS.legal[lang]}`
}

export function privacyPath(lang: Locale): string {
  return `/${lang}/${LOCALIZED_SLUGS.privacy[lang]}`
}

export function cookiesPath(lang: Locale): string {
  return `/${lang}/${LOCALIZED_SLUGS.cookies[lang]}`
}

/**
 * Remplace le segment de langue et traduit le slug localisé s'il est connu.
 * Utilisé par le sélecteur de langue pour rester sur la même page.
 */
export function localizePath(pathname: string, nextLang: Locale): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length === 0) return `/${nextLang}`

  segments[0] = nextLang

  const slug = segments[1]
  if (slug) {
    const entry = Object.values(LOCALIZED_SLUGS).find((slugs) =>
      Object.values(slugs).includes(slug),
    )
    if (entry) segments[1] = entry[nextLang]
  }

  return `/${segments.join("/")}`
}
