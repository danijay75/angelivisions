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
  company?: string;
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
  let fullNote = notes || "";

  // For Newsletter, the label is already in the Company field, and date is in Birthday
  if (label && label !== "Newsletter") {
    fullNote = `📌 Libellé : ${label}\n\n${fullNote}`;
  }

  return fullNote.trim();
}

// ---------------------------------------------------------------------------
// Helper: extract date from Birthdays
// ---------------------------------------------------------------------------

function extractDateFromBirthday(birthdays: any[] | undefined): string {
  if (!birthdays || birthdays.length === 0) return "";
  const bday = birthdays[0].date;
  if (bday) {
    const { year, month, day } = bday;
    // Note: Date constructor with year, month (0-indexed), day
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? "" : d.toISOString();
  }
  return "";
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
    
    // LOGIC: Use Company and Birthday fields
    let companyName = data.company;
    if (data.label === "Newsletter" && !companyName) {
      companyName = "Newsletter";
    }
    const organizations = companyName ? [{ name: companyName }] : [];

    const now = new Date();
    const birthdays = [{
      date: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
      }
    }];

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
        birthdays: birthdays.length > 0 ? birthdays : undefined,
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
        personFields: "names,emailAddresses,biographies,userDefined,organizations,birthdays",
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
        const company = person.organizations?.[0]?.name || "";
        
        // Use Birthday field for subscription date
        const subscribedAt = extractDateFromBirthday(person.birthdays);

        contacts.push({
          resourceName: person.resourceName || "",
          name: fullName,
          email,
          subscribedAt,
          company,
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
