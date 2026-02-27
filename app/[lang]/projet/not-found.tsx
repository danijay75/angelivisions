"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ProjectNotFound() {
  const params = useParams() as { lang?: string }
  const lang = (params?.lang as string) || "fr"
  const backHref = `/${lang}#realisations`

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Projet introuvable</h1>
        <p className="text-white/70 mb-8">
          Le projet demandé n’existe plus ou l’URL est incorrecte. Vous pouvez retourner aux réalisations.
        </p>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <Link href={backHref} aria-label="Retour aux Réalisations">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux Réalisations
          </Link>
        </Button>
      </div>
    </main>
  )
}
