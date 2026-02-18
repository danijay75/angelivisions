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
    const scriptLoadedRef = useRef(false)

    useEffect(() => {
        const renderWidget = () => {
            if (containerRef.current && !widgetIdRef.current && window.turnstile) {
                try {
                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: turnstileSiteKey,
                        callback: (token) => {
                            onVerify(token)
                        },
                        "error-callback": (err) => {
                            console.error("Turnstile error:", err)
                            if (onError) onError(err)
                        },
                        "expired-callback": () => {
                            if (onExpire) onExpire()
                        },
                        theme,
                        size: "normal"
                    })
                } catch (e) {
                    console.error("Turnstile render error:", e)
                }
            }
        }

        // Global callback for script load
        const callbackName = "onloadTurnstileCallback"
        if (!(window as any)[callbackName]) {
            ; (window as any)[callbackName] = () => {
                renderWidget()
            }
        }

        if (window.turnstile) {
            renderWidget()
        } else if (!scriptLoadedRef.current) {
            const scriptId = "cloudflare-turnstile-script"
            if (!document.getElementById(scriptId)) {
                const script = document.createElement("script")
                script.id = scriptId
                script.src = `https://challenges.cloudflare.com/turnstile/v0/api.js?onload=${callbackName}`
                script.async = true
                script.defer = true
                document.head.appendChild(script)
                scriptLoadedRef.current = true
            }
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current)
                } catch (e) {
                    // Ignore removal errors on unmount
                }
                widgetIdRef.current = null
            }
        }
    }, [onVerify, onError, onExpire, theme])

    return (
        <div className="flex flex-col items-center justify-center min-h-[65px] w-full py-2">
            <div ref={containerRef} />
            <p className="text-[10px] text-slate-500 mt-1">Défense par Cloudflare Turnstile</p>
        </div>
    )
}
