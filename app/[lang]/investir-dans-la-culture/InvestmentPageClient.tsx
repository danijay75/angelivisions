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
} from "lucide-react"
import type { Locale } from "@/lib/i18n/locales"

interface Project {
  id: string
  title: string
  category: string
  description: string
  targetAmount: number
  currentAmount: number
  expectedReturn: string
  duration: string
  risk: "Faible" | "Modéré" | "Élevé"
  highlights: string[]
  image: string
}

interface InvestmentPageClientProps {
  lang: Locale
}

const projects: Project[] = [
  {
    id: "1",
    title: "Album Collectif Hip-Hop Émergent",
    category: "Musique",
    description:
      "Production d'un album collaboratif avec 8 artistes hip-hop émergents, distribution digitale et physique.",
    targetAmount: 50000,
    currentAmount: 32000,
    expectedReturn: "15-25%",
    duration: "12 mois",
    risk: "Modéré",
    highlights: ["Artistes avec 100K+ followers", "Partenariat label indépendant", "Droits d'auteur partagés"],
    image: "/hip-hop-studio.png",
  },
  {
    id: "2",
    title: "Spectacle Immersif VR",
    category: "Expérience Immersive",
    description: "Création d'un spectacle théâtral en réalité virtuelle combinant performance live et technologie.",
    targetAmount: 75000,
    currentAmount: 45000,
    expectedReturn: "20-30%",
    duration: "18 mois",
    risk: "Élevé",
    highlights: ["Technologie VR innovante", "Tournée internationale prévue", "Partenariat Meta"],
    image: "/vr-theater-immersive.png",
  },
  {
    id: "3",
    title: "Comédie Musicale Moderne",
    category: "Théâtre",
    description:
      "Production d'une comédie musicale originale avec des thèmes contemporains et une distribution professionnelle.",
    targetAmount: 120000,
    currentAmount: 89000,
    expectedReturn: "12-18%",
    duration: "24 mois",
    risk: "Faible",
    highlights: ["Équipe primée", "Théâtre parisien confirmé", "Pré-ventes ouvertes"],
    image: "/musical-theater-performance.png",
  },
  {
    id: "4",
    title: "Festival Stand-Up Digital",
    category: "Humour",
    description: "Organisation d'un festival de stand-up avec streaming live et NFT des meilleures performances.",
    targetAmount: 35000,
    currentAmount: 28000,
    expectedReturn: "18-28%",
    duration: "8 mois",
    risk: "Modéré",
    highlights: ["20+ humoristes confirmés", "Plateforme streaming dédiée", "NFT exclusifs"],
    image: "/stand-up-comedy-festival.png",
  },
]

const categories = [
  { id: "musique", name: "Musique", icon: Music, color: "bg-blue-500" },
  { id: "theatre", name: "Théâtre", icon: Theater, color: "bg-purple-500" },
  { id: "humour", name: "Humour", icon: Mic, color: "bg-orange-500" },
  { id: "immersif", name: "Expériences Immersives", icon: Gamepad2, color: "bg-green-500" },
]

export default function InvestmentPageClient({ lang }: InvestmentPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("tous")

  const filteredProjects =
    selectedCategory === "tous" ? projects : projects.filter((p) => p.category.toLowerCase().includes(selectedCategory))

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Faible":
        return "text-green-600 bg-green-100"
      case "Modéré":
        return "text-yellow-600 bg-yellow-100"
      case "Élevé":
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
            name: "Investir dans la Culture - Projets Culturels Blockchain & NFT",
            description:
              "Investissez dans des projets culturels innovants grâce à la technologie blockchain et NFT. Rendements attractifs et impact culturel garanti.",
            url: `https://angeli-visions.com/${lang}/investir-dans-la-culture`,
            inLanguage: lang,
            isPartOf: {
              "@type": "WebSite",
              name: "Angeli Visions",
              url: "https://angeli-visions.com",
            },
            about: {
              "@type": "Thing",
              name: "Investissement Culturel Blockchain",
              description:
                "Plateforme d'investissement dans des projets culturels utilisant la technologie blockchain et NFT",
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
                Investir dans la <span className="text-emerald-200">Culture</span>
              </h1>
              <p className="text-xl mb-8 text-emerald-100">
                Découvrez des opportunités d'investissement uniques dans des projets culturels innovants. Soutenez les
                artistes de demain tout en générant des rendements attractifs grâce à la blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Commencer à investir
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  Découvrir les projets
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

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">€2.5M+</div>
              <div className="text-gray-600">Investis à ce jour</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">150+</div>
              <div className="text-gray-600">Projets financés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">22%</div>
              <div className="text-gray-600">Rendement moyen</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">5000+</div>
              <div className="text-gray-600">Investisseurs actifs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Secteurs d'Investissement</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diversifiez votre portefeuille culturel en investissant dans différents secteurs artistiques
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Projets en Cours</h2>
            <p className="text-xl text-gray-600">Investissez dès maintenant dans ces projets culturels prometteurs</p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="tous">Tous</TabsTrigger>
              <TabsTrigger value="musique">Musique</TabsTrigger>
              <TabsTrigger value="theatre">Théâtre</TabsTrigger>
              <TabsTrigger value="humour">Humour</TabsTrigger>
              <TabsTrigger value="immersif">Immersif</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-emerald-600">{project.category}</Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <Badge variant="outline" className={getRiskColor(project.risk)}>
                      {project.risk}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progression</span>
                        <span>{Math.round((project.currentAmount / project.targetAmount) * 100)}%</span>
                      </div>
                      <Progress value={(project.currentAmount / project.targetAmount) * 100} className="h-2" />
                      <div className="flex justify-between text-sm mt-1 text-gray-600">
                        <span>€{project.currentAmount.toLocaleString()}</span>
                        <span>€{project.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-emerald-600" />
                        <span>Rendement: {project.expectedReturn}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Durée: {project.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {project.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <Coins className="mr-2 h-4 w-4" />
                      Investir maintenant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Comment ça fonctionne</h2>
            <p className="text-xl text-gray-600">Un processus simple et sécurisé pour investir dans la culture</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Choisissez votre projet</h3>
              <p className="text-gray-600">
                Parcourez notre sélection de projets culturels vérifiés et choisissez ceux qui vous inspirent.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Investissez en toute sécurité</h3>
              <p className="text-gray-600">
                Utilisez notre plateforme blockchain sécurisée pour investir le montant de votre choix.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Récoltez les bénéfices</h3>
              <p className="text-gray-600">
                Suivez l'évolution de vos investissements et percevez vos rendements automatiquement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Shield className="h-16 w-16 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Sécurité et Transparence</h2>
          <p className="text-xl text-gray-600 mb-8">
            Vos investissements sont protégés par la technologie blockchain et nos partenaires financiers agréés.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Blockchain sécurisée</h4>
                <p className="text-gray-600 text-sm">
                  Tous les investissements sont enregistrés sur blockchain pour une transparence totale.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Projets vérifiés</h4>
                <p className="text-gray-600 text-sm">
                  Chaque projet est audité par notre équipe d'experts culturels et financiers.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Conformité réglementaire</h4>
                <p className="text-gray-600 text-sm">
                  Plateforme agréée et conforme aux réglementations financières européennes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Prêt à investir dans la culture de demain ?</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Rejoignez notre communauté d'investisseurs passionnés et soutenez les projets culturels innovants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
              <Star className="mr-2 h-5 w-5" />
              Créer mon compte investisseur
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              <BarChart3 className="mr-2 h-5 w-5" />
              Voir les performances
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
