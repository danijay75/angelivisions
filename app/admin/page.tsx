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
import ProjectsManager from "@/components/admin/projects-manager"
import BlogManager from "@/components/admin/blog-manager"
import InvestmentManager from "@/components/admin/investment-manager"
import TeamManager from "@/components/admin/team-manager"
import AudioManager from "@/components/admin/audio-manager"
import NewsletterManager from "@/components/admin/newsletter-manager"
import DevisManager from "@/components/admin/devis-manager"
import ArtistsManager from "@/components/admin/artists-manager"

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
              {section === "devis" && "Devis"}
              {section === "artists" && "Gestion des Artistes"}
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

            {/* PROJECTS MANAGER (Safe) */}
            {section === "projects" && (
              <ProjectsManager />
            )}

            {/* ARTISTS MANAGER (Safe) */}
            {section === "artists" && (
              <ArtistsManager />
            )}

            {/* BLOG MANAGER (Safe) */}
            {section === "blog" && (
              <BlogManager />
            )}

            {/* USERS MANAGER (Safe) */}
            {section === "users" && (
              <UsersManager />
            )}

            {/* INVESTMENT MANAGER (Safe) */}
            {section === "investment" && (
              <InvestmentManager />
            )}

            {/* TEAM MANAGER (Safe) */}
            {section === "team" && (
              <TeamManager />
            )}

            {/* AUDIO MANAGER (Safe) */}
            {section === "player" && (
              <AudioManager />
            )}

            {/* NEWSLETTER MANAGER (Safe) */}
            {section === "newsletter" && (
              <NewsletterManager />
            )}

            {/* DEVIS MANAGER (Safe) */}
            {section === "devis" && (
              <DevisManager />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
