"use client"

import dynamic from "next/dynamic"

// Move the dynamic import with ssr: false into this Client Component
const BlogListClient = dynamic(() => import("@/components/blog-list-client"), {
  ssr: false,
  loading: () => (
    <div className="w-full py-12 text-center text-sm text-muted-foreground">{"Chargement du blog..."}</div>
  ),
})

export default function BlogIndexClient() {
  return <BlogListClient />
}
