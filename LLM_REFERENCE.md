# Mimber — LLM Reference Database (RAG) for Timber-based Client Themes

> **Mimber** is a fork of `Shopify/Timber@2.2.2` (2014, MIT), the 10-year-ago ancestor of most Dawn-era Shopify themes. It is **not** a drop-in replacement. Client themes built on Timber have 5–10 years of divergent edits (new sections, apps, `product.js`/`theme.js` forks). Use Mimber as a **read-only reference DB** for an LLM modernizing a *specific* client repo — diff against Mimber to find what the client changed, then apply Mepto/modernization patches to the *client* files, not by copying Mimber.

> **Orchestrator is `AGENTS.md` — start there.** `AGENTS.md` is the paste-and-point entry (router + slice status + full file map). This file is the deep RAG detail for diff/mapping/verification. If you were told to paste Mimber into a Theme, open `AGENTS.md` first.

## How to Use (for an LLM agent)

1. **Start at `AGENTS.md`.** Paste Mimber folder into client repo (e.g. `mimber-reference/`), then LLM reads `mimber-reference/AGENTS.md`. That file routes to this one for detail.
2. **Diff, don't copy.** For each client theme file, `diff -u <mimber>/assets/timber.js.liquid <client>/assets/timber.js` (or `ajax-cart.js`). Better: diff `assets/timber.human.js` (prettified 496L backup, readable) — same logic. The diff is the client's business logic — preserve it. Only replace `jQuery` surface and polyfill scaffolding using the mappings below.
3. **Never vendor Mepto silently.** All Mepto integrations must be explicit: `{{ 'mepto.js' | asset_url | script_tag }}` as first script after `shopify_common.js`, or `import $ from 'mepto'` in ESM. See `AGENTS.md` Mepto mapping and `004-mimber-timber-audit.md` in `orion/plans/` if available.
4. **Polyfills + jQuery + Handlebars already removed from Mimber.** `fastclick.min.js`, `modernizr.min.js`, `respond.min.js` + `respond-proxy.html` were deleted (`cf8216d`, evergreen, saves ~15K+2 requests); `jquery/1.12.4` CDN → `mepto.js` + `handlebars.min.js` 46K → native `<template>` (slice 7, saves 46K+1 req) at `layout/theme.liquid:37-38` + `snippets/ajax-cart-template.liquid` + `collection-sorting.liquid` + `product.liquid`. Do **not** re-add them in client themes — remove the `{{ 'fastclick…' | asset_url }}` / `{{ 'handlebars…' }}` tags.
5. **Two Mepto targets only (sliced).** `timber.js.liquid` 496L and `ajax-cart.js.liquid` 563L + `layout/theme.liquid` + `snippets/ajax-cart-template.liquid` (slice 7: native `<template>`). `handlebars.min.js` 46K **deleted** (use `<template>`); client themes may still have it — remove.
6. **Build parity with `orion` libraries.** When you modernize `timber`/`ajax-cart` for a client, use the same stack as `flickity-mepto`/`currencies`/`recently-viewed`:
   - `package.json` `type:module` `browserslist ["last 3 versions"]`, **Go `esbuild` `es2017≈last3`** (`github.com/evanw/esbuild v0.25`, `bundle/minify/splitting`), no `vite`/`babel`.
   - `src/` ESM per slice (see `AGENTS.md` Slice status) + `src/entry/{global,product,collection,customer,cart}.js` (<14K gzip each, `type="module"`), `src/scheduler.js` FastDOM `measure`/`mutate` (rAF), `DocumentFragment` for cart row inserts (ajax-cart).
   - Output `dist/timber.pkgd.min.js` (legacy fallback) + `dist/{global,product,collection,customer,cart}.min.js` + `chunks/` → `{{ 'global.js' | asset_url }}` via `type="module"` and `{{ 'base.css' | asset_url }}` + `{% render 'css-variables' %}` (vanilla CSS per Dawn/Horizon).
   - CSS: `snippets/css-variables.liquid` inline `{% style %}:root{--color-primary:{{ settings.color_primary }}}` + `assets/base.css` vanilla (from `timber.scss.liquid` via `npx sass` then `hex→var(--color-*)`).

## Slice exports (what LLM copies as pattern)

