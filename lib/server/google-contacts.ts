import { google } from "googleapis";

// Initialize an OAuth2 client.
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"
);

// If we have a refresh token (recommended for automated creation), set it
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
}

const peopleApi = google.people({ version: "v1", auth: oauth2Client });

export interface ContactData {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  label?: string;
  notes?: string;
}

export async function createGoogleContact(data: ContactData) {
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    console.warn("GOOGLE_REFRESH_TOKEN n'est pas configuré. Le contact ne sera pas sauvegardé dans Google Contacts.");
    return false;
  }

  try {
    const names = [];
    if (data.firstName || data.lastName) {
      names.push({
        givenName: data.firstName || "Inconnu",
        familyName: data.lastName || "",
      });
    }

    const emailAddresses = [];
    if (data.email) {
      emailAddresses.push({
        value: data.email,
        type: "work",
      });
    }

    const phoneNumbers = [];
    if (data.phone) {
      phoneNumbers.push({
        value: data.phone,
        type: "mobile",
      });
    }

    const organizations = [];
    if (data.company) {
      organizations.push({
        name: data.company,
      });
    }

    const userDefined = [];
    if (data.label) {
      userDefined.push({ key: "Catégorie / Source", value: data.label });
    }

    const biographies = [];
    let fullNote = data.notes || "";
    const dateStr = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
    
    if (data.label) {
      fullNote = `📌 Libellé : ${data.label}\n📅 Date d'action : ${dateStr}\n\n${fullNote}`;
    } else {
      fullNote = `📅 Date d'action : ${dateStr}\n\n${fullNote}`;
    }
    
    if (fullNote.trim()) {
      biographies.push({
        value: fullNote.trim(),
      });
    }

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

    console.log("Contact créé sur Google Contacts :", response.data.resourceName);
    return true;
  } catch (error) {
    console.error("Erreur lors de la création du contact Google :", error);
    return false;
  }
}
