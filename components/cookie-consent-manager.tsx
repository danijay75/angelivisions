"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Shield, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { useI18n } from "@/components/i18n/i18n-provider"
import Link from "next/link"
import { useLang } from "@/hooks/use-lang"

type CookiePreferences = {
    essential: boolean
    analytics: boolean
    marketing: boolean
}

export default function CookieConsentManager() {
    const { t } = useI18n()
    const lang = useLang()
    const [showBanner, setShowBanner] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true, // Always true and disabled
        analytics: false,
        marketing: false,
    })

    // Initialize consent on mount
    useEffect(() => {
        // Check if consent is already saved
        const savedConsent = localStorage.getItem("cookie_consent")
        if (!savedConsent) {
            // Show banner after a small delay for better UX
            const timer = setTimeout(() => setShowBanner(true), 1000)
            return () => clearTimeout(timer)
        } else {
            // Load saved preferences
            try {
                setPreferences(JSON.parse(savedConsent))
            } catch (e) {
                console.error("Failed to parse cookie consent", e)
            }
        }
    }, [])

    // Expose open function to window
    useEffect(() => {
        window.openCookiePreferences = () => setShowModal(true)

        return () => {
            window.openCookiePreferences = undefined
        }
    }, [])

    const handleAcceptAll = () => {
        const allEnabled = { essential: true, analytics: true, marketing: true }
        setPreferences(allEnabled)
        saveConsent(allEnabled)
        setShowBanner(false)
        setShowModal(false)
    }

    const handleRefuseAll = () => {
        const allDisabled = { essential: true, analytics: false, marketing: false }
        setPreferences(allDisabled)
        saveConsent(allDisabled)
        setShowBanner(false)
        setShowModal(false)
    }

    const handleSavePreferences = () => {
        saveConsent(preferences)
        setShowBanner(false)
        setShowModal(false)
    }

    const saveConsent = (prefs: CookiePreferences) => {
        localStorage.setItem("cookie_consent", JSON.stringify(prefs))
        // Here you would typically initialize or disable scripts based on prefs
        console.log("Cookie preferences saved:", prefs)

        // Example: Trigger GTM or other scripts here
        // if (prefs.analytics) initAnalytics();
    }

    return (
        <>
            {/* Cookie Banner */}
            <AnimatePresence>
                {showBanner && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 z-50 p-4"
                    >
                        <div className="container mx-auto max-w-6xl">
                            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 text-white font-semibold text-lg">
                                        <Shield className="w-5 h-5 text-blue-400" />
                                        <h3>{t("cookieConsent.banner.title") || "Nous respectons votre vie privée"}</h3>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                                        {t("cookieConsent.banner.description") || "Nous utilisons des cookieConsent pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Vous pouvez accepter tous les cookieConsent ou configurer vos préférences."}
                                    </p>
                                    <div className="flex gap-4 text-xs">
                                        <Link href={`/${lang}/politique-cookieConsent`} className="text-blue-400 hover:text-blue-300 underline">
                                            {t("footer.cookieConsent") || "Politique de cookieConsent"}
                                        </Link>
                                        <Link href={`/${lang}/politique-confidentialite`} className="text-blue-400 hover:text-blue-300 underline">
                                            {t("footer.privacy") || "Politique de confidentialité"}
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowModal(true)}
                                        className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
                                    >
                                        {t("cookieConsent.banner.customize") || "Personnaliser"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={handleRefuseAll}
                                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                                    >
                                        {t("cookieConsent.banner.reject") || "Tout refuser"}
                                    </Button>
                                    <Button
                                        onClick={handleAcceptAll}
                                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                                    >
                                        {t("cookieConsent.banner.accept") || "Tout accepter"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preferences Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Shield className="w-6 h-6 text-blue-400" />
                            {t("cookieConsent.modal.title") || "Préférences de cookieConsent"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {t("cookieConsent.modal.description") || "Gérez vos préférences de consentement pour les cookieConsent utilisée sur ce site."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Essential */}
                        <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                            <div className="space-y-1">
                                <h4 className="font-semibold text-white">{t("cookieConsent.modal.essential.title") || "Nécessaires"}</h4>
                                <p className="text-sm text-slate-400">{t("cookieConsent.modal.essential.desc") || "Ces cookieConsent sont indispensables au bon fonctionnement du site."}</p>
                            </div>
                            <Switch checked={true} disabled />
                        </div>

                        {/* Analytics */}
                        <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                            <div className="space-y-1">
                                <h4 className="font-semibold text-white">{t("cookieConsent.modal.analytics.title") || "Analytiques"}</h4>
                                <p className="text-sm text-slate-400">{t("cookieConsent.modal.analytics.desc") || "Nous aident à comprendre comment vous utilisez le site."}</p>
                            </div>
                            <Switch
                                checked={preferences.analytics}
                                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
                            />
                        </div>

                        {/* Marketing */}
                        <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                            <div className="space-y-1">
                                <h4 className="font-semibold text-white">{t("cookieConsent.modal.marketing.title") || "Marketing"}</h4>
                                <p className="text-sm text-slate-400">{t("cookieConsent.modal.marketing.desc") || "Permettent de vous proposer des contenus adaptés à vos intérêts."}</p>
                            </div>
                            <Switch
                                checked={preferences.marketing}
                                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={handleRefuseAll}
                            className="text-slate-400 hover:text-white mr-auto"
                        >
                            {t("cookies.banner.reject") || "Tout refuser"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowModal(false)}
                            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
                        >
                            {t("common.cancel") || "Annuler"}
                        </Button>
                        <Button
                            onClick={handleSavePreferences}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {t("common.save") || "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

// Add global type for valid window object usage
declare global {
    interface Window {
        openCookiePreferences?: () => void
    }
}
