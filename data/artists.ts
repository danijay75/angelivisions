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
        id: "la-comedie-des-illusions",
        slug: "la-comedie-des-illusions",
        name: "La Comédie des Illusions",
        type: [{ fr: "Comédie", en: "Comedy", es: "Comedia" }],
        musicalGenre: [{ fr: "Théâtre & Humour", en: "Theater & Comedy", es: "Teatro y Humor" }],
        description: {
            fr: "<p>Une comédie hilarante rythmé par des quiproquos, des répliques ciselées et une mise en scène dynamique. Un spectacle grand public idéal pour les théâtres, séminaires et festivals d'humour.</p>",
            en: "<p>A hilarious comedy filled with misunderstandings and dynamic staging. Perfect for theaters, corporate events, and comedy festivals.</p>",
            es: "<p>Una comedia hilarante llena de malentendidos y puesta en escena dinámica. Ideal para teatros, eventos corporativos y festivales de humor.</p>"
        },
        photos: [
            "/vr-theater-immersive.png"
        ],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        socials: [
            { platform: "Instagram", url: "https://instagram.com/angelivisions" }
        ],
        tags: [
            { fr: "Comédie", en: "Comedy", es: "Comedia" },
            { fr: "Théâtre", en: "Theater", es: "Teatro" },
            { fr: "Humour", en: "Humor", es: "Humor" }
        ],
        available: true,
        featured: true,
        order: 1,
    },
    {
        id: "standup-burlesque-show",
        slug: "standup-burlesque-show",
        name: "Stand-up & Cabaret Burlesque",
        type: [{ fr: "Humour / Stand-up / Burlesque", en: "Humor / Stand-up / Burlesque", es: "Humor / Stand-up / Burlesco" }],
        musicalGenre: [{ fr: "Stand-up & Burlesque", en: "Stand-up & Burlesque", es: "Stand-up y Burlesco" }],
        description: {
            fr: "<p>Un plateau décapant associant les meilleurs humoristes de stand-up du moment et des performances burlesques envoûtantes. Entre rires incisifs, glamour et impertinence !</p>",
            en: "<p>A sharp show merging top stand-up comedians with spellbinding burlesque performances. Incisive laughter, glamour, and audacity combined!</p>",
            es: "<p>Un espectáculo picante que combina los mejores comediantes de stand-up con actuaciones burlescas cautivadoras. ¡Risas, glamour y audacia!</p>"
        },
        photos: [
            "/corporate-event-stage.jpg"
        ],
        videos: [],
        socials: [
            { platform: "Instagram", url: "https://instagram.com/angelivisions" }
        ],
        tags: [
            { fr: "Stand-up", en: "Stand-up", es: "Stand-up" },
            { fr: "Burlesque", en: "Burlesque", es: "Burlesco" },
            { fr: "Humour", en: "Humor", es: "Humor" }
        ],
        available: true,
        featured: true,
        order: 2,
    },
    {
        id: "symphonie-musicale-live",
        slug: "symphonie-musicale-live",
        name: "Symphonie Électro - Spectacle Musical",
        type: [{ fr: "Spectacle musical", en: "Musical Show", es: "Espectáculo musical" }],
        musicalGenre: [{ fr: "Spectacle musical", en: "Musical Show", es: "Espectáculo musical" }],
        description: {
            fr: "<p>Un spectacle musical grandiose associant des musiciens live, des voix puissantes et une scénographie visuelle immersive. Une expérience immersive inoubliable pour vos galas et festivals.</p>",
            en: "<p>A grandiose musical show blending live musicians, powerful vocals, and immersive visual staging. An unforgettable experience for galas and festivals.</p>",
            es: "<p>Un espectáculo musical grandioso que combina músicos en vivo, voces potentes y escenografía visual inmersiva. Una experiencia inolvidable.</p>"
        },
        photos: [
            "/music-production-setup.png"
        ],
        videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
        socials: [],
        tags: [
            { fr: "Spectacle musical", en: "Musical Show", es: "Espectáculo musical" },
            { fr: "Live", en: "Live", es: "En vivo" },
            { fr: "Concert", en: "Concert", es: "Concierto" }
        ],
        available: true,
        featured: true,
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

