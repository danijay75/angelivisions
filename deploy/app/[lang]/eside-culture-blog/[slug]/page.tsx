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
  params: { lang: "fr" | "en" | "es"; slug: string }
}) {
  const { slug } = params
  return <BlogPostClientWrapper slug={slug} />
}
