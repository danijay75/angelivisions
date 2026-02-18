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
    <header className="border-b bg-white p-4 flex justify-between items-center text-black">
      <div className="font-bold">ADMIN PANEL</div>
      <div className="flex items-center gap-4">
        <span>{String(user?.email || "Connecté")}</span>
        <button
          onClick={handleLogout}
          style={{ backgroundColor: 'red', color: 'white', padding: '4px 8px', borderRadius: '4px' }}
        >
          Déconnexion
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
