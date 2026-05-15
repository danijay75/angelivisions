import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ServiceItem } from "@/data/services"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Phone, Mail } from "lucide-react"

import { Redis } from "@upstash/redis"
import { ArtistsCatalogue } from "@/components/artists-catalogue"
import { SplitTitle } from "@/components/ui/split-title"

interface ServicePageProps {
  params: Promise<{
    lang: string
    serviceId: string
  }>
}

export const dynamic = "force-dynamic"



const SERVICES_KEY = "av_services_v1"

import { defaultServices } from "@/data/services"

async function getServices(): Promise<ServiceItem[]> {
  try {
    // Only fetch if env variables are available (prevents build-time crashes if missing)
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
  return defaultServices
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const services = await getServices()
  const service = services.find((s) => s.id === resolvedParams.serviceId)

  if (!service) {
    return {
      title: "Service non trouvé - Angeli Visions",
    }
  }

  return {
    title: `${service.title} - Angeli Visions`,
    description: service.description,
  }
}



export default async function ServicePage({ params }: ServicePageProps) {
  const resolvedParams = await params
  if (!resolvedParams.lang || !["fr", "en"].includes(resolvedParams.lang)) {
    notFound()
  }

  const services = await getServices()
  const service = services.find((s) => s.id === resolvedParams.serviceId)

  if (!service) {
    notFound()
  }


  return (
    <div className="min-h-screen bg-[#0A0A0A] selection:bg-amber-500/30">
      {/* Hero Section (Netflix Cover Style) */}
      <div className="relative h-[60vh] min-h-[500px] w-full flex items-end pb-16">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={service.image || "/corporate-event-stage.jpg"}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-8">
            <Link href={`/${resolvedParams.lang}/services`}>
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux services
              </Button>
            </Link>
          </div>
          <div className="max-w-4xl space-y-4 mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-2">
              <SplitTitle text={service.title} />
            </h1>
            {service.id !== "label-de-musique" && (
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                {service.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  <span className="title-gradient">Ce que nous proposons</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#121212]/80 border-white/5 backdrop-blur-sm">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-2xl font-bold">
                  <span className="title-gradient">Détails du service</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 space-y-4 font-light leading-relaxed text-lg pt-6">
                <p>Notre équipe d'experts vous accompagne de A à Z dans la réalisation de vos projets.</p>
                <p>Nous combinons créativité, innovation technologique et gestion rigoureuse pour garantir le succès de vos événements et de vos productions.</p>
                <p>N'hésitez pas à nous contacter pour un devis sur mesure ou pour discuter de vos besoins spécifiques.</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            <Card className="bg-gradient-to-br from-[#121212] via-[#0A0A0A] to-[#121212] border-amber-500/20 shadow-2xl shadow-amber-500/10 overflow-hidden backdrop-blur-md">
              <CardHeader className="pb-4 border-b border-white/5">
                <CardTitle className="text-white text-2xl font-light">Vous avez un projet ?</CardTitle>
                <div className="text-sm text-amber-500/80">Discutons de vos ambitions</div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <Link href={`/${resolvedParams.lang}/devis`} className="block">
                  <Button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-lg py-6 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:scale-[1.02] font-semibold border-none">
                    <span className="font-bold">Booking</span>
                    <span className="ml-1 font-medium">de nos artistes</span>
                  </Button>
                </Link>
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center text-white group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-blue-500/20 transition-colors">
                      <Phone className="w-4 h-4 text-blue-400" />
                    </div>
                    <a href="tel:+33663796742" className="hover:text-white transition-colors font-medium">
                      +33 6 63 79 67 42
                    </a>
                  </div>
                  <div className="flex items-center text-white group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-blue-500/20 transition-colors">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <a href="mailto:contact@angelivisions.com" className="hover:text-white transition-colors font-medium">
                      contact@angelivisions.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Intégration du Catalogue Artistes pour le Label de Musique */}
      {service.id === "label-de-musique" && (
        <div className="container mx-auto px-4 py-16 border-t border-white/5">
          <ArtistsCatalogue lang={resolvedParams.lang as "fr" | "en" | "es"} />
        </div>
      )}
    </div>
  )
}
