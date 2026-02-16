"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type Role = "admin" | "editor" | "guest"

export type AuthUser = {
  email: string
  role: Role
  name?: string
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  isAdmin: boolean
  isEditor: boolean
  isGuest: boolean
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>
  logout: () => Promise<void>
  refresh: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const LS_KEY = "av_user"

function readLocalUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const u = JSON.parse(raw) as AuthUser
    if (!u?.email || !u?.role) return null
    if (u.role !== "admin" && u.role !== "editor" && u.role !== "guest") return null
    return u
  } catch {
    return null
  }
}

function writeLocalUser(user: AuthUser | null) {
  try {
    if (!user) {
      localStorage.removeItem(LS_KEY)
    } else {
      localStorage.setItem(LS_KEY, JSON.stringify(user))
    }
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Initial load from localStorage
  useEffect(() => {
    setLoading(true)
    const u = readLocalUser()
    setUser(u)
    setLoading(false)
  }, [])

  const isAdmin = user?.role === "admin"
  const isEditor = user?.role === "editor"
  const isGuest = user?.role === "guest"

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/users/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        return { ok: false as const, error: data?.error || "Identifiants invalides" }
      }
      const nextUser: AuthUser = {
        email: data?.user?.email,
        role: data?.user?.role,
        name: data?.user?.name,
      }
      writeLocalUser(nextUser)
      setUser(nextUser)
      return { ok: true as const }
    } catch (e: any) {
      return { ok: false as const, error: e?.message || "Erreur de connexion" }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      await fetch("/api/admin/users/auth", { method: "DELETE" })
    } catch {
      // ignore
    } finally {
      writeLocalUser(null)
      setUser(null)
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    const u = readLocalUser()
    setUser(u)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, isAdmin, isEditor, isGuest, login, logout, refresh }),
    [user, loading, isAdmin, isEditor, isGuest, login, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
