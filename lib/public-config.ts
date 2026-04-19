export const turnstileSiteKey: string =
  (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() as string | undefined) || "0x4AAAAAACd_mGSE8A3NZiQ0"


// Bypass is OFF by default for security. Turn on later with NEXT_PUBLIC_CAPTCHA_BYPASS=true if needed for dev.
// Bypass is ONLY allowed in development mode.
export const captchaBypass: boolean = 
  process.env.NODE_ENV === 'development' && (process.env.NEXT_PUBLIC_CAPTCHA_BYPASS ?? "false") === "true"
