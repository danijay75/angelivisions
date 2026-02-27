"use client"

import { BlogListClient } from "@/components/blog-list-client"

export default function BlogIndexClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
      <BlogListClient />
    </div>
  )
}
