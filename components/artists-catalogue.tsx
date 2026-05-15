"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, Eye, Filter, Search } from "lucide-react"
import { type Artist } from "@/data/artists"
import { Input } from "@/components/ui/input"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { PlayCircle, Globe } from "lucide-react"
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube, FaTiktok, FaSpotify, FaApple, FaSoundcloud, FaDeezer } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { SiTidal, SiYoutubemusic } from "react-icons/si"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SplitTitle } from "@/components/ui/split-title"

const getSocialIconData = (platform: string) => {
    switch (platform.toLowerCase()) {
        case "instagram": return { icon: FaInstagram, color: "text-pink-500 hover:text-pink-400" }
        case "facebook": return { icon: FaFacebook, color: "text-blue-500 hover:text-blue-400" }
        case "x": return { icon: FaXTwitter, color: "text-slate-300 hover:text-white" }
        case "twitter": return { icon: FaTwitter, color: "text-blue-400 hover:text-blue-300" }
        case "youtube": return { icon: FaYoutube, color: "text-red-500 hover:text-red-400" }
        case "tiktok": return { icon: FaTiktok, color: "text-slate-300 hover:text-white" }
        case "spotify": return { icon: FaSpotify, color: "text-green-500 hover:text-green-400" }
        case "apple music": return { icon: FaApple, color: "text-rose-500 hover:text-rose-400" }
        case "deezer": return { icon: FaDeezer, color: "text-purple-500 hover:text-purple-400" }
        case "tidal": return { icon: SiTidal, color: "text-slate-900 hover:text-slate-700 bg-white rounded-full scale-90" }
        case "youtube music": return { icon: SiYoutubemusic, color: "text-red-500 hover:text-red-400" }
        case "soundcloud": return { icon: FaSoundcloud, color: "text-orange-500 hover:text-orange-400" }
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
        noArtists: string
        loading: string
        searchPlaceholder: string
        typesLabel: string
        genresLabel: string
    }
> = {
    fr: {
        title: "Booking de nos artistes",
        subtitle: "Découvrez notre sélection exclusive d'artistes pour faire de votre événement une réussite inoubliable.",
        filterAll: "Tous les Artistes",
        seeArtist: "Voir le profil",
        noArtists: "Aucun artiste trouvé pour cette recherche.",
        loading: "Chargement des artistes...",
        searchPlaceholder: "Rechercher un artiste...",
        typesLabel: "Type d'artiste :",
        genresLabel: "Genre musical :"
    },
    en: {
        title: "Our Booking Catalog",
        subtitle: "Discover our exclusive selection of artists to make your event an unforgettable success.",
        filterAll: "All Artists",
        seeArtist: "View profile",
        noArtists: "No artists found for this search.",
        loading: "Loading artists...",
        searchPlaceholder: "Search an artist...",
        typesLabel: "Artist type :",
        genresLabel: "Musical genre :"
    },
    es: {
        title: "Nuestro Catálogo Booking",
        subtitle: "Descubra nuestra selección exclusiva de artistas para que su evento sea un éxito inolvidable.",
        filterAll: "Todos los Artistes",
        seeArtist: "Ver perfil",
        noArtists: "No se encontraron artistas para esta búsqueda.",
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
                                                    <FaYoutube className="w-16 h-16 text-red-500 drop-shadow-lg group-hover:scale-110 transition-transform" />
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

export function ArtistsCatalogue({ lang }: { lang: Locale }) {
    const router = useRouter()
    const copy = LOCALE_COPY[lang] || LOCALE_COPY.fr

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

            const matchType = activeType === "all" || artistTypes.some(t => t === activeType)
            const matchGenre = activeGenre === "all" || artistGenres.some(g => g === activeGenre)
            const matchSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                artistTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            return matchType && matchGenre && matchSearch && artist.available
        })
    }, [artists, activeType, activeGenre, searchQuery, lang])

    if (loading) {
        return (
            <div className="py-20 flex items-center justify-center">
                <div className="text-white/60 text-lg">{copy.loading}</div>
            </div>
        )
    }

    return (
        <div className="w-full relative">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                    <SplitTitle text={copy.title} />
                </h2>
                <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed">{copy.subtitle}</p>

                <div className="flex flex-col items-center justify-center gap-6 mb-8 max-w-5xl mx-auto w-full">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={copy.searchPlaceholder}
                            className="w-full bg-white/[0.05] border-white/10 text-white pl-10 h-12 rounded-2xl focus:ring-amber-500 focus:border-amber-500/50 backdrop-blur-md transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:flex md:flex-col gap-6 w-full max-w-4xl">
                        <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                            <div className="flex items-center text-white/60">
                                <Filter className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium whitespace-nowrap">{copy.typesLabel}</span>
                            </div>

                            <div className="md:hidden w-full px-4">
                                <Select value={activeType} onValueChange={setActiveType}>
                                    <SelectTrigger className="w-full bg-white/5 border-white/20 text-white rounded-full h-10">
                                        <SelectValue placeholder={copy.filterAll} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/20 text-white">
                                        <SelectItem value="all">{copy.filterAll}</SelectItem>
                                        {types.map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="hidden md:flex flex-wrap justify-center gap-2">
                                <Button
                                    size="sm"
                                    variant={activeType === "all" ? "default" : "outline"}
                                    onClick={() => setActiveType("all")}
                                    className={`rounded-xl h-9 px-6 transition-all duration-300 ${activeType === "all" ? "sunset-gradient text-black font-semibold border-none shadow-[0_0_15px_-3px_rgba(251,191,36,0.4)]" : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/10 hover:text-white"}`}
                                >
                                    {copy.filterAll}
                                </Button>
                                {types.map(t => (
                                    <Button
                                        key={t}
                                        size="sm"
                                        variant={activeType === t ? "default" : "outline"}
                                        onClick={() => setActiveType(t)}
                                        className={`rounded-xl h-9 px-6 transition-all duration-300 ${activeType === t ? "sunset-gradient text-black font-semibold border-none shadow-[0_0_15px_-3px_rgba(251,191,36,0.4)]" : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        {t}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                            <div className="flex items-center text-white/60">
                                <Music className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium whitespace-nowrap">{copy.genresLabel}</span>
                            </div>

                            <div className="md:hidden w-full px-4">
                                <Select value={activeGenre} onValueChange={setActiveGenre}>
                                    <SelectTrigger className="w-full bg-white/[0.05] border-white/10 text-white rounded-xl h-10">
                                        <SelectValue placeholder={copy.filterAll} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/20 text-white">
                                        <SelectItem value="all">{copy.filterAll}</SelectItem>
                                        {genres.map(g => (
                                            <SelectItem key={g} value={g}>{g}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="hidden md:flex flex-wrap justify-center gap-2">
                                <Button
                                    size="sm"
                                    variant={activeGenre === "all" ? "default" : "outline"}
                                    onClick={() => setActiveGenre("all")}
                                    className={`rounded-xl h-9 px-6 transition-all duration-300 ${activeGenre === "all" ? "sunset-gradient text-black font-semibold border-none shadow-[0_0_15px_-3px_rgba(251,191,36,0.4)]" : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/10 hover:text-white"}`}
                                >
                                    {copy.filterAll}
                                </Button>
                                {genres.map(g => (
                                    <Button
                                        key={g}
                                        size="sm"
                                        variant={activeGenre === g ? "default" : "outline"}
                                        onClick={() => setActiveGenre(g)}
                                        className={`rounded-xl h-9 px-6 transition-all duration-300 ${activeGenre === g ? "sunset-gradient text-black font-semibold border-none shadow-[0_0_15px_-3px_rgba(251,191,36,0.4)]" : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/10 hover:text-white"}`}
                                    >
                                        {g}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {filteredArtists.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <p className="text-white/60 text-lg">{copy.noArtists}</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredArtists.map((artist, index) => {
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
                                >
                                    <Card className="glassy-card border-white/10 overflow-hidden hover:bg-white/[0.05] transition-all duration-500 h-full flex flex-col rounded-[2rem] group-hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                                        <div className="relative overflow-hidden group">
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

                                            <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="flex space-x-3">
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/${lang}/${artist.slug}`);
                                                        }}
                                                        size="sm"
                                                        className="sunset-gradient hover:opacity-90 text-black font-bold border-none rounded-xl px-6"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        {copy.seeArtist}
                                                    </Button>
                                                </div>
                                            </div>

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
                                            <div
                                                className="text-slate-300 mb-6 line-clamp-4 overflow-hidden text-sm leading-relaxed rich-text-content"
                                                dangerouslySetInnerHTML={{ __html: artist.description[lang] }}
                                            />

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {(artist.tags || []).map((tag, idx) => (
                                                    <Badge key={idx} variant="secondary" className="bg-white/[0.03] border border-white/10 text-slate-300 text-xs px-3 py-1.5 rounded-lg">
                                                        <Music className="w-3 h-3 mr-1.5 inline opacity-50 text-amber-500" />
                                                        {tag[lang]}
                                                    </Badge>
                                                ))}
                                            </div>

                                            {(() => {
                                                const medias = [...(artist.photos || []), ...(artist.videos || [])].filter(url => {
                                                    if (!url) return false;
                                                    if (url.includes("placeholder")) return false;
                                                    return true;
                                                })
                                                if (medias.length === 0) return null

                                                return <MediaCarousel medias={medias} artistName={artist.name} />
                                            })()}

                                            {artist.musicLinks && artist.musicLinks.length > 0 ? (
                                                <div className="mb-4 mt-auto bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                                                    <p className="text-white/90 text-sm font-semibold mb-3">Écouter sur</p>
                                                    <div className="flex flex-wrap gap-3 justify-center items-center">
                                                        {artist.musicLinks.map((link, i) => {
                                                            const { icon: MusicIcon, color } = getSocialIconData(link.platform)
                                                            return (
                                                                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full bg-slate-950/80 border border-white/5 transition-all w-9 h-9 flex items-center justify-center hover:scale-110 ${color}`} title={link.platform}>
                                                                    <MusicIcon className="w-5 h-5" />
                                                                </a>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ) : <div className="mt-auto"></div>}

                                            {artist.socials && artist.socials.length > 0 && (
                                                <div className="mb-4 bg-white/5 p-3 rounded-xl border border-white/10 text-center">
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
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
