#!/usr/bin/env node
// Themekit bundled with Mepto — prefers oreoorbitz/themekit fork (vendor/themekit), falls back to @shopify/themekit or `theme` PATH.
// Why fork: Shopify archived ThemeKit; we bundle Mepto-customized fork for Timber 1.0 (assets/layout/snippets/templates/config) while 2.0 `shopify theme` CLI rejects 1.0.
// Build order: JS → CSS → Liquid. ThemeKit is used only for deploy/watch (1.0 compat), not for JS bundling (Vite esnext+Babel last3).
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const candidates = [
  path.join(ROOT, 'vendor/themekit/bin/theme'),         // go build from fork
  path.join(ROOT, 'node_modules/@shopify/themekit/bin/theme'), // npm wrapper (S3)
  'theme',                                               // PATH
  'shopify-themekit',                                    // alias
]

const resolveBin = () => {
  for (const c of candidates) {
    if (c.includes('/') && fs.existsSync(c)) return c
    if (!c.includes('/')) return c // PATH lookup will be tried by spawn
  }
  return 'theme'
}

const bin = resolveBin()
const args = process.argv.slice(2)
if (args.length === 0) {
  console.log(`themekit (bundled with Mepto): fork oreoorbitz/themekit @ ${path.join(ROOT, 'vendor/themekit')} — falls back to @shopify/themekit / PATH`)
  console.log(`bin: ${bin}`)
  console.log('usage: node scripts/themekit.mjs [theme args]  |  npm run theme:deploy  etc.')
  process.exit(0)
}

const child = spawn(bin, args, { stdio: 'inherit', cwd: ROOT })
child.on('exit', (code) => process.exit(code ?? 1))
