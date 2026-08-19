# Mimber — Timber, modernized

**Timber 2.2.2, rebuilt with Mepto + Go.** A reference fork of [Shopify/Timber](https://github.com/Shopify/Timber) (2014, MIT) for the thousands of live stores still running it. Not a new theme — a **copy-paste reference** to modernize your Timber fork without rewriting your business logic.

> **Start here:** `AGENTS.md` is the router for LLMs. This README is for humans.

Live demo (unpublished, preview):
- **Mimber (this repo):** `https://orionsuperteststore.myshopify.com?_ab=0&_fd=0&_sc=1&preview_theme_id=130563899438`
- **Base Timber:** `https://orionsuperteststore.myshopify.com?_ab=0&_fd=0&_sc=1&preview_theme_id=130563932206`

---

## What you get

Mimber keeps your store looking the same, but ships **~60% smaller, faster JS/CSS**:

- **No jQuery** — `window.mepto || jQuery` fallback, `fetch` + `ShopifyAPI`, `classList`, `CustomEvent`
- **No Handlebars** — 46K `handlebars.min.js` deleted, native `<template>` (save 1 request)
- **No SCSS build** — `timber.scss.liquid` (58K) → vanilla `assets/base.css` (Dawn/Horizon `css-variables`)
- **Split JS** — `global` + `product` + `collection` + `customer` + `cart` as `type="module"` chunks, each <14K gzip (HTTP/2), plus legacy `timber.pkgd.min.js` fallback
- **Images** — `img_url: 'large'` → `image_url: width: 400 | image_tag: loading: 'lazy'` / `eager` + `fetchpriority: high` for LCP

Full slice log → `AGENTS.md` (slices 0–13, 15, 17). Perf notes → `PERFORMANCE_GUIDE.md`.

---

## Quick start

**Requires:** Node 22 + Go 1.22. `nvm use`, `go version`.

```bash
git clone https://github.com/oreoorbitz/Mimber && cd Mimber
git submodule update --init vendor/themekit   # ThemeKit fork (1.0, Go)
npm install
npx playwright install --with-deps chromium    # first time

# 1) configure your store (one time)
cp config.yml.example config.yml
# edit store, password (private app), theme_id — or use env:
# THEMEKIT_STORE=your-store.myshopify.com THEMEKIT_PASSWORD=shppa_... THEMEKIT_THEME_ID=123

# 2) build + check
npm run build          # image/js/a11y/liquid checks → esbuild Go → dist/theme
npm run check          # same checks + lint + typecheck

# 3) deploy + preview
npm run build          # or: go run ./cmd/mimber build
./bin/mimber preview --url
# or with env
THEMEKIT_STORE=... THEMEKIT_THEME_ID=... ./bin/mimber preview --url

# deploy the built theme
./bin/mimber deploy
# or: npm run mimber:deploy
```

Single binary: `go build -mod=mod -o bin/mimber ./cmd/mimber && ./bin/mimber --help`

---

## Using Mimber on a client store

Most client themes are 5–10yr forks of Timber. Don't replace them — **diff against Mimber**:

1. Copy this folder into the client repo: `cp -r Mimber mimber-reference/`
2. Tell your LLM: *“Read `mimber-reference/AGENTS.md` then modernize `assets/timber.js`.”*
3. The LLM diffs `mimber-reference/assets/timber.human.js` (readable 496L) vs `client/assets/timber.js` and applies the slice patterns (`src/cache.js`, `src/drawers.js`, etc.) — preserving the client's `product.js` forks and apps.
4. Build in `mimber-reference`: `./bin/mimber build` → copy `dist/theme/assets/timber.js` → `client/assets/timber.js`, update `layout/theme.liquid` to load `mepto.js` + `base.css` + `css-variables`.

That’s it. No `bower`, no `Vite`, no `shopify theme` 2.0 (it rejects Timber 1.0 — use the bundled ThemeKit).

---

## CLI

| Command | What |
|---|---|
| `go run ./cmd/mimber build` | `image`/`js`/`a11y`/`liquid` checks + `esbuild` → `dist/timber.*` + `dist/theme` |
| `go run ./cmd/mimber deploy` | Upload `dist/theme` (`config.yml` `store`/`theme_id`/`password`) |
| `go run ./cmd/mimber preview --url` | Print `https://x.y/?_ab=0&_fd=0&_sc=1&preview_theme_id=z` |
| `go run ./cmd/mimber harness` | `build` → `playwright --grep local` (offline, 2 tests) |
| `go run ./cmd/mimber harness --preview` | `build` → `deploy` → `playwright --grep preview` (live store) |
| `go run ./cmd/mimber harness --compare` | Visual compare: base `130563932206` vs Mimber `130563899438` (5 routes, `playwright-report/compare/`) |

`npm run` aliases: `build`, `check`, `mimber:build`, `mimber:deploy`, `mimber:preview`, `mimber:harness`, `test:compare`, `audit`, `liquid:check`.

---

## Checks (Go, offline, no store auth)

All six run in `npm run build` and `go run ./cmd/mimber build` (`MIMBER_SKIP_CHECKS=1` to bypass):

| Check | Command | What it catches |
|---|---|---|
| `image` | `go run ./cmd/image-analyzer --check . --json` | `img_url: 'large'` → `image_url: width:` + `image_tag` `alt`/`widths`/`loading` |
| `js` | `go run ./cmd/js-analyzer --check .` | `$.ajax`/`$.extend`/`Handlebars` → `fetch`/`<template>`, locale `cartUrl()` |
| `a11y` | `go run ./cmd/a11y-analyzer --check .` | `alt`, `input` `label`/`aria-label`, `button` `type`/`name`, `h1` hierarchy |
| `liquid` | `node scripts/liquid-check.mjs` + `go run ./cmd/mimber liquid --check` | `image_url`/`image_tag`/`paginate`/`render` mocks, `config/` drops any |
| `css` | `go run ./cmd/css-analyzer --json` | 90%+ `critical.css` vs `base.css` |
| `audit` | `node scripts/audit.mjs --json` | 13 rules, score 0–100 → `audit.json` for LLM starter |

Current Mimber: `image 0` · `js 0 high (11 closest low)` · `a11y 0 high (1 medium cart qty)` · `liquid 42/42` · `css-analyze` 27 threshold · `audit` 86/100 (only `closest` low).

---

## MCP 2.0 for your editor (Claude/Cursor)

`bin/mimber mcp` is an MCP server (spec 2026-07-28, `mcp-go`):

```bash
./bin/mimber mcp --stdio          # stdio for Claude/Cursor
./bin/mimber mcp --http :3202     # Streamable HTTP at http://127.0.0.1:3202/mcp
./bin/mimber mcp --help
```

`.vscode/mcp.json` / `claude mcp`:
```json
{ "mcpServers": { "mimber": { "command": "/abs/path/Mimber/bin/mimber", "args": ["mcp","--stdio"], "env": { "THEMEKIT_STORE":"orionsuperteststore.myshopify.com","THEMEKIT_THEME_ID":"130563899438","THEMEKIT_BASE_THEME_ID":"130563932206" } } } }
```

**Tools** (LLM calls): `mimber_image_check`, `mimber_js_check`, `mimber_a11y_check`, `mimber_liquid_check`, `mimber_css_analyze`, `mimber_preview_url`, `mimber_build`, `mimber_deploy` (needs `THEMEKIT_PASSWORD`, destructive), `mimber_compare` (screenshots).

**Resources:** `mimber://audit/audit.json` · `mimber://config/config.yml` (redacted) · `mimber://report/compare/README.md` + png
**Prompts:** `mimber-modernize` · `mimber-fix-a11y`

Keep `performance-investigations` MCP at `:3201`, Mimber at `:3202` — no port clash.

---

## Visual compare harness

We ship a Playwright harness that loads the **base Timber** vs **Mimber** side-by-side (no Photoshop).

```bash
THEMEKIT_STORE=orionsuperteststore.myshopify.com \
THEMEKIT_THEME_ID=130563899438 \
THEMEKIT_BASE_THEME_ID=130563932206 \
npx playwright test --grep "compare:" --reporter=list
# or: ./bin/mimber harness --compare
# output: playwright-report/compare/ (home-base.png vs home-mimber.png, etc.) + README.md
```

Last run on this repo: **discrepancy found** — `home` 223K→675K, `collection` 258K→488K, `product` 438K→1.0M. Screenshots in `playwright-report/compare/` show `Frontpage Collection` grid clipped, blue links (missing `base.css`), and `Liquid error (templates/index line 83): invalid url input` when `collection.products.first.featured_image` is nil — wrap with `{% if collection.products.first.featured_image %}`. Fix those two before next `deploy`.

---

## Structure

```
assets/timber.js.liquid        496L frozen original (+ timber.human.js readable)
assets/timber.scss.liquid      58K legacy (keep for diff, now base.css)
assets/base.css                66K vanilla (Dawn/Horizon, css-variables)
src/*.js                       14 modules (prepare-transition → ajax-cart)
src/entry/*.js                 5 splits (<14K gzip each)
dist/timber.* + dist/{global,…} + dist/theme/  deploy target (1.0)
vendor/themekit/               oreoorbitz/themekit fork (Go, 1.0)
cmd/mimber/                    Go orchestrator + analyzers + mcp
config.yml.example             store/theme_id/password → preview_theme_id
tests/preview.spec.js + compare.spec.js + unit/
```

`dist/theme` is what gets deployed. Legacy `vite.config.mjs`/`bower.json` removed — Go `esbuild` now.

---

## Links

- Timber 2.2.2 (upstream, MIT): https://github.com/Shopify/Timber
- Mepto: https://github.com/oreoorbitz/Mepto (`window.mepto||jQuery`)
- ThemeKit fork: https://github.com/oreoorbitz/themekit (`vendor/themekit`)
- Plans: `orion/plans/004-mimber-timber-audit.md` (if `orion/` sibling exists)
- License: MIT — derivative of Timber.
