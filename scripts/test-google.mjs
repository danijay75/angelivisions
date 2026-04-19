import { google } from "googleapis";

async function debug() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"
  );

  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  const peopleApi = google.people({ version: "v1", auth: oauth2Client });

  try {
    const res = await peopleApi.people.connections.list({
      resourceName: "people/me",
      pageSize: 10,
      personFields: "names,emailAddresses,userDefined,memberships",
    });

    console.log("Total Found:", res.data.connections?.length || 0);
    res.data.connections?.forEach((c, i) => {
        console.log(`\n--- Contact ${i+1} ---`);
        console.log("Name:", c.names?.[0]?.displayName);
        console.log("Emails:", c.emailAddresses?.map(e => e.value));
        console.log("UserDefined:", JSON.stringify(c.userDefined));
        console.log("Memberships:", JSON.stringify(c.memberships));
    });

  } catch (err) {
    console.error("API Error:", err.message);
  }
}

debug();
