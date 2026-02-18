"use client"

import React, { type ReactNode } from "react"
import { AuthProvider } from "@/contexts/auth-context"

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
                {children}
            </div>
        </AuthProvider>
    )
}
