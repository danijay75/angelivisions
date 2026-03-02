export interface InvestmentProject {
    id: string
    title: string
    slug: string
    category: string
    description: string
    fullDescription?: string
    targetAmount: number
    currentAmount: number
    expectedReturn: string
    duration: string
    risk: "Faible" | "Modéré" | "Élevé"
    highlights: string[]
    image: string
    isActive: boolean
}

export const defaultInvestmentProjects: InvestmentProject[] = [
    {
        id: "1",
        title: "Album Collectif Hip-Hop Émergent",
        slug: "album-collectif-hip-hop-emergent",
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
        isActive: true,
    },
    {
        id: "2",
        title: "Spectacle Immersif VR",
        slug: "spectacle-immersif-vr",
        category: "Expérience Immersive",
        description: "Création d'un spectacle théâtral en réalité virtuelle combinant performance live et technologie.",
        targetAmount: 75000,
        currentAmount: 45000,
        expectedReturn: "20-30%",
        duration: "18 mois",
        risk: "Élevé",
        highlights: ["Technologie VR innovante", "Tournée internationale prévue", "Partenariat Meta"],
        image: "/vr-theater-immersive.png",
        isActive: true,
    },
]
