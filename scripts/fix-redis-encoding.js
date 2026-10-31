/**
 * Réparation des caractères de remplacement (U+FFFD « � ») dans les valeurs
 * Redis, hérités d'un ancien bug d'encodage UTF-8.
 *
 *   node scripts/fix-redis-encoding.js            # simulation (aucune écriture)
 *   node scripts/fix-redis-encoding.js --apply    # applique les corrections
 *   node scripts/fix-redis-encoding.js --apply av_services_v1 autre:cle
 */
const { createRedis } = require("./_env");

const DEFAULT_KEYS = ["av_services_v1", "av_services_config_v1"];

// U+FFFD : le caractère « � » qui a remplacé les accents lors de l'incident.
const DIAMOND = "\uFFFD";

// Remplacements littéraux (pas de regex : on ne veut rien interpréter).
const FIXES = [
  ["vid" + DIAMOND + DIAMOND, "vidéo"],
  ["vid" + DIAMOND, "vidéo"],
  ["multicam" + DIAMOND + DIAMOND, "multicaméra"],
  ["syst" + DIAMOND + DIAMOND, "système"],
  ["sc" + DIAMOND + DIAMOND + "nique", "scénique"],
  ["v" + DIAMOND + "nements", "événements"],
  ["v" + DIAMOND + "nement", "événement"],
  ["r" + DIAMOND + DIAMOND, "ré"],
  ["d" + DIAMOND + DIAMOND, "dé"],
  ["m" + DIAMOND + DIAMOND, "mé"],
  ["v" + DIAMOND + DIAMOND, "vé"],
  [DIAMOND, "é"],
];

function countDiamonds(value) {
  if (typeof value === "string") return (value.match(/\uFFFD/g) || []).length;
  if (Array.isArray(value)) return value.reduce((n, v) => n + countDiamonds(v), 0);
  if (value && typeof value === "object") {
    return Object.values(value).reduce((n, v) => n + countDiamonds(v), 0);
  }
  return 0;
}

function fixDeep(value) {
  if (typeof value === "string") {
    let out = value;
    for (const [from, to] of FIXES) out = out.split(from).join(to);
    return out;
  }
  if (Array.isArray(value)) return value.map(fixDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = fixDeep(v);
    return out;
  }
  return value;
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const keys = args.filter((a) => !a.startsWith("--"));
  const targets = keys.length ? keys : DEFAULT_KEYS;

  const redis = createRedis();
  let total = 0;

  for (const key of targets) {
    const raw = await redis.get(key);
    if (raw == null) {
      console.log(`- ${key} : clé absente`);
      continue;
    }

    const data = typeof raw === "string" ? safeParse(raw) : raw;
    const count = countDiamonds(data);
    total += count;

    if (count === 0) {
      console.log(`- ${key} : OK (aucun caractère corrompu)`);
      continue;
    }

    console.log(`- ${key} : ${count} caractère(s) à réparer`);
    if (!apply) continue;

    await redis.set(key, fixDeep(data));
    console.log(`  -> corrigé`);
  }

  if (total === 0) {
    console.log("\nRien à faire.");
  } else if (!apply) {
    console.log(`\n${total} caractère(s) à corriger. Relancer avec --apply pour écrire.`);
  } else {
    console.log("\nCorrections appliquées.");
  }
}

function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
