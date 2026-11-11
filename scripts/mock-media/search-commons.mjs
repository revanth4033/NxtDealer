// Queries Wikimedia Commons for candidate photos per catalogue model. Metadata only; no image downloads.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
const UA = 'NxtDealerMockMedia/1.0 (local development script)'
const MODELS = [
  'Maruti Suzuki Swift', 'Maruti Suzuki Baleno', 'Hyundai i20', 'Tata Altroz', 'Volkswagen Polo',
  'Honda City', 'Hyundai Verna', 'Maruti Suzuki Ciaz', 'Skoda Slavia', 'Maruti Suzuki Dzire',
  'Hyundai Creta', 'Kia Seltos', 'Tata Nexon', 'Mahindra XUV700', 'Mahindra Scorpio-N', 'Toyota Fortuner',
  'Maruti Suzuki Brezza', 'Kia Sonet', 'Toyota Innova Crysta', 'Maruti Suzuki Ertiga', 'Kia Carens', 'Maruti Suzuki XL6',
]
const OK_LICENSE = /^(cc0|cc[- ]by(-sa)?[- ]?[0-9.]*|public domain|pd)/i
const BAD_TITLE = /interior|engine|dashboard|badge|logo|emblem|seat|wheel|boot|trunk|cockpit|steering|light|lamp|grille|detail|crash|test|police|taxi|modified|rally|race|toy|model car|scale/i
const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const file = new URL('./candidates.json', import.meta.url)
const out = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {}
const ALT = { 'Skoda Slavia': ['Slavia'], 'Mahindra XUV700': ['XUV700'], 'Mahindra Scorpio-N': ['Scorpio N', 'Scorpio-N'], 'Toyota Fortuner': ['Fortuner'], 'Maruti Suzuki Brezza': ['Vitara Brezza', 'Brezza'], 'Kia Sonet': ['Sonet'], 'Toyota Innova Crysta': ['Innova Crysta', 'Innova'], 'Maruti Suzuki Ertiga': ['Ertiga'], 'Kia Carens': ['Carens'], 'Maruti Suzuki XL6': ['XL6'] }
async function query(term) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const params = new URLSearchParams({ action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrlimit: '40', gsrsearch: `"${term}" filetype:bitmap`, prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '360', origin: '*' })
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': UA } })
    const text = await res.text()
    try { return JSON.parse(text) } catch { console.log('  rate limited, waiting'); await new Promise((r) => setTimeout(r, 15000 * (attempt + 1))) }
  }
  throw new Error('Gave up on ' + term)
}
for (const model of MODELS) {
  if ((out[model]?.length ?? 0) >= 6) continue
  const seen = new Set((out[model] ?? []).map((c) => c.title))
  const collected = [...(out[model] ?? [])]
  for (const term of [model, ...(ALT[model] ?? [])]) {
  const json = await query(term)
  const pages = Object.values(json.query?.pages ?? {}).sort((a, b) => a.index - b.index)
  const found = pages
    .map((p) => {
      const ii = p.imageinfo?.[0]; const m = ii?.extmetadata ?? {}
      return { title: p.title, width: ii?.width, height: ii?.height, mime: ii?.mime, thumb: ii?.thumburl, url: ii?.url, page: ii?.descriptionurl,
        license: strip(m.LicenseShortName?.value), artist: strip(m.Artist?.value), date: strip(m.DateTimeOriginal?.value).slice(0, 10) }
    })
    .filter((c) => c.mime === 'image/jpeg' && c.width >= 1600 && c.width / c.height >= 1.25 && c.width / c.height <= 1.9 && OK_LICENSE.test(c.license) && !BAD_TITLE.test(c.title))
  for (const c of found) if (!seen.has(c.title)) { seen.add(c.title); collected.push(c) }
  await new Promise((r) => setTimeout(r, 2500))
  }
  out[model] = collected.slice(0, 14)
  console.log(model.padEnd(24), out[model].length)
  writeFileSync(file, JSON.stringify(out, null, 1))
}
