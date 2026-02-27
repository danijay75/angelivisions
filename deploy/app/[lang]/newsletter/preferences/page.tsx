
"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useI18n } from "@/components/i18n/i18n-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

function PreferencesContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const router = useRouter()
    const { t } = useI18n()

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const [subscriber, setSubscriber] = useState<{ name: string; email: string } | null>(null)
    const [name, setName] = useState("")

    useEffect(() => {
        if (!token) {
            setError(t("newsletter.preferences.messages.error"))
            setIsLoading(false)
            return
        }

        const fetchSubscriber = async () => {
            try {
                const res = await fetch(`/api/newsletter/preferences?token=${token}`)
                if (!res.ok) {
                    throw new Error("Failed to fetch")
                }
                const data = await res.json()
                setSubscriber(data)
                setName(data.name)
            } catch (err) {
                setError(t("newsletter.preferences.messages.error"))
            } finally {
                setIsLoading(false)
            }
        }

        fetchSubscriber()
    }, [token, t])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const res = await fetch("/api/newsletter/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, action: "update", name }),
            })

            if (!res.ok) throw new Error()

            setSuccessMessage(t("newsletter.preferences.messages.saveSuccess"))
        } catch (err) {
            setError(t("newsletter.preferences.messages.error"))
        } finally {
            setIsSaving(false)
        }
    }

    const handleUnsubscribe = async () => {
        if (!confirm(t("newsletter.preferences.form.unsubscribe") + "?")) return

        setIsSaving(true)
        setError(null)

        try {
            const res = await fetch("/api/newsletter/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, action: "unsubscribe" }),
            })

            if (!res.ok) throw new Error()

            setSuccessMessage(t("newsletter.preferences.messages.unsubscribeSuccess"))
            setSubscriber(null) // Clear form
        } catch (err) {
            setError(t("newsletter.preferences.messages.error"))
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center py-20 px-4">
                <Card className="w-full max-w-md bg-slate-900 border-slate-800">
                    <CardContent className="pt-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-slate-200">{error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!subscriber && successMessage) {
        return (
            <div className="flex justify-center py-20 px-4">
                <Card className="w-full max-w-md bg-slate-900 border-slate-800">
                    <CardContent className="pt-6 text-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <p className="text-slate-200">{successMessage}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto"
            >
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white text-xl">{t("newsletter.preferences.title")}</CardTitle>
                        <CardDescription className="text-slate-400">
                            {t("newsletter.preferences.description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {successMessage && (
                            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-md flex items-center text-green-400 text-sm">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">{t("newsletter.preferences.form.email")}</label>
                                <Input
                                    value={subscriber?.email || ""}
                                    disabled
                                    className="bg-slate-950 border-slate-800 text-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">{t("newsletter.preferences.form.name")}</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Prénom NOM"
                                    className="bg-slate-950 border-slate-800 text-white focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t("newsletter.preferences.form.save")}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleUnsubscribe}
                                    disabled={isSaving}
                                    className="w-full border-red-900/50 text-red-400 hover:bg-red-950 hover:text-red-300 hover:border-red-800"
                                >
                                    {t("newsletter.preferences.form.unsubscribe")}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

export default function PreferencesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950 pt-24"><div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div></div>}>
            <main className="min-h-screen bg-slate-950 pt-24">
                <PreferencesContent />
            </main>
        </Suspense>
    )
}
