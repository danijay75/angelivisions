"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    ChevronLeft,
    ChevronRight,
    Youtube,
    Instagram,
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
import { type Artist } from "@/data/artists"

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

export default function ArtistDetailContent({
    artist,
    lang,
}: {
    artist: Artist
    lang: "fr" | "en" | "es"
}) {
    const router = useRouter()
    const currentLang = lang
    const [activeMediaIndex, setActiveMediaIndex] = useState(0)

    const medias = [...(artist.photos || []), ...(artist.videos || [])].filter(url => url && !url.includes("placeholder"))

    const handleNextMedia = () => {
        setActiveMediaIndex((prev) => (prev + 1) % medias.length)
    }

    const handlePrevMedia = () => {
        setActiveMediaIndex((prev) => (prev - 1 + medias.length) % medias.length)
    }

    return (
        <div className="min-h-screen bg-[#020617] pb-20 relative overflow-hidden">
            {/* Immersive Stage Light Orbs */}
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-orb orb-orange animate-orb opacity-40 -z-10" />
            <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-orb orb-blue animate-orb opacity-30 -z-10" />
            <div className="absolute bottom-[10%] left-[20%] w-[450px] h-[450px] bg-orb orb-white animate-orb opacity-20 -z-10" />

            {/* Hero Section with Canvas-like feel */}
            <div className="relative h-[65vh] overflow-hidden">
                {artist.photos[0] ? (
                    <img 
                        src={artist.photos[0]} 
                        alt={artist.name} 
                        className="w-full h-full object-cover brightness-[0.65] scale-105 transition-transform duration-1000" 
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900/40 flex items-center justify-center">
                        <Music className="w-24 h-24 text-white/10" />
                    </div>
                )}
                {/* Visual vignette blending into dark page body */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/10 via-[#020617]/40 to-[#020617]" />

                <div className="absolute bottom-16 left-0 w-full z-20">
                    <div className="container mx-auto px-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="text-white/80 hover:text-white mb-6 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl transition-all duration-300 backdrop-blur-md bg-black/20"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                        </Button>
                        
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-6xl md:text-8xl font-black uppercase tracking-tighter title-gradient pb-2 filter drop-shadow-2xl"
                        >
                            {artist.name}
                        </motion.h1>
                        
                        <div className="flex flex-wrap gap-2.5 mt-4">
                            {artist.type.map((t, i) => (
                                <Badge 
                                    key={i} 
                                    className="sunset-gradient text-black font-extrabold px-4.5 py-1.5 text-xs uppercase tracking-wider rounded-xl border-none shadow-[0_0_15px_-3px_rgba(251,191,36,0.5)]"
                                >
                                    {t[currentLang]}
                                </Badge>
                            ))}
                            {artist.musicalGenre.map((g, i) => (
                                <Badge 
                                    key={i} 
                                    variant="outline" 
                                    className="border-amber-500/30 text-amber-200 px-4.5 py-1.5 text-xs uppercase tracking-wider rounded-xl bg-amber-500/10 backdrop-blur-md font-semibold"
                                >
                                    {g[currentLang]}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10 space-y-8">
                {/* Top Section: About and Booking in two columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* About Card */}
                    <div className="lg:col-span-2">
                        <Card className="glassy-card border-white/8 overflow-hidden rounded-[2.5rem] h-full">
                            <CardContent className="p-8 md:p-10">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Globe className="w-6 h-6 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" /> À propos
                                </h2>
                                <div
                                    className="text-slate-300 text-base md:text-lg leading-relaxed space-y-4 rich-text-content"
                                    dangerouslySetInnerHTML={{ __html: artist.description[currentLang] }}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="glassy-card border-amber-500/15 shadow-[0_0_50px_-12px_rgba(245,158,11,0.12)] overflow-hidden rounded-[2.5rem] relative group h-full flex flex-col justify-center">
                            {/* Accent gold top border */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] sunset-gradient" />
                            <CardContent className="p-8 text-center relative z-10 flex flex-col items-center justify-center my-auto">
                                <Calendar className="w-12 h-12 text-amber-400 mx-auto mb-4 opacity-90 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]" />
                                <h3 className="text-2xl font-bold text-white mb-2 font-display">Booker cet artiste</h3>
                                <p className="text-slate-300 text-sm mb-6 leading-relaxed">Disponible pour vos événements d'exception, privés, corpo, clubs et festivals.</p>
                                <Button
                                    onClick={() => router.push(`/${currentLang}/devis`)}
                                    className="w-full sunset-gradient hover:opacity-90 text-black font-extrabold py-6 text-base rounded-2xl shadow-[0_15px_30px_-10px_rgba(217,119,6,0.4)] transition-all duration-500 hover:scale-[1.03] active:scale-95 border-none"
                                >
                                    Faire une demande
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Middle Section: Massive cinematic Media Gallery */}
                {medias.length > 0 && (
                    <div className="space-y-6 pt-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                            <PlayCircle className="w-6 h-6 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" /> Galerie Media
                        </h2>

                        {/* Large Active Media Player - Massive Full Width */}
                        <div className="glassy-card border-white/8 overflow-hidden rounded-[2.5rem] shadow-2xl relative group bg-black">
                            <div className="aspect-video w-full flex items-center justify-center overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {(() => {
                                        const activeUrl = medias[activeMediaIndex]
                                        const isYoutube = activeUrl.includes("youtube.com") || activeUrl.includes("youtu.be")
                                        
                                        if (isYoutube) {
                                            const videoId = activeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([^"&?\/\s]{11})/i)?.[1]
                                            return (
                                                <motion.div
                                                    key={`video-${activeMediaIndex}`}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="w-full h-full relative"
                                                >
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                                                        className="w-full h-full"
                                                        allow="autoplay; encrypted-media"
                                                        allowFullScreen
                                                    />
                                                </motion.div>
                                            )
                                        }
                                        
                                        return (
                                            <motion.div
                                                key={`photo-${activeMediaIndex}`}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.4 }}
                                                className="w-full h-full"
                                            >
                                                <img 
                                                    src={activeUrl} 
                                                    alt={artist.name} 
                                                    className="w-full h-full object-cover transition-all duration-700 hover:scale-102" 
                                                />
                                            </motion.div>
                                        )
                                    })()}
                                </AnimatePresence>
                            </div>

                            {/* Sidebar Controls overlay */}
                            {medias.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevMedia}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/85 border border-white/10 hover:border-white/20 text-white rounded-full p-3.5 transition-all duration-300 backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-xl focus:opacity-100"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleNextMedia}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/85 border border-white/10 hover:border-white/20 text-white rounded-full p-3.5 transition-all duration-300 backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-xl focus:opacity-100"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                    
                                    {/* Media index tracker overlay */}
                                    <div className="absolute bottom-4 right-6 bg-black/55 backdrop-blur-md text-white/90 text-xs px-3.5 py-1.5 rounded-full border border-white/5 font-display font-medium">
                                        {activeMediaIndex + 1} / {medias.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Navigation Row */}
                        {medias.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto py-2.5 px-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent justify-center">
                                {medias.map((url, i) => {
                                    const isActive = i === activeMediaIndex
                                    const isYoutube = url.includes("youtube.com") || url.includes("youtu.be")
                                    let thumbnail = url
                                    if (isYoutube) {
                                        const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([^"&?\/\s]{11})/i)?.[1]
                                        thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "/placeholder.svg"
                                    }
                                    
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setActiveMediaIndex(i)}
                                            className={`relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-2xl overflow-hidden border transition-all duration-300 ${
                                                isActive
                                                    ? "border-amber-400 scale-[0.96] shadow-[0_0_15px_rgba(251,191,36,0.4)] ring-2 ring-amber-400/20"
                                                    : "border-white/10 hover:border-white/25 opacity-60 hover:opacity-100"
                                            }`}
                                        >
                                            <img src={thumbnail} alt="" className="w-full h-full object-cover" />
                                            {isYoutube && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                    <PlayCircle className="w-6 h-6 text-red-500 drop-shadow" />
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom Section: Socials & Platforms Side-by-Side */}
                {((artist.socials && artist.socials.length > 0) || (artist.musicLinks && artist.musicLinks.length > 0)) && (
                    <div className={`grid grid-cols-1 ${artist.socials?.length && artist.musicLinks?.length ? 'md:grid-cols-2' : ''} gap-8 pt-4`}>
                        {/* Social Links Card */}
                        {artist.socials && artist.socials.length > 0 && (
                            <Card className="glassy-card border-white/8 rounded-[2.5rem]">
                                <CardContent className="p-6">
                                    <h3 className="text-white/85 font-extrabold mb-6 text-center uppercase tracking-widest text-[11px] font-display">Réseaux Sociaux</h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {artist.socials.map((link, i) => {
                                            const { icon: Icon, color } = getSocialIconData(link.platform)
                                            return (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 flex items-center justify-center hover:bg-white/[0.06] transition-all duration-300 group shadow-md"
                                                    title={link.platform}
                                                >
                                                    <Icon className={`w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110 ${color}`} />
                                                </a>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Music Links / Streaming Platforms Card */}
                        {artist.musicLinks && artist.musicLinks.length > 0 && (
                            <Card className="glassy-card border-white/8 rounded-[2.5rem]">
                                <CardContent className="p-6">
                                    <h3 className="text-white/85 font-extrabold mb-6 text-center uppercase tracking-widest text-[11px] font-display">Plateformes</h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {artist.musicLinks.map((link, i) => {
                                            const { icon: Icon, color } = getSocialIconData(link.platform)
                                            return (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 flex items-center justify-center hover:bg-white/[0.06] transition-all duration-300 group shadow-md"
                                                    title={link.platform}
                                                >
                                                    <Icon className={`w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110 ${color}`} />
                                                </a>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

