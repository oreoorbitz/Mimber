# Mimber — Agent Orchestrator (paste this folder into a Timber-based theme)

Mimber is a **reference DB**, not an installable theme. Fork of `Shopify/Timber@2.2.2` (MIT, 2014). Most client Shopify themes are 5-10yr forks of this — diff against Mimber, then apply Mepto/modern patches to *client* files. **Start every LLM session here**, then follow the router.

**Runtime:** Go 1.22+ + Node 22 LTS (Go orchestrates, LLM does the work — `go` required, `nvm use` for Vite). Build = Vite `esnext` + `@rollup/plugin-babel` `last 3 versions` + `bugfixes:true` (same as `flickity-mepto`/`currencies`/`recently-viewed`).

---

## How to use (paste → point LLM at this file)

1. Copy `Mimber/` into client repo (e.g. `mimber-reference/`) or paste its `src/` + `dist/` + `PERFORMANCE_GUIDE.md`.
2. Tell LLM: "Read `mimber-reference/AGENTS.md` then do the task."
3. LLM diffs `mimber/assets/timber.js.liquid` vs `client/assets/timber.js` (`ajax-cart.js`) and applies slices below — preserves client business logic, only swaps jQuery/polyfill surface.
4. Build in Mimber, copy `dist/timber.pkgd.min.js` → `client/assets/timber.js` (keep `.liquid` header if any), update `layout/theme.liquid` script tags.
5. For preview: see **Preview harness (ThemeKit + Playwright)** below — `config.yml` + `dist/theme`.

## Preview harness (ThemeKit + Playwright) — LLM can run without `shopify theme` 2.0

Timber is **Shopify 1.0** (`assets/layout/snippets/templates/config`). `shopify theme` CLI is 2.0 and rejects 1.0. Use **bundled ThemeKit fork** (`oreoorbitz/themekit`, Go, vendored at `vendor/themekit` + bundled with Mepto `meptos` for customization) — Go is required (LLM does the store update, developer installs Go). Order: JS → CSS → Liquid (this repo does JS first, CSS/Liquid last).

**Go orchestrator** (`go` 1.22+ `Cobra`): `cmd/mimber` wraps all three — `vendor/themekit/cmd/mimber` is canonical `mimber` CLI (imports ThemeKit as lib); `Mimber/cmd/mimber/main.go` proxy (`go run ./cmd/mimber`). Build single `bin/mimber` (`go build -o bin/mimber ./cmd/mimber`).

| Step | Command | What |
|---|---|---|
| 1 | `cp config.yml.example config.yml` | Fill `store`, `password` (private app), `theme_id` or `THEMEKIT_STORE/THEMEKIT_PASSWORD/THEMEKIT_THEME_ID` env |
| 2 | `go run ./cmd/mimber build` (`npm run mimber:build`) | Vite `esnext+Babel last3` → `dist/timber.*.js` + `build:theme` → `dist/theme` (Shopify 1.0 structure + modern `assets/timber.js`) |
| 3 | `go run ./cmd/mimber deploy` (`npm run mimber:deploy`) | Upload `dist/theme` via bundled fork `vendor/themekit/bin/theme` (`go build -o vendor/themekit/bin/theme ./vendor/themekit/...`) |
| 4 | `go run ./cmd/mimber preview --url` (`npm run mimber:preview`) | Print `https://{store}/?_ab=0&_fd=0&_sc=1&preview_theme_id={theme_id}` (x.y + z from `config.yml`/`--store`/`--theme-id`) |
| 5 | `go run ./cmd/mimber harness --preview` (`npm run mimber:harness`) | Build → deploy → `playwright --grep preview` (full store preview) |
| 5 local | `go run ./cmd/mimber harness` | Build → `playwright --grep local` (offline `dist/theme` checks, 2 tests, ~0.6s) |

Env: `THEMEKIT_STORE=foo.myshopify.com THEMEKIT_THEME_ID=123456789 THEMEKIT_PASSWORD=xxx go run ./cmd/mimber harness --preview`.

---

## Router — read the focused doc for your task

| You are… | Read this first |
|---|---|
| Modernizing `timber.js` / `ajax-cart.js` for a client | `LLM_REFERENCE.md` → File Map + Mepto mapping |
| Doing a slice (prepareTransition, cache, Drawers, etc.) | This file → Slice status, then `src/<slice>.js` |
| Optimizing DOM/rAF/batch/perf | `PERFORMANCE_GUIDE.md` Part I (DOM > Part II V8) |
| Removing `fastclick`/`modernizr`/`respond` | `LLM_REFERENCE.md` § Polyfills + `layout/theme.liquid:37,395` |
| Verifying client theme after patch | `LLM_REFERENCE.md` → Verification |
| Building Mimber | This file → Build loop below |
| Auditing what client changed vs Timber | `assets/timber.human.js` + `assets/timber.js.liquid` (496L frozen) |
| Handling `handlebars`/`product.js` divergences | `LLM_REFERENCE.md` → Divergences + `orion/plans/003-product-stack-audit.md` (if available) |

