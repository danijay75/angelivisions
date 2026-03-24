require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  console.log('Starting test email sending...');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('ERROR: RESEND_API_KEY not found in .env.local');
    return;
  }

  try {
    console.log('Sending to user (jelassidani@gmail.com)...');
    const d1 = await resend.emails.send({
      from: 'Angeli Visions <noreply@angelivisions.com>',
      to: 'jelassidani@gmail.com',
      subject: 'Accusé de réception - Votre réclamation (TEST DIRECT)',
      html: '<p>Bonjour Dani,<br/><br/>Si vous lisez ceci, c est que le domaine et la connexion Resend fonctionnent parfaitement. Ceci est un email de test direct côté client.</p>'
    });
    console.log('User response:', d1);

    console.log('Sending to admin (reclamations@angelivisions.com)...');
    const d2 = await resend.emails.send({
      from: 'Angeli Visions <noreply@angelivisions.com>',
      to: 'reclamations@angelivisions.com',
      subject: 'Nouvelle réclamation (TEST DIRECT)',
      html: '<p>Ceci est un test de notification côté administrateur de la plateforme pour valider les envois Resend.</p>'
    });
    console.log('Admin response:', d2);

  } catch (err) {
    console.error('Error sending emails:', err);
  }
}
test();
