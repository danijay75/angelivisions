import "server-only"
import type { Locale } from "./locales"

export type Dictionary = typeof import("./dictionaries/fr").default

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case "en":
      return (await import("./dictionaries/en")).default
    case "es":
      return (await import("./dictionaries/es")).default
    case "fr":
    default:
      return (await import("./dictionaries/fr")).default
  }
}
