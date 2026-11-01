import type { Locale } from "@/lib/i18n/locales"
import { notreMission } from "./notre-mission"
import { ourMission } from "./our-mission"
import { nuestraMision } from "./nuestra-mision"

export interface MissionContent {
  meta: { title: string; description: string }
  hero: { eyebrow: string; title: string; subtitle: string; lead: string }
  facts: { value: string; label: string }[]
  mission: {
    number: string
    source: string
    title: string
    paragraphs: string[]
  }
  activities: {
    number: string
    source: string
    title: string
    intro: string
    primaryLabel: string
    primary: string[]
    secondaryLabel: string
    secondary: string[]
    note: string
  }
  governance: {
    number: string
    source: string
    title: string
    paragraphs: string[]
    columns: [string, string]
    rows: { role: string; coefficient: string }[]
    footnote: string
  }
  sharing: {
    number: string
    source: string
    title: string
    paragraphs: string[]
    stats: { value: string; label: string }[]
  }
  fund: {
    number: string
    source: string
    title: string
    paragraphs: string[]
    stat: { value: string; label: string }
  }
  synthesis: {
    title: string
    lead: string
    items: { title: string; text: string }[]
  }
  cta: { title: string; text: string; contact: string; quote: string }
  legalNote: string
}

const MISSION_CONTENT: Record<Locale, MissionContent> = {
  fr: notreMission,
  en: ourMission,
  es: nuestraMision,
}

export function getMissionContent(lang: Locale): MissionContent {
  return MISSION_CONTENT[lang] ?? MISSION_CONTENT.fr
}

