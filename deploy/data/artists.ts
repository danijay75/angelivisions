export type Artist = {
    id: string
    slug: string
    name: string
    genre: string
    description: string
    photos: string[]
    videos: string[]
    tags: string[]
    available: boolean
    featured: boolean
    order: number
}

export const ARTISTS_STORAGE_KEY = "av_artists_v1"

export const defaultArtists: Artist[] = [
    {
        id: "dj-phoenix",
        slug: "dj-phoenix",
        name: "DJ Phoenix",
        genre: "DJ",
        description:
            "<p>DJ Phoenix enflamme les pistes depuis plus de 10 ans. Spécialisé dans la musique <strong>électronique</strong>, <strong>deep house</strong> et <strong>afrobeat</strong>, il transforme chaque événement en une expérience musicale inoubliable.</p><p>Passé par les plus grandes scènes parisiennes, il maîtrise aussi bien les soirées privées que les festivals de grande envergure.</p>",
        photos: [
            "/placeholder.svg?height=600&width=800&text=DJ+Phoenix+1",
            "/placeholder.svg?height=600&width=800&text=DJ+Phoenix+2",
            "/placeholder.svg?height=600&width=800&text=DJ+Phoenix+3",
        ],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        tags: ["Deep House", "Afrobeat", "Électro"],
        available: true,
        featured: true,
        order: 1,
    },
    {
        id: "elena-strings",
        slug: "elena-strings",
        name: "Elena Strings",
        genre: "Musicienne",
        description:
            "<p>Violoniste classique de formation, Elena apporte une touche d'<strong>élégance</strong> et de <strong>raffinement</strong> à vos événements. Du classique au contemporain, elle adapte son répertoire à chaque occasion.</p><p>Accompagnée de son quatuor à cordes, elle sublime les cérémonies, les cocktails d'entreprise et les soirées privées.</p>",
        photos: [
            "/placeholder.svg?height=600&width=800&text=Elena+Strings+1",
            "/placeholder.svg?height=600&width=800&text=Elena+Strings+2",
        ],
        videos: [],
        tags: ["Classique", "Contemporain", "Cérémonie"],
        available: true,
        featured: true,
        order: 2,
    },
    {
        id: "duo-nova",
        slug: "duo-nova",
        name: "Duo Nova",
        genre: "DJ & Musicien",
        description:
            "<p>Le Duo Nova fusionne <strong>DJ set</strong> et <strong>saxophone live</strong> pour créer une atmosphère unique. Leur énergie communicative garantit une ambiance de fête inoubliable.</p><p>Idéal pour les soirées corporate, les événements privés et les clubs, ils s'adaptent à tous les styles musicaux.</p>",
        photos: [
            "/placeholder.svg?height=600&width=800&text=Duo+Nova+1",
            "/placeholder.svg?height=600&width=800&text=Duo+Nova+2",
            "/placeholder.svg?height=600&width=800&text=Duo+Nova+3",
            "/placeholder.svg?height=600&width=800&text=Duo+Nova+4",
        ],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        tags: ["Saxo Live", "House", "Funk", "Club"],
        available: true,
        featured: false,
        order: 3,
    },
]

/** Read artists from localStorage, falling back to defaults. */
export function loadArtists(): Artist[] {
    if (typeof window === "undefined") return defaultArtists
    try {
        const raw = localStorage.getItem(ARTISTS_STORAGE_KEY)
        if (!raw) return defaultArtists
        const parsed = JSON.parse(raw) as Artist[]
        return parsed.length > 0 ? parsed : defaultArtists
    } catch {
        return defaultArtists
    }
}

/** Persist artists to localStorage. */
export function saveArtists(artists: Artist[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(ARTISTS_STORAGE_KEY, JSON.stringify(artists))
}
