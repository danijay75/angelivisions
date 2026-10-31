#!/usr/bin/env npx ts-node --skip-project
/**
 * clean-spam-newsletter.ts
 *
 * Identifie et supprime les contacts newsletter suspects depuis Google Contacts.
 *
 * Usage:
 *   npx ts-node scripts/clean-spam-newsletter.ts            # Dry-run (affiche les suspects)
 *   npx ts-node scripts/clean-spam-newsletter.ts --delete    # Supprime les suspects
 *   npx ts-node scripts/clean-spam-newsletter.ts --list-all  # Liste tous les contacts
 */

import { google } from "googleapis"
import * as path from "path"
import * as fs from "fs"
import * as readline from "readline"

// Charge les variables d'environnement depuis .env.local (sans dépendance dotenv)
const envPath = path.resolve(__dirname, "../.env.local")
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n")
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "")
    if (key && !process.env[key]) process.env[key] = value
  }
}

// ---------------------------------------------------------------------------
// Heuristiques de spam
// ---------------------------------------------------------------------------

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "guerrillamail.org",
  "guerrillamail.biz", "guerrillamail.de", "guerrillamail.info",
  "tempmail.com", "temp-mail.org", "throwam.com", "yopmail.com", "yopmail.fr",
  "fakeinbox.com", "trashmail.com", "trashmail.me", "trashmail.net",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "spam4.me",
  "dispostable.com", "mailnull.com", "spamgourmet.com", "spamgourmet.net",
  "10minutemail.com", "10minutemail.net", "10minutemail.org", "10minute-mail.com",
  "minutemail.com", "mt2014.com", "mt2015.com", "discard.email",
  "spambox.us", "spambox.me", "spambox.info",
  "mytemp.email", "tempinbox.com", "tempr.email",
  "mailsac.com", "maildrop.cc", "gishpuppy.com",
  "mailnesia.com", "0-mail.com", "0815.ru", "put2.net",
  "filzmail.com", "7tags.com", "antispam24.de", "spamevader.com",
])

const SUSPICIOUS_TLDS = new Set([
  "xyz", "tk", "ml", "ga", "cf", "gq", "pw", "top", "club",
  "buzz", "click", "download", "link", "loan", "men", "work",
  "racing", "review", "science", "stream", "trade", "webcam", "win",
])

const SPAM_NAME_PATTERNS = [
  /^[a-z]{1,3}\d{3,}$/i,          // ex: ab12345
  /^[a-z]{8,}[0-9]{2,}$/i,         // ex: xzytmpfoo99
  /^\d+$/,                          // que des chiffres
  /^test\d*$/i,                     // "test", "test1"
  /^user\d+$/i,                     // "user123"
  /^admin\d*$/i,                    // "admin"
  /^noreply/i,                      // "noreply..."
  /^(bot|spam|fake|temp|trash)/i,   // préfixes suspects
]

function getEmailDomain(email: string) { return email.split("@")[1]?.toLowerCase() || "" }
function getEmailTld(email: string) { return getEmailDomain(email).split(".").pop()?.toLowerCase() || "" }
function isDisposable(email: string) { return DISPOSABLE_DOMAINS.has(getEmailDomain(email)) }
function isSuspiciousTld(email: string) { return SUSPICIOUS_TLDS.has(getEmailTld(email)) }

function isSpamName(name: string, email: string): boolean {
  // Nom constitué de lettres avec alternance aléatoire majuscule/minuscule (signature bot)
  // ex: "gBGPyEDTMqaXUVjOCnzF" — pas de pattern humain naturel
  // On EXCLUT les noms tout en majuscules (style français: "Prénom NOM")
  const nameParts = name.trim().split(/\s+/)
  const hasRandomCaps = nameParts.some((part) => {
    if (part.length < 8) return false
    // Si le mot est entièrement en majuscules, c'est un nom de famille français → légitime
    if (part === part.toUpperCase()) return false
    // Si le mot est entièrement en minuscules → légitime
    if (part === part.toLowerCase()) return false
    // Compte les majuscules internes (pas la première lettre)
    const rest = part.slice(1)
    const internalUpperCount = (rest.match(/[A-Z]/g) || []).length
    // Un vrai nom comme "Beaujean" ou "Benouzio" a 0 majuscules internes
    // Un bot comme "gBGPyEDTMqaXUVjOCnzF" en a beaucoup
    return internalUpperCount >= 3
  })
  if (hasRandomCaps) return true

  // Patterns de spam sur le nom complet (sans espaces)
  return SPAM_NAME_PATTERNS.some((p) => p.test(name.replace(/\s+/g, "")))
}

function isRandomLocalPart(email: string): boolean {
  const local = email.split("@")[0] || ""
  if (local.length > 10 && !/[aeiou]/i.test(local)) return true
  const digitCount = (local.match(/\d/g) || []).length
  if (digitCount > 4 && local.length < 12) return true
  return false
}

interface Contact { resourceName: string; name: string; email: string; subscribedAt: string }
interface SuspiciousContact extends Contact { reasons: string[] }

// Date de début de l'attaque de bots (28/07/2026) — les abonnés avant cette date sont probablement légitimes
const BOT_ATTACK_START = new Date("2026-07-28T00:00:00")

