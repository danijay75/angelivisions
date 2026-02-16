export function isCaptchaBypassed() {
  // Bypass is ON by default to unblock you. Turn off later with CAPTCHA_BYPASS=false.
  const serverFlag = (process.env.CAPTCHA_BYPASS ?? "true") === "true"
  const clientFlag = (process.env.NEXT_PUBLIC_CAPTCHA_BYPASS ?? "true") === "true"
  return serverFlag || clientFlag
}

export async function verifyHCaptcha(token: string) {
  // If bypass is enabled, always pass.
  if (isCaptchaBypassed()) return true

  const secret = process.env.HCAPTCHA_SECRET
  if (!secret) return false
  if (!token) return false
  try {
    const res = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    })
    const data = await res.json()
    return !!data.success
  } catch {
    return false
  }
}
