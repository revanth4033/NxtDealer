// Downloads the hand-picked Commons photos (1280px thumbnails), centre-crops them to 1024x768 with macOS sips,
// and writes a manifest + attribution. Usage: node download.mjs <projectRoot>
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
const here = new URL('.', import.meta.url).pathname
const root = process.argv[2]
const UA = 'NxtDealerMockMedia/1.0 (local development script)'
const candidates = JSON.parse(readFileSync(join(here, 'candidates.json'), 'utf8'))
const picks = JSON.parse(readFileSync(join(here, 'picks.json'), 'utf8'))
const outDir = join(root, 'public/mock-media/vehicles'); mkdirSync(outDir, { recursive: true })
const raw = join(here, 'raw'); mkdirSync(raw, { recursive: true })
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const manifest = {}; const credits = []
for (const [model, sets] of Object.entries(picks)) {
  manifest[model] = []
  for (const [colourKey, colourName, indices] of sets) {
    const photos = []
    for (const [n, index] of indices.entries()) {
      const c = candidates[model][index]
      const file = `${slug(model)}-${colourKey}-${n + 1}.jpg`
      const dest = join(outDir, file)
      if (!existsSync(dest)) {
        const thumb = c.thumb.replace(/\/\d+px-/, '/1280px-')
        const tmp = join(raw, file)
        const res = await fetch(thumb, { headers: { 'User-Agent': UA } })
        if (!res.ok) throw new Error(`${res.status} for ${c.title}`)
        writeFileSync(tmp, Buffer.from(await res.arrayBuffer()))
        // Scale to 768px high (or 1024 wide if narrower than 4:3), then centre-crop to 1024x768.
        const ratio = c.width / c.height
        const scaleArgs = ratio >= 4 / 3 ? ['--resampleHeight', '768'] : ['--resampleWidth', '1024']
        execFileSync('sips', [...scaleArgs, tmp, '--out', dest], { stdio: 'ignore' })
        execFileSync('sips', ['--cropToHeightWidth', '768', '1024', '-s', 'formatOptions', 'low', dest], { stdio: 'ignore' })
        await new Promise((r) => setTimeout(r, 1000))
      }
      photos.push(`/mock-media/vehicles/${file}`)
      credits.push({ file, title: c.title.replace(/^File:/, ''), author: c.artist || 'Unknown', license: c.license, source: c.page })
    }
    manifest[model].push({ colourKey, colour: colourName, photos })
  }
  console.log(model.padEnd(24), sets.length, 'sets')
}
rmSync(raw, { recursive: true, force: true })
writeFileSync(join(here, 'manifest.json'), JSON.stringify(manifest, null, 1))
const md = ['# Vehicle photo credits', '', 'Mock inventory photos from Wikimedia Commons, resized and centre-cropped to 1024×768.', 'Used under the licence listed for each file.', '', '| File | Original | Author | Licence |', '| --- | --- | --- | --- |',
  ...credits.map((c) => `| ${c.file} | [${c.title.replace(/\|/g, '\\|')}](${c.source}) | ${c.author.replace(/\|/g, '/')} | ${c.license} |`)].join('\n')
writeFileSync(join(outDir, 'ATTRIBUTION.md'), md + '\n')
console.log('photos:', credits.length)
