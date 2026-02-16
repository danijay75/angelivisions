"use client"

import type React from "react"
import { createContext, useContext, useMemo } from "react"
import type { Locale } from "@/lib/i18n/locales"
import type fr from "@/lib/i18n/dictionaries/fr"

type Dictionary = typeof fr

type I18nContextValue = {
  lang: Locale
  t: (path: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce((acc: any, key) => (acc && acc[key] != null ? acc[key] : undefined), obj as any)
}

function format(str: string, vars?: Record<string, string | number>) {
  if (!vars) return str
  return Object.keys(vars).reduce((acc, k) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k])), str)
}

export function I18nProvider({
  lang,
  dictionary,
  children,
}: {
  lang: Locale
  dictionary: Dictionary
  children: React.ReactNode
}) {
  const value = useMemo<I18nContextValue>(() => {
    return {
      lang,
      t: (path: string, vars?: Record<string, string | number>) => {
        const val = getByPath(dictionary, path)
        if (typeof val === "string") return format(val, vars)
        return path // fallback to key
      },
    }
  }, [lang, dictionary])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
