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
    id: "captation-video",
    title: "Captation vidéo",
    description: "Système multicaméra professionnel pour l'enregistrement de vos événements en très haute définition.",
    features: ["4K & 8K", "Multicaméra", "Élimination des bruits", "Équipe dédiée"],
    color: "from-blue-500 to-cyan-500",
    image: "/corporate-event-stage.jpg",
  },
  {
    id: "streaming-live",
    title: "Streaming Live",
    description: "Diffusion en direct sur vos plateformes avec régie dynamique intégrée, idéal pour étendre votre audience.",
    features: ["YouTube Live", "Twitch", "Réseaux Sociaux", "Faible latence"],
    color: "from-purple-500 to-pink-500",
    image: "/event-organization.jpg",
  },
  {
    id: "podcast",
    title: "Podcast",
    description: "Création, enregistrement et distribution de podcasts audio et vidéo avec des locaux insonorisés.",
    features: ["Studio professionnel", "Prise de son HD", "Montage experte", "Mixage"],
    color: "from-amber-500 to-orange-500",
    image: "/hip-hop-studio.png",
  },
  {
    id: "booking",
    title: "Booking DJ & Musiciens",
    description: "Trouvez l'artiste parfait pour animer vos événements, soirées privées ou conventions.",
    features: ["DJs internationaux", "Groupes live", "Artistes exclusifs", "Clé en main"],
    color: "from-emerald-500 to-teal-500",
    image: "/music-production-setup.png", 
  },
  {
    id: "vj-video-mapping",
    title: "VJ / Vidéo mapping",
    description: "Création de décors visuels immersifs et d'animations projetées sur mesure pour sublimer l'architecture de vos événements.",
    features: ["Mapping 3D", "VJing en direct", "Scénographie", "Contenus sur mesure"],
    color: "from-fuchsia-500 to-indigo-500",
    image: "/vr-theater-immersive.png",
  },
  {
    id: "label-de-musique",
    title: "Label de musique",
    description: "Production phonographique, développement d'artistes et distribution numérique à l'échelle internationale.",
    features: ["Direction artistique", "Distribution digitale", "Édition musicale", "Promotion"],
    color: "from-rose-500 to-orange-500",
    image: "/abstract-soundscape.png",
  },
]

export const SERVICES_STORAGE_KEY = "av_services_config_v1"
