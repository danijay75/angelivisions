export type ParagraphBlock = {
  type: "paragraph"
  html: string // stored as HTML from contentEditable
}

export type ImageBlock = {
  type: "image"
  src: string
  alt?: string
  caption?: string
}

export type VideoBlock = {
  type: "video"
  url: string // YouTube / Vimeo / mp4
  caption?: string
}

export type EmbedBlock = {
  type: "embed"
  html: string // raw embed HTML (trusted admin content)
  caption?: string
}

export type BlogBlock = ParagraphBlock | ImageBlock | VideoBlock | EmbedBlock

export type BlogSEO = {
  title?: string
  description?: string
  canonicalUrl?: string
  tags?: string[]
  robots?: {
    index: boolean
    follow: boolean
  }
  ogImage?: string
  ogType?: "article" | "website" | "video.other"
  twitterCard?: "summary" | "summary_large_image"
}

export type BlogPost = {
  id: string // equals slug
  slug: string
  title: string
  excerpt?: string
  date: string // ISO date
  author?: string
  coverImage?: string
  blocks: BlogBlock[]
  published?: boolean
  seo?: BlogSEO
}

export const BLOG_STORAGE_KEY = "av_blog_posts_v2"

export const defaultPosts: BlogPost[] = [
  {
    id: "premiere-edition-eside-culture",
    slug: "premiere-edition-eside-culture",
    title: "Lancement de eSide Culture",
    excerpt:
      "Bienvenue sur eSide Culture, notre nouveau blog dédié aux coulisses de la création, à l’innovation et aux événements culturels.",
    date: new Date().toISOString(),
    author: "Équipe Angeli Visions",
    coverImage: "/placeholder.svg?height=500&width=900",
    published: true,
    seo: {
      title: "Lancement de eSide Culture — Blog Angeli Visions",
      description:
        "Découvrez eSide Culture, le blog d’Angeli Visions dédié aux coulisses de la création, au mapping vidéo et à la production musicale.",
      tags: ["annonce", "culture", "événementiel", "musique", "mapping vidéo"],
      robots: { index: true, follow: true },
      ogType: "article",
      twitterCard: "summary_large_image",
    },
    blocks: [
      {
        type: "paragraph",
        html: "<p>Nous sommes fiers d’inaugurer eSide Culture, un espace où nous partageons inspirations, méthodes de travail, et retours d’expérience sur la scène événementielle et musicale.</p>",
      },
      {
        type: "image",
        src: "/placeholder.svg?height=600&width=1000",
        alt: "Studio Angeli Visions",
        caption: "Dans les coulisses de nos productions musicales",
      },
      {
        type: "paragraph",
        html: "<p>Au programme : <strong>conseils</strong>, <em>interviews</em>, études de cas et découvertes techniques autour de la sonorisation, du mapping vidéo et de la production musicale.</p>",
      },
      {
        type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "Une vidéo inspirante pour commencer",
      },
      {
        type: "embed",
        html: '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/76979871?h=8272103f6e&title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>',
        caption: "Exemple d’embed (Vimeo)",
      },
    ],
  },
  {
    id: "derriere-le-mapping-video",
    slug: "derriere-le-mapping-video",
    title: "Derrière le mapping vidéo: nos méthodes",
    excerpt:
      "Du repérage à la calibration, retour détaillé sur notre workflow de projection mapping lors d’un spectacle en extérieur.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    author: "Studio AV",
    coverImage: "/placeholder.svg?height=500&width=900",
    published: true,
    seo: {
      title: "Derrière le mapping vidéo: nos méthodes",
      description:
        "Repérage, modélisation 3D, calibration et synchronisation: découvrez notre workflow de projection mapping.",
      tags: ["mapping vidéo", "workflow", "projection", "3D"],
      robots: { index: true, follow: true },
      ogType: "article",
      twitterCard: "summary_large_image",
    },
    blocks: [
      {
        type: "paragraph",
        html: "<p>Le mapping démarre bien avant la première projection. Nous commençons par un repérage précis du lieu et une modélisation 3D rapide pour anticiper les contraintes.</p>",
      },
      {
        type: "image",
        src: "/placeholder.svg?height=600&width=1000",
        caption: "Façade patrimoniale, projection d’essai",
      },
      {
        type: "paragraph",
        html: "<p>La calibration et la synchronisation audio/visuelle sont clés. Dans un prochain billet, nous partagerons nos presets techniques.</p>",
      },
    ],
  },
]
