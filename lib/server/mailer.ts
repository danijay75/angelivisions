import { Resend } from "resend"

let _resend: Resend | null = null
function getResendClient(): any {
  if (!process.env.RESEND_API_KEY) {
    return {
      emails: {
        send: async () => {
          console.warn("[Mailer] RESEND_API_KEY is missing. Skipping email.");
          return { data: null, error: null };
        }
      }
    };
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@angelivision.com"
const FROM_NAME = process.env.FROM_NAME || "Angeli Visions"
const REPLY_TO = process.env.REPLY_TO || "contact@angelivisions.com"

interface SendMailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendMail({ to, subject, html, replyTo }: SendMailOptions) {
  const { data, error } = await getResendClient().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    replyTo: replyTo || REPLY_TO,
  })

  if (error) {
    console.error("[Mailer] Send error:", JSON.stringify(error))
    throw new Error(error.message || "Failed to send email")
  }

  return data
}
