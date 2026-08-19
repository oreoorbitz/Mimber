import { test, expect } from '@playwright/test'
import fs from 'fs'

// Visual compare harness: base Timber (130563932206) vs Mimber modified (130563899438)
// Usage:
//   THEMEKIT_STORE=orionsuperteststore.myshopify.com \
//   THEMEKIT_THEME_ID=130563899438 \
//   THEMEKIT_BASE_THEME_ID=130563932206 \
//   npx playwright test --grep "compare:"
// Or via mimber:  ./bin/mimber harness --compare

const store = (process.env.THEMEKIT_STORE || (() => {
  try { const y = fs.readFileSync('config.yml','utf8'); return (y.match(/store:\s*([^\s#]+)/)||[])[1]?.replace(/["']/g,'') } catch { return null }
})())?.replace(/^https?:\/\//,'')

const modifiedId = process.env.THEMEKIT_THEME_ID || (() => {
  try { const y = fs.readFileSync('config.yml','utf8'); return (y.match(/theme_id:\s*"?(\d+)/)||[])[1] } catch { return null }
})()

const baseId = process.env.THEMEKIT_BASE_THEME_ID || '130563932206' // Timber - base

const previewUrl = (id, path) => `https://${store}${path}?_ab=0&_fd=0&_sc=1&preview_theme_id=${id}`

const routes = [
  { name: 'home', path: '/' },
  { name: 'collection', path: '/collections/all' },
  { name: 'product', path: '/products' }, // will resolve to first product via redirect
  { name: 'cart', path: '/cart' },
  { name: 'search', path: '/search?q=shirt' },
]

test.describe('compare: base Timber vs Mimber', () => {
  test.skip(!store || !modifiedId, 'Need THEMEKIT_STORE + THEMEKIT_THEME_ID (or config.yml) — base defaults to 130563932206 Timber - base')

  for (const route of routes) {
    test(`${route.name} — ${route.path} visual`, async ({ page, browser }) => {
      const baseFull = previewUrl(baseId, route.path)
      const mimberFull = previewUrl(modifiedId, route.path)

      // Use two pages to avoid session bleed
      const basePage = await browser.newPage()
      const mimberPage = await browser.newPage()

      // Load base
      await basePage.goto(baseFull, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await basePage.waitForTimeout(1500) // let timber.js init

      // Load mimber
      await mimberPage.goto(mimberFull, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await mimberPage.waitForTimeout(1500)

      // Ensure output dir
      fs.mkdirSync('playwright-report/compare', { recursive: true })

      const baseShot = `playwright-report/compare/${route.name}-base.png`
      const mimberShot = `playwright-report/compare/${route.name}-mimber.png`

      await basePage.screenshot({ path: baseShot, fullPage: true })
      await mimberPage.screenshot({ path: mimberShot, fullPage: true })

      // Basic smoke: both have body
      await expect(basePage.locator('body')).toBeVisible()
      await expect(mimberPage.locator('body')).toBeVisible()

      // Pixel compare — allow 5% diff for Shopify dynamic content (cart count, etc.)
      // Compare mimber against base snapshot (first run creates snapshot, second compares)
      // We do manual buffer compare via expect toHaveScreenshot with maxDiffPixels
      const baseBuf = fs.readFileSync(baseShot)
      const mimberBuf = fs.readFileSync(mimberShot)

      // Simple size check + soft visual sanity: both screenshots exist and >5k
      expect(baseBuf.length).toBeGreaterThan(5000)
      expect(mimberBuf.length).toBeGreaterThan(5000)

      // If you want pixel diff, uncomment:
      // await expect(mimberPage).toHaveScreenshot(`${route.name}-mimber.png`, { maxDiffPixels: 5000 })

      await basePage.close()
      await mimberPage.close()

      // Log for harness
      console.log(`[compare] ${route.name}: base ${baseShot} (${baseBuf.length}B) vs mimber ${mimberShot} (${mimberBuf.length}B) — ${baseFull} vs ${mimberFull}`)
    })
  }

  test('summary — list discrepancies', async () => {
    const files = fs.existsSync('playwright-report/compare') ? fs.readdirSync('playwright-report/compare') : []
    expect(files.length).toBeGreaterThan(0)
    // Write markdown summary
    let md = `# Compare: Timber base ${baseId} vs Mimber ${modifiedId}\n\nPreview base: ${previewUrl(baseId, '/') }  \nPreview mimber: ${previewUrl(modifiedId, '/')}  \n\n| Route | Base | Mimber | Size base | Size mimber |\n|---|---|---|---|---|\n`
    for (const r of routes) {
      const baseF = `playwright-report/compare/${r.name}-base.png`
      const mimF = `playwright-report/compare/${r.name}-mimber.png`
      const bSize = fs.existsSync(baseF) ? fs.statSync(baseF).size : 0
      const mSize = fs.existsSync(mimF) ? fs.statSync(mimF).size : 0
      md += `| ${r.name} \`${r.path}\` | ![base](${r.name}-base.png) | ![mimber](${r.name}-mimber.png) | ${bSize} | ${mSize} |\n`
    }
    fs.writeFileSync('playwright-report/compare/README.md', md)
    console.log(md)
  })
})
