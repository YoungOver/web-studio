import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const pages = ['index', 'clinic', 'coffee', 'ai-saas', 'repair', 'club', 'detailing', 'school', 'miniapp', 'dashboard', 'shop'].filter((p) => fs.existsSync(path.resolve(__dirname, `${p}.html`)))

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, path.resolve(__dirname, `${p}.html`)])),
    },
  },
})
