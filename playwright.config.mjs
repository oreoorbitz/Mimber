import { defineConfig } from '@playwright/test'
import fs from 'fs'

// Preview URL derived from config.yml (ThemeKit) or env.
// LLM harness: set THEMEKIT_STORE / THEMEKIT_THEME_ID or fill config.yml then run `npm run test:preview`.
// URL format: https://{store}/?_ab=0&_fd=0&_sc=1&preview_theme_id={theme_id}  (ThemeKit legacy preview)
const readPreviewUrl = () => {
  const envStore = process.env.THEMEKIT_STORE
  const envId = process.env.THEMEKIT_THEME_ID
  if (envStore && envId) return `https://${envStore.replace(/^https?:\/\//, '')}/?_ab=0&_fd=0&_sc=1&preview_theme_id=${envId}`
  try {
    const yml = fs.readFileSync('./config.yml', 'utf8')
    const store = (yml.match(/store:\s*([^\s#]+)/) || [])[1]?.replace(/["']/g, '')
    const themeId = (yml.match(/theme_id:\s*"?(\d+)/) || [])[1]
    if (store && themeId) return `https://${store.replace(/^https?:\/\//, '')}/?_ab=0&_fd=0&_sc=1&preview_theme_id=${themeId}`
  } catch {}
  return null
}

const previewUrl = readPreviewUrl()

export default defineConfig({
  testDir: 'tests',
  testMatch: /.*\.spec\.js/,
  testIgnore: /unit\/.*/,
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // preview harness will override baseURL if previewUrl available
    baseURL: previewUrl || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  // Don't require a webServer for Shopify preview (remote store)
  webServer: undefined,
  // LLM can run `npx playwright test --grep preview` without a store by using file:// dist/theme preview
})
