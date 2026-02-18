"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, authLoading, router])

  if (authLoading) return <div className="p-8">Chargement...</div>
  if (!user) return null

  return (
    <div className="p-8 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">DIAGNOSTIC EN COURS</h1>
      <p>Utilisateur : {String(user?.email || "Inconnu")}</p>
      <p>Rôle : {String(user?.role || "Aucun")}</p>
      <hr className="my-4" />
      <div className="bg-gray-100 p-4 rounded shadow">
        Si vous voyez ce message, le problème vient des composants graphiques (icônes, boutons, cartes) que nous avons désactivés pour ce test.
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Actualiser
      </button>
    </div>
  )
}
