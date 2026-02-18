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

  async function handleLogout() {
    await logout()
    router.replace("/admin/login")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white p-4 flex justify-between items-center h-14">
      <div className="font-bold">ADMIN</div>
      <div className="flex items-center gap-4 text-sm">
        <span>{String(user?.email || "Connecté")}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Sortir
        </button>
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
