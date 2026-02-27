import { redirect } from "next/navigation"

export default async function LegacyBlogPostRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/fr/eside-culture-blog/${slug}`)
}
