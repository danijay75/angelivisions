"use client"

import { usePathname } from "next/navigation"
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales"

/**
 * Derives the current locale from the first path segment: /fr, /en, /es
 * Defaults to 'fr' if not matched.
 */
export function useLang(): Locale {
  const pathname = usePathname() || `/${DEFAULT_LOCALE}`
  const seg = pathname.split("/").filter(Boolean)[0]
  return isLocale(seg) ? (seg as Locale) : DEFAULT_LOCALE
}
