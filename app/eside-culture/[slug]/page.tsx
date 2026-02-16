import { redirect } from "next/navigation"

export default function OldBlogPostRedirect({ params }: { params: { slug: string } }) {
  redirect(`/eside-culture-blog/${params.slug}`)
  return null
}
