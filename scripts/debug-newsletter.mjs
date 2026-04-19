import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function debugNewsletter() {
  console.log("--- DEBUG NEWSLETTER GOOGLE CONTACTS ---");
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
    console.error("Missing Google env variables.");
    return;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const peopleApi = google.people({ version: "v1", auth: oauth2Client });

  try {
    // 1. Check Groups
    console.log("Fetching groups...");
    const groupsRes = await peopleApi.contactGroups.list();
    const groups = groupsRes.data.contactGroups || [];
    console.log(`Found ${groups.length} groups.`);
    groups.forEach(g => console.log(`- ${g.name} (${g.resourceName}) [${g.memberCount} members]`));

    const newsletterGroup = groups.find(g => g.name === "Newsletter" || g.formattedName === "Newsletter");
    console.log("Target group:", newsletterGroup ? `${newsletterGroup.name} (${newsletterGroup.resourceName})` : "NOT FOUND");

    // 2. Fetch first page of connections
    console.log("\nFetching first 10 connections...");
    const res = await peopleApi.people.connections.list({
      resourceName: "people/me",
      pageSize: 10,
      personFields: "names,emailAddresses,userDefined,organizations,memberships",
    });

    const connections = res.data.connections || [];
    console.log(`Found ${connections.length} connections in first page.`);
    
    connections.forEach((person, i) => {
      const email = person.emailAddresses?.[0]?.value || "no-email";
      const name = person.names?.[0]?.displayName || "no-name";
      const tags = person.userDefined?.map(u => `${u.key}=${u.value}`).join(", ") || "none";
      const orgs = person.organizations?.map(o => o.name).join(", ") || "none";
      const memberships = person.memberships?.map(m => m.contactGroupMembership?.contactGroupResourceName).join(", ") || "none";
      
      console.log(`[${i}] ${name} <${email}>`);
      console.log(`    Tags: ${tags}`);
      console.log(`    Orgs: ${orgs}`);
      console.log(`    Groups: ${memberships}`);
    });

  } catch (error) {
    console.error("DEBUG ERROR:", error);
  }
}

debugNewsletter();
