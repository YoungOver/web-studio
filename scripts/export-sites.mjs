// Copies the multi-page build into one self-contained folder per site: ../<site>/dist/index.html + assets.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const pages = { index: 'pulse', clinic: 'clinic', coffee: 'coffee', 'ai-saas': 'ai-saas', repair: 'repair', club: 'club', detailing: 'detailing', school: 'school', miniapp: 'miniapp', dashboard: 'dashboard', shop: 'shop' }

for (const [page, site] of Object.entries(pages)) {
  const src = path.join(dist, `${page}.html`)
  if (!fs.existsSync(src)) { console.log(`skip ${site}: no ${page}.html`); continue }
  const out = path.join(root, '..', site, 'dist')
  fs.rmSync(out, { recursive: true, force: true })
  fs.mkdirSync(out, { recursive: true })
  fs.copyFileSync(src, path.join(out, 'index.html'))
  fs.cpSync(path.join(dist, 'assets'), path.join(out, 'assets'), { recursive: true })
  if (fs.existsSync(path.join(dist, 'img'))) fs.cpSync(path.join(dist, 'img'), path.join(out, 'img'), { recursive: true })
  console.log(`exported ${site}`)
}
