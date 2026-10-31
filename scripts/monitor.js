const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Resend } = require('resend');

// Load environment from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  });
}

const RESEND_API_KEY = env.RESEND_API_KEY || process.env.RESEND_API_KEY;
const FROM_EMAIL = env.FROM_EMAIL || 'contact@angelivisions.com';
const ADMIN_EMAIL = env.ADMIN_EMAIL || 'contact@angelivisions.com';
const ALERT_EMAILS = ['jelassidani@gmail.com'];

// Helper to run shell commands safely
function runCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
  } catch (err) {
    return `Error running command: ${cmd}\nMessage: ${err.message}\nOutput: ${err.stdout || ''}\nError: ${err.stderr || ''}`;
  }
}

// Log to file and console
const logPath = path.join(__dirname, '..', 'data', 'monitor.log');
function log(msg) {
  const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  const formattedMsg = `[${timestamp}] ${msg}`;
  console.log(formattedMsg);
  try {
    fs.appendFileSync(logPath, formattedMsg + '\n', 'utf8');
  } catch (e) {
    console.error('Failed to write to log file:', e);
  }
}

async function checkSite(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'AngeliVisions-Monitor/1.0' },
      signal: AbortSignal.timeout(10000)
    });
    return {
      ok: res.status >= 200 && res.status < 400,
      status: res.status,
      statusText: res.statusText
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message
    };
  }
}

