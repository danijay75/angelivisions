import type { Metadata } from "next"
import { notFound } from "next/navigation"
import AvIpSwitchLanding from "../av-ip-switch-landing"
import { landingContent } from "../content"
import { buildJsonLd, buildMetadata } from "../seo"
import { PAGE_LOCALES, isPageLocale, type PageLocale } from "../locales"

export const dynamicParams = false

export function generateStaticParams() {
  return PAGE_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isPageLocale(locale)) {
    return {}
  }
  return buildMetadata(locale)
}

export default async function LocalizedAvIpSwitchPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isPageLocale(locale)) {
    notFound()
  }

  const pageLocale: PageLocale = locale
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
      <AvIpSwitchLanding locale={pageLocale} content={content} />
    </>
  )
}
