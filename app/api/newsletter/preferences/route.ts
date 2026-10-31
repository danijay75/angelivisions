
import { type NextRequest, NextResponse } from "next/server"
import {
  listNewsletterContacts,
  updateGoogleContact,
  deleteGoogleContact,
} from "@/lib/server/google-contacts"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  if (!token && !email) {
    return NextResponse.json({ error: "Email ou token requis" }, { status: 400 })
  }

  try {
    const contacts = await listNewsletterContacts()
    const normalizedEmail = email ? email.toLowerCase().trim() : ""

    const found = contacts.find((c) => {
      if (normalizedEmail && c.email.toLowerCase() === normalizedEmail) return true
      if (token && (c.resourceName === token || c.email.toLowerCase() === token.toLowerCase())) return true
      return false
    })

    if (found) {
      return NextResponse.json({
        name: found.name,
        email: found.email,
        resourceName: found.resourceName,
      })
    }

    return NextResponse.json({ error: "Abonné introuvable" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching subscriber preferences:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token, email, resourceName, action, name } = await req.json()

    const targetEmail = email?.toLowerCase().trim()
    let targetResourceName = resourceName

    if (!targetResourceName) {
      const contacts = await listNewsletterContacts()
      const found = contacts.find((c) => {
        if (targetEmail && c.email.toLowerCase() === targetEmail) return true
        if (token && (c.resourceName === token || c.email.toLowerCase() === token.toLowerCase())) return true
        return false
      })
      if (found) {
        targetResourceName = found.resourceName
      }
    }

    if (!targetResourceName) {
      return NextResponse.json({ error: "Abonné introuvable" }, { status: 404 })
    }

    if (action === "unsubscribe") {
      const ok = await deleteGoogleContact(targetResourceName)
      if (!ok) {
        return NextResponse.json({ error: "Échec de la désinscription" }, { status: 500 })
      }
      return NextResponse.json({ success: true, message: "Désinscription confirmée" })
    } else if (action === "update") {
      const ok = await updateGoogleContact(targetResourceName, { name })
      if (!ok) {
        return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 })
      }
      return NextResponse.json({ success: true, message: "Préférences mises à jour" })
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 })
  } catch (error) {
    console.error("Error updating preferences:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
