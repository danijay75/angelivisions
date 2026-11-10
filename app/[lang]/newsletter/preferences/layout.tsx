import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
    title: "Préférences newsletter",
    robots: { index: false, follow: true },
}

export default function NewsletterPreferencesLayout({ children }: { children: React.ReactNode }) {
    return children
}
