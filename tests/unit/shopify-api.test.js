import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ShopifyAPI } from '../../src/shopify-api.js'

describe('ShopifyAPI', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ items: [] }), text: () => Promise.resolve('{}') })
    )
    global.document = { body: { dispatchEvent: () => {} } }
    global.CustomEvent = class CustomEvent {
      constructor(n, o) {
        this.name = n
        this.detail = o.detail
      }
    }
  })

  it('exposes expected methods', () => {
    expect(typeof ShopifyAPI.getCart).toBe('function')
    expect(typeof ShopifyAPI.changeItem).toBe('function')
    expect(typeof ShopifyAPI.addItemFromForm).toBe('function')
  })
})
