import type { Locale } from "./locales"

/**
 * Slugs localisés des pages statiques dont l'URL change selon la langue.
 * Ajouter ici toute nouvelle page concernée.
 */
export const LOCALIZED_SLUGS: Record<string, Record<Locale, string>> = {
  about: { fr: "notre-mission", en: "our-mission", es: "nuestra-mision" },
}

export function aboutPath(lang: Locale): string {
  return `/${lang}/${LOCALIZED_SLUGS.about[lang]}`
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
