"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import HCaptcha from "react-hcaptcha"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { hcaptchaSiteKey, captchaBypass } from "@/lib/public-config"

const SITEKEY = hcaptchaSiteKey

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const nextUrl = params.get("next") || "/admin"
  const [exists, setExists] = useState<boolean | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const captchaRef = useRef<HCaptcha>(null)

  useEffect(() => {
    // Bypass total: on envoie l'utilisateur directement au tableau de bord
    if (captchaBypass) {
      router.replace(nextUrl || "/admin")
    }
  }, [router, nextUrl])

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((j) => setExists(j.exists))
      .catch(() => setExists(true))
  }, [])

  const onCaptchaVerify = (token: string) => setCaptchaToken(token)
  const resetCaptcha = () => captchaRef.current?.resetCaptcha()

  const hcaptchaEnabled = !captchaBypass && !!SITEKEY

  async function handleInit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (hcaptchaEnabled && !captchaToken) return setMessage("Veuillez compléter le captcha.")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      })
      const j = await res.json()
      if (!res.ok || !j.success) {
        setMessage(j.message || "Erreur lors de la création.")
        if (hcaptchaEnabled) {
          resetCaptcha()
          setCaptchaToken(null)
        }
        return
      }
      setMessage("Compte créé. Vous pouvez vous connecter.")
      setExists(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (hcaptchaEnabled && !captchaToken) return setMessage("Veuillez compléter le captcha.")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      })
      const j = await res.json()
      if (!res.ok || !j.success) {
        setMessage(j.message || "Identifiants invalides.")
        if (hcaptchaEnabled) {
          resetCaptcha()
          setCaptchaToken(null)
        }
        return
      }
      router.replace(nextUrl)
    } finally {
      setLoading(false)
    }
  }

  if (captchaBypass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white/90">Bypass admin actif — redirection vers le tableau de bord…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-white/5 backdrop-blur-md border-white/10 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/images/angeli-visions-logo-white.png"
              alt="Angeli Visions"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                const el = e.target as HTMLImageElement
                el.src = "/placeholder.svg?height=64&width=200"
              }}
            />
          </div>
          <CardTitle className="text-white text-2xl">
            {exists === false ? "Première utilisation" : "Connexion Admin"}
          </CardTitle>
          <p className="text-slate-300 text-sm">
            {exists === false ? "Créez le premier compte administrateur" : "Connectez-vous pour accéder au back office"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg">{message}</div>
          )}

          {!hcaptchaEnabled ? (
            <div className="bg-green-500/20 border border-green-500/50 text-green-100 p-3 rounded-lg text-sm">
              hCaptcha bypass activé: le captcha n’est pas requis pour se connecter.
            </div>
          ) : null}

          <form onSubmit={exists === false ? handleInit : handleLogin} className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="contact@angelivisions.com"
                required
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">Mot de passe</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {hcaptchaEnabled && (
              <div className="bg-white/10 p-3 rounded-md border border-white/20">
                <HCaptcha sitekey={SITEKEY as string} onVerify={onCaptchaVerify} ref={captchaRef} theme="dark" />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {exists === false
                ? loading
                  ? "Création..."
                  : "Créer le compte admin"
                : loading
                  ? "Connexion..."
                  : "Se connecter"}
            </Button>
          </form>

          {exists && (
            <div className="text-center">
              <a href="/admin/forgot" className="text-purple-300 hover:text-purple-200 text-sm">
                Mot de passe oublié ?
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
