import { use } from "react"
import type { Metadata } from "next"
import BlogPostClientWrapper from "./BlogPostClientWrapper"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: "fr" | "en" | "es"; slug: string }>
}) {
  const { slug } = use(params)
  return <BlogPostClientWrapper slug={slug} />
}
