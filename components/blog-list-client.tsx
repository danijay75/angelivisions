"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BLOG_STORAGE_KEY, defaultPosts, type BlogPost } from "@/data/blog"
import { Badge } from "@/components/ui/badge"
import { useLang } from "@/hooks/use-lang"

function mergePosts(defaults: BlogPost[], stored?: BlogPost[]): BlogPost[] {
  if (!stored || !Array.isArray(stored)) return defaults
  const map = new Map<string, BlogPost>()
  for (const p of defaults) map.set(p.id, p)
  for (const p of stored) map.set(p.id, p)
  return Array.from(map.values())
}

export default function BlogListClient() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts)
  const lang = useLang()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BLOG_STORAGE_KEY)
      if (raw) {
        const json = JSON.parse(raw) as BlogPost[]
        if (Array.isArray(json)) {
          setPosts(mergePosts(defaultPosts, json))
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const visible = useMemo(
    () => posts.filter((p) => p.published !== false).sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [posts],
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-white text-3xl md:text-4xl font-bold mb-6">eSide Culture</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {visible.map((p) => (
          <Link
            key={p.id}
            href={`/${lang}/eside-culture-blog/${p.slug}`}
            className="group rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors bg-white/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.coverImage || "/placeholder.svg?height=400&width=800&query=cover"}
              alt={p.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <div className="text-xs text-white/60 mb-2 flex items-center gap-2">
                <span>{new Date(p.date).toLocaleDateString("fr-FR")}</span>
                {p.author ? <span>• {p.author}</span> : null}
              </div>
              <h2 className="text-white text-xl font-semibold mb-1 group-hover:underline">{p.title}</h2>
              {p.excerpt ? <p className="text-white/70 text-sm line-clamp-3">{p.excerpt}</p> : null}
              {p.seo?.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.seo.tags.slice(0, 4).map((t) => (
                    <Badge key={t} className="bg-white/10 text-white border-white/20">
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
