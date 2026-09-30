// Unpacks shadcn-registry JSON dumps (fetched through the browser) into src/components.
// Usage: node scripts/unpack-registry.mjs <dump.json> [--no-overwrite]
import fs from 'node:fs'
import path from 'node:path'

const dumpPath = process.argv[2]
const noOverwrite = process.argv.includes('--no-overwrite')
let data = JSON.parse(fs.readFileSync(dumpPath, 'utf8'))
if (typeof data === 'string') data = JSON.parse(data)

const root = path.resolve(import.meta.dirname, '..')
const deps = new Set()
const regDeps = new Set()
const report = []

const sources = [
  ['magic', 'magicui'],
  ['acet', 'aceternity'],
  ['shad', 'ui'],
  ['t21', 'twentyfirst'],
]

for (const [key, dir] of sources) {
  for (const item of data[key] ?? []) {
    if (!item.j) { report.push(`${item.n}: skipped (${item.err})`); continue }
    for (const d of item.j.dependencies ?? []) if (d !== 'cn') deps.add(d)
    for (const d of item.j.registryDependencies ?? []) regDeps.add(d)
    for (const f of item.j.files ?? []) {
      if (!f.content) continue
      const out = path.join(root, 'src', 'components', dir, path.basename(f.path))
      if (noOverwrite && fs.existsSync(out)) { report.push(`${dir}/${path.basename(f.path)} (kept existing)`); continue }
      fs.mkdirSync(path.dirname(out), { recursive: true })
      const content = f.content
        .replace(/@\/registry\/magicui\//g, '@/components/magicui/')
        .replace(/@\/registry\/[\w-]+\/ui\//g, '@/components/ui/')
        .replace(/@\/registry\/[\w-]+\/lib\/utils/g, '@/lib/utils')
      fs.writeFileSync(out, content)
      report.push(`${dir}/${path.basename(f.path)}`)
    }
  }
}

console.log(report.join('\n'))
console.log('DEPS', [...deps].join(' '))
console.log('REGDEPS', [...regDeps].join(' '))
