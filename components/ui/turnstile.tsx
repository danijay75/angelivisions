"use client"

import { useEffect, useRef, useState } from "react"
import { turnstileSiteKey } from "@/lib/public-config"

interface TurnstileProps {
    onVerify: (token: string) => void
    onError?: (error?: any) => void
    onExpire?: () => void
    theme?: "light" | "dark" | "auto"
}

declare global {
    interface Window {
        onloadTurnstileCallback: () => void
        turnstile: {
            render: (
                container: string | HTMLElement,
                options: {
                    sitekey: string
                    callback: (token: string) => void
                    "error-callback"?: (error?: any) => void
                    "expired-callback"?: () => void
                    theme?: string
                    size?: "normal" | "flexible" | "compact"
                }
            ) => string
            reset: (widgetId: string) => void
            remove: (widgetId: string) => void
        }
    }
}

export default function Turnstile({ onVerify, onError, onExpire, theme = "dark" }: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const [errorCount, setErrorCount] = useState(0)

    useEffect(() => {
        // We use a unique callback name to avoid conflicts if multiple widgets are rendered
        const callbackName = `onloadTurnstileCallback_${Math.random().toString(36).substring(7)}`

            ; (window as any)[callbackName] = () => {
                console.log(`Turnstile script loaded (cb: ${callbackName}), rendering widget...`)
                if (containerRef.current && !widgetIdRef.current && window.turnstile) {
                    try {
                        console.log("Rendering Turnstile with key:", turnstileSiteKey.substring(0, 10) + "...")
                        widgetIdRef.current = window.turnstile.render(containerRef.current, {
                            sitekey: turnstileSiteKey,
                            callback: (token) => {
                                console.log("Turnstile verification success")
                                onVerify(token)
                            },
                            "error-callback": (err) => {
                                console.error("Turnstile widget error:", err)
                                setErrorCount(prev => prev + 1)
                                if (onError) onError(err)
                            },
                            "expired-callback": () => {
                                console.warn("Turnstile token expired")
                                if (onExpire) onExpire()
                            },
                            theme,
                            size: "normal"
                        })
                    } catch (e) {
                        console.error("Turnstile render exception:", e)
                    }
                }
            }

        // Load Turnstile script
        const scriptId = "cloudflare-turnstile-script"
        let script = document.getElementById(scriptId) as HTMLScriptElement

        if (!script) {
            script = document.createElement("script")
            script.id = scriptId
            script.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?onload=${callbackName}&render=explicit`
            script.async = true
            script.defer = true
            document.head.appendChild(script)
        } else if (window.turnstile) {
            // If script already exists, the global callback might not be called again by the script
            // so we call it ourselves if the turnstile object is ready
            ; (window as any)[callbackName]()
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current)
                } catch (e) {
                    console.warn("Error removing Turnstile widget:", e)
                }
                widgetIdRef.current = null
            }
            delete (window as any)[callbackName]
        }
    }, [onVerify, onError, onExpire, theme])

    return (
        <div className="flex flex-col items-center justify-center min-h-[65px] w-full py-2">
            <div
                ref={containerRef}
                key={`turnstile-container-${errorCount}`} // Re-render container on error to try a fresh start
            />
            {errorCount > 0 && (
                <div className="text-[10px] text-red-400 mt-2 text-center">
                    <p>Erreur Turnstile ({errorCount})</p>
                    <p className="opacity-70 break-all">Clé utilisée : {turnstileSiteKey}</p>
                    <p className="mt-1">Vérifiez vos "Authorized Hostnames" sur Cloudflare.</p>
                </div>
            )}
            <p className="text-[10px] text-slate-500 mt-1">Défense par Cloudflare Turnstile</p>
        </div>
    )
}
