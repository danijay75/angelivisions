import type { Metadata } from "next"
import { landingContent } from "./content"
import { OG_LOCALES, PAGE_LOCALES, localePath, type PageLocale } from "./locales"

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"
export const APP_VERSION = "1.1.1"

function absolutePath(locale: PageLocale): string {
  return `${BASE_URL}${localePath(locale)}`
}

const languageAlternates: Record<string, string> = Object.fromEntries(
  PAGE_LOCALES.map((locale) => [locale, absolutePath(locale)]),
)

languageAlternates["x-default"] = absolutePath("fr")

const downloadUrls = [
  `${BASE_URL}/downloads/easy-ip-switch/easy-ip-switch-${APP_VERSION}-windows.exe`,
  `${BASE_URL}/downloads/easy-ip-switch/easy-ip-switch-${APP_VERSION}-macos-intel.dmg`,
  `${BASE_URL}/downloads/easy-ip-switch/easy-ip-switch-${APP_VERSION}-macos-apple-silicon.dmg`,
]

export function buildMetadata(locale: PageLocale): Metadata {
  const content = landingContent[locale]
  const url = absolutePath(locale)

  return {
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
    alternates: {
      canonical: url,
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      siteName: "Angeli Visions",
      title: content.meta.title,
      description: content.meta.description,
      url,
      locale: OG_LOCALES[locale],
      alternateLocale: PAGE_LOCALES.filter((item) => item !== locale).map(
        (item) => OG_LOCALES[item],
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export function buildJsonLd(locale: PageLocale) {
  const content = landingContent[locale]
  const url = absolutePath(locale)

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name: "Easy IP-Switch",
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: "Network configuration",
        operatingSystem: "Windows 8, Windows 10, Windows 11, macOS 12+",
        softwareVersion: APP_VERSION,
        description: content.meta.description,
        inLanguage: content.lang,
        url,
        downloadUrl: downloadUrls,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
        publisher: {
          "@type": "Organization",
          name: "Angeli Visions",
          url: BASE_URL,
        },
        featureList: content.features.items.map((item) => item.title),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: content.lang,
        mainEntity: content.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Angeli Visions",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Easy IP-Switch",
            item: url,
          },
        ],
      },
    ],
  }
}
