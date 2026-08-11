# Mimber — Agent Orchestrator (paste this folder into a Timber-based theme)

Mimber is a **reference DB**, not an installable theme. Fork of `Shopify/Timber@2.2.2` (MIT, 2014). Most client Shopify themes are 5-10yr forks of this — diff against Mimber, then apply Mepto/modern patches to *client* files. **Start every LLM session here**, then follow the router.

**Runtime:** Node 22 LTS (`nvm use`, `engines.node >=18`). Build = Vite `esnext` + `@rollup/plugin-babel` `last 3 versions` + `bugfixes:true` (same as `flickity-mepto`/`currencies`/`recently-viewed`).

---

## How to use (paste → point LLM at this file)

1. Copy `Mimber/` into client repo (e.g. `mimber-reference/`) or paste its `src/` + `dist/` + `PERFORMANCE_GUIDE.md`.
2. Tell LLM: "Read `mimber-reference/AGENTS.md` then do the task."
3. LLM diffs `mimber/assets/timber.js.liquid` vs `client/assets/timber.js` (`ajax-cart.js`) and applies slices below — preserves client business logic, only swaps jQuery/polyfill surface.
4. Build in Mimber, copy `dist/timber.pkgd.min.js` → `client/assets/timber.js` (keep `.liquid` header if any), update `layout/theme.liquid` script tags.

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
| **4 — accessibleNav** | 105-182 | `mouseenter/touchstart`, `focus/blur`, `showDropdown` body `on/off('touchstart')` | **Queued** | `.find/.has/.closest`, `setTimeout 250ms`, delegated `touchstart` |
| **5 — Drawers** | 348-493 | `timber.Drawers` (`$.extend`/`$.proxy`, `trigger`, `trapFocus`, `prepareTransition`) | **Queued** | `Object.assign` vs `$.extend`, `bind` vs `$.proxy`, `CustomEvent` |
| **6 — ajax-cart** | `ajax-cart.js.liquid` 563 | `$.ajax`/`Deferred` + `Handlebars` cart rendering | **Queued** | `fetch` vs `$.ajax`, `Promise`, `DocumentFragment` + `<template>` |

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
| `assets/timber.scss.liquid`, `assets/handlebars.min.js` (46K), `layout/theme.liquid:37,395`, `bower.json` | Styles/vendor/shell — reference only, not modernized via Mimber | Diff only, remove polyfill tags |
| `src/prepare-transition.js` | Slice 1: Mepto `prepareTransition` + `scheduler` rAF | Copy pattern to client |
| `src/money-format.js` | Slice 1: `Shopify.formatMoney` hoisted regex | Copy pattern |
| `src/url.js` | `replaceUrlParam` cached `RegExp` | Reused by `collectionViews` |
| `src/cache.js` | Slice 2: `cacheSelectors` bulk `querySelectorAll`, `mepto` fallback | Copy |
| `src/utils.js` | Slice 2: `mobileNavToggle` etc., `scheduler.mutate` batches | Copy |
| `src/product-page.js` | Slice 3: `productPage` single `mutate`, `classList`/`disabled`, `Shopify.formatMoney` + `Shopify.Image.switchImage`, `i18n` defaults (Liquid `{{ t | json }}` → `options.i18n`) | Copy |
| `src/scheduler.js` | FastDOM `measure`/`mutate` rAF | Shared by slice 1-3 |
| `src/mepto.js` | `window.mepto \|\| window.jQuery` getter (`$`) | Shared |
| `src/index.js` | Assembles `window.timber` legacy names, `DOMContentLoaded` auto-init | Entry |
| `dist/timber.esm.js` / `dist/timber.pkgd.js` / `dist/timber.pkgd.min.js` | Built artifacts — Vite `esnext` + Babel `last 3` | Copy `pkgd.min.js` → client `assets/timber.js` |
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
nvm use                          # 22 LTS (or Node >=18)
npm install
npm run build                    # clean + vite build + vite.min + banner → dist/* (needs Node 22 for esnext)
node --check src/*.js
# jQuery purge check in client after copy:
grep -c "jQuery" assets/timber.js  # → 0 (comments only)
```

Dist current (slice 3): `timber.esm.js 21.3K` / `timber.pkgd.js 22.9K` / `timber.pkgd.min.js 11.2K` (`3.76K gzip`). Grows as slices 4-6 land.

---

## Verify (client after paste)

`node --check assets/timber.js`, `shopify theme check` (no `fastclick`/`respond` 404s), manual: drawer `prepareTransition` (slice 1), `collectionViews ?view=`, `responsiveVideos` wrap, `loginForms #recover`, mobile nav toggle, cart add/update if `ajax-cart` modernized.

---

## Quick links

Upstream Timber `2.2.2` https://github.com/Shopify/Timber — Mepto https://github.com/oreoorbitz/Mepto — Handlebars `1.3.0` 46K — Shopify `shopify_common.js` (keep)
