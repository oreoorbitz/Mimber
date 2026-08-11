import { describe, it, expect } from 'vitest'
import { replaceUrlParam } from '../../src/url.js'

describe('replaceUrlParam', () => {
  it('replaces existing param', () => {
    expect(replaceUrlParam('/collections/all?sort_by=manual&view=grid', 'sort_by', 'price-ascending')).toBe(
      '/collections/all?sort_by=price-ascending&view=grid'
    )
  })
  it('appends param when missing', () => {
    expect(replaceUrlParam('/collections/all', 'view', 'list')).toBe('/collections/all?view=list')
  })
})
