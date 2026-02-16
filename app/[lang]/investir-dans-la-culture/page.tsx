import type { Metadata } from "next"
import InvestmentPageClient from "./InvestmentPageClient"
import type { Locale } from "@/lib/i18n/locales"

interface Props {
  params: { lang: Locale }
}

export function generateMetadata({ params }: Props): Metadata {
  const { lang } = params

  const titles = {
    fr: "Investir dans la Culture - Projets Culturels Blockchain & NFT | Angeli Visions",
    en: "Invest in Culture - Cultural Blockchain & NFT Projects | Angeli Visions",
    es: "Invertir en Cultura - Proyectos Culturales Blockchain & NFT | Angeli Visions",
  }

  const descriptions = {
    fr: "Investissez dans des projets culturels innovants (musique, théâtre, humour, stand-up, expériences immersives) grâce à la technologie blockchain et NFT. Rendements attractifs et impact culturel garanti.",
    en: "Invest in innovative cultural projects (music, theater, comedy, stand-up, immersive experiences) through blockchain and NFT technology. Attractive returns and guaranteed cultural impact.",
    es: "Invierte en proyectos culturales innovadores (música, teatro, humor, stand-up, experiencias inmersivas) a través de la tecnología blockchain y NFT. Rendimientos atractivos e impacto cultural garantizado.",
  }

  const keywords = {
    fr: "investissement culturel, blockchain culture, NFT musique, financement participatif, projets artistiques, rendement investissement, innovation culturelle, théâtre blockchain, stand-up NFT",
    en: "cultural investment, blockchain culture, music NFT, crowdfunding, artistic projects, investment returns, cultural innovation, blockchain theater, stand-up NFT",
    es: "inversión cultural, blockchain cultura, NFT música, financiación participativa, proyectos artísticos, rendimiento inversión, innovación cultural, teatro blockchain, stand-up NFT",
  }

  return {
    title: titles[lang],
    description: descriptions[lang],
    keywords: keywords[lang],
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      images: [{ url: "/cultural-investment-nft.png" }],
      type: "website",
      locale: lang === "fr" ? "fr_FR" : lang === "en" ? "en_US" : "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[lang],
      description: descriptions[lang],
      images: ["/cultural-investment-nft.png"],
    },
    alternates: {
      canonical: `/${lang}/investir-dans-la-culture`,
      languages: {
        fr: "/fr/investir-dans-la-culture",
        en: "/en/investir-dans-la-culture",
        es: "/es/investir-dans-la-culture",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default function InvestmentPage({ params }: Props) {
  return <InvestmentPageClient lang={params.lang} />
}
