"use client"

import { useState, useEffect } from "react"
import { useI18n } from "@/components/i18n/i18n-provider"
import { type InvestmentProject } from "@/data/investments"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    TrendingUp,
    Clock,
    Shield,
    Coins,
    ArrowLeft,
    CheckCircle,
    Calendar,
    Target,
    BarChart3,
    ArrowRight,
    Music,
    Theater,
    Mic,
    Ticket,
    Star,
    Trophy,
    Loader2
} from "lucide-react"
import Link from "next/link"

interface Props {
    slug: string
}

export default function ProjectDetailPageClient({ slug }: Props) {
    const { t, lang } = useI18n()
    const [project, setProject] = useState<InvestmentProject | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/investments?slug=${slug}`)
                const data = await res.json()
                if (data.project) {
                    setProject(data.project)
                }
            } catch (error) {
                console.error("Failed to fetch project detail:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [slug])

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "Faible":
            case "low":
                return "text-green-600 bg-green-100"
            case "Modéré":
            case "moderate":
                return "text-yellow-600 bg-yellow-100"
            case "Élevé":
            case "high":
                return "text-red-600 bg-red-100"
            default:
                return "text-gray-600 bg-gray-100"
        }
    }

    const categories = [
        { id: "musique", name: t("investment.sectors.musique"), icon: Music, color: "bg-blue-500", keyMatch: "Musique" },
        { id: "theatre", name: t("investment.sectors.theatre"), icon: Theater, color: "bg-purple-500", keyMatch: "Théâtre" },
        { id: "humour", name: t("investment.sectors.humour"), icon: Mic, color: "bg-orange-500", keyMatch: "Humour" },
        { id: "immersif", name: t("investment.sectors.immersif"), icon: Ticket, color: "bg-green-500", keyMatch: "Expérience Immersive" },
        { id: "festival", name: "Festival", icon: Star, color: "bg-amber-500", keyMatch: "Festival" },
        { id: "sport", name: t("investment.sectors.sport"), icon: Trophy, color: "bg-red-500", keyMatch: "Événement Sportif" },
    ]

    const categoryInfo = project ? (categories.find(c => c.keyMatch === project.category) || { icon: Star, color: "bg-slate-500" }) : { icon: Star, color: "bg-slate-500" }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-xl font-medium text-slate-600">Chargement du projet...</p>
                </div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-3xl font-bold mb-4">Projet introuvable</h1>
                    <p className="text-slate-600 mb-8">Le projet que vous recherchez n'existe pas ou n'est plus disponible.</p>
                    <Link href={`/${lang}/investir-dans-la-culture`}>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour à la liste
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const progress = project.targetAmount > 0 ? (project.currentAmount / project.targetAmount) * 100 : 0

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Section */}
            <div className="relative h-[400px] lg:h-[500px]">
                <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                <div className="absolute top-8 left-4 lg:left-8 z-10">
                    <Link href={`/${lang}/investir-dans-la-culture`}>
                        <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour
                        </Button>
                    </Link>
                </div>

                <div className="absolute bottom-12 left-0 right-0 p-4 lg:px-8">
                    <div className="container mx-auto max-w-6xl">
                        <Badge className={`${categoryInfo.color} mb-4 text-white hover:${categoryInfo.color} text-sm px-4 py-1`}>
                            <categoryInfo.icon className="h-4 w-4 mr-2 inline" />
                            {project.category}
                        </Badge>
                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            {project.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 -mt-10 relative z-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none shadow-xl shadow-slate-200/50">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center">
                                    <BarChart3 className="mr-3 h-6 w-6 text-emerald-600" />
                                    Présentation du projet
                                </h2>
                                <div
                                    className="text-lg text-slate-700 leading-relaxed mb-6 rich-text-content"
                                    dangerouslySetInnerHTML={{ __html: project.fullDescription || project.description }}
                                />

                                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                                    {(project.highlights || []).map((highlight, index) => (
                                        <div key={index} className="flex items-start p-4 bg-emerald-50 rounded-xl">
                                            <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-700 font-medium">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl shadow-slate-200/50">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center">
                                    <Shield className="mr-3 h-6 w-6 text-emerald-600" />
                                    Pourquoi investir ?
                                </h2>
                                <p className="text-slate-600 mb-6">
                                    Ce projet a été rigoureusement audité par nos experts. En investissant, vous soutenez non seulement la culture, mais vous participez également à l'économie réelle via des actifs numériques sécurisés par la blockchain.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                        <h4 className="font-semibold mb-2">Transparence Totale</h4>
                                        <p className="text-sm text-slate-500">Chaque transaction et distribution de dividendes est enregistrée sur la blockchain.</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                        <h4 className="font-semibold mb-2">Liquidité</h4>
                                        <p className="text-sm text-slate-500">Possibilité de revendre vos parts sur notre marché secondaire (prochainement).</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar / Investment Panel */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-xl shadow-slate-200/50 sticky top-24">
                            <CardHeader className="bg-slate-900 text-white rounded-t-xl py-6">
                                <CardTitle className="flex justify-between items-center text-xl font-bold">
                                    <span>État du financement</span>
                                    <Badge variant="outline" className={getRiskColor(project.risk) + " border-none"}>
                                        {project.risk}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-slate-500 text-sm">Progression</span>
                                        <span className="text-2xl font-bold text-slate-900">{Math.round(progress)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-3 bg-slate-100" />
                                    <div className="flex justify-between text-sm mt-3 pt-3 border-t border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-slate-400">Collecté</span>
                                            <span className="text-lg font-bold text-emerald-600">€{project.currentAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-slate-400">Objectif</span>
                                            <span className="text-lg font-bold text-slate-900">€{project.targetAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <TrendingUp className="h-5 w-5 text-emerald-600 mr-3" />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Rendement visé</p>
                                            <p className="font-bold text-slate-900">{project.expectedReturn}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <Clock className="h-5 w-5 text-blue-500 mr-3" />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Durée de l'actif</p>
                                            <p className="font-bold text-slate-900">{project.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <Target className="h-5 w-5 text-purple-500 mr-3" />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Investissement Min.</p>
                                            <p className="font-bold text-slate-900">€100</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg font-bold shadow-lg shadow-emerald-200">
                                        <Coins className="mr-2 h-5 w-5" />
                                        Investir maintenant
                                    </Button>
                                    <p className="text-center text-xs text-slate-400 px-4">
                                        En cliquant, vous reconnaissez avoir pris connaissance des risques liés à l'investissement.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl">
                            <CardContent className="p-6">
                                <h4 className="font-bold text-lg mb-2">Besoin d'aide ?</h4>
                                <p className="text-sm text-indigo-100 mb-4">Un conseiller est disponible pour répondre à vos questions sur ce projet spécifique.</p>
                                <Button className="w-full bg-white text-indigo-600 hover:bg-slate-100">
                                    Contacter un expert
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
