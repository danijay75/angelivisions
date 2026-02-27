import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Music, Calendar, Users, Mic, Monitor, Camera } from "lucide-react"
import type { ServiceItem } from "@/data/services"

import { Redis } from "@upstash/redis"

const serviceIcons = {
  production: Music,
  organization: Calendar,
  booking: Users,
  technical: Mic,
  "led-walls": Monitor,
  media: Camera,
}

export const dynamic = "force-dynamic"
const SERVICES_KEY = "av_services_v1"

async function getServices(): Promise<ServiceItem[]> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
      const servicesData = await redis.get(SERVICES_KEY)

      if (servicesData) {
        if (typeof servicesData === "string") {
          return JSON.parse(servicesData)
        } else if (typeof servicesData === "object" && Array.isArray(servicesData)) {
          return servicesData
        }
      }
    }
  } catch (error) {
    console.log("[v0] Error fetching services directly from Redis:", error)
  }

  // Fallback to default services if API fails
  return [
    {
      id: "production",
      title: "Production Musicale",
      description: "Compositions originales, jingles personnalisés, musiques d'ambiance pour vos événements",
      features: [
        "Jingles d'entreprise",
        "Musiques d'ambiance",
        "Compositions originales",
        "Arrangements personnalisés",
      ],
      color: "from-blue-500 to-cyan-500",
      image: "/music-production-setup.png",
    },
    {
      id: "organization",
      title: "Organisation d'Événements",
      description: "Gestion complète de vos événements : logistique, venue, traiteur, décoration et animation",
      features: ["Galas & réceptions", "Événements d'entreprise", "Soirées privées", "Conventions & séminaires"],
      color: "from-cyan-500 to-teal-500",
      image: "/event-organization.jpg",
    },
  ]
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params
  if (!resolvedParams.lang || !["fr", "en"].includes(resolvedParams.lang)) {
    notFound()
  }

  const services = await getServices()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Nos{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Découvrez notre gamme complète de services pour vos événements et projets musicaux
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = serviceIcons[service.id as keyof typeof serviceIcons] || Music

            return (
              <Card
                key={service.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    {service.image && (
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                  </div>
                  <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-slate-300">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-700/50 text-slate-200 mr-2 mb-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/${resolvedParams.lang}/services/${service.id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      En savoir plus
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl p-8 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-4">Vous avez un projet ?</h2>
            <div className="text-sm text-slate-300 mb-6">Contactez-nous pour discuter de votre projet</div>
            <Link href={`/${resolvedParams.lang}/devis`}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-bold px-10"
              >
                Parlons-en !
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
