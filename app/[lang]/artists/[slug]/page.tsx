"use client"

import { use, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Music,
    ArrowLeft,
    PlayCircle,
    Globe,
    Calendar,
    CheckCircle,
    Instagram,
    Youtube,
    Facebook
} from "lucide-react"
import {
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaYoutube,
    FaTiktok,
    FaSpotify,
    FaApple,
    FaSoundcloud,
    FaDeezer
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { SiTidal, SiYoutubemusic } from "react-icons/si"
import { useI18n } from "@/components/i18n/i18n-provider"
import { type Artist } from "@/data/artists"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const getSocialIconData = (platform: string) => {
    switch (platform.toLowerCase()) {
        case "instagram": return { icon: FaInstagram, color: "text-pink-500" }
        case "facebook": return { icon: FaFacebook, color: "text-blue-500" }
        case "x": return { icon: FaXTwitter, color: "text-slate-300" }
        case "twitter": return { icon: FaTwitter, color: "text-blue-400" }
        case "youtube": return { icon: FaYoutube, color: "text-red-500" }
        case "tiktok": return { icon: FaTiktok, color: "text-slate-300" }
        case "spotify": return { icon: FaSpotify, color: "text-green-500" }
        case "apple music": return { icon: FaApple, color: "text-rose-500" }
        case "deezer": return { icon: FaDeezer, color: "text-purple-500" }
        case "tidal": return { icon: SiTidal, color: "text-white" }
        case "youtube music": return { icon: SiYoutubemusic, color: "text-red-500" }
        case "soundcloud": return { icon: FaSoundcloud, color: "text-orange-500" }
        default: return { icon: Globe, color: "text-white/70" }
    }
}

export default function ArtistDetailPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const router = useRouter()
    const resolvedParams = use(params)
    const { lang } = useI18n()
    const currentLang = (resolvedParams.lang || lang || "fr") as "fr" | "en" | "es"

    const [artist, setArtist] = useState<Artist | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchArtist() {
            try {
                const response = await fetch("/api/artists")
                if (response.ok) {
                    const data = await response.json()
                    const found = data.artists.find((a: Artist) => a.slug === resolvedParams.slug)
                    setArtist(found || null)
                }
            } catch (error) {
                console.error("Failed to fetch artist:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchArtist()
    }, [resolvedParams.slug])

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Chargement...</div>
    }

    if (!artist) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
                <h1 className="text-3xl font-bold mb-4">Artiste non trouvé</h1>
                <Button onClick={() => router.push(`/${currentLang}/artists`)} variant="outline" className="border-white/20 text-white">
                    Retour à la liste
                </Button>
            </div>
        )
    }

    const medias = [...(artist.photos || []), ...(artist.videos || [])].filter(url => url && !url.includes("placeholder"))

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            {/* Hero Section with Canvas-like feel */}
            <div className="relative h-[60vh] overflow-hidden">
                {artist.photos[0] ? (
                    <img src={artist.photos[0]} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <Music className="w-24 h-24 text-white/10" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-32 left-0 w-full">
                    <div className="container mx-auto px-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="text-white/70 hover:text-white mb-6 backdrop-blur-md bg-black/20"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                        </Button>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter"
                        >
                            {artist.name}
                        </motion.h1>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {artist.type.map((t, i) => (
                                <Badge key={i} className="bg-emerald-500 text-white px-4 py-1 text-sm rounded-full">
                                    {t[currentLang]}
                                </Badge>
                            ))}
                            {artist.musicalGenre.map((g, i) => (
                                <Badge key={i} variant="outline" className="border-emerald-400 text-emerald-400 px-4 py-1 text-sm rounded-full bg-emerald-500/10">
                                    {g[currentLang]}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Globe className="w-6 h-6 text-emerald-400" /> À propos
                                </h2>
                                <div
                                    className="text-white/80 text-lg leading-relaxed space-y-4 rich-text-content"
                                    dangerouslySetInnerHTML={{ __html: artist.description[currentLang] }}
                                />
                            </CardContent>
                        </Card>

                        {/* Media Gallery */}
                        {medias.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <PlayCircle className="w-6 h-6 text-emerald-400" /> Galerie Media
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {medias.map((url, i) => {
                                        const isYoutube = url.includes("youtube.com") || url.includes("youtu.be")
                                        if (isYoutube) {
                                            const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([^"&?\/\s]{11})/i)?.[1]
                                            return (
                                                <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black group relative">
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        className="w-full h-full"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            )
                                        }
                                        return (
                                            <div key={i} className="aspect-square md:aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black group">
                                                <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 border-none shadow-2xl shadow-emerald-500/20">
                            <CardContent className="p-8 text-center">
                                <Calendar className="w-12 h-12 text-white mx-auto mb-4 opacity-80" />
                                <h3 className="text-2xl font-bold text-white mb-2">Réserver cet artiste</h3>
                                <p className="text-emerald-50 text-sm mb-6">Disponible pour vos événements privés, corpo et festivals.</p>
                                <Button
                                    onClick={() => router.push(`/${currentLang}/devis`)}
                                    className="w-full bg-white text-emerald-700 hover:bg-emerald-50 py-6 text-lg font-bold rounded-xl"
                                >
                                    Faire une demande
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        {artist.socials && artist.socials.length > 0 && (
                            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                                <CardContent className="p-6">
                                    <h3 className="text-white font-bold mb-6 text-center uppercase tracking-widest text-xs">Réseaux Sociaux</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {artist.socials.map((link, i) => {
                                            const { icon: Icon, color } = getSocialIconData(link.platform)
                                            return (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`aspect-square rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all group ${color}`}
                                                >
                                                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                                                </a>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Music Links */}
                        {artist.musicLinks && artist.musicLinks.length > 0 && (
                            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                                <CardContent className="p-6">
                                    <h3 className="text-white font-bold mb-6 text-center uppercase tracking-widest text-xs">Plateformes de Streaming</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {artist.musicLinks.map((link, i) => {
                                            const { icon: Icon, color } = getSocialIconData(link.platform)
                                            return (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`aspect-square rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all group ${color}`}
                                                >
                                                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                                                </a>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Service Guarantees */}
                        <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-3 text-white/70 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Accompagnement technique
                                </div>
                                <div className="flex items-center gap-3 text-white/70 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Sonorisation incluse (option)
                                </div>
                                <div className="flex items-center gap-3 text-white/70 text-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Contrat sécurisé
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
