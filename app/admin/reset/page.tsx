"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import HCaptcha from "react-hcaptcha"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { hcaptchaSiteKey, captchaBypass } from "@/lib/public-config"

const SITEKEY = hcaptchaSiteKey

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const token = params.get("token") || ""
  const [password, setPassword] = useState("")
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const captchaRef = useRef<HCaptcha>(null)

  const hcaptchaEnabled = !captchaBypass && !!SITEKEY

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    if (hcaptchaEnabled && !captchaToken) return setMessage("Veuillez compléter le captcha.")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, captchaToken }),
      })
      const j = await res.json()
      if (!res.ok || !j.success) {
        setMessage(j.message || "Impossible de réinitialiser le mot de passe.")
        if (hcaptchaEnabled) {
          captchaRef.current?.resetCaptcha()
          setCaptchaToken(null)
        }
        return
      }
      setDone(true)
      setMessage("Mot de passe mis à jour. Vous pouvez vous connecter.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-white/5 backdrop-blur-md border-white/10 w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-2xl">Réinitialisation du mot de passe</CardTitle>
          <p className="text-slate-300 text-sm">Choisissez un nouveau mot de passe</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div
              className={`${done ? "bg-green-500/20 border-green-500/50 text-green-100" : "bg-red-500/20 border-red-500/50 text-red-200"} border p-3 rounded-lg`}
            >
              {message}
            </div>
          )}

          {!hcaptchaEnabled ? (
            <div className="bg-green-500/20 border border-green-500/50 text-green-100 p-3 rounded-lg text-sm">
              hCaptcha bypass activé: le captcha n’est pas requis pour cette action.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Nouveau mot de passe</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            {hcaptchaEnabled && (
              <div className="bg-white/10 p-3 rounded-md border border-white/20">
                <HCaptcha
                  sitekey={SITEKEY as string}
                  onVerify={(t) => setCaptchaToken(t)}
                  ref={captchaRef}
                  theme="dark"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || done}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
          <div className="text-center">
            <a href="/admin/login" className="text-purple-300 hover:text-purple-200 text-sm">
              Retour à la connexion
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
