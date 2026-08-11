import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getShopifyRoot, cartUrl, ShopifyAPI } from '../../src/shopify-api.js'

describe('locale-aware cartUrl', () => {
  const origShopify = global.Shopify
  afterEach(() => {
    global.Shopify = origShopify
    global.window = undefined
  })

  it('defaults to / when no Shopify.routes', () => {
    global.window = {}
    global.Shopify = {}
    expect(getShopifyRoot()).toBe('/')
    expect(cartUrl('/cart.js')).toBe('/cart.js')
    expect(cartUrl('/cart/add.js')).toBe('/cart/add.js')
  })

  it('uses Shopify.routes.root with locale prefix', () => {
    global.window = { Shopify: { routes: { root: '/fr/' } } }
    global.Shopify = global.window.Shopify
    expect(getShopifyRoot()).toBe('/fr/')
    expect(cartUrl('/cart.js')).toBe('/fr/cart.js')
    expect(cartUrl('/cart/change.js')).toBe('/fr/cart/change.js')
  })

  it('normalizes root without trailing slash', () => {
    global.window = { Shopify: { routes: { root: '/de' } } }
    global.Shopify = global.window.Shopify
    expect(getShopifyRoot()).toBe('/de/')
    expect(cartUrl('cart/update.js')).toBe('/de/cart/update.js')
  })

  it('ShopifyAPI.getCart fetches locale-aware url', async () => {
    global.window = { Shopify: { routes: { root: '/en/' } } }
    global.Shopify = global.window.Shopify
    // re-import already captured cartUrl via closure — verify via fetch spy
    const fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ items: [] }),
        text: () => Promise.resolve('{"items":[]}'),
      })
    )
    global.fetch = fetchSpy
    global.document = { body: { dispatchEvent: () => {} } }
    global.CustomEvent = class CustomEvent {
      constructor(n, o) {
        this.name = n
        this.detail = o.detail
      }
    }
    // getCart uses jsonFetch -> fetch
    await new Promise((resolve) => {
      ShopifyAPI.getCart(resolve)
    })
    expect(fetchSpy).toHaveBeenCalled()
    const url = fetchSpy.mock.calls[0][0]
    expect(url).toBe('/en/cart.js')
  })
})
