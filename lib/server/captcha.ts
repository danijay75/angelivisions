export function isCaptchaBypassed() {
    const serverFlag = (process.env.CAPTCHA_BYPASS ?? "false") === "true"
    const clientFlag = (process.env.NEXT_PUBLIC_CAPTCHA_BYPASS ?? "false") === "true"
    return serverFlag || clientFlag
}

/**
 * Verifies a Cloudflare Turnstile token
 */
export async function verifyCaptcha(token: string) {
    // If bypass is enabled, always pass.
    if (isCaptchaBypassed()) {
        console.log("Captcha verification bypassed (isCaptchaBypassed=true)")
        return true
    }

    const secret = process.env.TURNSTILE_SECRET_KEY
    if (!secret) {
        console.error("TURNSTILE_SECRET_KEY is not set")
        return false
    }

    if (!token) {
        console.warn("No captcha token provided for verification")
        return false
    }

    try {
        console.log("Verifying Turnstile token...")
        const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: secret,
                response: token,
            }),
        })
        const data = await res.json()
        console.log("Turnstile verification response:", JSON.stringify(data))
        return !!data.success
    } catch (error) {
        console.error("Turnstile verification error:", error)
        return false
    }
}
