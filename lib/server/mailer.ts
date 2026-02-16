import nodemailer from "nodemailer"

export function getMailer() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || "587")
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.FROM_EMAIL || user
  const fromName = process.env.FROM_NAME
  const replyTo = process.env.REPLY_TO

  if (!host || !user || !pass || !from) return null

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL direct
    requireTLS: port === 587, // STARTTLS recommandé OVH Exchange
    auth: { user, pass },
  })

  return { transport, from, fromName, replyTo }
}
