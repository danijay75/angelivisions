import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ServiceItem } from "@/data/services"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Phone, Mail, Music, Calendar, Users, Mic, Monitor, Camera } from "lucide-react"

interface ServicePageProps {
  params: Promise<{
    lang: string
    serviceId: string
  }>
}

const serviceIcons = {
  production: Music,
  organization: Calendar,
  booking: Users,
  technical: Mic,
  "led-walls": Monitor,
  media: Camera,
}

async function getServices(): Promise<ServiceItem[]> {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

    const response = await fetch(`${baseUrl}/api/services`, {
      cache: "no-store", // Always get fresh data
    })

    if (response.ok) {
      const data = await response.json()
      return data.services || []
    }
  } catch (error) {
    console.log("[v0] Error fetching services:", error)
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
      features: ["Mariages clé-en-main", "Événements d'entreprise", "Soirées privées", "Conventions & séminaires"],
      color: "from-cyan-500 to-teal-500",
      image: "/event-organization.jpg",
    },
  ]
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

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((service) => ({
    serviceId: service.id,
  }))
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

  const IconComponent = serviceIcons[service.id as keyof typeof serviceIcons] || Music

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link href={`/${resolvedParams.lang}/services`}>
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux services
            </Button>
          </Link>
        </div>

        {/* Service Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center`}>
              <IconComponent className="w-12 h-12 text-white" />
            </div>
            {service.image && (
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="w-24 h-24 rounded-2xl object-cover"
              />
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{service.title}</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">{service.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Ce que nous proposons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Details based on service type */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Détails du service</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                {service.id === "production" && (
                  <>
                    <p>
                      Notre équipe de producteurs expérimentés vous accompagne dans la création de compositions
                      musicales originales, adaptées à vos besoins spécifiques.
                    </p>
                    <p>
                      Que ce soit pour des jingles d'entreprise, des musiques d'ambiance pour vos événements ou des
                      arrangements personnalisés, nous mettons notre expertise au service de votre projet.
                    </p>
                    <p>
                      Nous travaillons avec des équipements de pointe et des logiciels professionnels pour garantir une
                      qualité sonore exceptionnelle.
                    </p>
                  </>
                )}
                {service.id === "organization" && (
                  <>
                    <p>
                      Fort de notre expérience dans l'organisation d'événements, nous prenons en charge tous les aspects
                      de votre projet, de la conception à la réalisation.
                    </p>
                    <p>
                      Notre équipe s'occupe de la logistique, de la recherche de lieux, du traiteur, de la décoration et
                      de l'animation pour créer des moments inoubliables.
                    </p>
                    <p>
                      Nous adaptons nos services à tous types d'événements : mariages, événements d'entreprise, soirées
                      privées, conventions et séminaires.
                    </p>
                  </>
                )}
                {service.id === "booking" && (
                  <>
                    <p>
                      Nos DJs professionnels et nos artistes VJ créent des performances audiovisuelles uniques pour vos
                      événements.
                    </p>
                    <p>
                      Nous proposons des sets personnalisés, des animations interactives et des performances live qui
                      s'adaptent à l'ambiance de votre événement.
                    </p>
                    <p>
                      Possibilité de streaming en direct pour étendre la portée de votre événement au-delà du lieu
                      physique.
                    </p>
                  </>
                )}
                {service.id === "technical" && (
                  <>
                    <p>
                      Notre équipe technique expérimentée met à votre disposition un matériel de pointe pour la
                      sonorisation, l'éclairage et la vidéo.
                    </p>
                    <p>
                      Nous concevons des installations techniques sur-mesure adaptées à vos besoins et à la
                      configuration de votre lieu.
                    </p>
                    <p>
                      De la simple sonorisation aux installations complexes de vidéo mapping, nous maîtrisons toutes les
                      technologies audiovisuelles.
                    </p>
                  </>
                )}
                {service.id === "led-walls" && (
                  <>
                    <p>
                      Nos murs de LED haute définition transforment vos événements en expériences visuelles
                      spectaculaires.
                    </p>
                    <p>
                      Nous proposons des écrans de différentes tailles et résolutions, avec des contenus personnalisés
                      adaptés à votre événement.
                    </p>
                    <p>
                      Installation professionnelle et support technique complet pour garantir un rendu visuel parfait.
                    </p>
                  </>
                )}
                {service.id === "media" && (
                  <>
                    <p>
                      Nos équipes de captation multicaméras immortalisent vos événements avec un rendu professionnel.
                    </p>
                    <p>
                      Nous réalisons également des émissions TV et des podcasts, de la prise de vue à la
                      post-production.
                    </p>
                    <p>
                      Nos services incluent le montage, l'étalonnage et la livraison dans les formats de votre choix.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Intéressé par ce service ?</CardTitle>
                <CardDescription className="text-slate-300">
                  Contactez-nous pour discuter de votre projet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={`/${resolvedParams.lang}/devis`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    Demander un devis
                  </Button>
                </Link>
                <div className="space-y-3">
                  <div className="flex items-center text-slate-300">
                    <Phone className="w-4 h-4 mr-3 text-blue-400" />
                    <a href="tel:+33663796742" className="hover:text-white transition-colors">
                      +33 6 63 79 67 42
                    </a>
                  </div>
                  <div className="flex items-center text-slate-300">
                    <Mail className="w-4 h-4 mr-3 text-blue-400" />
                    <a href="mailto:contact@angelivisions.com" className="hover:text-white transition-colors">
                      contact@angelivisions.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Services */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Autres services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services
                    .filter((s) => s.id !== service.id)
                    .slice(0, 3)
                    .map((otherService) => {
                      const OtherIconComponent = serviceIcons[otherService.id as keyof typeof serviceIcons] || Music
                      return (
                        <Link key={otherService.id} href={`/${resolvedParams.lang}/services/${otherService.id}`}>
                          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                            <div
                              className={`w-8 h-8 rounded bg-gradient-to-r ${otherService.color} flex items-center justify-center`}
                            >
                              <OtherIconComponent className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-slate-300 hover:text-white text-sm">{otherService.title}</span>
                          </div>
                        </Link>
                      )
                    })}
                </div>
                <Link href={`/${resolvedParams.lang}/services`}>
                  <Button variant="ghost" className="w-full mt-4 text-slate-300 hover:text-white">
                    Voir tous les services
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
