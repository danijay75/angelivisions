import { redirect } from "next/navigation"

export default async function OldBlogPostRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/eside-culture-blog/${slug}`)
  return null
}
