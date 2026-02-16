export const hcaptchaSiteKey: string =
  (process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY as string | undefined) || "a7a26710-d536-49aa-8f42-0cc292323648"

// Bypass is ON by default to unblock you. Turn off later with NEXT_PUBLIC_CAPTCHA_BYPASS=false.
export const captchaBypass: boolean = (process.env.NEXT_PUBLIC_CAPTCHA_BYPASS ?? "true") === "true"
