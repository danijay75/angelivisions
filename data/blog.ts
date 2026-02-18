export const BLOG_STORAGE_KEY = "AV_BLOG_V1"

export interface BlogSEO {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: "article" | "website" | "video.other"
  twitterCard?: "summary" | "summary_large_image"
  robots?: {
    index: boolean
    follow: boolean
  }
  tags?: string[]
}

export type BlogBlock =
  | { type: "paragraph"; html: string }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "video"; url: string; caption?: string }
  | { type: "embed"; html: string; caption?: string }

export interface BlogPost {
  id: string
  slug: string
  title: string
  // Date ISO string
  date: string
  author?: string
  excerpt?: string
  coverImage?: string
  // If false, it's a draft
  published?: boolean
  blocks: BlogBlock[]
  seo?: BlogSEO
}

export const defaultPosts: BlogPost[] = [
  {
    id: "lancement-agence",
    slug: "lancement-agence",
    title: "Lancement d'Angeli Visions",
    date: new Date().toISOString(),
    author: "Danilo Angeli",
    excerpt: "Nous sommes fiers d'annoncer officiellement le lancement de notre agence...",
    published: true,
    blocks: [
      {
        type: "paragraph",
        html: "<p>Bienvenue sur le blog d'Angeli Visions. Nous sommes une agence dédiée à l'excellence...</p>",
      },
    ],
    seo: {
      tags: ["Lancement", "Agence"],
    },
  },
]
