import { redirect } from "next/navigation"

export default function LegacyBlogPostRedirect({ params }: { params: { slug: string } }) {
  redirect(`/fr/eside-culture-blog/${params.slug}`)
}
