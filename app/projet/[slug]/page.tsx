import { redirect } from "next/navigation"

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return redirect(`/fr/projet/${slug}`)
}
