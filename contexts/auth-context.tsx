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

const LS_KEY = "av_user_v2"

function readLocalUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const u = JSON.parse(raw)
    // Strict type check to prevent React crash
    if (typeof u?.email !== "string" || typeof u?.role !== "string") return null
    if (u.role !== "admin" && u.role !== "editor" && u.role !== "guest") return null
    return u as AuthUser
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

  // Initial load from session API
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session")
      const data = await res.json()
      console.log("[DEBUG] AuthContext raw session data:", data)
      if (res.ok && data.authenticated && data.user) {
        // Ensure strictly strings to prevent "Object invalid as React child" crashes
        const safeRole =
          typeof data.user.role === "string" && ["admin", "editor", "guest"].includes(data.user.role)
            ? (data.user.role as Role)
            : "guest"

        const nextUser: AuthUser = {
          email: typeof data.user.email === "string" ? data.user.email : "",
          role: safeRole,
          name: typeof data.user.name === "string" ? data.user.name : "",
        }
        setUser(nextUser)
        writeLocalUser(nextUser)
      } else {
        setUser(null)
        writeLocalUser(null)
      }
    } catch (e) {
      console.error("Refresh error:", e)
      const u = readLocalUser()
      setUser(u)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const isAdmin = user?.role === "admin"
  const isEditor = user?.role === "editor"
  const isGuest = user?.role === "guest"

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        return { ok: false as const, error: data?.message || "Identifiants invalides" }
      }
      // Trigger a refresh to get the user info from the session
      await refresh()
      return { ok: true as const }
    } catch (e: any) {
      return { ok: false as const, error: e?.message || "Erreur de connexion" }
    } finally {
      setLoading(false)
    }
  }, [refresh])

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // ignore
    } finally {
      writeLocalUser(null)
      setUser(null)
      setLoading(false)
    }
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
