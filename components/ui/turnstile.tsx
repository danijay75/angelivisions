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

    const onVerifyRef = useRef(onVerify)
    const onErrorRef = useRef(onError)
    const onExpireRef = useRef(onExpire)

    useEffect(() => {
        onVerifyRef.current = onVerify
        onErrorRef.current = onError
        onExpireRef.current = onExpire
    }, [onVerify, onError, onExpire])

    const renderedRef = useRef(false)

    useEffect(() => {
        const renderWidget = () => {
            if (containerRef.current && !widgetIdRef.current && window.turnstile && !renderedRef.current) {
                try {
                    renderedRef.current = true
                    const id = window.turnstile.render(containerRef.current, {
                        sitekey: turnstileSiteKey,
                        callback: (token) => {
                            onVerifyRef.current(token)
                        },
                        "error-callback": (err) => {
                            console.error("Turnstile error:", err)
                            renderedRef.current = false
                            if (onErrorRef.current) onErrorRef.current(err)
                        },
                        "expired-callback": () => {
                            renderedRef.current = false
                            if (onExpireRef.current) onExpireRef.current()
                        },
                        theme,
                        size: "normal"
                    })
                    widgetIdRef.current = id
                } catch (e) {
                    console.error("Turnstile render error:", e)
                    renderedRef.current = false
                }
            }
        }

        // Use a more robust check for Turnstile readiness
        const checkTurnstile = () => {
            if (window.turnstile) {
                renderWidget()
            } else {
                // If not ready yet, check again in a bit (failsafe if script onload is tricky)
                const timer = setTimeout(checkTurnstile, 500)
                return () => clearTimeout(timer)
            }
        }

        if (window.turnstile) {
            renderWidget()
        } else {
            const scriptId = "cloudflare-turnstile-script"
            // If script isn't there, add it
            if (!document.getElementById(scriptId)) {
                const script = document.createElement("script")
                script.id = scriptId
                script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                script.async = true
                script.defer = true
                script.onload = renderWidget
                document.head.appendChild(script)
            } else {
                // Script is there but window.turnstile might not be ready yet
                const pollInterval = setInterval(() => {
                    if (window.turnstile) {
                        renderWidget()
                        clearInterval(pollInterval)
                    }
                }, 100)
                setTimeout(() => clearInterval(pollInterval), 5000) // Timeout after 5s
            }
        }

        return () => {
            renderedRef.current = false
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current)
                } catch (e) {
                    // ignore removal errors
                }
                widgetIdRef.current = null
            }
        }
    }, [theme])

    return (
        <div className="flex flex-col items-center justify-center min-h-[65px] w-full py-2">
            <div ref={containerRef} />
            <p className="text-[10px] text-slate-500 mt-1">Défense par Cloudflare Turnstile</p>
        </div>
    )
}
