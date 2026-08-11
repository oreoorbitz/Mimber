import { describe, it, expect } from 'vitest'
import { JSDOM } from 'jsdom'
import { cacheSelectors } from '../../src/cache.js'

describe('cacheSelectors', () => {
  it('populates timber cache without throwing', () => {
    const dom = new JSDOM(`<div id="PageContainer"></div><div class="site-header"></div>`)
    global.document = dom.window.document
    const timber = {}
    cacheSelectors(timber)
    expect(timber.cache.$html).toBeDefined()
    delete global.document
  })
})
