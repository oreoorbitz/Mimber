# Mimber — LLM Reference Database (RAG) for Timber-based Client Themes

> **Mimber** is a fork of `Shopify/Timber@2.2.2` (2014, MIT), the 10-year-ago ancestor of most Dawn-era Shopify themes. It is **not** a drop-in replacement. Client themes built on Timber have 5–10 years of divergent edits (new sections, apps, `product.js`/`theme.js` forks). Use Mimber as a **read-only reference DB** for an LLM modernizing a *specific* client repo — diff against Mimber to find what the client changed, then apply Mepto/modernization patches to the *client* files, not by copying Mimber.

## How to Use (for an LLM agent)

1. **Diff, don't copy.** For each client theme file, `diff -u <mimber>/assets/timber.js.liquid <client>/assets/timber.js` (or `ajax-cart.js`). The diff is the client's business logic — preserve it. Only replace `jQuery` surface and polyfill scaffolding using the mappings below.
2. **Never vendor Mepto silently.** All Mepto integrations must be explicit: `{{ 'mepto.js' | asset_url | script_tag }}` as first script after `shopify_common.js`, or `import $ from 'mepto'` in ESM. See `004-mimber-timber-audit.md` in `orion/plans/`.
3. **Polyfills already removed from Mimber.** `fastclick.min.js`, `modernizr.min.js`, `respond.min.js` + `respond-proxy.html` were deleted (evergreen, saves ~15K+2 requests). Do **not** re-add them in client themes — remove the `{{ 'fastclick…' | asset_url }}` etc. tags from `layout/theme.liquid:38,395` and replace with `touch-action: manipulation` CSS if needed.
4. **Two Mepto targets only.** `timber.js.liquid` (496 lines, `prepareTransition` + `Shopify.formatMoney`) and `ajax-cart.js.liquid` (563 lines, `$.ajax`/`Deferred` + `Handlebars` tmpl). `handlebars.min.js` (46K) is **kept** here for reference; client themes may keep it or replace `template.tmpl` with `<template>` clone — check `grep -r "tmpl"` in client.
5. **Build parity with `orion` libraries.** When you modernize `timber`/`ajax-cart` for a client, use the same stack as `flickity-mepto`/`currencies`/`recently-viewed`:
   - `package.json` `type:module` `browserslist ["last 3 versions"]`, `vite` `esnext + @rollup/plugin-babel` (`bugfixes:true`), `Babel` `preset-env` `modules:false`.
   - `src/timber.js` + `src/ajax-cart.js` ESM, `src/scheduler.js` FastDOM `measure`/`mutate` (rAF), `DocumentFragment` for cart row inserts.
   - Output `dist/timber.mepto.pkgd.min.js` → `assets/timber.js` (keep `.liquid` header if present) and `dist/ajax-cart.mepto.pkgd.min.js` → `assets/ajax-cart.js` via `{{ 'timber.js' | asset_url }}`.

## File Map (Mimber vs Client)

| Mimber file | Purpose | Client counterpart | Action |
|---|---|---|---|
| `assets/timber.js.liquid` | Core theme JS (`prepareTransition`, `Shopify` helpers) | `assets/timber.js` or `theme.js` fork | Mepto `window.mepto \|\| jQuery`, `Object.assign` vs `$.extend`, `classList` vs `addClass` |
| `assets/ajax-cart.js.liquid` | Ajax cart (`/cart.js`, `Handlebars`) | `assets/ajax-cart.js` or `cart.js` | `fetch` vs `$.ajax`, `Promise` vs `Deferred`, `DocumentFragment` |
| `assets/handlebars.min.js` | `v1.3.0` templating | `assets/handlebars.min.js` may be customized | Keep or replace — audit `grep tmpl` first |
| `assets/timber.scss.liquid` | Base styles | `assets/theme.scss` fork | Do not modernize via Mimber — diff only |
| `layout/theme.liquid:37,395` | `jQuery 1.12.4` CDN + 3 polyfills | `layout/theme.liquid` | Replace `jquery` CDN with `mepto.js` after Mepto builds are staged |

## Common Client Divergences to Preserve

- New `sections/*.liquid` with `data-flickity` or `swiper` — already handled via `flickity-mepto` / `swiper-bundle.js`; don't touch via Mimber.
- `product.js` variant logic (may be Dawn `product.js` 52K fork, not Timber `timber.js`) — audit per `orion/plans/003-product-stack-audit.md`.
- App blocks (`shopify-app-*`) injecting `jQuery` — keep `window.jQuery = window.mepto` compat alias (`setMepto`) as `currencies` did.

## Verification (client theme)

- `node --check assets/timber.js`, `grep -c "jQuery" assets/timber.js` → 0 (comments only).
- `shopify theme check` — no `fastclick`/`respond` 404s (since deleted in Mimber, remove tags in client).
- Manual: cart add/remove, `prepareTransition` (drawer), handlebars render, currency switch if `currencies-mepto` staged.

## Links

- Upstream Timber `2.2.2`: https://github.com/Shopify/Timber (MIT, deprecated)
- This fork: `orion/Mimber` — reference DB, not a theme to install
- Plans: `orion/plans/004-mimber-timber-audit.md`, `orion/plans/001-orchestration-overview.md` (#7)
- Mepto: `orion/Mepto` (`meptos@2.0.0`) — `window.mepto || window.jQuery` pattern
- Modernized siblings: `flickity-mepto` (`b316f90`), `currencies` (`4724f44`), `recently-viewed` (`301ed2b`), `shopify_option_selection` (`05ec927`)
