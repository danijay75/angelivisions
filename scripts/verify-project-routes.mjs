// Usage:
// node scripts/verify-project-routes.mjs --base https://your-deploy.vercel.app --slugs slug1,slug2
// or with env:
// BASE_URL=https://your-deploy.vercel.app SLUGS=slug1,slug2 node scripts/verify-project-routes.mjs

const LANGS = ["fr", "en", "es"]

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === "--base") out.base = args[++i]
    if (a === "--slugs") out.slugs = args[++i]
  }
  return out
}

const { base: baseArg, slugs: slugsArg } = parseArgs()
const BASE_URL = (process.env.BASE_URL || baseArg || "").replace(/\/$/, "")
if (!BASE_URL) {
  console.error("❌ Please provide BASE_URL via --base or env BASE_URL")
  process.exit(1)
}

function unique(arr) {
  return Array.from(new Set(arr))
}

async function discoverSlugs(base) {
  try {
    const res = await fetch(`${base}/fr`, { redirect: "follow" })
    const html = await res.text()
    const re = /\/(?:fr|en|es)\/projet\/([a-z0-9-]+)/gi
    const matches = []
    let m
    while ((m = re.exec(html)) !== null) {
      matches.push(m[1])
    }
    const slugs = unique(matches)
    if (slugs.length) {
      console.log(`🔎 Discovered ${slugs.length} slug(s) on /fr:`, slugs.join(", "))
      return slugs
    }
  } catch (e) {
    // ignore
  }
  console.warn("⚠️ Could not auto-discover slugs from /fr; please provide --slugs.")
  return []
}

async function assert200(url) {
  const res = await fetch(url, { redirect: "manual" })
  const ok = res.status === 200
  return { ok, status: res.status, url }
}

async function assertRedirect(url, expectedDestSuffix) {
  const res = await fetch(url, { redirect: "manual" })
  const status = res.status
  const location = res.headers.get("location") || ""
  const ok = (status === 307 || status === 308) && location.endsWith(expectedDestSuffix)
  return { ok, status, location, url }
}

async function assert404(url, expectText) {
  const res = await fetch(url, { redirect: "manual" })
  const status = res.status
  const text = await res.text()
  const ok = status === 404 && (!expectText || text.includes(expectText))
  return { ok, status, url }
}

async function main() {
  const userSlugs = (process.env.SLUGS || slugsArg || "").split(",").map(s => s.trim()).filter(Boolean)
  const slugs = userSlugs.length ? userSlugs : await discoverSlugs(BASE_URL)
  if (!slugs.length) {
    console.error("❌ No slugs to test. Provide via --slugs or ensure /fr lists projects.")
    process.exit(1)
  }

  let passed = 0
  let failed = 0
  const results = []

  for (const slug of slugs) {
    for (const lang of LANGS) {
      const url = `${BASE_URL}/${lang}/projet/${slug}`
      const r = await assert200(url)
      results.push(r)
      if (r.ok) {
        console.log(`✅ 200 ${url}`)
        passed++
      } else {
        console.error(`❌ ${r.status} ${url}`)
        failed++
      }
    }
    const legacy = `${BASE_URL}/projet/${slug}`
    const expectedSuffix = `/fr/projet/${slug}`
    const redir = await assertRedirect(legacy, expectedSuffix)
    results.push(redir)
    if (redir.ok) {
      console.log(`✅ ${redir.status} ${legacy} -> ${redir.location}`)
      passed++
    } else {
      console.error(`❌ Legacy redirect: ${redir.status} ${legacy} -> ${redir.location}`)
      failed++
    }
  }

  // Not found case
  const nf = await assert404(`${BASE_URL}/fr/projet/does-not-exist-__test__`, "Projet introuvable")
  results.push(nf)
  if (nf.ok) {
    console.log(`✅ 404 projects not-found page OK`)
    passed++
  } else {
    console.error(`❌ Not-found test failed: status=${nf.status}`)
    failed++
  }

  console.log(`\nSummary: ${passed} passed, ${failed} failed`)
  process.exit(failed ? 1 : 0)
}

main().catch((e) => {
  console.error("Unexpected error:", e)
  process.exit(1)
})
