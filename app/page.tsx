import { redirect } from "next/navigation"

// Server redirect to the default locale, avoiding any client-side Promises on initial render.
export default function Page() {
  redirect("/fr")
}
