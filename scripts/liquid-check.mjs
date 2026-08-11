#!/usr/bin/env node
// liquid-check.mjs — LLM sanity for Liquid (https://liquidjs.com, https://github.com/harttle/liquidjs)
// Parses/renders Shopify Liquid with dummy context to catch syntax + filter errors before deploy.
// Modern Mimber uses image_url/image_tag, routes.root_url, css-variables — all mocked here.
import fs from 'fs'
import path from 'path'
import { Liquid } from 'liquidjs'

const jsonOnly = process.argv.includes('--json')
const positional = process.argv.slice(2).filter(a => !a.startsWith('--'))[0]
const target = positional ? path.resolve(positional) : path.resolve('.')

// Minimal Shopify filters that liquidjs doesn't know — mock to avoid parse errors
const shopifyFilters = {
  image_url: (v, opts) => {
    // mock: return placeholder URL; opts like {width: 800}
    if (!v) return ''
    const width = opts?.width || opts || 100
    const src = typeof v === 'string' ? v : v.src || v.url || '/cdn/shop/files/placeholder.jpg'
    return `${src}?width=${width}`
  },
  image_tag: (v, ...args) => {
    // liquidjs calls image_tag with URL string + hash opts
    const opts = args[args.length - 1] && typeof args[args.length - 1] === 'object' ? args[args.length - 1] : {}
    const src = typeof v === 'string' ? v : String(v)
    const alt = opts.alt || ''
    const loading = opts.loading || 'lazy'
    const fetchpriority = opts.fetchpriority ? ` fetchpriority="${opts.fetchpriority}"` : ''
    const id = opts.id ? ` id="${opts.id}"` : ''
    const klass = opts.class ? ` class="${opts.class}"` : ''
    const widths = opts.widths ? ` data-widths="${opts.widths}"` : ''
    return `<img src="${src}" alt="${alt}" loading="${loading}"${fetchpriority}${id}${klass}${widths} />`
  },
  img_url: (v, size) => {
    // legacy shim — delegate to image_url mock
    if (!v) return ''
    const src = typeof v === 'string' ? v : v.src || v.url || '/cdn/shop/files/placeholder.jpg'
    return `${src}?size=${size}`
  },
  asset_url: (v) => `/assets/${v}`,
  shopify_asset_url: (v) => `https://cdn.shopify.com/s/assets/${v}`,
  stylesheet_tag: (v) => `<link rel="stylesheet" href="${v}" />`,
  script_tag: (v) => `<script src="${v}"></script>`,
  global_asset_url: (v) => `https://cdn.shopify.com/shopifycloud/shopify/assets/${v}`,
  t: (v) => String(v),
  money: (v) => `$${(Number(v) / 100).toFixed(2)}`,
  money_with_currency: (v) => `$${(Number(v) / 100).toFixed(2)} USD`,
  json: (v) => JSON.stringify(v),
  escape: (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;'),
  handle: (v) => String(v).toLowerCase().replace(/\s+/g, '-'),
  handleize: (v) => String(v).toLowerCase().replace(/\s+/g, '-'),
  within: (v, c) => String(v),
  link_to: (v, url) => `<a href="${url}">${v}</a>`,
  customer_logout_link: (v) => `<a href="/account/logout">${v}</a>`,
  customer_login_link: (v) => `<a href="/account/login">${v}</a>`,
  customer_register_link: (v) => `<a href="/account/register">${v}</a>`,
  default_pagination: (v) => String(v),
  // Shopify-specific no-ops
  font_face: () => '',
  font_modify: (v) => v,
  color_brightness: () => 128,
  color_lighten: (v) => String(v),
  color_darken: (v) => String(v),
}

const dummyProduct = {
  title: 'Example Product',
  url: '/products/example',
  available: true,
  price: 1999,
  compare_at_price: 2499,
  compare_at_price_max: 2499,
  price_varies: false,
  featured_image: { src: '/cdn/shop/files/product.jpg', alt: 'Product image', width: 800, height: 800 },
  images: [
    { src: '/cdn/shop/files/product-1.jpg', alt: 'Image 1' },
    { src: '/cdn/shop/files/product-2.jpg', alt: 'Image 2' },
  ],
  variants: [{ id: 1, title: 'Default', available: true, price: 1999, sku: 'SKU1' }],
  options: ['Title'],
  selected_or_first_available_variant: { id: 1, title: 'Default', available: true, price: 1999, featured_image: { src: '/cdn/shop/files/product.jpg', alt: 'Product' } },
  description: '<p>Description</p>',
}
const dummyContext = {
  shop: { url: 'https://example.myshopify.com', name: 'Example Shop', currency: 'USD', money_format: '${{amount}}', domain: 'example.myshopify.com' },
  product: dummyProduct,
  collection: { title: 'Collection', url: '/collections/all', handle: 'all', image: { src: '/cdn/shop/files/collection.jpg', alt: 'Collection' }, products: [dummyProduct], all_products_count: 1, previous_product: null, next_product: null },
  collections: { frontpage: { products: [dummyProduct] }, all: { handle: 'all' } },
  cart: { item_count: 1, total_price: 1999, items: [{ product_title: 'Example', quantity: 1, image: '/cdn/shop/files/product.jpg', url: '/products/example', key: 'abc', line_price: 1999, original_line_price: 1999, vendor: 'Vendor', variant_title: 'Default', properties: {}, discounts: [] }], note: '', total_discount: 0 },
  settings: { color_primary: '#204a80', color_secondary: '#dcdcdc', color_body_text: '#333', color_body_bg: '#fff', color_borders: '#e5e5e5', color_footer_bg: '#f2f2f2', color_footer_text: '#636', color_footer_social_link: '#bbb', logo_max_width: '450', ajax_cart_method: 'drawer', cart_notes_enable: false, footer_social_enable: false, footer_newsletter_enable: false },
  routes: { root_url: '/' },
  request: { locale: { iso_code: 'en' } },
  section: { index: 1, location: 'template' },
  shopify: { routes: { root: '/' } },
  canonical_url: 'https://example.myshopify.com/',
  page_title: 'Test',
  current_tags: [],
  current_page: 1,
  paginate: { pages: 1 },
  blogs: { news: { articles: [{ title: 'Article', url: '/blogs/news/article', published_at: new Date().toISOString(), excerpt: 'Excerpt', content: 'Content', image: { src: '/cdn/shop/files/article.jpg', alt: 'Article' } }] } },
  article: { title: 'Article', image: { src: '/cdn/shop/files/article.jpg', alt: 'Article' } },
  gift_card: { initial_value: 5000, currency: 'USD' },
  now: new Date().toISOString(),
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (['node_modules', 'dist', '.git', 'vendor', '.next'].includes(e.name)) continue
      walk(p, out)
    } else if (e.name.endsWith('.liquid')) {
      out.push(p)
    }
  }
  return out
}

