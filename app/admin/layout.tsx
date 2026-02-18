"use client"

import React, { type ReactNode } from "react"
import { AuthProvider } from "@/contexts/auth-context"

// AdminSidebar is handled inside the page content or we can hoist it here if we change architecture.
// For now, let's keep Layout as a clean provider shell and let the Page handle the sidebar composition 
// OR better yet, let's make the Layout provide the shell.

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
        {children}
      </div>
    </AuthProvider>
  )
}
