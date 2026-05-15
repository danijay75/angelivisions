import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

async function fixEncoding() {
  const keys = ["av_services_v1", "av_services_config_v1"];

  for (const key of keys) {
    console.log(`Checking key: ${key}`);
    const data = await redis.get(key);
    if (!data) {
      console.log(`No data found for ${key}`);
      continue;
    }

    let jsonStr = JSON.stringify(data);
    
    // Common corruptions observed
    const replacements = [
      { from: /v?o/g, to: "vidéo" },
      { from: /vǸ/g, to: "vé" },
      { from: /v?/g, to: "vé" },
      { from: /vid?o/g, to: "vidéo" },
      { from: /v?o/g, to: "vidéo" },
      { from: /v?nements/g, to: "événements" },
      { from: /vnements/g, to: "événements" },
      { from: /v?nement/g, to: "événement" },
      { from: /systme/g, to: "système" },
      { from: /multicamra/g, to: "multicaméra" },
      { from: /scnique/g, to: "scénique" },
      { from: /audiovisuel/g, to: "audiovisuel" },
      { from: /rǸ/g, to: "ré" },
      { from: /dǸ/g, to: "dé" },
      { from: /mǸ/g, to: "mé" },
      { from: /?/g, to: "é" }, // Catch-all for single diamond with question mark
      { from: /Ǹ/g, to: "é" },
    ];

    let fixedJsonStr = jsonStr;
    for (const r of replacements) {
      fixedJsonStr = fixedJsonStr.replace(r.from, r.to);
    }

    if (fixedJsonStr !== jsonStr) {
      console.log(`Found issues in ${key}, fixing...`);
      const fixedData = JSON.parse(fixedJsonStr);
      await redis.set(key, fixedData);
      console.log(`Successfully fixed ${key}`);
    } else {
      console.log(`No issues found in ${key}`);
    }
  }
}

fixEncoding().catch(console.error);
