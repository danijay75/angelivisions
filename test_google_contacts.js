const { google } = require('googleapis');

async function testGoogleContacts() {
    console.log("Démarrage du test d'intégration Google Contacts...");

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"
    );

    if (!process.env.GOOGLE_REFRESH_TOKEN) {
        console.error("❌ ERREUR: GOOGLE_REFRESH_TOKEN introuvable dans .env.local");
        return;
    }

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const peopleApi = google.people({ version: "v1", auth: oauth2Client });
    
    console.log("Token Refresh chargé. Tentative de création d'un contact...");

    try {
        const response = await peopleApi.people.createContact({
            requestBody: {
                names: [{ givenName: "Testeur", familyName: "Automatique" }],
                emailAddresses: [{ value: "test-integration@angelivisions.local", type: "work" }],
                phoneNumbers: [{ value: "+33600000000", type: "mobile" }],
                organizations: [{ name: "Angeli Visions Dev" }],
                biographies: [{ value: "📌 Libellé : Prospect (Devis)\n📅 Date d'action : Test local\n\nCeci est un test automatisé généré par votre assistant pour confirmer que la liaison d'API fonctionne." }],
                userDefined: [{ key: "Catégorie / Source", value: "Prospect (Devis)" }]
            },
        });
        console.log("✅ SUCCÈS ! Contact virtuel créé dans votre répertoire Google.");
        console.log("Ressource ID :", response.data.resourceName);
        console.log("Vous pouvez vérifier à l'adresse : https://contacts.google.com");
    } catch (e) {
        console.error("❌ ERREUR LORS DU TEST :");
        if (e.response && e.response.data) {
            console.error(JSON.stringify(e.response.data, null, 2));
        } else {
            console.error(e.message);
        }
    }
}

testGoogleContacts();
