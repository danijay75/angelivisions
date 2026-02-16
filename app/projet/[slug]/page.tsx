import { redirect } from "next/navigation"

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return redirect(`/fr/projet/${params.slug}`)
}
