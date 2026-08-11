#!/usr/bin/env node
// JS fallback for mimber audit (Go primary: vendor/themekit/cmd/mimber/audit.go)
// Scans Timber→Mimber gaps; outputs audit.json + audit.md for LLM starter.
import fs from 'fs'
import path from 'path'

const target = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '.'
const jsonOnly = process.argv.includes('--json')
const root = path.resolve(target)

const rules = [
  { id:'jquery-ajax', title:'jQuery $.ajax vs fetch + Mepto', severity:'high', re: /\$\.ajax\s*\(|jQuery\.ajax\s*\(/, hint:'Use fetch + ShopifyAPI (src/shopify-api.js)' },
  { id:'jquery-extend-proxy', title:'jQuery $.extend/$.proxy vs Object.assign/bind', severity:'medium', re:/\$\.extend\s*\(|\$\.proxy\s*\(/, hint:'Object.assign / bind' },
  { id:'jquery-selector', title:'jQuery selector $()/jQuery() vs Mepto/native', severity:'medium', re:/\$\(\s*['"\[]|jQuery\(\s*['"\[]/, hint:'window.mepto||jQuery or querySelectorAll' },
  { id:'handlebars', title:'Handlebars vs native <template>', severity:'high', re:/handlebars(\.min)?\.js|Handlebars\.compile|\{\{#?items\}\}/, hint:'Delete handlebars.min.js 46K, use <template> (slice 7)' },
  { id:'locale-fetch', title:'Cart fetch not locale-aware', severity:'high', re:/fetch\(\s*['"]\/cart(\.js|\/add\.js|\/change\.js|\/update\.js)['"]/, hint:"cartUrl('/cart.js') via Shopify.routes.root {{ routes.root_url }} (slice 11)" },
  { id:'locale-form', title:'Product form action not locale-aware', severity:'medium', re:/action="\/cart\/add"/, hint:'action="{{ routes.root_url }}cart/add"' },
  { id:'css-legacy-scss', title:'Legacy timber.scss.css still loaded', severity:'medium', re:/timber\.scss\.css/, hint:"Dawn/Horizon: {% render 'css-variables' %} + {{ 'base.css' | asset_url }} (slice 13)" },
  { id:'js-splitting', title:'Single timber.js vs per-template split', severity:'medium', re:/\{\{\s*'timber\.js'\s*\|/, hint:'type="module" per-template global/product/collection/customer/cart (slice 9)' },
  { id:'css-vendor-prefix', title:'Vendor prefix / IE hack in SCSS (*zoom, -webkit-)', severity:'low', re:/\*zoom:\s*1|@mixin prefixer|-ms-transform|-webkit-transform:\s*translateZ\(0\)/, hint:'Evergreen: transform native, will-change only (slice 12)' },
  { id:'perf-closest', title:'Perf: closest in hot path', severity:'low', re:/\.closest\(/, hint:'Keep closest only for delegation' },
]

function walk(dir, out=[]) {
  for (const e of fs.readdirSync(dir, {withFileTypes:true})) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (['node_modules','dist','.git','vendor','.next'].includes(e.name)) continue
      walk(p, out)
    } else if (/\.(js|liquid|scss|css)$/i.test(e.name) || e.name.endsWith('.liquid')) {
      out.push(p)
    }
  }
  return out
}

const frozen = ['assets/timber.js.liquid','assets/timber.human.js','assets/ajax-cart.js.liquid']
const files = walk(root)
const hits = []
const ruleHits = {}
for (const file of files) {
  const rel = path.relative(root, file)
  if (frozen.some(f=> rel===f || rel.startsWith(f))) continue
  // skip vendor/dist already handled, but also skip frozen SCSS reference for vendor-prefix if it's the legacy file we keep for diff
  const content = fs.readFileSync(file, 'utf8')
  const lines = content.split('\n')
  for (const r of rules) {
    // skip handlebars check for the modern snippet that only mentions it in a comment
    if (r.id==='handlebars' && rel==='snippets/ajax-cart-template.liquid') continue
    // skip css-legacy / js-splitting if inside HTML comment fallback
    for (let i=0;i<lines.length;i++) {
      const line = lines[i]
      if (r.id==='css-legacy-scss' && line.includes('<!--') && line.includes('timber.scss.css')) continue
      // js-splitting fallback timber.js is intentional when global.js (split) already present
      if (r.id==='js-splitting' && content.includes('global.js')) continue
      // skip comment-only lines for jquery-selector to avoid // $('#ProductThumbs') doc
      if (r.id==='jquery-selector' && line.trim().startsWith('//')) continue
      if (r.re.test(line)) {
        const snip = line.trim().slice(0,120)
        hits.push({ rule:r.id, file:rel, line:i+1, snippet:snip, hint:r.hint })
        ruleHits[r.id] = (ruleHits[r.id]||0)+1
      }
    }
  }
}
// synthetic css-vanilla missing
const hasBase = fs.existsSync(path.join(root,'assets/base.css'))
const hasVars = fs.existsSync(path.join(root,'snippets/css-variables.liquid'))
if (!hasBase || !hasVars) {
  const miss = !hasVars ? 'snippets/css-variables.liquid (+ assets/base.css)' : 'assets/base.css'
  hits.push({ rule:'css-missing-vanilla', file:'assets/base.css', line:1, snippet:'missing '+miss, hint:'Generate base.css via npx sass (slice 13, Dawn/Horizon)' })
  ruleHits['css-missing-vanilla'] = (ruleHits['css-missing-vanilla']||0)+1
}
hits.sort((a,b)=> a.rule.localeCompare(b.rule) || a.file.localeCompare(b.file) || a.line-b.line)
let score = 100
for (const r of [...rules, {id:'css-missing-vanilla', title:'Missing vanilla CSS', severity:'high'}]) {
  const c = ruleHits[r.id]||0
  if (!c) continue
  let per = r.severity==='high'?15 : r.severity==='medium'?8 : 3
  let ded = per + (c>3?(Math.min(c-3,8)*2):0)
  ded = Math.min(ded,25)
  score -= ded
}
if (hasBase&&hasVars) score = Math.min(100, score+5)
if (score<0) score=0
const rulesOut = [...rules, {id:'css-missing-vanilla', title:'Missing vanilla CSS', severity:'high'}].map(r=>({id:r.id, title:r.title, severity:r.severity, hits:ruleHits[r.id]||0}))
const result = { target: root, score, rules: rulesOut, hits, summary: hits.length?`${hits.length} hits; score ${score}/100 — run per AGENTS.md slices 7→13`:'modern — no hits; score 100/100' }

if (jsonOnly) {
  console.log(JSON.stringify(result, null, 2))
} else {
  fs.writeFileSync(path.join(root,'audit.json'), JSON.stringify(result, null, 2)+'\n')
  let md = `# Mimber audit — ${result.target}\n\n**Score ${result.score}/100** — ${result.summary}\n\n| Rule | Severity | Hits | Title |\n|---|---|---|---|\n`
  for (const ru of result.rules) md += `| ${ru.id} | ${ru.severity} | ${ru.hits} | ${ru.title} |\n`
  if (hits.length) {
    md += `\n## Hits (for LLM starter)\n\n| Rule | File:Ln | Snippet | Hint |\n|---|---|---|---|\n`
    for (const h of hits) md += `| ${h.rule} | ${h.file}:${h.line} | \`${h.snippet.replace(/\|/g,'\\|')}\` | ${h.hint} |\n`
    md += `\n## LLM starter prompt\n\nCopy Mimber folder as \`mimber-reference/\`, then prompt:\n\n\`\`\`\nRead mimber-reference/AGENTS.md then modernize this theme per audit.json hits.\nPrioritize high severity: handlebars, locale-fetch, jquery-ajax, css-missing-vanilla.\nKeep diff minimal per slice; preserve client business logic.\n\`\`\`\n`
  }
  fs.writeFileSync(path.join(root,'audit.md'), md)
  console.log(`audit: ${hits.length} hits across ${rulesOut.filter(r=>r.hits).length} rules → ${root}/audit.{json,md} (score ${score}/100)`)
  console.log(md.split('\n').slice(0,30).join('\n'))
}
