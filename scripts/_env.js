/**
 * Petit utilitaire partagé par les scripts d'administration Redis :
 * charge .env.local sans dépendance externe (dotenv n'est pas installé).
 *
 * Usage : const { loadEnv, createRedis } = require("./_env");
 */
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const env = {};
  const envPath = path.join(__dirname, "..", ".env.local");

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const match = trimmed.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (!match) return;
      const key = match[1];
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    });
  }

  return env;
}

/**
 * Instancie le client Upstash à partir des variables d'environnement.
 * Aucun identifiant ne doit être écrit en dur dans le dépôt (il est public).
 */
function createRedis() {
  const env = loadEnv();
  const url = env.KV_REST_API_URL || process.env.KV_REST_API_URL;
  const token = env.KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "KV_REST_API_URL / KV_REST_API_TOKEN introuvables (.env.local ou variables d'environnement).",
    );
  }

  const { Redis } = require("@upstash/redis");
  return new Redis({ url, token });
}

module.exports = { loadEnv, createRedis };
