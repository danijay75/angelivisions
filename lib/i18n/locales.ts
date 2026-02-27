export const LOCALES = ["fr", "en", "es"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "fr"

export function isLocale(input?: string): input is Locale {
  return !!input && (LOCALES as readonly string[]).includes(input)
}
