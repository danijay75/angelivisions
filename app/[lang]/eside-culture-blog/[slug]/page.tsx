import BlogPostClientWrapper from "./BlogPostClientWrapper"

export default function BlogPostPage({
  params,
}: {
  params: { lang: "fr" | "en" | "es"; slug: string }
}) {
  const { slug } = params
  return <BlogPostClientWrapper slug={slug} />
}
