export type LocalizedString = {
    fr: string
    en: string
    es: string
}

export type Artist = {
    id: string
    slug: string
    name: string
    type: LocalizedString[]
    musicalGenre: LocalizedString[]
    description: LocalizedString
    photos: string[]
    videos: string[]
    socials?: { platform: string, url: string }[]
    musicLinks?: { platform: string, url: string }[]
    tags: LocalizedString[]
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
        type: [{ fr: "DJ", en: "DJ", es: "DJ" }],
        musicalGenre: [{ fr: "Electro-House", en: "Electro-House", es: "Electro-House" }],
        description: {
            fr: "<p>DJ Phoenix enflamme les pistes depuis plus de 10 ans. Spécialisé dans la musique <strong>électronique</strong>, <strong>deep house</strong> et <strong>afrobeat</strong>, il transforme chaque événement en une expérience musicale inoubliable.</p><p>Passé par les plus grandes scènes parisiennes, il maîtrise aussi bien les soirées privées que les festivals de grande envergure.</p>",
            en: "<p>DJ Phoenix has been igniting dance floors for over 10 years. Specialized in <strong>electronic</strong>, <strong>deep house</strong> and <strong>afrobeat</strong> music, he transforms every event into an unforgettable musical experience.</p><p>Having played on the biggest Parisian stages, he masters private parties as well as large-scale festivals.</p>",
            es: "<p>DJ Phoenix lleva más de 10 años encendiendo las pistas de baile. Especializado en música <strong>electrónica</strong>, <strong>deep house</strong> y <strong>afrobeat</strong>, transforma cada evento en una experiencia musical inolvidable.</p><p>Habiendo pasado por los escenarios parisinos más importantes, domina tanto las fiestas privadas como los festivales a gran escala.</p>"
        },
        photos: [
            "/placeholder.svg?height=600&width=800&text=DJ+Phoenix+1",
            "/placeholder.svg?height=600&width=800&text=DJ+Phoenix+2",
            "/placeholder.svg?height=600&width=800&text=DJ+Phoenix+3",
        ],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        socials: [
            { platform: "Instagram", url: "https://instagram.com/djphoenix" },
            { platform: "YouTube", url: "https://youtube.com/djphoenix" }
        ],
        tags: [
            { fr: "Deep House", en: "Deep House", es: "Deep House" },
            { fr: "Afrobeat", en: "Afrobeat", es: "Afrobeat" },
            { fr: "Électro", en: "Electro", es: "Electro" }
        ],
        available: true,
        featured: true,
        order: 1,
    },
    {
        id: "elena-strings",
        slug: "elena-strings",
        name: "Elena Strings",
        type: [{ fr: "Musicien(ne)", en: "Musician", es: "Músico" }],
        musicalGenre: [{ fr: "Pop", en: "Pop", es: "Pop" }, { fr: "Classique", en: "Classical", es: "Clásico" }],
        description: {
            fr: "<p>Violoniste classique de formation, Elena apporte une touche d'<strong>élégance</strong> et de <strong>raffinement</strong> à vos événements. Du classique au contemporain, elle adapte son répertoire à chaque occasion.</p><p>Accompagnée de son quatuor à cordes, elle sublime les cérémonies, les cocktails d'entreprise et les soirées privées.</p>",
            en: "<p>A classically trained violinist, Elena brings a touch of <strong>elegance</strong> and <strong>refinement</strong> to your events. From classical to contemporary, she adapts her repertoire to every occasion.</p><p>Accompanied by her string quartet, she enhances ceremonies, corporate cocktails and private parties.</p>",
            es: "<p>Violonista de formación clásica, Elena aporta un toque de <strong>elegancia</strong> y <strong>refinamiento</strong> a sus eventos. Del clásico al contemporáneo, adapta su repertorio a cada ocasión.</p><p>Acompañada por su cuarteto de cuerda, realza ceremonias, cócteles corporativos y fiestas privadas.</p>"
        },
        photos: [
            "/placeholder.svg?height=600&width=800&text=Elena+Strings+1",
            "/placeholder.svg?height=600&width=800&text=Elena+Strings+2",
        ],
        videos: [],
        socials: [
            { platform: "Facebook", url: "https://facebook.com/elenastrings" }
        ],
        tags: [
            { fr: "Classique", en: "Classical", es: "Clásico" },
            { fr: "Contemporain", en: "Contemporary", es: "Contemporáneo" },
            { fr: "Cérémonie", en: "Ceremony", es: "Ceremonia" }
        ],
        available: true,
        featured: true,
        order: 2,
    },
    {
        id: "duo-nova",
        slug: "duo-nova",
        name: "Duo Nova",
        type: [{ fr: "Groupe", en: "Band", es: "Grupo" }],
        musicalGenre: [{ fr: "Electro-House", en: "Electro-House", es: "Electro-House" }],
        description: {
            fr: "<p>Le Duo Nova fusionne <strong>DJ set</strong> et <strong>saxophone live</strong> pour créer une atmosphère unique. Leur énergie communicative garantit une ambiance de fête inoubliable.</p><p>Idéal pour les soirées corporate, les événements privés et les clubs, ils s'adaptent à tous les styles musicaux.</p>",
            en: "<p>Duo Nova merges <strong>DJ set</strong> and <strong>live saxophone</strong> to create a unique atmosphere. Their communicative energy guarantees an unforgettable party mood.</p><p>Ideal for corporate parties, private events and clubs, they adapt to all musical styles.</p>",
            es: "<p>Duo Nova fusiona <strong>DJ set</strong> y <strong>saxofón en vivo</strong> para crear una atmósfera única. Su energía comunicativa garantiza un ambiente de fiesta inolvidable.</p><p>Ideal para fiestas corporativas, eventos privados y clubes, se adaptan a todos los estilos musicales.</p>"
        },
        photos: [
            "/placeholder.svg?height=600&width=800&text=Duo+Nova+1",
            "/placeholder.svg?height=600&width=800&text=Duo+Nova+2",
            "/placeholder.svg?height=600&width=800&text=Duo+Nova+3",
            "/placeholder.svg?height=600&width=800&text=Duo+Nova+4",
        ],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        socials: [],
        tags: [
            { fr: "Saxo Live", en: "Live Sax", es: "Saxo en vivo" },
            { fr: "House", en: "House", es: "House" },
            { fr: "Funk", en: "Funk", es: "Funk" },
            { fr: "Club", en: "Club", es: "Club" }
        ],
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

