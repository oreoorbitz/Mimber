#!/usr/bin/env node
// Build dist/theme — Shopify 1.0 structure for ThemeKit (keep 1.0, modernize JS → CSS → Liquid)
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..')
const DIST = path.join(ROOT, 'dist', 'theme')
const SRC_DIRS = ['assets', 'config', 'layout', 'locales', 'snippets', 'templates']

const copy = (src, dest) => {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

const copyDir = (name) => {
  const src = path.join(ROOT, name)
  if (!fs.existsSync(src)) return
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const ent of entries) {
    const s = path.join(src, ent.name)
    const d = path.join(DIST, name, ent.name)
    if (ent.isDirectory()) {
      fs.cpSync(s, d, { recursive: true })
    } else {
      copy(s, d)
    }
  }
}

fs.mkdirSync(DIST, { recursive: true })
for (const dir of SRC_DIRS) copyDir(dir)

// overlay built Mimber JS into assets (mepto-free, last 3)
// dist/timber.*.js are ESM/IIFE from src/* (14 modules, 63K pkgd)
const built = [
  ['dist/timber.pkgd.min.js', 'assets/timber.js'],
  ['dist/timber.pkgd.js', 'assets/timber.js'],
]
let placed = false
for (const [srcRel, destRel] of built) {
  const src = path.join(ROOT, srcRel)
  if (fs.existsSync(src) && !placed) {
    copy(src, path.join(DIST, destRel))
    placed = true
    console.log(`theme: ${srcRel} → ${path.join('dist/theme', destRel)}`)
  }
}

// also place mepto if available (peer)
try {
  const meptoSrc = path.join(ROOT, 'node_modules', 'meptos', 'dist', 'mepto.js')
  if (fs.existsSync(meptoSrc)) {
    copy(meptoSrc, path.join(DIST, 'assets', 'mepto.js'))
    console.log('theme: meptos/dist/mepto.js → dist/theme/assets/mepto.js')
  }
} catch {}

console.log(`theme: dist/theme ready (${DIST})`)
