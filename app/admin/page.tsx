"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AdminSidebar, type AdminSection } from "@/components/admin/sidebar"
import { RefreshCw } from "lucide-react"

// Import components safely
import ServicesManager from "@/components/admin/services-manager"
import UsersManager from "@/components/admin/users-manager"
import CategoryManager from "@/components/admin/category-manager"
// We will need to re-import Projects and others later

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [section, setSection] = useState<AdminSection>("services")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-10 h-10 animate-spin text-purple-500 mb-4" />
        <p className="text-xl font-light tracking-widest text-white/50">CHARGEMENT...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar Navigation */}
      <AdminSidebar currentSection={section} onSectionChange={(s) => setSection(s as AdminSection)} />

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              {section === "services" && "Services"}
              {section === "projects" && "Projets & Réalisations"}
              {section === "investment" && "Investissement"}
              {section === "team" && "Équipe"}
              {section === "player" && "Lecteur Audio"}
              {section === "blog" && "Blog & Actualités"}
              {section === "newsletter" && "Newsletter"}
              {section === "users" && "Gestion Utilisateurs"}
            </h1>
            <p className="text-white/40 mt-1 text-sm">
              Gestion de contenu et administration
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-7xl"
          >
            {/* SERVICES MANAGER (Safe) */}
            {section === "services" && (
              <ServicesManager />
            )}

            {/* USERS MANAGER (Safe) */}
            {section === "users" && (
              <UsersManager />
            )}

            {/* PLACEHOLDERS FOR OTHER SECTIONS (Safe) */}
            {["projects", "blog", "newsletter", "team", "player", "investment"].includes(section) && (
              <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <RefreshCw className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-xl font-semibold text-white/80 mb-2">Section en migration</h3>
                <p className="text-white/40 text-center max-w-md">
                  Nous migrons les composants vers la nouvelle architecture sécurisée.
                  Cette section sera bientôt disponible.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