const files = fs.statSync(target).isDirectory() ? walk(target) : [target]
const engine = new Liquid({ strictFilters: false, strictVariables: false, strictTags: false, jekyllInclude: false, cache: false })
for (const [k, fn] of Object.entries(shopifyFilters)) engine.registerFilter(k, fn)
function blockTag(start, end) {
  return {
    parse(tagToken, remainTokens) {
      this.tpls = []
      let depth = 0
      while (remainTokens.length) {
        const t = remainTokens.shift()
        if (t.name === start) depth++
        if (t.name === end) {
          if (depth === 0) break
          depth--
        }
        this.tpls.push(t)
      }
    },
    *render(ctx, emitter) { for (const tpl of this.tpls) { const out = yield tpl; if (out) emitter.write(out) } },
  }
}
function lineTag() { return { parse(token) { this.args = token.args }, *render(ctx, emitter) { emitter.write(`<!-- ${this.args} -->`) } } }
// Mock Shopify tags that liquidjs doesn't know
engine.registerTag('style', blockTag('style', 'endstyle'))
engine.registerTag('render', lineTag())
engine.registerTag('include', lineTag())
engine.registerTag('section', lineTag())
engine.registerTag('form', blockTag('form', 'endform'))
engine.registerTag('paginate', blockTag('paginate', 'endpaginate'))
engine.registerTag('layout', lineTag())
engine.registerTag('schema', blockTag('schema', 'endschema'))

const results = []
for (const file of files) {
  const rel = path.relative(path.resolve('.'), file)
  const src = fs.readFileSync(file, 'utf8')
  try {
    const tpl = engine.parse(src)
    // Render with dummy context (catches runtime filter errors like image_tag)
    await engine.render(tpl, dummyContext)
    results.push({ file: rel, ok: true })
  } catch (e) {
    results.push({ file: rel, ok: false, error: e.message.split('\n')[0].slice(0, 300) })
  }
}

const failed = results.filter(r => !r.ok)
const ok = results.filter(r => r.ok)

if (jsonOnly) {
  console.log(JSON.stringify({ target: path.resolve(target), total: results.length, ok: ok.length, failed: failed.length, results }, null, 2))
} else {
  console.log(`liquid-check: ${ok.length}/${results.length} ok, ${failed.length} failed — ${target}`)
  for (const r of failed) console.log(`  ✖ ${r.file}: ${r.error}`)
  for (const r of ok.slice(0, 5)) console.log(`  ✓ ${r.file}`)
  if (failed.length) console.log(`\nFix: ensure image_url: width: + image_tag loading:'lazy'/'eager' per shopify.dev, and css-variables snippet exists.`)
  // Write audit companion
  const out = { target: path.resolve(target), total: results.length, ok: ok.length, failed: failed.length, results }
  try { fs.writeFileSync(path.join(path.resolve(target), 'liquid-audit.json'), JSON.stringify(out, null, 2) + '\n') } catch {}
}

process.exit(failed.length ? 1 : 0)
