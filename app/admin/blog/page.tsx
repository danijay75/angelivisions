"use client"
import BlogManager from "@/components/admin/blog-manager"

export default function AdminBlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <h1 className="text-white text-2xl font-bold mb-6">Blog (eSide Culture)</h1>
      <BlogManager />
    </div>
  )
}
