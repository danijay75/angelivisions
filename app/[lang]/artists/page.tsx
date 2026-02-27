"use client"

import { use, useEffect, useState, useMemo, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, Eye, ImageIcon, ArrowLeft, Filter, Search, Tag } from "lucide-react"
import { useI18n } from "@/components/i18n/i18n-provider"
import { type Artist } from "@/data/artists"
import { Input } from "@/components/ui/input"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Instagram, Facebook, Twitter, Youtube, Music2, Headphones, PlayCircle, Globe, X as XIcon } from "lucide-react"

const getSocialIconData = (platform: string) => {
    switch (platform.toLowerCase()) {
        case "instagram": return { icon: Instagram, color: "text-pink-500 hover:text-pink-400" }
        case "facebook": return { icon: Facebook, color: "text-blue-500 hover:text-blue-400" }
        case "x": return { icon: XIcon, color: "text-slate-300 hover:text-white" }
        case "twitter": return { icon: Twitter, color: "text-blue-400 hover:text-blue-300" }
        case "youtube": return { icon: Youtube, color: "text-red-500 hover:text-red-400" }
        case "tiktok": return { icon: Music2, color: "text-slate-300 hover:text-white" }
        case "spotify": return { icon: Headphones, color: "text-green-500 hover:text-green-400" }
        case "apple music": return { icon: Music2, color: "text-rose-500 hover:text-rose-400" }
        case "soundcloud": return { icon: Globe, color: "text-orange-500 hover:text-orange-400" }
        default: return { icon: Globe, color: "text-white/70 hover:text-white" }
    }
}
type Locale = "fr" | "en" | "es"

const LOCALE_COPY: Record<
    Locale,
    {
        title: string
        subtitle: string
        filterAll: string
        seeArtist: string
        photos: (n: number) => string
        backToHome: string
        noArtists: string
        artistsCount: (n: number) => string
        loading: string
        searchPlaceholder: string
        typesLabel: string
        genresLabel: string
    }
> = {
    fr: {
        title: "Nos Artistes",
        subtitle: "Découvrez notre sélection exclusive d'artistes pour faire de votre événement une réussite inoubliable.",
        filterAll: "Tous les Artistes",
        seeArtist: "Voir le profil",
        photos: (n) => `${n} photos`,
        backToHome: "Retour à l'accueil",
        noArtists: "Aucun artiste trouvé pour cette recherche.",
        artistsCount: (n) => `${n} artiste${n > 1 ? "s" : ""}`,
        loading: "Chargement des artistes...",
        searchPlaceholder: "Rechercher un artiste...",
        typesLabel: "Type d'artiste :",
        genresLabel: "Genre musical :"
    },
    en: {
        title: "Our Artists",
        subtitle: "Discover our exclusive selection of artists to make your event an unforgettable success.",
        filterAll: "All Artists",
        seeArtist: "View profile",
        photos: (n) => `${n} photos`,
        backToHome: "Back to home",
        noArtists: "No artists found for this search.",
        artistsCount: (n) => `${n} artist${n > 1 ? "s" : ""}`,
        loading: "Loading artists...",
        searchPlaceholder: "Search an artist...",
        typesLabel: "Artist type :",
        genresLabel: "Musical genre :"
    },
    es: {
        title: "Nuestros Artistas",
        subtitle: "Descubra nuestra selección exclusiva de artistas para que su evento sea un éxito inolvidable.",
        filterAll: "Todos los Artistas",
        seeArtist: "Ver perfil",
        photos: (n) => `${n} fotos`,
        backToHome: "Volver al inicio",
        noArtists: "No se encontraron artistas para esta búsqueda.",
        artistsCount: (n) => `${n} artista${n > 1 ? "s" : ""}`,
        loading: "Cargando artistas...",
        searchPlaceholder: "Buscar un artista...",
        typesLabel: "Tipo de artista :",
        genresLabel: "Género musical :"
    },
}

