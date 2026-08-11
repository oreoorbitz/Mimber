import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { Liquid } from 'liquidjs'

// Same Shopify shims as scripts/liquid-check.mjs — keep in sync.
const filters = {
  image_url: (v, opts) => {
    if (!v) return ''
    const width = opts?.width || opts || 100
    const src = typeof v === 'string' ? v : v.src || v.url || '/cdn/shop/files/placeholder.jpg'
    return `${src}?width=${width}`
  },
  image_tag: (v, ...args) => {
    const opts = args[args.length - 1] && typeof args[args.length - 1] === 'object' ? args[args.length - 1] : {}
    const src = typeof v === 'string' ? v : String(v)
    const alt = opts.alt || ''
    const loading = opts.loading || 'lazy'
    return `<img src="${src}" alt="${alt}" loading="${loading}" />`
  },
  asset_url: (v) => `/assets/${v}`,
  t: (v) => String(v),
  money: (v) => String(v),
}

function makeEngine() {
  const engine = new Liquid({ strictFilters: false, strictVariables: false, strictTags: false })
  for (const [k, fn] of Object.entries(filters)) engine.registerFilter(k, fn)
  const block = (s, e) => ({
    parse(tt, rem) {
      this.tpls = []
      let d = 0
      while (rem.length) {
        const t = rem.shift()
        if (t.name === s) d++
        if (t.name === e) { if (d === 0) break; d-- }
        this.tpls.push(t)
      }
    },
    *render(ctx, emitter) { for (const tpl of this.tpls) { const out = yield tpl; if (out) emitter.write(out) } },
  })
  const line = () => ({ parse(t) { this.args = t.args }, *render(_c, e) { e.write(`<!-- ${this.args} -->`) } })
  engine.registerTag('style', block('style', 'endstyle'))
  engine.registerTag('render', line())
  engine.registerTag('include', line())
  engine.registerTag('section', line())
  engine.registerTag('form', block('form', 'endform'))
  engine.registerTag('paginate', block('paginate', 'endpaginate'))
  engine.registerTag('layout', line())
  engine.registerTag('schema', block('schema', 'endschema'))
  return engine
}

describe('liquidjs sanity', () => {
  it('renders image_tag with lazy/eager via liquidjs', async () => {
    const engine = makeEngine()
    const tpl = engine.parse(`{{ product.featured_image | image_url: width: 800 | image_tag: alt: product.title, loading: 'lazy' }}`)
    const out = await engine.render(tpl, { product: { title: 'T', featured_image: { src: '/a.jpg' } } })
    expect(out).toContain('loading="lazy"')
    expect(out).toMatch(/width=800|width.*800/)
  })

  it('parses all repo .liquid files', async () => {
    const engine = makeEngine()
    const root = path.resolve('..') // tests/unit -> Mimber root via cwd
    // When run via vitest cwd is repo root; walk from '.'
    const files = []
    function walk(dir) {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name)
        if (e.isDirectory()) {
          if (['node_modules', 'dist', '.git', 'vendor'].includes(e.name)) continue
          walk(p)
        } else if (e.name.endsWith('.liquid')) files.push(p)
      }
    }
    const base = fs.existsSync(path.join(process.cwd(), 'snippets')) ? process.cwd() : path.resolve(process.cwd(), '..')
    walk(base)
    expect(files.length).toBeGreaterThan(10)
    for (const f of files) {
      const src = fs.readFileSync(f, 'utf8')
      const tpl = engine.parse(src)
      expect(tpl).toBeTruthy()
    }
  })

  it('rejects broken liquid syntax', async () => {
    const engine = makeEngine()
    // liquidjs is lenient with strictTags:false; broken output still parses — ensure missing end tag is caught only when strict
    const strict = new Liquid({ strictTags: true })
    expect(() => strict.parse('{% if foo %}')).toThrow()
  })
})
