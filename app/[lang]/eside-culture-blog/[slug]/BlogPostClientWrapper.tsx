"use client"

import dynamic from "next/dynamic"

// Create a client-only dynamic import for the blog post client component.
// Typing the props ensures TS knows we forward { slug }.
const BlogPostClient = dynamic<{ slug: string }>(() => import("@/components/blog-post-client"), { ssr: false })

export default function BlogPostClientWrapper({ slug }: { slug: string }) {
  return <BlogPostClient slug={slug} />
}
