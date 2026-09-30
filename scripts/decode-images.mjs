// Decodes a browser-made base64 image dump into public/img and writes photo credits.
import fs from 'node:fs'
import path from 'node:path'

let data = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
if (typeof data === 'string') data = JSON.parse(data)
const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, 'public', 'img')
fs.mkdirSync(outDir, { recursive: true })
const credits = []
for (const [name, v] of Object.entries(data)) {
  if (v.err || !v.b64) { console.log(`${name}: ERR ${v.err}`); continue }
  if (v.premium) { console.log(`${name}: skipped premium`); continue }
  const buf = Buffer.from(v.b64, 'base64')
  fs.writeFileSync(path.join(outDir, `${name}.jpg`), buf)
  credits.push(`${name}.jpg — ${v.by} — ${v.link}`)
  console.log(`${name}.jpg ${Math.round(buf.length / 1024)} KB`)
}
fs.writeFileSync(path.join(outDir, 'CREDITS.txt'), 'Фото: Unsplash (Unsplash License)\n' + credits.join('\n') + '\n')
