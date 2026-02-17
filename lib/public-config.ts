export const turnstileSiteKey: string =
  (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() as string | undefined) || "1x00000000000000000000AA"


// Bypass is OFF by default for security. Turn on later with NEXT_PUBLIC_CAPTCHA_BYPASS=true if needed for dev.
export const captchaBypass: boolean = (process.env.NEXT_PUBLIC_CAPTCHA_BYPASS ?? "false") === "true"
