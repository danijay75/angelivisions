import { notFound } from "next/navigation"
import { isLocale } from "@/lib/i18n/locales"
import { getArtists } from "@/lib/server/artists"
import ArtistDetailContent from "./artist-detail-content"

export const dynamic = "force-dynamic"

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
