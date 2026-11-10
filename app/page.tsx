import { permanentRedirect } from "next/navigation"

// Redirection permanente (308) vers la locale par défaut.
// Un 307 laissait Google choisir `/` comme URL canonique de `/fr`.
export default function Page() {
  permanentRedirect("/fr")
}