Do not guess past the router — open the doc. `AGENTS.md` stays short.

---

## Slice status (keep updated as slices land)

| Slice | Timber lines | What | Status | Mepto surface |
|---|---|---|---|---|
| **0 — humanize + deletes** | — | `prettier` → `timber.human.js` (496L backup), delete `fastclick.min.js`/`modernizr.min.js`/`respond.min.js`+proxy | **Done** `cf8216d` | `touch-action: manipulation` vs `FastClick` |
| **1 — prepareTransition + formatMoney** | 1-62 | `prepareTransition` + `Shopify.formatMoney` + `replaceUrlParam` + `scheduler` | **Done** `b7353a4` | `window.mepto\|\|jQuery`, `classList`+`transitionend {once:true}`, `void offsetWidth` in `mutate` |
| **2 — cache + small utils** | 67-103,193-342 | `cacheSelectors`, `init` (no FastClick), `mobileNavToggle`, `getHash`, `switchImage`, `productImageSwitch`, `responsiveVideos`, `collectionViews`, `loginForms`, `resetPasswordSuccess` | **Done** `aa4342c` (9 modules, `dist 17.7K/8.5K min`) | `querySelectorAll` bulk, `mepto` fallback, `scheduler.mutate` wraps |
| **3 — productPage** | 203-259 | Variant pricing UI (`variant.available`, `compare_at_price`, `Shopify.formatMoney`) | **Done** (10 modules, `dist 22.9K/11.2K min`) | `classList`/`disabled`/`textContent` in single `mutate`, `Shopify.Image.switchImage` kept |
| **4 — accessibleNav** | 105-182 | `mouseenter/touchstart`, `focus/blur`, `showDropdown` body `on/off('touchstart')` | **Done** (11 modules, `dist 27.5K/13.4K min`) | `querySelectorAll`, `closest`, `classList`, `setTimeout 250ms` body `touchstart` |
| **5 — Drawers** | 348-493 | `timber.Drawers` (`$.extend`/`$.proxy`, `trigger`, `trapFocus`, `prepareTransition`) | **Done** (12 modules, `dist 36.4K/18K min`) | `Object.assign` vs `$.extend`, `bind` vs `$.proxy`, `CustomEvent` + `mepto trigger` compat, `mutate` |
| **6 — ajax-cart** | `ajax-cart.js.liquid` 563 | `$.ajax`/`Deferred` + `Handlebars` cart rendering | **Done** (14 modules, `dist 63.8K/32.1K min` → `67.2K/34.8K` with slice 7) | `fetch` vs `$.ajax`, `FormData`+`URLSearchParams`, `DocumentFragment`, `CustomEvent` |
| **7 — handlebars + theme liquid** | `handlebars.min.js` 46K + `theme.liquid` + `ajax-cart-template` + `collection-sorting`/`product` | **Done** (14 modules, `dist 67.2K/34.8K min`, **save 46K + 1 req**, 0 `jQuery` in theme) | `native <template>` vs `Handlebars.compile`, `mepto.js` vs `jquery/1.12.4`, `URLSearchParams` vs `jQuery.param`, `DOMContentLoaded` vs `jQuery(function` |
| **8 — query optimization** | `cache.js`/`product-page.js`/`drawers.js`/`accessible-nav`/`utils` | **Done** (14 mods, `dist 65K/34.7K min`, per **measurethat #16434** `closest 13.8M vs querySelector 16.1M Ops/sec`) | `getElementById` for `#id` (fastest), `getElementsByClassName`/`getElementsByTagName` for `.class`/`a`, QSA only for attribute/`[data-*]`, `closest` only for delegation (kept for `ajaxcart__qty-adjust`, else `parentElement` walk) |

Update this table when you land a slice — LLM points at this file.

---

## File map — every file LLM may need

### Mimber (this folder) — paste target

| File | Purpose | LLM action |
|---|---|---|
| `AGENTS.md` **← you are here** | Orchestrator — entry point, router, slice status | Read first |
| `LLM_REFERENCE.md` | RAG DB: diff workflow, File Map vs client, Mepto mappings, polyfill deletes, divergences | Read after `AGENTS.md` |
| `PERFORMANCE_GUIDE.md` | Part I DOM batching/rAF/thrashing > Part II V8 JIT | Read for perf slices |
| `assets/timber.js.liquid` | **Frozen original** 496L — Shopify Timber core | Diff vs client `timber.js`/`theme.js` fork |
| `assets/timber.human.js` | Prettified backup of `timber.js.liquid` (same 496L, readable) | Readable diff base |
| `assets/ajax-cart.js.liquid` | Ajax cart 563L — `$.ajax` + `Handlebars` | Diff vs client `ajax-cart.js`/`cart.js` |
| `snippets/ajax-cart-template.liquid` + `snippets/collection-sorting.liquid` + `templates/product.liquid` | `Handlebars`/`jQuery.param`/`jQuery(function` → native `<template>`/`URLSearchParams`/`DOMContentLoaded` | Diff vs client, remove `handlebars.min.js` script tag |
| `assets/timber.scss.liquid`, `layout/theme.liquid` (now `mepto.js` vs `jquery/1.12.4`+`modernizr`+`fastclick`), `bower.json` | Styles/vendor/shell — reference only, partly modernized (slice 7: `mepto.js`) | Diff only, remove polyfill tags |
| `src/prepare-transition.js` | Slice 1: Mepto `prepareTransition` + `scheduler` rAF | Copy pattern to client |
| `src/money-format.js` | Slice 1: `Shopify.formatMoney` hoisted regex | Copy pattern |
| `src/url.js` | `replaceUrlParam` cached `RegExp` | Reused by `collectionViews` |
| `src/cache.js` | Slice 2: `cacheSelectors` bulk `querySelectorAll`, `mepto` fallback | Copy |
| `src/utils.js` | Slice 2: `mobileNavToggle` etc., `scheduler.mutate` batches | Copy |
| `src/product-page.js` | Slice 3: `productPage` single `mutate`, `classList`/`disabled`, `Shopify.formatMoney` + `Shopify.Image.switchImage`, `i18n` defaults (Liquid `{{ t | json }}` → `options.i18n`) | Copy |
| `src/accessible-nav.js` | Slice 4: `accessibleNav` `querySelectorAll`, `closest`, `classList`, `focus/blur` | Copy |
| `src/drawers.js` | Slice 5: `Drawers` `Object.assign`/`bind`/`CustomEvent`+`mepto trigger`, `prepareTransition`, `mutate`, `trapFocus` | Copy |
| `src/shopify-api.js` + `src/ajax-cart.js` | Slice 6→7: `ShopifyAPI` (`fetch`+`CustomEvent`), `ajaxCart` (slice 7: native `<template>` **no Handlebars**, `DocumentFragment`) | Copy |
| `src/scheduler.js` | FastDOM `measure`/`mutate` rAF | Shared by slice 1-6 |
| `src/mepto.js` | `window.mepto \|\| window.jQuery` getter (`$`) | Shared |
| `src/index.js` | Assembles `window.timber` legacy names, `DOMContentLoaded` auto-init | Entry |
| `dist/timber.esm.js` / `dist/timber.pkgd.js` / `dist/timber.pkgd.min.js` | Built artifacts — Vite `esnext` + Babel `last 3` | Copy `pkgd.min.js` → client `assets/timber.js` |
| `dist/theme/` | **Shopify 1.0 theme for ThemeKit** — `assets/timber.js` (modern), `layout/theme.liquid`, `config/`, `snippets/`, `templates/` | `go run ./cmd/mimber deploy` → `dist/theme` (`directory: dist/theme` in `config.yml`) |
| `vendor/themekit/` | **Bundled ThemeKit fork** `oreoorbitz/themekit` (Go, 1.0) — `cmd/mimber` | `go build -o vendor/themekit/bin/theme ./vendor/themekit/...` → `bin/theme` |
| `config.yml.example` | ThemeKit legacy config (store + `theme_id` + `preview_theme_id`) | `cp config.yml.example config.yml`, fill `x.y` + `z` |
| `cmd/mimber/main.go` + `vendor/themekit/cmd/mimber/` | **Go orchestrator** `mimber` (`Cobra`: `build`/`deploy`/`preview`/`harness`) | `go run ./cmd/mimber` or `bin/mimber` |
| `playwright.config.mjs` + `tests/preview.spec.js` | Playwright harness — `_ab=0&_fd=0&_sc=1&preview_theme_id=z` | `go run ./cmd/mimber harness --preview` (full) / `harness` (local) |
| `package.json` (`type:module`, `browserslist last 3`), `vite.config.mjs`+`vite.min.config.mjs`, `babel.config.json` | Build parity with `flickity-mepto`/`currencies` | Reuse in client build |
| `README.md` | Upstream Timber README (deprecated notice) — not orchestrator | Ignore |
| `spec/` | Timber i18n Ruby tests — not JS modernization | Ignore |

### Sibling references (when `orion/` is available; not pasted)

| Repo | Pattern to reuse |
|---|---|
| `orion/flickity-mepto` (`vite esnext+Babel`, `Map`, `scheduler`, `IO lazyLoad`) | Build/perf precedent |
| `orion/currencies` (`native cookie`, `querySelectorAll+measure/mutate`, hoisted regex/`Map`) | `mepto` cookies + batch |
| `orion/recently-viewed` (`fetch` vs `$.ajax`, `DocumentFragment` tmpl) | Ajax → fetch |
| `orion/shopify_option_selection` (`Map` variant `O(1)`, `DocumentFragment`) | Variant/perf |
| `orion/plans/004-mimber-timber-audit.md`, `001-orchestration-overview.md` | Full audits (if `orion/` present) |

---

## Mepto mapping (keep `jQuery` compat where clients expect it)

| jQuery | Mepto / native |
|---|---|
| `jQuery`, `$`, `$(sel)` | `window.mepto \|\| window.jQuery` → `mepto(sel)` or `document.querySelectorAll` (see `src/cache.js`, `src/mepto.js`) |
| `$.extend` | `Object.assign` |
| `$.each` / `$.proxy` | `for` loop / `bind` |
| `$(el).on/.off/.trigger` | `addEventListener` / `dispatchEvent(new CustomEvent)` or `mepto(el).on/off/trigger` |
| `a.fn.prepareTransition` | `src/prepare-transition.js` (`classList`+`transitionend {once:true}`+`mutate void offsetWidth`) |
| `addClass/removeClass/toggleClass` | `classList.add/remove/toggle` |
| `show/hide` | `style.display = 'block'/'none'` in `mutate` |
| `FastClick.attach` | **Delete** — `touch-action: manipulation` CSS |
| `$(timber.init)` | `DOMContentLoaded` + `queueMicrotask` (see `src/index.js`) |

Never vendor Mepto silently — `{{ 'mepto.js' \| asset_url \| script_tag }}` first, or `import $ from 'mepto'` in ESM. Keep `window.jQuery = window.mepto` alias if client apps need it.

---

## Build loop

```bash
# Requires Go 1.22+ (LLM does the work, developer installs Go) + Node 22 LTS (nvm use)
go version && nvm use
npm install                      # vendor/themekit already as submodule
go run ./cmd/mimber build        # Vite + build:theme → dist/* + dist/theme
go run ./cmd/mimber preview --url --store x.y --theme-id z
go run ./cmd/mimber harness --preview  # build → deploy → playwright --grep preview
go run ./cmd/mimber harness      # build → playwright --grep local (offline, 2 tests)
# Single binary: go build -o bin/mimber ./cmd/mimber && ./bin/mimber --help

# One-offs:
npx playwright install --with-deps chromium  # first time only
cp config.yml.example config.yml # fill store=x.y theme_id=z password (or THEMEKIT_STORE/THEMEKIT_THEME_ID)
```
node --check src/*.js
grep -c "jQuery" dist/theme/assets/timber.js  # → 0 (comments only)
```

Dist current (slice 8 query-opt): `timber.esm.js 65K` / `timber.pkgd.js 68K` / `timber.pkgd.min.js 34.7K` (`10.4K gzip`). Slices 1-8 complete (query-opt per **measurethat #16434**: `byId`/`byClass`/`byTag` vs QSA, `closest` only for delegation). Save still **46K+1 req** (handlebars deleted).

---

## Verify (client after paste)

`node --check assets/timber.js`, `shopify theme check` (no `fastclick`/`respond` 404s), manual: drawer `prepareTransition` (slice 1), `collectionViews ?view=`, `responsiveVideos` wrap, `loginForms #recover`, mobile nav toggle, cart add/update if `ajax-cart` modernized.

---

## Quick links

Upstream Timber `2.2.2` https://github.com/Shopify/Timber — Mepto https://github.com/oreoorbitz/Mepto + bundled ThemeKit fork https://github.com/oreoorbitz/themekit (Go, `vendor/themekit`, 1.0) — Handlebars `1.3.0` 46K **removed slice 7 (native <template>)** — Shopify `shopify_common.js` (keep)
