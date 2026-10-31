const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: "***UPSTASH-URL-SUPPRIMEE***",
  token: "***TOKEN-REVOQUE***",
});

const defaultServices = [
  {
    id: "captation-video",
    title: "Captation vidéo",
    description: "Système multicaméra professionnel pour l'enregistrement de vos événements en très haute définition.",
    features: ["4K & 8K", "Multicaméra", "Élimination des bruits", "Équipe dédiée"],
    color: "from-blue-600 to-cyan-600",
    image: "/music-production-setup.png",
  },
  {
    id: "streaming-live",
    title: "Streaming Live",
    description: "Diffusion en direct sur les réseaux sociaux ou plateformes privées avec une qualité professionnelle.",
    features: ["Multi-plateformes", "Basse latence", "Interaction live", "Backup réseau"],
    color: "from-blue-500 to-cyan-500",
    image: "/event-organization.jpg",
  },
  {
    id: "podcast",
    title: "Podcast",
    description: "Enregistrement de podcasts audio et vidéo en studio ou sur le lieu de votre événement.",
    features: ["Podcast vidéo", "Qualité radio", "Mixage live", "Diffusion"],
    color: "from-orange-500 to-red-500",
    image: "/abstract-soundscape.png",
  },
  {
    id: "booking",
    title: "Booking DJ & Musiciens",
    description: "DJs professionnels et musiciens live pour l'animation de vos soirées et événements.",
    features: ["DJs certifiés", "Musiciens live", "Coordination", "Playlist sur-mesure"],
    color: "from-blue-700 to-cyan-700",
    image: "/live-music-performance.jpg",
  },
  {
    id: "vj-video-mapping",
    title: "VJ / Vidéo mapping",
    description: "Expériences visuelles immersives, mapping architectural et performances VJ en direct.",
    features: ["Mapping 3D", "VJing live", "Contenu sur-mesure", "Immersion"],
    color: "from-blue-500 to-cyan-500",
    image: "/corporate-event-stage.jpg",
  },
  {
    id: "label-de-musique",
    title: "Catalogue de spectacles",
    description: "Notre sélection de spectacles immersifs, performances artistiques et concerts pour vos événements.",
    features: ["Spectacles", "Artistes", "Performances", "Concerts"],
    color: "from-rose-500 to-orange-500",
    image: "/abstract-soundscape.png",
  },
];

async function resetServices() {
  console.log("Resetting av_services_v1 in Redis...");
  await redis.set("av_services_v1", defaultServices);
  console.log("Successfully reset av_services_v1");
}

resetServices().catch(console.error);
