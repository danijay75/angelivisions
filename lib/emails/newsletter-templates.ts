
export const getNewsletterConfirmationEmail = (name: string, preferencesUrl: string, lang: string = 'fr') => {
    const content = {
        fr: {
            subject: "Bienvenue à la Newsletter Angeli Visions",
            title: "Bienvenue !",
            message: `Bonjour ${name},<br><br>Merci de vous être inscrit à la newsletter d'Angeli Visions. Vous recevrez bientôt nos dernières actualités et événements.<br><br>Vous pouvez gérer vos préférences ou vous désinscrire à tout moment en cliquant sur le lien ci-dessous :`,
            button: "Gérer mes préférences",
            footer: "Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email."
        },
        en: {
            subject: "Welcome to Angeli Visions Newsletter",
            title: "Welcome!",
            message: `Hello ${name},<br><br>Thank you for subscribing to the Angeli Visions newsletter. You will soon receive our latest news and events.<br><br>You can manage your preferences or unsubscribe at any time by clicking the link below:`,
            button: "Manage my preferences",
            footer: "If you did not sign up for this newsletter, you can ignore this email."
        },
        es: {
            subject: "Bienvenido al boletín de Angeli Visions",
            title: "¡Bienvenido!",
            message: `Hola ${name},<br><br>Gracias por suscribirte al boletín de Angeli Visions. Pronto recibirás nuestras últimas noticias y eventos.<br><br>Puedes gestionar tus preferencias o darte de baja en cualquier momento haciendo clic en el siguiente enlace:`,
            button: "Gestionar mis preferencias",
            footer: "Si no te has inscrito a este boletín, puedes ignorar este correo."
        }
    };

    const t = content[lang as keyof typeof content] || content.fr;

    return {
        subject: t.subject,
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .button { display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #888888; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>${t.title}</h2>
            <p>${t.message}</p>
            <a href="${preferencesUrl}" class="button">${t.button}</a>
            <p class="footer">${t.footer}</p>
          </div>
        </body>
      </html>
    `
    };
};

export const getAdminNotificationEmail = (name: string, email: string) => {
    return {
        subject: "[Angeli Visions] Nouvelle inscription newsletter",
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 5px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <h3>Nouvel abonné Newsletter 🎉</h3>
            <p>Une nouvelle personne vient de s'inscrire :</p>
            <ul>
                <li><strong>Nom :</strong> ${name}</li>
                <li><strong>Email :</strong> ${email}</li>
                <li><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</li>
            </ul>
          </div>
        </body>
      </html>
    `
    };
};
