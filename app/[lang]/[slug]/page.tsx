import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { isLocale, LOCALES } from "@/lib/i18n/locales"
import { getArtists } from "@/lib/server/artists"
import ArtistDetailContent from "./artist-detail-content"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://angelivisions.com"

export const dynamic = "force-dynamic"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
    const { lang, slug } = await params
    if (!isLocale(lang)) return {}

    const artists = await getArtists()
    const artist = artists.find((a) => a.slug === slug)

    if (!artist) {
        return {
            title: "Artiste introuvable",
            robots: { index: false, follow: false },
        }
    }

    const rawDescription = artist.description?.[lang] ?? artist.description?.fr ?? ""
    const description = rawDescription
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 160)

    const languages: Record<string, string> = {}
    LOCALES.forEach((l) => {
        languages[l] = `${BASE_URL}/${l}/${artist.slug}`
    })
    languages["x-default"] = `${BASE_URL}/fr/${artist.slug}`

    return {
        title: artist.name,
        description,
        alternates: {
            canonical: `${BASE_URL}/${lang}/${artist.slug}`,
            languages,
        },
        openGraph: {
            title: artist.name,
            description,
            type: "profile",
            images: artist.photos?.[0] ? [{ url: artist.photos[0] }] : undefined,
        },
    }
}

export default async function ArtistDetailPage({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>
}) {
    const { lang, slug } = await params

    if (!isLocale(lang)) {
        notFound()
    }

    const artists = await getArtists()
    const artist = artists.find((a) => a.slug === slug)

    if (!artist) {
        notFound()
    }

    return <ArtistDetailContent artist={artist} lang={lang} />
}
