"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BLOG_STORAGE_KEY, defaultPosts, type BlogPost } from "@/data/blog"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/components/i18n/i18n-provider"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

function mergePosts(defaults: BlogPost[], stored?: BlogPost[]): BlogPost[] {
  if (!stored || !Array.isArray(stored)) return defaults
  const map = new Map<string, BlogPost>()
  for (const p of defaults) map.set(p.id, p)
  for (const p of stored) map.set(p.id, p)
  return Array.from(map.values())
}

export default function BlogListClient() {
  const { t, lang } = useI18n()
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts)
  const [isLoaded, setIsLoaded] = useState(false)

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
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const visible = useMemo(
    () => posts.filter((p) => p.published !== false).sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [posts],
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-white text-3xl md:text-4xl font-bold mb-6">{t("blog.title")}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {!isLoaded ? (
          Array.from({ length: 4 }).map((_, i) => <BlogSkeleton key={i} />)
        ) : (
          visible.map((p) => (
            <Link
              key={p.id}
              href={`/${lang}/eside-culture-blog/${p.slug}`}
              className="group rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors bg-white/5"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={p.coverImage || "/placeholder.svg?height=400&width=800&query=cover"}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
              </div>
              <div className="p-4">
                <div className="text-xs text-white/60 mb-2 flex items-center gap-2">
                  <span>{new Date(p.date).toLocaleDateString(t("blog.dateLocale"))}</span>
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
          ))
        )}
      </div>
    </div>
  )
}

function BlogSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 h-full">
      <Skeleton className="w-full h-48 bg-white/10" />
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-3 w-20 bg-white/5" />
          <Skeleton className="h-3 w-20 bg-white/5" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2 bg-white/10" />
        <Skeleton className="h-4 w-full mb-1 bg-white/5" />
        <Skeleton className="h-4 w-5/6 bg-white/5" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-5 w-12 rounded-full bg-white/10" />
          <Skeleton className="h-5 w-12 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  )
}