function MediaCarousel({ medias, artistName }: { medias: string[], artistName: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { amount: 0.3 })
    const [api, setApi] = useState<CarouselApi>()
    const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: false }))
    const [isHovered, setIsHovered] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(window.innerWidth < 1024)
        const onResize = () => setIsMobile(window.innerWidth < 1024)
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    useEffect(() => {
        if (!api) return
        try {
            const autoplay = api.plugins().autoplay
            if (!autoplay) return

            if (isMobile) {
                if (inView) autoplay.play()
                else autoplay.stop()
            } else {
                if (isHovered) autoplay.play()
                else autoplay.stop()
            }
        } catch (e) {
            console.error(e)
        }
    }, [api, inView, isMobile, isHovered])

    return (
        <div
            ref={ref}
            className="mb-4 bg-white/5 p-3 px-6 rounded-xl border border-white/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h4 className="text-white/90 text-sm font-semibold mb-3 flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-emerald-400" /> Photos & Vidéos
            </h4>
            <div className="relative">
                <Carousel
                    setApi={setApi}
                    plugins={[plugin.current]}
                    opts={{ loop: true }}
                    className="w-full"
                >
                    <CarouselContent>
                        {medias.map((mediaUrl, i) => {
                            const isImage = mediaUrl.match(/\.(jpeg|jpg|gif|png|webp|svg|base64)/i) || mediaUrl.startsWith('data:image');

                            if (isImage) {
                                return (
                                    <CarouselItem key={i}>
                                        <div className="aspect-video w-full rounded overflow-hidden shadow-lg border border-white/10 bg-black flex items-center justify-center">
                                            <img src={mediaUrl} alt={`${artistName} media`} className="w-full h-full object-cover" />
                                        </div>
                                    </CarouselItem>
                                )
                            }

                            let isYoutube = false;
                            let videoId = "";

                            if (mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")) {
                                isYoutube = true;
                                const match = mediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([^"&?\/\s]{11})/i);
                                if (match && match[1]) {
                                    videoId = match[1];
                                }
                            }

                            return (
                                <CarouselItem key={`vid-${i}`}>
                                    <div className="aspect-video w-full rounded overflow-hidden shadow-lg border border-white/10 bg-black">
                                        {isYoutube ? (
                                            <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="relative w-full h-full block group cursor-pointer">
                                                <img src={videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "/placeholder.svg?text=YouTube+Video"} alt="YouTube Video" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-colors">
                                                    <Youtube className="w-16 h-16 text-red-500 drop-shadow-lg group-hover:scale-110 transition-transform" />
                                                </div>
                                            </a>
                                        ) : (
                                            <video src={mediaUrl} controls className="w-full h-full object-contain" />
                                        )}
                                    </div>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[-16px] w-8 h-8 rounded-full border border-white/20 bg-black/60 hover:bg-black/90 text-white z-10" />
                    <CarouselNext className="absolute right-[-16px] w-8 h-8 rounded-full border border-white/20 bg-black/60 hover:bg-black/90 text-white z-10" />
                </Carousel>
            </div>
        </div>
    )
}

export default function ArtistsPage({ params }: { params: Promise<{ lang: string }> }) {
    const router = useRouter()
    const { lang: contextLang } = useI18n()
    const resolvedParams = use(params)

    const lang = (resolvedParams?.lang || contextLang || "fr") as Locale
    const copy = LOCALE_COPY[lang]

    const [artists, setArtists] = useState<Artist[]>([])
    const [loading, setLoading] = useState(true)
    const [activeType, setActiveType] = useState<string>("all")
    const [activeGenre, setActiveGenre] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        async function fetchArtists() {
            try {
                const response = await fetch("/api/artists")
                if (response.ok) {
                    const data = await response.json()
                    setArtists(data.artists || [])
                }
            } catch (error) {
                console.error("Failed to fetch artists:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchArtists()
    }, [])

    // Extract unique values
    const types = useMemo(() => {
        const unique = new Set(artists.flatMap(a => (a.type || []).map(t => t[lang])).filter(Boolean))
        return Array.from(unique)
    }, [artists, lang])

    const genres = useMemo(() => {
        const unique = new Set(artists.flatMap(a => (a.musicalGenre || []).map(g => g[lang])).filter(Boolean))
        return Array.from(unique)
    }, [artists, lang])

    const filteredArtists = useMemo(() => {
        return artists.filter(artist => {
            const artistTypes = (artist.type || []).map(t => t[lang])
            const artistGenres = (artist.musicalGenre || []).map(g => g[lang])
            const artistTags = (artist.tags || []).map(t => t[lang])

            const matchType = activeType === "all" || artistTypes.includes(activeType)
            const matchGenre = activeGenre === "all" || artistGenres.includes(activeGenre)
            const matchSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                artistTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            return matchType && matchGenre && matchSearch && artist.available
        })
    }, [artists, activeType, activeGenre, searchQuery, lang])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white/60 text-lg">{copy.loading}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <div className="pt-32 pb-16">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <Button
                            variant="ghost"
                            onClick={() => router.push(`/${lang}`)}
                            className="mb-8 text-white/70 hover:text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {copy.backToHome}
                        </Button>

                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                {copy.title}
                            </span>
                        </h1>

                        <p className="text-xl text-white/80 max-w-4xl mx-auto mb-12">{copy.subtitle}</p>

                        {/* Filters and Search */}
                        <div className="flex flex-col items-center justify-center gap-6 mb-8 max-w-5xl mx-auto">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={copy.searchPlaceholder}
                                    className="w-full bg-white/5 border-white/20 text-white pl-10 h-12 rounded-full focus:ring-emerald-500"
                                />
                            </div>

                            {/* Type Filter */}
                            <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                                <div className="flex items-center text-white/60">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium whitespace-nowrap">{copy.typesLabel}</span>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant={activeType === "all" ? "default" : "outline"}
                                        onClick={() => setActiveType("all")}
                                        className={`rounded-full h-8 px-4 ${activeType === "all" ? "bg-emerald-500 hover:bg-emerald-600 border-none" : "border-white/20 hover:bg-white/10"}`}
                                    >
                                        {copy.filterAll}
                                    </Button>
                                    {types.map(t => (
                                        <Button
                                            key={t}
                                            size="sm"
                                            variant={activeType === t ? "default" : "outline"}
                                            onClick={() => setActiveType(t)}
                                            className={`rounded-full h-8 px-4 ${activeType === t ? "bg-emerald-500 hover:bg-emerald-600 border-none" : "border-white/20 hover:bg-white/10"}`}
                                        >
                                            {t}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Genre Filter */}
                            <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                                <div className="flex items-center text-white/60">
                                    <Music className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium whitespace-nowrap">{copy.genresLabel}</span>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant={activeGenre === "all" ? "default" : "outline"}
                                        onClick={() => setActiveGenre("all")}
                                        className={`rounded-full h-8 px-4 ${activeGenre === "all" ? "bg-teal-500 hover:bg-teal-600 border-none" : "border-white/20 hover:bg-white/10"}`}
                                    >
                                        {copy.filterAll}
                                    </Button>
                                    {genres.map(g => (
                                        <Button
                                            key={g}
                                            size="sm"
                                            variant={activeGenre === g ? "default" : "outline"}
                                            onClick={() => setActiveGenre(g)}
                                            className={`rounded-full h-8 px-4 ${activeGenre === g ? "bg-teal-500 hover:bg-teal-600 border-none" : "border-white/20 hover:bg-white/10"}`}
                                        >
                                            {g}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <p className="text-white/60 text-sm mb-8">{copy.artistsCount(filteredArtists.length)}</p>
                    </motion.div>
                </div>
            </div>

            {/* Artists Grid */}
            <div className="container mx-auto px-4 pb-20">
                {filteredArtists.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                        <p className="text-white/60 text-lg">{copy.noArtists}</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredArtists.map((artist, index) => {
                                const galleryCount = (artist.photos || []).length
                                const featuredBadge = artist.featured

                                return (
                                    <motion.div
                                        key={artist.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        whileHover={{ y: -10 }}
                                        className="group"
                                    // Optionally, implement routing if an individual artist profile exists.
                                    // onClick={() => handleArtistClick(artist.slug)}
                                    >
                                        <Card className="bg-white/5 backdrop-blur-md border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                                            <div className="relative overflow-hidden group">
                                                {/* Placeholder OR First Photo */}
                                                <div className="w-full h-72 bg-slate-900 flex items-center justify-center overflow-hidden">
                                                    {(() => {
                                                        const validPhotos = (artist.photos || []).filter(url => url && !url.includes("placeholder") && url.trim() !== "");
                                                        const heroPhoto = validPhotos[0];

                                                        return heroPhoto ? (
                                                            <img
                                                                src={heroPhoto}
                                                                alt={artist.name}
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="text-white/60 text-center">
                                                                <Music className="w-16 h-16 mx-auto mb-2 opacity-30" />
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <div className="flex space-x-3">
                                                        <Button size="sm" className="bg-emerald-500/80 backdrop-blur-md hover:bg-emerald-500 text-white border-none">
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            {copy.seeArtist}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Tags / Badges */}
                                                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                                                    {featuredBadge && (
                                                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg">
                                                            Populaire
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <h3 className="text-white font-bold text-2xl mb-1">{artist.name}</h3>
                                                </div>
                                            </div>
                                            <CardContent className="p-6 flex-1 flex flex-col justify-start">
                                                {/* Summary / description without HTML tags */}
                                                <div
                                                    className="text-white/70 mb-4 line-clamp-3 overflow-hidden text-sm leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: artist.description[lang] }}
                                                />

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {(artist.tags || []).map((tag, idx) => (
                                                        <Badge key={idx} variant="secondary" className="bg-white/5 border border-white/10 text-white/80 text-xs px-3 py-1">
                                                            <Music className="w-3 h-3 mr-1 inline opacity-50" />
                                                            {tag[lang]}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {/* Photos & Vidéos (Combined Media Carousel) */}
                                                {(() => {
                                                    const medias = [...(artist.photos || []), ...(artist.videos || [])].filter(url => {
                                                        if (!url) return false;
                                                        if (url.includes("placeholder")) return false;
                                                        return true;
                                                    })
                                                    if (medias.length === 0) return null

                                                    return <MediaCarousel medias={medias} artistName={artist.name} />
                                                })()}

                                                {/* Socials & Follow (Moved below media) */}
                                                {artist.socials && artist.socials.length > 0 ? (
                                                    <div className="mb-4 mt-auto bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                                                        <p className="text-white/90 text-sm font-semibold mb-3">Suivez "{artist.name}"</p>
                                                        <div className="flex flex-wrap gap-3 justify-center items-center">
                                                            {artist.socials.map((soc, i) => {
                                                                const { icon: SocialIcon, color } = getSocialIconData(soc.platform)
                                                                return (
                                                                    <a key={i} href={soc.url} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full bg-slate-950/80 border border-white/5 transition-all w-9 h-9 flex items-center justify-center hover:scale-110 ${color}`} title={soc.platform}>
                                                                        <SocialIcon className="w-5 h-5" />
                                                                    </a>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                ) : <div className="mt-auto"></div>}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}
