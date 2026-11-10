"use client"

import { useEffect } from "react"

/**
 * Le layout racine ne connaît pas la locale (il est partagé par /fr, /en, /es
 * et /easy-ip-switch). On corrige donc l'attribut lang du <html> côté client,
 * après hydratation : Googlebot lit le DOM rendu.
 */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang
    }
  }, [lang])

  return null
}
