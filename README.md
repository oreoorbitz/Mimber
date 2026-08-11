# Mimber — Mepto-modernized Timber 2.2.2 (reference DB, not a new theme)

> **Mimber is a reference DB fork of `Shopify/Timber@2.2.2` (MIT, 2014)** — the 10yr-old ancestor of most Timber-based client themes. It is **not** a drop-in replacement. Client themes have 5–10yr divergent edits; diff against Mimber, then apply Mepto/Go patches to *client* files. For LLM paste-and-modernize workflow, start at **`AGENTS.md`**.

Upstream Timber itself is deprecated by Shopify — see [Slate](https://github.com/Shopify/slate) for new themes. Mimber exists to modernize the JS/CSS/Liquid of existing Timber forks without rewriting business logic.

---

## What’s modernized (slices 0–8, Go `esbuild` + Mepto)

| Slice | What | Key change |
|---|---|---|
| **0** `cf8216d` | `timber.human.js` + deletes | `fastclick`/`modernizr`/`respond` → `touch-action: manipulation` |
| **1–6** | `timber.js.liquid` 496L + `ajax-cart.js.liquid` 563L = **1059L** | `prepareTransition`/`formatMoney`/`cache`/`productPage`/`accessibleNav`/`Drawers`/`ShopifyAPI+ajaxCart` → `mepto` (`window.mepto||jQuery`) → `classList`/`fetch`/`CustomEvent`/`DocumentFragment`/`Object.assign`/`bind` |
| **7** `a12db69` | `handlebars.min.js` **46K deleted** + `theme.liquid`/`ajax-cart-template`/`collection-sorting`/`product` | `Handlebars.compile` → native `<template>` clone, `jquery/1.12.4` CDN → `mepto.js`, `jQuery.param` → `URLSearchParams`, `jQuery(function` → `DOMContentLoaded` — **save 46K+1 req, 0 `jQuery` in theme** |
| **8** `ad29cf6` | Query optimization (measurethat #16434) | `getElementById` for `#id`, `getElementsByClassName/TagName` for `.class`/`a`, `QSA` only for `[data-*]`, `closest` only for delegation (`closest 13.8M vs querySelector 16.1M Ops/sec` in Chrome) |

Build: **Go `github.com/evanw/esbuild v0.25`** (`es2017≈last3`, `bundle/minify`, no `Vite`/`Babel`) + **ThemeKit fork** `oreoorbitz/themekit` (`Go`, `vendor/themekit`, 1.0 — `shopify theme` 2.0 rejects Timber 1.0). Order **JS → CSS → Liquid** (JS done, CSS/Liquid next). `dist/timber.pkgd.min.js 34.7K (10.4K gzip)` + `dist/theme` (Shopify 1.0 for deploy).

---

## Quick start (Go + Node)

```bash
# Requires Go 1.22+ (LLM does the work, dev installs Go) + Node 22 (nvm use, for Playwright)
git clone https://github.com/oreoorbitz/Mimber && cd Mimber
git submodule update --init vendor/themekit   # oreoorbitz/themekit fork (Go)
npm install

# Go orchestrator (single binary)
go run ./cmd/mimber build        # esbuild Go → dist/timber.* + dist/theme (1.0 + modern assets/timber.js)
go run ./cmd/mimber preview --url --store x.y --theme-id z
go run ./cmd/mimber harness --preview  # build→deploy→playwright preview
go run ./cmd/mimber harness      # build→playwright local (offline, 2 tests)
# binary: go build -o bin/mimber ./cmd/mimber && ./bin/mimber --help
```

Preview needs `cp config.yml.example config.yml` → `store=x.y` (`myshopify.com`), `theme_id=z`, `password` (or `THEMEKIT_STORE/THEMEKIT_THEME_ID/THEMEKIT_PASSWORD` env) → `https://x.y/?_ab=0&_fd=0&_sc=1&preview_theme_id=z`.

One-offs: `npx playwright install --with-deps chromium` (first time), `go run ./cmd/mimber build` is `npm run build` (now Go, no Vite).

---

## Using Mimber to modernize a client store (paste → LLM)

1. `cp -r Mimber mimber-reference/` into client repo.
2. Prompt LLM: `Read mimber-reference/AGENTS.md then modernize assets/timber.js` (AGENTS routes to `LLM_REFERENCE.md`/slice files).
3. LLM diffs `mimber-reference/assets/timber.human.js` (prettified 496L) vs `client/assets/timber.js`, applies slice patterns from `src/cache.js` etc. — preserves client `product.js` forks, sections, apps.
4. Build `mimber-reference` (`go run ./cmd/mimber build`) → `cp dist/theme/assets/timber.js → client/assets/timber.js` (keep `.liquid` header if any), update `layout/theme.liquid` (`mepto.js`).

See **`AGENTS.md`** (orchestrator, router, slice status, File Map, Mepto mapping, Build loop) and **`LLM_REFERENCE.md`** (RAG: diff workflow, handlebars/native `<template>`, `URLSearchParams`, divergences, verification). `PERFORMANCE_GUIDE.md` Part I DOM > Part II V8.

---

## Structure

```
assets/timber.js.liquid          496L frozen original (+ timber.human.js readable)
assets/ajax-cart.js.liquid       563L frozen
snippets/ajax-cart-template.liquid  native <template> (was Handlebars)
src/{prepare-transition,money-format,url,cache,utils,product-page,accessible-nav,drawers,shopify-api,ajax-cart,scheduler,mepto}.js  14 modules
dist/timber.{esm,pkgd}.{js,min.js}  esbuild Go artifacts (copy pkgd.min.js → theme)
dist/theme/                      Shopify 1.0 for ThemeKit (directory: dist/theme)
vendor/themekit/                 oreoorbitz/themekit Go fork (cmd/mimber)
cmd/mimber/main.go               Go proxy → vendor/themekit/cmd/mimber
go.mod                           require esbuild v0.25 + thekit + cobra
config.yml.example               ThemeKit legacy (store, password, theme_id → preview_theme_id)
playwright.config.mjs + tests/preview.spec.js  harness (_ab/_fd/_sc)
```

`dist/theme` is the deploy target; `dist/timber.*` are ESM+IIFE. Legacy `vite.config.mjs`/`babel.config.json`/`bower.json`/`Gemfile`/`spec/` removed — Go esbuild now.

---

## Links

- Upstream Timber `2.2.2`: https://github.com/Shopify/Timber (MIT, deprecated)
- Mepto `meptos@2.0.0`: https://github.com/oreoorbitz/Mepto (`window.mepto||jQuery`)
- ThemeKit fork: https://github.com/oreoorbitz/themekit (Go, `vendor/themekit`, bundled with Mepto)
- Shopify `shopify_common.js`: keep, `Handlebars` 1.3.0 **removed** (native `<template>`)
- Plans: `orion/plans/004-mimber-timber-audit.md`

License: MIT (`LICENSE`) — derivative of Timber.
