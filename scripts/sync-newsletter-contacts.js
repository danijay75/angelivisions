const { google } = require('googleapis');
const { Redis } = require('@upstash/redis');

async function syncExistingSubscribers() {
  console.log("🚀 Démarrage de la synchronisation des abonnés Newsletter vers Google Contacts...");

  const redis = new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const peopleApi = google.people({ version: 'v1', auth: oauth2Client });

  try {
    const INDEX_KEY = "newsletter_emails";
    const subscribers = await redis.smembers(INDEX_KEY);
    
    // Also check legacy key
    const legacyEmails = await redis.smembers("newsletter_subscribers");
    const allEmails = [...new Set([...subscribers, ...legacyEmails])];

    console.log(`📋 ${allEmails.length} abonnés trouvés dans la base Redis.`);

    let successCount = 0;
    let failCount = 0;

    for (const email of allEmails) {
      try {
        const normalizedEmail = email.toLowerCase().trim();
        const data = await redis.hgetall(`newsletter:${normalizedEmail}`);
        
        let name = "Abonné Inconnu";
        if (data && data.name) {
          name = data.name;
        }

        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0] || "Inconnu";
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;
        
        const dateStr = data && data.subscribedAt 
          ? new Date(data.subscribedAt).toLocaleString("fr-FR", { timeZone: "Europe/Paris" })
          : new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

        console.log(`⏳ Synchronisation de : ${normalizedEmail} (${name})...`);

        await peopleApi.people.createContact({
          requestBody: {
            names: [{ givenName: firstName, familyName: lastName || "" }],
            emailAddresses: [{ value: normalizedEmail, type: "work" }],
            biographies: [{ 
              value: `📌 Libellé : Newsletter\n📅 Date d'action : ${dateStr}\n\nSynchronisation historique effectuée le ${new Date().toLocaleDateString("fr-FR")}` 
            }],
            userDefined: [{ key: "Catégorie / Source", value: "Newsletter" }]
          },
        });

        successCount++;
      } catch (e) {
        if (e.response && e.response.status === 409) {
          console.warn(`⚠️ Le contact ${email} existe déjà dans Google Contacts.`);
          successCount++; // Count as success since it's there
        } else {
          console.error(`❌ Erreur pour ${email}:`, e.message);
          failCount++;
        }
      }
      
      // Small pause to avoid hitting rate limits too fast (100ms)
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ FIN DE SYNCHRONISATION :`);
    console.log(`- ${successCount} contacts synchronisés ou déjà présents.`);
    console.log(`- ${failCount} échecs.`);

  } catch (err) {
    console.error("💥 Erreur fatale lors de la synchronisation:", err);
  }
}

syncExistingSubscribers();
