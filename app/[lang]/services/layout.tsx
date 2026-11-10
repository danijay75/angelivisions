import type React from "react"

// Le canonical et les hreflang sont déclarés par le hub (services/page.tsx)
// et par chaque page service : un layout ne doit pas les imposer à ses enfants.
export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children
}
