"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cookie, Shield, Settings, X } from "lucide-react"

declare global {
  interface Window {
    openCookiePreferences?: () => void
  }
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent")
    if (cookieConsent) {
      try {
        const parsed = JSON.parse(cookieConsent)
        setPreferences({
          necessary: true,
          analytics: !!parsed.analytics,
          marketing: !!parsed.marketing,
          functional: !!parsed.functional,
        })
      } catch (e) {
        // ignore parsing errors
      }
      // Don't show popup automatically if consent exists
      return
    }

    // Show popup after a short delay if not set
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Provide a global method to reopen the cookie preferences overlay anywhere in the app
    window.openCookiePreferences = () => {
      try {
        const saved = localStorage.getItem("cookieConsent")
        if (saved) {
          const parsed = JSON.parse(saved)
          setPreferences({
            necessary: true,
            analytics: !!parsed.analytics,
            marketing: !!parsed.marketing,
            functional: !!parsed.functional,
          })
        }
      } catch (e) {
        // If parsing fails, keep defaults
        console.warn("Unable to parse saved cookie preferences")
      }
      setShowDetails(true)
      setIsVisible(true)
    }

    return () => {
      delete window.openCookiePreferences
    }
  }, [])

  const acceptAll = () => {
    const consentData = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("cookieConsent", JSON.stringify(consentData))
    setIsVisible(false)

    // Here you would typically initialize your analytics, marketing tools, etc.
    console.log("All cookies accepted")
  }

  const rejectAll = () => {
    const consentData = {
      necessary: true, // Necessary cookies cannot be rejected
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("cookieConsent", JSON.stringify(consentData))
    setIsVisible(false)

    console.log("Only necessary cookies accepted")
  }

  const savePreferences = () => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("cookieConsent", JSON.stringify(consentData))
    setIsVisible(false)

    console.log("Custom preferences saved:", preferences)
  }

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === "necessary") return // Cannot disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const cookieCategories = [
    {
      key: "necessary" as const,
      title: "Cookies nécessaires",
      description: "Ces cookies sont essentiels au fonctionnement du site web et ne peuvent pas être désactivés.",
      required: true,
    },
    {
      key: "functional" as const,
      title: "Cookies fonctionnels",
      description: "Ces cookies permettent d'améliorer les fonctionnalités et la personnalisation du site.",
      required: false,
    },
    {
      key: "analytics" as const,
      title: "Cookies analytiques",
      description: "Ces cookies nous aident à comprendre comment les visiteurs interagissent avec le site web.",
      required: false,
    },
    {
      key: "marketing" as const,
      title: "Cookies marketing",
      description: "Ces cookies sont utilisés pour vous proposer des publicités pertinentes.",
      required: false,
    },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => !showDetails && setIsVisible(false)}
          />

          {/* Cookie Consent Popup */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <Card className="bg-white/95 backdrop-blur-md border-slate-200/50 shadow-2xl max-w-4xl mx-auto">
              <CardContent className="p-0">
                {!showDetails ? (
                  // Simple consent view
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Cookie className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Gestion des cookies</h3>
                        <p className="text-slate-600 mb-4">
                          Nous utilisons des cookies pour améliorer votre expérience sur notre site web, analyser le
                          trafic et personnaliser le contenu. Vous pouvez choisir d'accepter tous les cookies ou
                          personnaliser vos préférences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={acceptAll}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                          >
                            Tout accepter
                          </Button>
                          <Button
                            onClick={rejectAll}
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
                          >
                            Tout refuser
                          </Button>
                          <Button
                            onClick={() => setShowDetails(true)}
                            variant="ghost"
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Personnaliser
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Detailed preferences view
                  <div className="max-h-[80vh] overflow-y-auto">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">Préférences des cookies</h3>
                            <p className="text-slate-600 text-sm">Gérez vos préférences de cookies par catégorie</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => setShowDetails(false)}
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Cookie Categories */}
                    <div className="p-6 space-y-6">
                      {cookieCategories.map((category) => (
                        <div key={category.key} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-slate-900">{category.title}</h4>
                            <div className="flex items-center space-x-2">
                              {category.required && (
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Requis</span>
                              )}
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={preferences[category.key]}
                                  onChange={() => togglePreference(category.key)}
                                  disabled={category.required}
                                  className="sr-only peer"
                                />
                                <div
                                  className={`relative w-11 h-6 rounded-full peer transition-colors ${
                                    preferences[category.key]
                                      ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                                      : "bg-slate-200"
                                  } ${category.required ? "opacity-50" : ""}`}
                                >
                                  <div
                                    className={`absolute top-[2px] left-[2px] bg-white border border-slate-300 rounded-full h-5 w-5 transition-transform ${
                                      preferences[category.key] ? "translate-x-5" : "translate-x-0"
                                    }`}
                                  />
                                </div>
                              </label>
                            </div>
                          </div>
                          <p className="text-slate-600 text-sm">{category.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-200 bg-slate-50">
                      <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                          onClick={rejectAll}
                          variant="outline"
                          className="border-slate-300 text-slate-700 hover:bg-white bg-transparent"
                        >
                          Tout refuser
                        </Button>
                        <Button
                          onClick={acceptAll}
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                        >
                          Tout accepter
                        </Button>
                        <Button
                          onClick={savePreferences}
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                        >
                          Enregistrer les préférences
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
