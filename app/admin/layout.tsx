"use client"

import React, { type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, LogOut, MoreVertical, Users, ExternalLink, AlertTriangle } from "lucide-react"

class AdminErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("[PANIC] Admin Error Boundary caught:", error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-red-900/20 border border-red-500/50 rounded-2xl p-8 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold">Erreur de rendu</h1>
            </div>
            <p className="text-red-200 mb-4 font-medium">{String(this.state.error?.message || "Erreur inconnue")}</p>
            <pre className="bg-black/40 p-4 rounded-lg text-xs font-mono text-red-300/80 overflow-auto max-h-64 mb-6 border border-white/5">
              {String(this.state.error?.stack || "")}
            </pre>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white w-full"
              onClick={() => window.location.reload()}
            >
              Forcer le rechargement
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function AdminTopbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  console.log("[DEBUG] AdminTopbar user:", user)

  async function handleLogout() {
    console.log("[DEBUG] Logging out...")
    await logout()
    router.replace("/admin/login")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4">
        <Link href="/admin" className="font-semibold whitespace-nowrap">
          {"Admin"}
        </Link>

        <Separator orientation="vertical" className="mx-2 hidden h-6 sm:block" />

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-2">
          {/* Desktop: full buttons */}
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="secondary" className="gap-2" asChild aria-label="Voir le site" title="Voir le site">
              {/* Default to FR as langue par défaut */}
              <Link href="/fr" target="_blank" rel="noreferrer">
                <Globe className="h-4 w-4" />
                <span className="whitespace-nowrap">{"Voir le site"}</span>
                <ExternalLink className="ml-1 h-3.5 w-3.5 opacity-70" />
              </Link>
            </Button>

            {/* Always visible to allow initial bootstrap access */}
            <Button
              variant={pathname?.startsWith("/admin/users") ? "default" : "secondary"}
              className="gap-2"
              aria-label="Gérer les utilisateurs"
              asChild
            >
              <Link href="/admin/users">
                <Users className="h-4 w-4" />
                <span className="whitespace-nowrap">{"Utilisateurs"}</span>
              </Link>
            </Button>

            {user?.role && (
              <Badge variant="outline" className="uppercase">
                {String(user.role)}
              </Badge>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile: collapsed menu */}
          <div className="flex items-center md:hidden">
            {user?.role && (
              <Badge variant="outline" className="uppercase mr-1">
                {String(user.role)}
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Ouvrir le menu admin">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/fr" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{"Voir le site"}</span>
                    <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-70" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{"Utilisateurs"}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{"Déconnexion"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminErrorBoundary>
        <div className="min-h-screen flex flex-col bg-white">
          <AdminTopbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
        </div>
      </AdminErrorBoundary>
    </AuthProvider>
  )
}