| Slice | Mimber `src/` | Built `dist` |
|---|---|---|
| **1** `prepareTransition` + `formatMoney` | `prepare-transition.js` (`classList`+`transitionend {once:true}`+`scheduler.mutate void offsetWidth`), `money-format.js` (hoisted regex), `url.js` (`replaceUrlParam` cached `RegExp`), `scheduler.js`, `mepto.js` | `dist/timber.pkgd.min.js 3.5K` |
| **2** `cache + small utils` | `cache.js` (bulk `querySelectorAll`, `mepto` fallback, shape-stable `timber.cache`), `utils.js` (`mobileNavToggle`/`productImageSwitch`/`switchImage`/`responsiveVideos` wrap batch/`collectionViews`/`loginForms`/`resetPasswordSuccess`/`getHash`) + `src/index.js` (`DOMContentLoaded` auto-init, no `FastClick`) | `dist 17.7K / 8.5K min (5K/2.96K gzip)`, 9 modules (`b7353a4`→`aa4342c`) |
| **3** `productPage` | `product-page.js` (single `mutate`, `classList`/`disabled`/`textContent`, `Shopify.formatMoney` + `Shopify.Image.switchImage`, `options.i18n` defaults for `{{ t \| json }}`) | `dist 22.9K / 11.2K min (6.18K/3.76K gzip)`, 10 modules |
| **4** `accessibleNav` | `accessible-nav.js` (`querySelectorAll`, `closest`, `classList`, `focus/blur`, body `touchstart` 250ms) | `dist 27.5K / 13.4K min (7.15K/4.35K gzip)`, 11 modules |
| **5** `Drawers` | `drawers.js` (`Object.assign`/`bind`/`CustomEvent`+`mepto trigger`, `prepareTransition`, `mutate`, `trapFocus` `focusin`) | `dist 36.4K / 18K min (9.07K/5.51K gzip)`, 12 modules |
| **6** `ajax-cart` | `shopify-api.js` + `ajax-cart.js` (`fetch`+`URLSearchParams`/`FormData` vs `$.ajax`/`Deferred`, `CustomEvent` vs `trigger`, `DocumentFragment` handlebars append, `Object.assign` vs `$.extend`) | `dist 63.8K / 32.1K min (15.06K/9.7K gzip)`, 14 modules — **all 1059L done** (handlebars kept) |
| **7** `handlebars + theme liquid` | `assets/handlebars.min.js` **deleted** (46K), `snippets/ajax-cart-template.liquid` → `<template>` + `src/ajax-cart.js` native `<template>` clone, `layout/theme.liquid` `mepto.js` vs `jquery/1.12.4`, `snippets/collection-sorting.liquid` `URLSearchParams` vs `jQuery.param`, `templates/product.liquid` `DOMContentLoaded` vs `jQuery(function` | `dist 67.2K / 34.8K min (15.91K/10.4K gzip)`, 14 modules — **0 jQuery in theme, save 46K+1 req** |
| **8** `query opt` | `cache.js`/`product-page.js`/`drawers.js`/`accessible-nav`/`utils` `getElementById`/`getElementsByClassName` vs QSA | `dist 65K/34.7K min` |
| **9** `per-template split` | `src/entry/{global,product,collection,customer,cart}.js` `type="module"` `splitting` | `dist/{global,product,collection,customer,cart}.min.js` + `chunks/` each <14K gzip |
| **10** `quality gates` | `eslint@9`/`prettier@3`/`vitest@4 jsdom`/`stylelint@16` + `tests/unit/*` + `playwright local 2` | `npm run check`/`test:all` |
| **11** `locale-aware Ajax` | `shopify-api.js` `cartUrl()` `Shopify.routes.root {{ routes.root_url }}` per https://shopify.dev/docs/api/ajax/reference/cart#get--locale-cartjs + `ajax-cart.js` `formSelector *=` | 4 endpoints locale-aware, `shopify-api-locale.test.js` 4 cases |
| **12–13** `CSS vanilla` | `timber.scss.liquid` 58K SCSS → `assets/base.css` 66K vanilla CSS (via `npx sass` + `hex→var(--color-*)`), `snippets/css-variables.liquid` `{% style %}:root{--color-primary:{{ settings.color_primary }}}` per [Dawn](https://github.com/Shopify/dawn) + [Horizon](https://github.com/Shopify/horizon), `gift-card.css` | `layout/theme.liquid` now `css-variables` + `base.css` (legacy `timber.scss.css` commented) |

## File Map (Mimber vs Client)

| Mimber file | Purpose | Client counterpart | Action |
|---|---|---|---|
| `assets/timber.js.liquid` | Core theme JS (`prepareTransition`, `Shopify` helpers) | `assets/timber.js` or `theme.js` fork | Mepto `window.mepto \|\| jQuery`, `Object.assign` vs `$.extend`, `classList` vs `addClass` |
| `assets/ajax-cart.js.liquid` | Ajax cart (`/cart.js`, `Handlebars`) | `assets/ajax-cart.js` or `cart.js` | `fetch` vs `$.ajax`, `Promise` vs `Deferred`, `DocumentFragment` |
| `snippets/ajax-cart-template.liquid` | Native `<template>` (was Handlebars) | `snippets/ajax-cart-template.liquid` | Replace Handlebars `{{#items}}` with `data-ajaxcart-*` + `template.content.cloneNode(true)` in `src/ajax-cart.js` |
| `snippets/collection-sorting.liquid` | `URLSearchParams` vs `jQuery.param` | `snippets/collection-sorting.liquid` | `URLSearchParams` |
| `templates/product.liquid` | `DOMContentLoaded` vs `jQuery(function` | `templates/product.liquid` | `DOMContentLoaded` + `mepto` |
| `assets/timber.scss.liquid` | SCSS legacy 58K (now vanilla `base.css`) | `assets/theme.scss` fork | Keep for diff; new theme uses `base.css` (vanilla) — diff SCSS but port via `css-variables` |
| `assets/base.css` | Vanilla CSS 66K (Dawn/Horizon, no SCSS) | `assets/theme.scss` | `var(--color-primary)` etc — settings via `snippets/css-variables.liquid` |
| `snippets/css-variables.liquid` | Dawn/Horizon Liquid vars inline | — | `{% render 'css-variables' %}` in `<head>` (contains `{% style %}:root{--color-primary:{{ settings.color_primary }}}`) — add to client `layout/theme.liquid` |
| `layout/theme.liquid` | Now `mepto.js` + `base.css` + `css-variables` (was `jquery/1.12.4` + `handlebars` + `fastclick/modernizr` + `timber.scss.css`) | `layout/theme.liquid` | Already `mepto.js`+`base.css`; remove `timber.scss.css`/`jquery` tags, add `css-variables` |
| `dist/theme/` | **Built Shopify 1.0 theme** (JS modernized, `assets/timber.js` replaced, `handlebars` deleted) | Client `dist/theme` or direct `assets/` | `go run ./cmd/mimber build` → `dist/theme` is ThemeKit deploy target (`directory: dist/theme`) |
| `config.yml.example` | ThemeKit legacy config + preview URL template | Client `config.yml` | `cp config.yml.example config.yml`, set `x.y` store + `z` `theme_id` |
| `scripts/build-theme.mjs` | Assembles `dist/theme` (copy `assets/layout/config/locales/snippets/templates` + overlay `dist/timber.pkgd.min.js`) | — | `npm run build:theme` |
| `playwright.config.mjs` + `tests/preview.spec.js` | Playwright harness for preview `_ab=0&_fd=0&_sc=1&preview_theme_id=z` | — | `npx playwright test --grep preview` (remote) or `--grep local` (offline) |

## Common Client Divergences to Preserve

- New `sections/*.liquid` with `data-flickity` or `swiper` — already handled via `flickity-mepto` / `swiper-bundle.js`; don't touch via Mimber.
- `product.js` variant logic (may be Dawn `product.js` 52K fork, not Timber `timber.js`) — audit per `orion/plans/003-product-stack-audit.md`.
- App blocks (`shopify-app-*`) injecting `jQuery` — keep `window.jQuery = window.mepto` compat alias (`setMepto`) as `currencies` did.

## Verification (client theme)

- `node --check dist/theme/assets/timber.js`, `grep -c "jQuery" dist/theme/assets/timber.js` → 0 (comments only).
- `npx playwright test --grep local` — 2 tests for `dist/theme` structure + `config.yml.example`.
- `shopify theme check` — no `fastclick`/`respond` 404s (since deleted in Mimber, remove tags in client).
- Preview (with store): `cp config.yml.example config.yml` → fill `x.y` store + `z` `theme_id` → `go run ./cmd/mimber deploy` → `go run ./cmd/mimber harness --preview` opens `https://x.y/?_ab=0&_fd=0&_sc=1&preview_theme_id=z` (or `npx playwright test --grep preview`).
- Manual: cart add/remove, `prepareTransition` (drawer), native `<template>` cart render (no handlebars), currency switch if `currencies-mepto` staged.

## Links

- Upstream Timber `2.2.2`: https://github.com/Shopify/Timber (MIT, deprecated)
- This fork: `orion/Mimber` — reference DB, not a theme to install
- Plans: `orion/plans/004-mimber-timber-audit.md`, `orion/plans/001-orchestration-overview.md` (#7)
- Mepto: `orion/Mepto` (`meptos@2.0.0`) — `window.mepto || window.jQuery` pattern
- Modernized siblings: `flickity-mepto` (`b316f90`), `currencies` (`4724f44`), `recently-viewed` (`301ed2b`), `shopify_option_selection` (`05ec927`)
