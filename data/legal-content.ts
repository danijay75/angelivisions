import type { Locale } from "@/lib/i18n/locales"
import { legalContentFr } from "./legal-content-fr"
import { legalContentEn } from "./legal-content-en"
import { legalContentEs } from "./legal-content-es"

export interface LegalNoticeContent {
  meta: { title: string; description: string }
  title: string
  publisher: {
    heading: string
    rows: { label: string; value: string }[]
  }
  publicationDirector: {
    heading: string
    name: string
    role: string
    contactLabel: string
    contactEmail: string
  }
  hosting: {
    heading: string
    lead: string
    company: string
    address: string
    websiteLabel: string
    websiteUrl: string
  }
  commitments: {
    heading: string
    paragraphs: string[]
  }
  intellectualProperty: {
    heading: string
    body: string
  }
  question: {
    heading: string
    intro: string
  }
}

export interface PrivacyPolicyContent {
  meta: { title: string; description: string }
  title: string
  intro: string
  controller: {
    heading: string
    body: string
    dpoLabel: string
    dpoName: string
  }
  dataCollected: {
    heading: string
    items: { title: string; description: string }[]
  }
  purposes: {
    heading: string
    intro: string
    items: string[]
  }
  rights: {
    heading: string
    items: { title: string; description: string }[]
  }
  contact: {
    heading: string
    title: string
    intro: string
  }
}

export interface CookiePolicyContent {
  meta: { title: string; description: string }
  title: string
  intro: string
  whatIs: {
    heading: string
    body: string
  }
  used: {
    heading: string
    groups: { title: string; description: string; items: string[] }[]
  }
  manage: {
    heading: string
    intro: string
  }
}

export interface LegalContent {
  legalNotice: LegalNoticeContent
  privacy: PrivacyPolicyContent
  cookies: CookiePolicyContent
}

const LEGAL_CONTENT: Record<Locale, LegalContent> = {
  fr: legalContentFr,
  en: legalContentEn,
  es: legalContentEs,
}

export function getLegalContent(lang: Locale): LegalContent {
  return LEGAL_CONTENT[lang] ?? LEGAL_CONTENT.fr
}
