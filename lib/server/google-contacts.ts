import { google } from "googleapis";

export interface ContactData {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  label?: string;
  notes?: string;
}

export interface NewsletterContact {
  resourceName: string;
  name: string;
  email: string;
  subscribedAt: string;
}

// ---------------------------------------------------------------------------
// Helper: build a fresh People API client (lazy init per call)
// ---------------------------------------------------------------------------

function getPeopleApi() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.people({ version: "v1", auth: oauth2Client });
}

// ---------------------------------------------------------------------------
// Helper: build the biography / notes block
// ---------------------------------------------------------------------------

function buildBiography(label: string | undefined, notes: string | undefined): string {
  const dateStr = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  let fullNote = notes || "";

  if (label) {
    fullNote = `📌 Libellé : ${label}\n📅 Date d'action : ${dateStr}\n\n${fullNote}`;
  } else {
    fullNote = `📅 Date d'action : ${dateStr}\n\n${fullNote}`;
  }

  return fullNote.trim();
}

// ---------------------------------------------------------------------------
// Helper: extract subscription date from a biography string
// ---------------------------------------------------------------------------

function extractDateFromBio(bio: string): string {
  const match = bio.match(/📅 Date d'action\s*:\s*(.+)/);
  if (!match) return "";

  const raw = match[1].trim();

  // Try parsing French date format "dd/mm/yyyy hh:mm:ss"
  const frMatch = raw.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):?(\d{2})?/);
  if (frMatch) {
    const [, day, month, year, hour, min, sec] = frMatch;
    return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec || "00"}`).toISOString();
  }

  // Fallback: try native Date parse
  const d = new Date(raw);
  return isNaN(d.getTime()) ? "" : d.toISOString();
}

// ---------------------------------------------------------------------------
// CREATE — generic contact creation (used by all forms)
// ---------------------------------------------------------------------------

export async function createGoogleContact(data: ContactData) {
  console.log(`[Google Contacts] Tentative de création pour: ${data.email} (${data.label || "Sans libellé"})`);

  const peopleApi = getPeopleApi();
  if (!peopleApi) {
    console.error("[Google Contacts] ERREUR: Variables d'environnement manquantes.");
    return null;
  }

  try {
    const names = [];
    if (data.firstName || data.lastName) {
      names.push({ givenName: data.firstName || "Inconnu", familyName: data.lastName || "" });
    }

    const emailAddresses = data.email ? [{ value: data.email, type: "work" }] : [];
    const phoneNumbers = data.phone ? [{ value: data.phone, type: "mobile" }] : [];
    const organizations = data.company ? [{ name: data.company }] : [];
    const userDefined = data.label ? [{ key: "Catégorie / Source", value: data.label }] : [];
    const biography = buildBiography(data.label, data.notes);
    const biographies = biography ? [{ value: biography }] : [];

    const response = await peopleApi.people.createContact({
      requestBody: {
        names: names.length > 0 ? names : undefined,
        emailAddresses: emailAddresses.length > 0 ? emailAddresses : undefined,
        phoneNumbers: phoneNumbers.length > 0 ? phoneNumbers : undefined,
        organizations: organizations.length > 0 ? organizations : undefined,
        biographies: biographies.length > 0 ? biographies : undefined,
        userDefined: userDefined.length > 0 ? userDefined : undefined,
      },
    });

    console.log("[Google Contacts] Contact créé :", response.data.resourceName);
    return response.data.resourceName as string;
  } catch (error) {
    console.error("[Google Contacts] Erreur lors de la création :", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// LIST — retrieve all contacts tagged "Newsletter"
// ---------------------------------------------------------------------------

export async function listNewsletterContacts(): Promise<NewsletterContact[]> {
  const peopleApi = getPeopleApi();
  if (!peopleApi) return [];

  try {
    const contacts: NewsletterContact[] = [];
    let nextPageToken: string | undefined;

    do {
      const res = await peopleApi.people.connections.list({
        resourceName: "people/me",
        pageSize: 100,
        personFields: "names,emailAddresses,biographies,userDefined",
        pageToken: nextPageToken,
      });

      const connections = res.data.connections || [];

      for (const person of connections) {
        const isNewsletter = person.userDefined?.some(
          (ud) => ud.key === "Catégorie / Source" && ud.value === "Newsletter"
        );

        if (!isNewsletter) continue;

        const email = person.emailAddresses?.[0]?.value || "";
        const firstName = person.names?.[0]?.givenName || "";
        const lastName = person.names?.[0]?.familyName || "";
        const fullName = [firstName, lastName].filter(Boolean).join(" ");
        const bio = person.biographies?.[0]?.value || "";
        const subscribedAt = extractDateFromBio(bio);

        contacts.push({
          resourceName: person.resourceName || "",
          name: fullName,
          email,
          subscribedAt,
        });
      }

      nextPageToken = res.data.nextPageToken ?? undefined;
    } while (nextPageToken);

    // Sort by most recent first
    contacts.sort((a, b) => {
      const da = a.subscribedAt ? new Date(a.subscribedAt).getTime() : 0;
      const db = b.subscribedAt ? new Date(b.subscribedAt).getTime() : 0;
      return db - da;
    });

    console.log(`[Google Contacts] ${contacts.length} contacts Newsletter trouvés.`);
    return contacts;
  } catch (error) {
    console.error("[Google Contacts] Erreur lors du listage :", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// UPDATE — update name and/or email on a contact by resourceName
// ---------------------------------------------------------------------------

export async function updateGoogleContact(
  resourceName: string,
  updates: { name?: string; email?: string }
): Promise<boolean> {
  const peopleApi = getPeopleApi();
  if (!peopleApi) return false;

  try {
    // 1. Fetch current contact to get etag
    const existing = await peopleApi.people.get({
      resourceName,
      personFields: "names,emailAddresses,biographies,userDefined",
    });

    const etag = existing.data.etag;

    // 2. Build updated fields
    const updateMask: string[] = [];
    const body: Record<string, unknown> = { etag };

    if (updates.name !== undefined) {
      const parts = updates.name.trim().split(" ");
      body.names = [{ givenName: parts[0] || "Inconnu", familyName: parts.slice(1).join(" ") || "" }];
      updateMask.push("names");
    }

    if (updates.email !== undefined) {
      body.emailAddresses = [{ value: updates.email, type: "work" }];
      updateMask.push("emailAddresses");
    }

    if (updateMask.length === 0) return true;

    await peopleApi.people.updateContact({
      resourceName,
      updatePersonFields: updateMask.join(","),
      requestBody: body,
    });

    console.log(`[Google Contacts] Contact mis à jour : ${resourceName}`);
    return true;
  } catch (error) {
    console.error("[Google Contacts] Erreur lors de la mise à jour :", error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// DELETE — remove a contact by resourceName
// ---------------------------------------------------------------------------

export async function deleteGoogleContact(resourceName: string): Promise<boolean> {
  const peopleApi = getPeopleApi();
  if (!peopleApi) return false;

  try {
    await peopleApi.people.deleteContact({ resourceName });
    console.log(`[Google Contacts] Contact supprimé : ${resourceName}`);
    return true;
  } catch (error) {
    console.error("[Google Contacts] Erreur lors de la suppression :", error);
    return false;
  }
}