async function checkHealth(base) {
  try {
    const res = await fetch(`${base}/api/health`, {
      method: 'GET',
      headers: { 'User-Agent': 'AngeliVisions-Monitor/1.0' },
      signal: AbortSignal.timeout(10000),
      cache: 'no-store'
    });
    const contentType = res.headers.get('content-type') || '';
    // Ancien build sans endpoint /api/health : la route catch-all renvoie du HTML.
    if (!contentType.includes('application/json')) {
      return { ok: null, status: res.status, legacy: true };
    }
    const body = await res.json().catch(() => null);
    return {
      ok: res.ok && body?.status === 'ok',
      status: res.status,
      buildId: body?.buildId || null
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  const siteUrl = 'https://angelivisions.com';

  log(`Starting check for ${siteUrl}...`);
  const health = await checkHealth(siteUrl);
  const initialCheck = await checkSite(siteUrl);

  if (health.ok === null) {
    log('Healthcheck absent (build sans /api/health) - fallback sur la page d\'accueil.');
  } else {
    log(`Healthcheck: ${health.ok ? 'OK' : 'KO'} (HTTP ${health.status || 'N/A'}${health.buildId ? `, build ${health.buildId}` : ''})`);
  }

  const isHealthy = health.ok === null ? initialCheck.ok : (health.ok === true && initialCheck.ok);

  if (isHealthy) {
    log(`Site is ONLINE (${initialCheck.status}). Exiting silently.`);
    process.exit(0);
  }

  log(`Site is OFFLINE! Page: ${initialCheck.status || 'N/A'}, Health: ${health.status || 'N/A'}, Error: ${initialCheck.error || health.error || 'N/A'}`);
  
  // 1. Gather diagnostics before recovery
  const nginxStatusBefore = runCommand('systemctl status nginx --no-pager');
  const pm2StatusBefore = runCommand('su - ubuntu -c "pm2 status"');
  const portsBefore = runCommand('ss -tulpn | grep -E "3000|80|443"');
  
  // 2. Attempt Recovery
  log('Initiating recovery...');
  let recoveryActions = [];
  
  // Nginx check and recovery
  const isNginxActive = runCommand('systemctl is-active nginx').trim();
  if (isNginxActive !== 'active') {
    log('Nginx is not active. Attempting to restart Nginx...');
    const restartNginxResult = runCommand('systemctl restart nginx');
    recoveryActions.push(`Restarted Nginx (Status: ${restartNginxResult.trim() || 'Done'})`);
  } else {
    log('Nginx is active.');
  }

  // PM2 check and recovery
  const pm2List = runCommand('su - ubuntu -c "pm2 jlist"');
  let angelivisionsProcess = null;
  try {
    const processes = JSON.parse(pm2List);
    angelivisionsProcess = processes.find(p => p.name === 'angelivisions');
  } catch (e) {
    log(`Could not parse PM2 process list: ${e.message}`);
  }

  if (!angelivisionsProcess) {
    log('angelivisions process is not registered in PM2. Attempting startup...');
    const startResult = runCommand('su - ubuntu -c "cd /var/www/angelivisions && pm2 start ecosystem.config.js"');
    recoveryActions.push(`Started angelivisions under PM2: ${startResult}`);
  } else if (angelivisionsProcess.pm2_env.status !== 'online') {
    log(`angelivisions status is "${angelivisionsProcess.pm2_env.status}". Restarting process...`);
    const restartResult = runCommand('su - ubuntu -c "pm2 restart angelivisions"');
    recoveryActions.push(`Restarted angelivisions under PM2 (Previous status: ${angelivisionsProcess.pm2_env.status}): ${restartResult}`);
  } else {
    log('angelivisions process is online in PM2, but public website is returning errors. Restarting anyway to refresh...');
    const restartResult = runCommand('su - ubuntu -c "pm2 restart angelivisions"');
    recoveryActions.push(`Restarted online angelivisions to refresh: ${restartResult}`);
  }

  // Wait for services to settle
  log('Waiting 5 seconds for services to settle...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 3. Recheck Site
  const postCheck = await checkSite(siteUrl);
  const recoveryStatus = postCheck.ok ? 'RECOVERED' : 'STILL OFFLINE';
  log(`Post-recovery check: ${recoveryStatus} (${postCheck.status || 'N/A'}${postCheck.error ? ', Error: ' + postCheck.error : ''})`);
  
  // 4. Gather post-recovery diagnostics
  const nginxStatusAfter = runCommand('systemctl status nginx --no-pager');
  const pm2StatusAfter = runCommand('su - ubuntu -c "pm2 status"');
  const portsAfter = runCommand('ss -tulpn | grep -E "3000|80|443"');
  
  // 5. Gather Logs
  const pm2ErrorLogs = runCommand('tail -n 50 /home/ubuntu/.pm2/logs/angelivisions-error-0.log');
  const pm2OutLogs = runCommand('tail -n 50 /home/ubuntu/.pm2/logs/angelivisions-out-0.log');
  const nginxErrorLogs = runCommand('tail -n 50 /var/log/nginx/error.log');
  
  // 6. Send Email Alert via Resend
  if (!RESEND_API_KEY) {
    log('ERROR: RESEND_API_KEY is not defined. Cannot send alert email.');
    return;
  }
  
  log('Sending alert email...');
  const resend = new Resend(RESEND_API_KEY);
  
  const subject = `[ALERTE SURVEILLANCE] ${recoveryStatus === 'RECOVERED' ? 'Rétablissement' : 'Panne Critique'} - angelivisions.com`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: ${recoveryStatus === 'RECOVERED' ? '#2e7d32' : '#c62828'}; border-bottom: 2px solid ${recoveryStatus === 'RECOVERED' ? '#2e7d32' : '#c62828'}; padding-bottom: 10px;">
        ${recoveryStatus === 'RECOVERED' ? '🟢 Site Rétabli' : '🔴 Site Toujours Hors Ligne'}
      </h2>
      <p>La tâche de surveillance automatique a détecté que le site était hors ligne à 9h.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr style="background-color: #f5f5f5;">
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Paramètre</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Valeur</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Statut Initial</td>
          <td style="padding: 10px; border: 1px solid #ddd; color: #c62828;">HORS LIGNE (HTTP ${initialCheck.status || 'N/A'} - ${initialCheck.error || 'Erreur réseau/connexion'})</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Statut Après Tentative</td>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: ${recoveryStatus === 'RECOVERED' ? '#2e7d32' : '#c62828'};">
            ${recoveryStatus === 'RECOVERED' ? 'EN LIGNE (HTTP ' + postCheck.status + ')' : 'TOUJOURS EN PANNE'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Date / Heure (Paris)</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</td>
        </tr>
      </table>
      
      <h3 style="margin-top: 25px; color: #333;">Actions de récupération entreprises</h3>
      <ul style="background-color: #f9f9f9; padding: 15px 30px; border-left: 4px solid #0288d1; border-radius: 4px;">
        ${recoveryActions.map(action => `<li style="margin-bottom: 5px;">${action}</li>`).join('') || 'Aucune action requise.'}
      </ul>
      
      <h3 style="margin-top: 25px; color: #333;">Diagnostics Après Tentatives</h3>
      
      <details style="margin-bottom: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
        <summary style="font-weight: bold; cursor: pointer;">Statut PM2 (Ubuntu)</summary>
        <pre style="background: #272822; color: #f8f8f2; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${pm2StatusAfter}</pre>
      </details>
      
      <details style="margin-bottom: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
        <summary style="font-weight: bold; cursor: pointer;">Statut Nginx</summary>
        <pre style="background: #272822; color: #f8f8f2; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${nginxStatusAfter}</pre>
      </details>
      
      <details style="margin-bottom: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
        <summary style="font-weight: bold; cursor: pointer;">Ports Réseau Actifs</summary>
        <pre style="background: #272822; color: #f8f8f2; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${portsAfter}</pre>
      </details>
      
      <h3 style="margin-top: 25px; color: #333;">Logs Utiles</h3>
      
      <details style="margin-bottom: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
        <summary style="font-weight: bold; cursor: pointer;">Derniers logs PM2 (Erreurs)</summary>
        <pre style="background: #272822; color: #f8f8f2; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${pm2ErrorLogs || 'Aucun log d\'erreur disponible.'}</pre>
      </details>
      
      <details style="margin-bottom: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
        <summary style="font-weight: bold; cursor: pointer;">Derniers logs PM2 (Sortie standard)</summary>
        <pre style="background: #272822; color: #f8f8f2; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${pm2OutLogs || 'Aucun log disponible.'}</pre>
      </details>
      
      <details style="margin-bottom: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
        <summary style="font-weight: bold; cursor: pointer;">Derniers logs Nginx (Erreurs)</summary>
        <pre style="background: #272822; color: #f8f8f2; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${nginxErrorLogs || 'Aucun log d\'erreur Nginx disponible.'}</pre>
      </details>
      
      <p style="margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; text-align: center;">
        Ce message a été généré automatiquement par le script de surveillance d'Angeli Visions.
      </p>
    </div>
  `;
  
  try {
    const data = await resend.emails.send({
      from: 'Angeli Visions <noreply@angelivisions.com>',
      to: ALERT_EMAILS,
      subject: subject,
      html: htmlContent
    });
    log(`Alert email sent successfully. Resend Response ID: ${data.data ? data.data.id : JSON.stringify(data)}`);
  } catch (err) {
    log(`Error sending email alert via Resend: ${err.message}`);
  }
}

main().catch(err => {
  log(`Critical error in monitor script: ${err.stack}`);
  process.exit(1);
});
