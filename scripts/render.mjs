// Screenshot a local HTML file with the system Chrome (headless).
// Usage: node scripts/render.mjs <file.html> <out.jpg> [width] [height] [--full]
import path from 'node:path'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const require = createRequire(path.join(execSync('npm root -g').toString().trim(), '@playwright/mcp/package.json'))
const { chromium } = require('playwright-core')
const [file, out, w = '1440', h = '900'] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const page = await browser.newPage({ viewport: { width: +w, height: +h } })
await page.goto(pathToFileURL(path.resolve(file)).href, { waitUntil: 'networkidle' }).catch(() => {})
await page.waitForTimeout(1500)
await page.screenshot({ path: out, type: 'jpeg', quality: 90, fullPage: process.argv.includes('--full') })
await browser.close()
console.log(out)
