"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Music,
  Theater,
  Mic,
  Gamepad2,
  Users,
  Shield,
  Coins,
  BarChart3,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Ticket,
  Trophy,
  Loader2,
} from "lucide-react"
import { useI18n } from "@/components/i18n/i18n-provider"
import { useEffect, useMemo } from "react"
import Link from "next/link"
import { type InvestmentProject } from "@/data/investments"

// Use InvestmentProject from data/investments

export default function InvestmentPageClient() {
  const { t, lang } = useI18n()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [projects, setProjects] = useState<InvestmentProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/investments")
        const data = await res.json()
        if (data.projects) {
          // Filter only active projects for frontend
          setProjects(data.projects.filter((p: InvestmentProject) => p.isActive))
        }
      } catch (error) {
        console.error("Failed to fetch investment projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const staticCategories = [
    { id: "musique", name: t("investment.sectors.musique"), icon: Music, color: "bg-blue-500", keyMatch: "Musique" },
    { id: "theatre", name: t("investment.sectors.theatre"), icon: Theater, color: "bg-purple-500", keyMatch: "Théâtre" },
    { id: "humour", name: t("investment.sectors.humour"), icon: Mic, color: "bg-orange-500", keyMatch: "Humour" },
    { id: "immersif", name: t("investment.sectors.immersif"), icon: Ticket, color: "bg-green-500", keyMatch: "Expérience Immersive" },
    { id: "festival", name: "Festival", icon: Star, color: "bg-amber-500", keyMatch: "Festival" },
    { id: "sport", name: t("investment.sectors.sport"), icon: Trophy, color: "bg-red-500", keyMatch: "Événement Sportif" },
  ]

  const derivedCategories = useMemo(() => {
    const cats = new Set<string>()
    projects.forEach(p => { if (p.category) cats.add(p.category) })

    return Array.from(cats).map(catName => {
      const existing = staticCategories.find(sc => sc.keyMatch === catName)
      if (existing) return existing
      return {
        id: catName.toLowerCase().replace(/\s+/g, "-"),
        name: catName,
        icon: Star,
        color: "bg-slate-500",
        keyMatch: catName
      }
    })
  }, [projects, t])

  const filteredProjects = selectedCategory === "all"
    ? projects
    : projects.filter((p) => {
      const cat = derivedCategories.find(c => c.id === selectedCategory)
      return p.category === cat?.keyMatch
    })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("investment.title"),
            description: t("investment.subtitle"),
            url: `https://angelivisions.com/${lang}/investir-dans-la-culture`,
            inLanguage: lang,
            isPartOf: {
              "@type": "WebSite",
              name: "Angeli Visions",
              url: "https://angelivisions.com",
            },
            about: {
              "@type": "Thing",
              name: t("investment.schemaAboutName"),
              description: t("investment.schemaAboutDesc"),
            },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "EUR",
              lowPrice: "100",
              highPrice: "50000",
              offerCount: projects.length.toString(),
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                {t("investment.heroTitle")}<span className="text-emerald-200">{t("investment.heroHighlight")}</span>
              </h1>
              <p className="text-xl mb-8 text-emerald-100">
                {t("investment.heroDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  {t("investment.startInvesting")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  {t("investment.discoverProjects")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/cultural-investment-blockchain.png"
                alt="Investissement culturel blockchain"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>



      {/* Categories Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("investment.sectorsTitle")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("investment.sectorsSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {derivedCategories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("investment.projectsTitle")}</h2>
            <p className="text-xl text-gray-600">{t("investment.projectsSubtitle")}</p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8 overflow-hidden">
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex min-w-max md:w-full h-auto">
                <TabsTrigger className="py-2 flex-1" value="all">{t("investment.tabs.all")}</TabsTrigger>
                {derivedCategories.map(cat => (
                  <TabsTrigger key={cat.id} className="py-2 flex-1" value={cat.id}>{cat.name}</TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 min-h-[400px]">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-emerald-600">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="text-xl font-medium">Chargement des projets...</p>
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Link key={project.id} href={`/${lang}/investir-dans-la-culture/${project.slug || project.id}`} className="block">
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full border-none shadow-lg shadow-slate-200/50">
                    <div className="aspect-video relative">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <Badge className="absolute top-4 left-4 bg-emerald-600">{project.category}</Badge>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">{project.title}</CardTitle>
                        <Badge variant="outline" className={getRiskColor(project.risk)}>
                          {(() => {
                            const riskKey = project.risk.toLowerCase() === "faible" ? "low" :
                              project.risk.toLowerCase() === "modéré" ? "moderate" :
                                project.risk.toLowerCase() === "élevé" ? "high" :
                                  project.risk.toLowerCase()
                            return t(`investment.project.risks.${riskKey}`) || project.risk
                          })()}
                        </Badge>
                      </div>
                      <div
                        className="text-base line-clamp-2 text-slate-500 rich-text-content"
                        dangerouslySetInnerHTML={{ __html: project.description }}
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500">{t("investment.project.progression")}</span>
                            <span className="font-bold">{project.targetAmount > 0 ? Math.round((project.currentAmount / project.targetAmount) * 100) : 0}%</span>
                          </div>
                          <Progress value={project.targetAmount > 0 ? (project.currentAmount / project.targetAmount) * 100 : 0} className="h-2" />
                          <div className="flex justify-between text-sm mt-3 pt-3 border-t border-slate-50">
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400">Collecté</span>
                              <span className="font-bold text-emerald-600">€{project.currentAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-xs text-slate-400">Objectif</span>
                              <span className="font-bold text-slate-900">€{project.targetAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pb-2">
                          <div className="flex items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <TrendingUp className="h-4 w-4 mr-2 text-emerald-600" />
                            <span className="text-sm font-semibold">{project.expectedReturn}</span>
                          </div>
                          <div className="flex items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <Clock className="h-4 w-4 mr-2 text-slate-400" />
                            <span className="text-sm font-semibold">{project.duration}</span>
                          </div>
                        </div>

                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                          {t("investment.project.investNow")}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white/50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-xl text-gray-500">Aucun projet trouvé dans cette catégorie.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("investment.howItWorks.title")}</h2>
            <p className="text-xl text-gray-600">{t("investment.howItWorks.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("investment.howItWorks.step1Title")}</h3>
              <p className="text-gray-600">
                {t("investment.howItWorks.step1Desc")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("investment.howItWorks.step2Title")}</h3>
              <p className="text-gray-600">
                {t("investment.howItWorks.step2Desc")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("investment.howItWorks.step3Title")}</h3>
              <p className="text-gray-600">
                {t("investment.howItWorks.step3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-4xl text-center">
          <Shield className="h-16 w-16 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">{t("investment.security.title")}</h2>
          <p className="text-xl text-gray-600 mb-8">
            {t("investment.security.subtitle")}
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">{t("investment.security.blockchainTitle")}</h4>
                <p className="text-gray-600 text-sm">
                  {t("investment.security.blockchainDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">{t("investment.security.verifiedTitle")}</h4>
                <p className="text-gray-600 text-sm">
                  {t("investment.security.verifiedDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">{t("investment.security.complianceTitle")}</h4>
                <p className="text-gray-600 text-sm">
                  {t("investment.security.complianceDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t("investment.cta.title")}</h2>
          <p className="text-xl mb-8 text-emerald-100">
            {t("investment.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
              <Star className="mr-2 h-5 w-5" />
              {t("investment.cta.createAccount")}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              <BarChart3 className="mr-2 h-5 w-5" />
              {t("investment.cta.viewPerformance")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
