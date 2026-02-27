"use client"

import { useEffect, useMemo, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { BLOG_STORAGE_KEY, defaultPosts, type BlogPost } from "@/data/blog"
import { BlogRenderer } from "@/components/blog-renderer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/i18n-provider"

function mergePosts(defaults: BlogPost[], stored?: BlogPost[]): BlogPost[] {
  if (!stored || !Array.isArray(stored)) return defaults
  const map = new Map<string, BlogPost>()
  for (const p of defaults) map.set(p.id, p)
  for (const p of stored) map.set(p.id, p)
  return Array.from(map.values())
}

function getReadingStats(post: BlogPost) {
  const text = post.blocks
    .filter((b) => b.type === "paragraph")
    .map((b: any) => (b.html || "").replace(/<[^>]+>/g, " "))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
  const words = text ? text.split(" ").length : 0
  const minutes = Math.max(1, Math.round(words / 200))
  return { words, minutes }
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const { t, lang } = useI18n()
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts)

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

  const post = useMemo(() => posts.find((p) => p.slug === slug), [posts, slug])

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-white">
        <p>{t("blog.notFound")}</p>
        <Button asChild className="mt-4">
          <Link href={`/${lang}/eside-culture-blog`}>{t("blog.backToBlog")}</Link>
        </Button>
      </div>
    )
  }

  const seoTitle = post.seo?.title || post.title
  const description = post.seo?.description || post.excerpt || ""
  const ogImage = post.seo?.ogImage || post.coverImage || "/placeholder.svg?height=630&width=1200"
  const robots = post.seo?.robots
    ? `${post.seo.robots.index ? "index" : "noindex"}, ${post.seo.robots.follow ? "follow" : "nofollow"}`
    : undefined
  const url =
    typeof window !== "undefined" ? window.location.href : `https://angelivisions.com/${lang}/eside-culture-blog/${post.slug}`
  const tags = post.seo?.tags || []
  const { minutes } = getReadingStats(post)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: seoTitle,
    description,
    author: post.author ? [{ "@type": "Person", name: post.author }] : undefined,
    datePublished: post.date,
    image: ogImage,
    mainEntityOfPage: url,
  }

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        {description ? <meta name="description" content={description} /> : null}
        {robots ? <meta name="robots" content={robots} /> : null}
        {post.seo?.canonicalUrl ? <link rel="canonical" href={post.seo.canonicalUrl} /> : null}
        <meta property="og:title" content={seoTitle} />
        {description ? <meta property="og:description" content={description} /> : null}
        <meta property="og:type" content={post.seo?.ogType || "article"} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content={post.seo?.twitterCard || "summary_large_image"} />
        <meta name="twitter:title" content={seoTitle} />
        {description ? <meta name="twitter:description" content={description} /> : null}
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-10 text-white">
        <nav className="text-sm text-white/60 mb-6">
          <Link href={`/${lang}`} className="hover:text-white/90">
            {t("nav.accueil")}
          </Link>
          {" / "}
          <Link href={`/${lang}/eside-culture-blog`} className="hover:text-white/90">
            {t("blog.title")}
          </Link>
        </nav>

        {post.coverImage ? (
          <div className="rounded-xl overflow-hidden border border-white/10 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage || "/placeholder.svg"} alt={post.title} className="w-full h-auto object-cover" />
          </div>
        ) : null}

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-white/70 mb-6">
          <span>{new Date(post.date).toLocaleDateString(t("blog.dateLocale"))}</span>
          {post.author ? <span>• {post.author}</span> : null}
          <span>• {t("blog.readingTime", { min: minutes })}</span>
          {tags.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge key={t} className="bg-white/10 text-white border-white/20">
                  {t}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <BlogRenderer blocks={post.blocks} />
      </div>
    </>
  )
}
