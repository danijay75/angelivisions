import type { Metadata } from "next"
import { notFound } from "next/navigation"
import EasyIpSwitchLanding from "../easy-ip-switch-landing"
import { landingContent } from "../content"
import { buildJsonLd, buildMetadata } from "../seo"
import { LOCALIZED_LOCALES, type LocalizedLocale, type PageLocale } from "../locales"

export const dynamicParams = false

export function generateStaticParams() {
  return LOCALIZED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!LOCALIZED_LOCALES.includes(locale as LocalizedLocale)) {
    return {}
  }
  return buildMetadata(locale as PageLocale)
}

export default async function LocalizedEasyIpSwitchPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!LOCALIZED_LOCALES.includes(locale as LocalizedLocale)) {
    notFound()
  }

  const pageLocale = locale as PageLocale

  const content = landingContent[pageLocale]

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(content.lang)}`,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(pageLocale)) }}
      />
      <EasyIpSwitchLanding locale={pageLocale} content={content} />
    </>
  )
}
