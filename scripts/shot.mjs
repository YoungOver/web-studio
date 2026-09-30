// Headless screenshots of built pages (dist/) with the system Chrome.
// Usage: node scripts/shot.mjs <page> [--rm] [--w 1440] [--h 900] [--at 0,0.3,0.6] [--sel "#id"] [--wait 6000] [--out dir]
//   <page>  html name without extension (club, detailing, school, index...)
//   --rm    emulate prefers-reduced-motion: reduce (the client's Windows has animations off)
//   --dist  build folder relative to project root (default dist)
//   --at    comma list of scroll fractions of page height; --sel scrolls an element into view instead
// Prints saved file paths and any console errors / page errors.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'

const globalRoot = execSync('npm root -g').toString().trim()
const require = createRequire(path.join(globalRoot, '@playwright/mcp/package.json'))
const { chromium } = require('playwright-core')

const args = process.argv.slice(2)
const name = args[0]
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d }
const rm = args.includes('--rm')
const W = +opt('--w', 1440), H = +opt('--h', 900)
const at = opt('--at', '0').split(',').map(Number)
const sel = opt('--sel', '')
const wait = +opt('--wait', 6000)
const dist = path.resolve(import.meta.dirname, '..', opt('--dist', 'dist'))
const outDir = path.resolve(opt('--out', path.join(import.meta.dirname, '..', '.shots')))
fs.mkdirSync(outDir, { recursive: true })

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json', '.webp': 'image/webp' }
const server = http.createServer((req, res) => {
  const p = path.join(dist, decodeURIComponent(req.url.split('?')[0]))
  fs.readFile(p, (err, buf) => {
    if (err) { res.writeHead(404); return res.end() }
    res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); res.end(buf)
  })
}).listen(0)
const port = server.address().port

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const page = await browser.newPage({ viewport: { width: W, height: H }, reducedMotion: rm ? 'reduce' : 'no-preference' })
const logs = []
page.on('console', (m) => { if (m.type() === 'error') logs.push('console: ' + m.text().slice(0, 300)) })
page.on('pageerror', (e) => logs.push('pageerror: ' + e.message.slice(0, 300)))
await page.goto(`http://localhost:${port}/${name}.html`, { waitUntil: 'load' })
await page.waitForTimeout(wait)
await page.mouse.move(W * 0.5, H * 0.4); await page.mouse.move(W * 0.7, H * 0.3, { steps: 10 })
const saved = []
const tag = `${name}${rm ? '_rm' : ''}_${W}`
if (sel) {
  await page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel)
  await page.waitForTimeout(2500)
  const f = path.join(outDir, `${tag}_sel.jpg`); await page.screenshot({ path: f, type: 'jpeg', quality: 70 }); saved.push(f)
} else {
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  for (const fr of at) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * fr))
    await page.waitForTimeout(fr === 0 ? 500 : 2500)
    const f = path.join(outDir, `${tag}_${String(fr).replace('.', '')}.jpg`)
    await page.screenshot({ path: f, type: 'jpeg', quality: 70 }); saved.push(f)
  }
}
console.log(saved.join('\n'))
console.log(logs.length ? logs.join('\n') : 'no console errors')
await browser.close(); server.close()
