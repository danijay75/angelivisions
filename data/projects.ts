export type Project = {
  id: number
  title: string
  slug: string
  category: string
  image: string
  gallery: string[]
  description: string
  fullDescription?: string
  services: string[]
  client: string
  date: string
  guests: string
  location: string
}

export const categories = [
  { id: "corporate", label: "Entreprise", color: "from-blue-500 to-cyan-500" },
  { id: "production", label: "Production Musicale", color: "from-purple-500 to-pink-500" },
  { id: "mapping", label: "Vidéo Mapping", color: "from-indigo-500 to-purple-500" },
  { id: "media", label: "Captations et prises de vue", color: "from-green-500 to-emerald-500" },
]

export const projects: Project[] = [

  {
    id: 2,
    title: "Convention Technologique",
    slug: "convention-technologique",
    category: "corporate",
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description: "Événement d'entreprise avec vidéo mapping et streaming live pour 500 participants",
    fullDescription:
      "Convention internationale avec vidéo mapping immersif et streaming multi-caméras pour toucher 10 000+ participants à distance.",
    services: ["Vidéo mapping", "Streaming live", "Sonorisation", "Régie technique"],
    client: "TechCorp International",
    date: "Mars 2024",
    guests: "500 participants",
    location: "Palais des Congrès",
  },
  {
    id: 3,
    title: "Album 'Midnight Vibes'",
    slug: "album-midnight-vibes",
    category: "production",
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description: "Production complète d'un album de musique électronique avec 12 compositions originales",
    fullDescription:
      "Composition, arrangement, mixage et mastering complet pour un album de 12 titres en musique électronique.",
    services: ["Composition originale", "Arrangement", "Mixage", "Mastering"],
    client: "Artist Collective",
    date: "Février 2024",
    guests: "Album 12 titres",
    location: "Studio EventPro",
  },
  {
    id: 4,
    title: "Festival Summer Beats",
    slug: "festival-summer-beats",
    category: "mapping",
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description: "Spectacle de vidéo mapping sur façade historique avec synchronisation musicale",
    services: ["Vidéo mapping", "Conception visuelle", "Synchronisation audio", "Régie technique"],
    client: "Ville de Paris",
    date: "Juillet 2024",
    guests: "5000 spectateurs",
    location: "Place de la République",
  },
  {
    id: 5,
    title: "Soirée Gala Entreprise",
    slug: "soiree-gala-entreprise",
    category: "corporate",
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description: "Gala annuel avec performances live et animation DJ pour célébrer les 50 ans de l'entreprise",
    services: ["DJ & Musiciens", "Performances live", "Éclairage scénique", "Organisation"], // remplacé "Animation DJ" par "DJ & Musiciens"
    client: "Groupe Industriel",
    date: "Octobre 2024",
    guests: "300 invités",
    location: "Grand Palais",
  },
  {
    id: 6,
    title: "Bar-Mitzvah Moderne",
    slug: "bar-mitzvah-moderne",
    category: "corporate",
    image: "/placeholder.svg?height=400&width=600",
    gallery: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description: "Célébration moderne avec thème musical personnalisé et animations interactives",
    services: ["Thème personnalisé", "Animations interactives", "DJ & Musiciens", "Éclairage"], // remplacé "DJ jeune public" par "DJ & Musiciens"
    client: "Famille Cohen",
    date: "Septembre 2024",
    guests: "120 invités",
    location: "Salle Wagram",
  },
]
