export const PAGE_LOCALES = ["fr", "en", "de", "es"] as const

export type PageLocale = (typeof PAGE_LOCALES)[number]
export type LocalizedLocale = Exclude<PageLocale, "fr">

export const LOCALIZED_LOCALES: LocalizedLocale[] = ["en", "de", "es"]

export const LOCALE_NAMES: Record<PageLocale, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  es: "Español",
}

export const LOCALE_LABELS: Record<PageLocale, string> = {
  fr: "FR",
  en: "EN",
  de: "DE",
  es: "ES",
}

export const OG_LOCALES: Record<PageLocale, string> = {
  fr: "fr_FR",
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
}

/** URL publique de la landing page pour une langue donnée. */
export function localePath(locale: PageLocale): string {
  return locale === "fr" ? "/easy-ip-switch" : `/easy-ip-switch/${locale}`
}

export function isPageLocale(value: string): value is PageLocale {
  return (PAGE_LOCALES as readonly string[]).includes(value)
}