function analyzeContact(c: Contact): SuspiciousContact | null {
  // Ne pas flaguer les contacts inscrits bien avant l'attaque (avant le 28/07/2026)
  if (c.subscribedAt) {
    const parts = c.subscribedAt.split("/")
    if (parts.length === 3) {
      const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
      if (!isNaN(d.getTime()) && d < BOT_ATTACK_START) return null
    }
  }

  const reasons: string[] = []
  if (isDisposable(c.email)) reasons.push("🗑️  Domaine jetable connu")
  if (isSuspiciousTld(c.email)) reasons.push("⚠️  TLD suspect")
  if (isSpamName(c.name, c.email)) reasons.push("🤖 Nom suspect / identique à l'email")
  if (isRandomLocalPart(c.email)) reasons.push("🎲 Partie locale aléatoire")
  if (/\d{4,}/.test(c.name)) reasons.push("🔢 Trop de chiffres dans le nom")
  return reasons.length > 0 ? { ...c, reasons } : null
}

// ---------------------------------------------------------------------------
// Google Contacts
// ---------------------------------------------------------------------------

function getPeopleApi() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"
  )
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })
  return google.people({ version: "v1", auth })
}

async function listAllNewsletterContacts(): Promise<Contact[]> {
  const api = getPeopleApi()
  const contacts: Contact[] = []
  let nextPageToken: string | undefined

  do {
    const res = await api.people.connections.list({
      resourceName: "people/me",
      pageSize: 100,
      personFields: "names,emailAddresses,userDefined,organizations,birthdays",
      pageToken: nextPageToken,
    })

    for (const person of res.data.connections || []) {
      const isNewsletter =
        person.userDefined?.some((ud) => ud.key === "Catégorie / Source" && ud.value?.toLowerCase() === "newsletter") ||
        person.organizations?.some((org) => org.name?.toLowerCase() === "newsletter")

      if (!isNewsletter) continue
      const email = person.emailAddresses?.[0]?.value || ""
      if (!email) continue

      const firstName = person.names?.[0]?.givenName || ""
      const lastName = person.names?.[0]?.familyName || ""
      const name = [firstName, lastName].filter(Boolean).join(" ") || email.split("@")[0]

      let subscribedAt = ""
      const bday = person.birthdays?.[0]?.date
      if (bday?.year && bday?.month && bday?.day) {
        const d = new Date(bday.year, bday.month - 1, bday.day)
        subscribedAt = isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR")
      }

      contacts.push({ resourceName: person.resourceName || "", name, email, subscribedAt })
    }

    nextPageToken = res.data.nextPageToken ?? undefined
  } while (nextPageToken)

  return contacts
}

async function deleteContact(resourceName: string): Promise<boolean> {
  try {
    await getPeopleApi().people.deleteContact({ resourceName })
    return true
  } catch {
    return false
  }
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans) }))
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2)
  const doDelete = args.includes("--delete")
  const listAll = args.includes("--list-all")

  console.log("\n🔍 Récupération des abonnés newsletter depuis Google Contacts...\n")
  const contacts = await listAllNewsletterContacts()
  console.log(`📋 ${contacts.length} contacts newsletter trouvés au total.\n`)

  if (listAll) {
    console.log("=".repeat(80))
    console.log("LISTE COMPLÈTE")
    console.log("=".repeat(80))
    for (const c of contacts) {
      console.log(`  ${(c.subscribedAt || "date inconnue").padEnd(12)} | ${c.name.padEnd(30)} | ${c.email}`)
    }
    return
  }

  const suspicious = contacts.map(analyzeContact).filter((c): c is SuspiciousContact => c !== null)

  if (suspicious.length === 0) {
    console.log("✅ Aucun contact suspect détecté ! La liste est propre.\n")
    return
  }

  console.log("=".repeat(80))
  console.log(`🚨 ${suspicious.length} CONTACT(S) SUSPECT(S) DÉTECTÉ(S)`)
  console.log("=".repeat(80))

  for (const c of suspicious) {
    console.log(`\n  📧 ${c.email}`)
    console.log(`     Nom       : ${c.name}`)
    console.log(`     Inscrit le: ${c.subscribedAt || "date inconnue"}`)
    console.log(`     Raisons   : ${c.reasons.join(" | ")}`)
  }

  console.log("\n" + "=".repeat(80))

  if (!doDelete) {
    console.log("\n💡 Mode DRY-RUN — aucune suppression effectuée.")
    console.log("   Pour supprimer ces contacts, relancez avec --delete")
    console.log(`\n   npx ts-node scripts/clean-spam-newsletter.ts --delete\n`)
    return
  }

  console.log(`\n⚠️  Vous allez SUPPRIMER définitivement ${suspicious.length} contact(s).`)
  const answer = await prompt("   Confirmer ? Tapez 'OUI' pour continuer : ")

  if (answer.trim().toUpperCase() !== "OUI") {
    console.log("\n❌ Suppression annulée.\n")
    return
  }

  console.log("\n🗑️  Suppression en cours...\n")
  let deleted = 0
  let failed = 0

  for (const c of suspicious) {
    const ok = await deleteContact(c.resourceName)
    if (ok) {
      console.log(`  ✅ Supprimé : ${c.email}`)
      deleted++
    } else {
      console.log(`  ❌ Échec    : ${c.email}`)
      failed++
    }
    // Pause pour éviter le rate-limit Google API
    await new Promise((r) => setTimeout(r, 250))
  }

  console.log(`\n✅ Terminé : ${deleted} supprimé(s), ${failed} échec(s).\n`)
}

main().catch((err) => {
  console.error("Erreur fatale :", err)
  process.exit(1)
})
