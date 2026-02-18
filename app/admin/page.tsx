"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Layers,
  FolderKanban,
  TrendingUp,
  Users as UsersIcon,
  Music4,
  Newspaper,
  Mail,
  UserCog,
  RefreshCw
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// On importe les managers mais on ne les affichera que si le test de structure passe
import ServicesManager from "@/components/admin/services-manager"
import UsersManager from "@/components/admin/users-manager"
// Les autres seront rajoutés au fur et à mesure

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [section, setSection] = useState("services")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-8">
        <RefreshCw className="w-10 h-10 animate-spin text-purple-500 mb-4" />
        <p className="text-xl font-light tracking-widest">CHARGEMENT DU SYSTÈME...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation des Sections */}
        <Card className="bg-white/5 border-white/10 mb-8 overflow-hidden backdrop-blur-md">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-center text-white/50">
              Tableau de bord de gestion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: "services", label: "Services", icon: Layers },
                { id: "projects", label: "Projets", icon: FolderKanban },
                { id: "blog", label: "Blog", icon: Newspaper },
                { id: "users", label: "Utilisateurs", icon: UserCog },
                { id: "newsletter", label: "Newsletter", icon: Mail },
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={section === item.id ? "default" : "outline"}
                  className={`transition-all duration-300 ${section === item.id
                      ? "bg-purple-600 hover:bg-purple-700 text-white scale-105 shadow-lg shadow-purple-500/20"
                      : "border-white/10 text-white/70 hover:bg-white/10 hover:text-white bg-transparent"
                    }`}
                  onClick={() => setSection(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zone de Contenu */}
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {section === "services" && (
              <div className="space-y-4">
                <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg text-center font-medium">
                  Test de stabilité : Gestionnaire de Services
                </div>
                <ServicesManager />
              </div>
            )}

            {section === "users" && (
              <UsersManager />
            )}

            {["projects", "blog", "newsletter"].includes(section) && (
              <div className="p-20 text-center bg-white/5 rounded-2xl border border-white/10 border-dashed">
                <p className="text-white/40 italic">La section {String(section)} est temporairement en maintenance pour diagnostic...</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
