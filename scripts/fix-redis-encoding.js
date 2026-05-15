const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: "https://engaged-quetzal-20185.upstash.io",
  token: "AU7ZAAIncDFlZDcyYzY3Y2ZiNzY0NTkzYjVlZWFhZGEyYmM3YWFkOXAxMjAxODU",
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
    
    // Common corruptions observed in the browser subagent screenshots
    const replacements = [
      { from: /vid\uFFFD\uFFFD/g, to: "vidéo" },
      { from: /vid\uFFFD/g, to: "vidéo" },
      { from: /v\uFFFD\uFFFD/g, to: "vé" },
      { from: /multicam\uFFFD\uFFFD/g, to: "multicaméra" },
      { from: /syst\uFFFD\uFFFD/g, to: "système" },
      { from: /sc\uFFFD\uFFFD/g, to: "scénique" },
      { from: /r\uFFFD\uFFFD/g, to: "ré" },
      { from: /d\uFFFD\uFFFD/g, to: "dé" },
      { from: /m\uFFFD\uFFFD/g, to: "mé" },
      { from: /v\uFFFDnements/g, to: "événements" },
      { from: /v\uFFFDnement/g, to: "événement" },
      { from: /\uFFFD/g, to: "é" }, // Single diamond question mark fallback
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
