"use client"

import React, { type ReactNode } from "react"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

function AdminTopbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.replace("/admin/login")
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-slate-900 p-4 flex justify-between items-center h-16 text-white shadow-xl">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center font-bold">AV</div>
        <span className="font-bold tracking-widest text-sm">ADMINISTRATION</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/60">Connecté en tant que</span>
          <span className="text-sm font-medium">{String(user?.email || "Admin")}</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white/10 hover:bg-red-600 hover:text-white transition-colors border border-white/20 px-4 py-2 rounded text-xs font-bold"
        >
          DÉCONNEXION
        </button>
      </div>
    </header>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-black">
        <AdminTopbar />
        <main>{children}</main>
      </div>
    </AuthProvider>
  )
}
