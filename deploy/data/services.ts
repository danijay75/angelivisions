export type ServiceItem = {
  id: string
  title: string
  description: string
  features: string[]
  color: string // Tailwind gradient class e.g. "from-blue-500 to-cyan-500"
  image?: string // URL or data URL for the logo/icon
}

export const defaultServices: ServiceItem[] = [
  {
    id: "production",
    title: "Production Musicale",
    description: "Compositions originales, jingles personnalisés, musiques d'ambiance pour vos événements",
    features: ["Jingles d'entreprise", "Musiques d'ambiance", "Compositions originales", "Arrangements personnalisés"],
    color: "from-blue-500 to-cyan-500",
    image: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "organization",
    title: "Organisation d'Événements",
    description: "Gestion complète de vos événements : logistique, venue, traiteur, décoration et animation",
    features: ["Galas & réceptions", "Événements d'entreprise", "Soirées privées", "Conventions & séminaires"],
    color: "from-cyan-500 to-teal-500",
    image: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "booking",
    title: "Booking DJ & Musiciens",
    description: "DJs professionnels, animation live audiovisuel, VJing et performances audiovisuelles personnalisées",
    features: ["DJ sets professionnels", "VJ live performances", "Animation interactive", "Streaming en direct"],
    color: "from-teal-500 to-emerald-500",
    image: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "technical",
    title: "Prestations Techniques",
    description: "Sonorisation, éclairage scénique, vidéo mapping et conception technique d'événements",
    features: [
      "Sonorisation événementielle",
      "Éclairage scénique",
      "Murs de LED",
      "VJ / Vidéo mapping",
      "Régie technique",
    ],
    color: "from-emerald-500 to-blue-500",
    image: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "led-walls",
    title: "Murs de LED",
    description: "Écrans LED haute définition pour créer des expériences visuelles immersives et spectaculaires",
    features: ["Écrans LED géants", "Affichage haute résolution", "Installation sur-mesure", "Contenu personnalisé"],
    color: "from-blue-600 to-cyan-600",
    image: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "media",
    title: "Captations et prises de vue",
    description: "Captations multicaméras, émissions TV et création de podcasts pour vos événements",
    features: ["Captations multicaméras", "Émissions TV", "Création de Podcasts", "Post-production vidéo"],
    color: "from-blue-700 to-cyan-800",
    image: "/placeholder.svg?height=128&width=128",
  },
  {
    id: "sport",
    title: "Événements Sportifs",
    description: "Organisation et animation d'événements sportifs : soirées de remise de prix, galas sportifs et couverture médiatique",
    features: ["Galas & remises de prix", "Soirées supporters", "Couverture médiatique", "Animation & sono de stade"],
    color: "from-orange-500 to-red-500",
    image: "/placeholder.svg?height=128&width=128",
  },
]

export const SERVICES_STORAGE_KEY = "av_services_config_v1"
