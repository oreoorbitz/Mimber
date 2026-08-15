# Mimber — Agent Orchestrator (paste this folder into a Timber-based theme)

Mimber is a **reference DB**, not an installable theme. Fork of `Shopify/Timber@2.2.2` (MIT, 2014). Most client Shopify themes are 5-10yr forks of this — diff against Mimber, then apply Mepto/modern patches to *client* files. **Start every LLM session here**, then follow the router.

**Runtime:** Go 1.22+ (`go` required, Mepto-bundled `vendor/themekit` + `esbuild` Go `github.com/evanw/esbuild`) + Node 22 LTS (`nvm use` for Playwright). Build = **`esbuild` Go** `es2017≈last3` `bundle/minify` (replaces `Vite` + `@rollup/plugin-babel`).

---

## How to use (paste → point LLM at this file)

1. Copy `Mimber/` into client repo (e.g. `mimber-reference/`) or paste its `src/` + `dist/` + `PERFORMANCE_GUIDE.md`.
2. Tell LLM: "Read `mimber-reference/AGENTS.md` then do the task."
3. LLM diffs `mimber/assets/timber.js.liquid` vs `client/assets/timber.js` (`ajax-cart.js`) and applies slices below — preserves client business logic, only swaps jQuery/polyfill surface.
4. Build in Mimber, copy `dist/timber.pkgd.min.js` → `client/assets/timber.js` (keep `.liquid` header if any), update `layout/theme.liquid` script tags.
5. For preview: see **Preview harness (ThemeKit + Playwright)** below — `config.yml` + `dist/theme`.

## Preview harness (ThemeKit + Playwright) — LLM can run without `shopify theme` 2.0

Timber is **Shopify 1.0** (`assets/layout/snippets/templates/config`). `shopify theme` CLI is 2.0 and rejects 1.0. Use **bundled ThemeKit fork** (`oreoorbitz/themekit`, Go, vendored at `vendor/themekit` + bundled with Mepto `meptos` for customization) — Go is required (LLM does the store update, developer installs Go). Order: JS → CSS → Liquid (this repo does JS first, CSS/Liquid last).

**Go orchestrator** (`go` 1.22+ `Cobra`): `cmd/mimber` wraps all three — `vendor/themekit/cmd/mimber` is canonical `mimber` CLI (imports ThemeKit as lib); `Mimber/cmd/mimber/main.go` proxy (`go run -mod=mod ./cmd/mimber` — `-mod=mod` required because `vendor/themekit` is a local `replace` inside the Go `vendor/` directory, which otherwise triggers `inconsistent vendoring` (see `go help modules`); all `npm run mimber:*` scripts already pass `-mod=mod`). Build single `bin/mimber` (`go build -mod=mod -o bin/mimber ./cmd/mimber`).

| Step | Command | What |
|---|---|---|
| 1 | `cp config.yml.example config.yml` | Fill `store`, `password` (private app), `theme_id` or `THEMEKIT_STORE/THEMEKIT_PASSWORD/THEMEKIT_THEME_ID` env |
| 2 | `go run -mod=mod ./cmd/mimber build` (`npm run mimber:build`) | `esbuild` Go `es2017≈last3` → `dist/timber.*.js` + `dist/theme` (Shopify 1.0 structure + modern `assets/timber.js`) |
| 3 | `go run -mod=mod ./cmd/mimber deploy` (`npm run mimber:deploy`) | Upload `dist/theme` via bundled fork `vendor/themekit/bin/theme` (`go build -mod=mod -o vendor/themekit/bin/theme ./vendor/themekit/...`) |
| 4 | `go run -mod=mod ./cmd/mimber preview --url` (`npm run mimber:preview`) | Print `https://{store}/?_ab=0&_fd=0&_sc=1&preview_theme_id={theme_id}` (x.y + z from `config.yml`/`--store`/`--theme-id`) |
| 5 | `go run -mod=mod ./cmd/mimber harness --preview` (`npm run mimber:harness`) | Build → deploy → `playwright --grep preview` (full store preview) |
| 5 local | `go run -mod=mod ./cmd/mimber harness` | Build → `playwright --grep local` (offline `dist/theme` checks, 2 tests, ~0.6s) |

Env: `THEMEKIT_STORE=foo.myshopify.com THEMEKIT_THEME_ID=123456789 THEMEKIT_PASSWORD=xxx go run -mod=mod ./cmd/mimber harness --preview` — `-mod=mod` required (local `replace` `vendor/themekit` lives inside Go `vendor/` dir; without it `go: inconsistent vendoring`).

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
| **8 — query optimization** | `cache.js`/`product-page.js`/`drawers.js`/`accessible-nav`/`ajax-cart.js` | **Done v2** (14 mods, `dist 65K/34.7K min`, per **dom-bench Chrome 150** `gEBCN 57×>qSA('.cls')`, `gEBTN 3292×>qSA('span')` @20K, `closest 4.1×>manual loop`; v1 was measurethat #16434) | Sizzle `rquickExpr` `#id`→`getElementById` 1.18×, `.cls`→`getElementsByClassName`, `tag`→`getElementsByTagName`, QSA only for `[data-*]`/compound; `closest` for all delegation (C++ walk), cached-length `for` over `forEach` (1.23-2.4×) |
| **9 — per-template splitting** | `src/entry/{global,product,collection,customer,cart}.js` + `layout/theme.liquid` | **Done** (5 entries, ESM `splitting`, `target es2017≈last3`, HTTP/2 multiplex, each **<14KB gzip** — `global 2.8K`/`product 0.9K`/`collection 0.3K`/`customer 0.3K`/`cart 4.1K` + shared chunks `1.2K+0.5K+0.4K`; per-page `global 4.9K`/`product 5.8K`/`cart+global 9.0K` gzip, legacy `timber.pkgd.min.js 8.7K` kept) | `type="module"` per-template `{{ 'global.js' | asset_url }}`, `chunks/` shared, `esbuild` `splitting:true` `EntryNames`/`ChunkNames`, fallback `timber.js` IIFE |
| **10 — quality gates** | `eslint.config.js` + `.prettierrc.json` + `vitest.config.js` + `tests/unit/*` | **Done** (`eslint 9` flat `globals browser/node`, `prettier 3` semi:false, `vitest 4` `jsdom`, 6 tests 12 cases incl locale-aware, `npm run check=lint+typecheck+build:js`, `test:all=vitest+playwright --grep local`) | `no-unused-vars caughtErrorsIgnorePattern ^_`, `no-empty allowEmptyCatch`, `playwright testMatch *.spec.js testIgnore unit/` |
| **11 — locale-aware Ajax** | `src/shopify-api.js` + `src/ajax-cart.js` + `layout/theme.liquid` + `templates/product.liquid` | **Done** (`Shopify.routes.root` `{{ routes.root_url }}` per https://shopify.dev/docs/api/ajax/reference/cart#get--locale-cartjs, `cartUrl(path)` helper, `formSelector` `*=` for `/{locale}/cart/add`, 4 endpoints locale-aware, `tests/unit/shopify-api-locale.test.js` 4 cases) | `getShopifyRoot()` fallback `/`, `fetch(cartUrl('/cart.js'))` |
| **12 — CSS modernize (evergreen) S1** | `assets/timber.scss.liquid` + `assets/gift-card.scss.liquid` | **Done** (remove `prefixer` mixin `ms/webkit/moz/o`, `*zoom:1` IE6/7, `-webkit/-moz` appearance→`appearance`, `-webkit-overflow-scrolling`/`-webkit-text-size-adjust` removed, `promote-layer` `translateZ(0)`→`will-change` only, `gift-card` dedupe `-webkit-animation`/`@-webkit-keyframes`, add `:root` CSS vars `--color-primary` etc, `stylelint 16` + `postcss-scss`) | `transform`/`user-select`/`backface-visibility` native, `:root { --color-* : {{ settings.* }} }` |
| **13 — CSS vanilla (Dawn/Horizon)** | `assets/base.css` + `assets/gift-card.css` (vanilla, no SCSS) + `snippets/css-variables.liquid` | **Done** (Liquid vars moved to inline `{% render 'css-variables' %}` → `{% style %}:root{--color-primary:{{ settings.color_primary }}}`, SCSS compiled via `npx sass` with placeholder `{{ }}`→`#hex` then `hex→var(--color-*)`, vanilla `base.css 66K/12.1K gzip` + `gift-card.css 9.7K`, `layout/theme.liquid` now `base.css` + `css-variables` per https://github.com/Shopify/dawn + https://github.com/Shopify/horizon, `templates/gift_card.liquid` updated, legacy `timber.scss.css` kept commented) | `{{ 'base.css' | asset_url | stylesheet_tag }}` + `{% render 'css-variables' %}` vanilla CSS |
| **15 — Liquid images** | `templates/product.liquid` + `snippets/product-grid-item.liquid` + `templates/{collection,index,blog,cart,search}` + `snippets/social-meta-tags.liquid` | **Done** (deprecated `img_url: 'large'/'compact'` → `image_url: width: 800/400/200` + `image_tag` per https://shopify.dev/docs/api/liquid/filters/image_tag + https://shopify.dev/docs/api/liquid/filters/image_url, native lazy `loading: 'lazy'` + eager `loading: 'eager' fetchpriority: 'high'` for hero per https://performance.shopify.com/blogs/blog/lazy-load-images-for-performance, `widths: '200,400,600'` srcset, `image_tag` auto `width`/`height`/`srcset`/`focal_point`) | `{{ image | image_url: width: 800 | image_tag: loading: 'eager' }}` / `loading: 'lazy'` |
| **17 — Liquid `render` vs `include`** | `layout/theme.liquid` + `templates/{product,collection,collection.list,blog,article,search,index,list-collections}` + `snippets/*` | **Done** (62 `{% include %}` → `{% render %}` isolated scope per https://shopify.dev/docs/api/liquid/tags/render + https://shopify.dev/docs/api/liquid/tags/deprecated-tags#include; `breadcrumb` `collection,product,blog,article,page,current_tags,page_title`, `product-grid-item` `product,collection,grid_item_width`, `collection-sidebar` `collection,current_tags`, `blog-sidebar` `blog,current_tags`, `tags-article` `article,blog`, `comment` `comment`; others no params `search-bar`,`social-meta-tags`,`oldIE-js`,`ajax-cart-template`,`collection-sorting`,`respond`, onboarding) | `{% render 'snippet', product: product %}` isolated (explicit params + globals `shop,settings,routes`), ~20% faster, no write-back |
| **16 — LiquidJS sanity** | `scripts/liquid-check.mjs` + `tests/unit/liquid.test.js` | **Done** ([liquidjs](https://liquidjs.com) https://github.com/harttle/liquidjs `v10`, mocks `image_url`/`image_tag`/`paginate`/`form`/`render` + dummy `product`/`cart`/`settings` context, nested `paginate` depth, `npm run liquid:check` → 42/42 ok, `vitest` 3 cases `image_tag`+`parse all`+`strict`) | `npm run liquid:check` / `liquid:check:json` + `go run ./cmd/mimber liquid --json` |
| **14 — audit tool (Go + JS starter)** | `vendor/themekit/cmd/mimber/audit.go` + `scripts/audit.mjs` (Cobra `mimber audit`) | **Done** (static analysis 13 rules: `jquery-ajax`/`handlebars`/`locale-fetch`/`css-vanilla`/`splitting`/`vendor-prefix`/`perf-closest`/`liquid-img-url-legacy`/`liquid-legacy-img-src`, score 0–100, `audit.json`+`audit.md` for LLM starter per `measurethat #16434` + https://shopify.dev/docs/api/ajax/reference/cart + https://shopify.dev/docs/api/liquid/filters/image_tag, Go primary + JS fallback `node scripts/audit.mjs --json`, `npm run audit`/`audit:json`/`mimber:audit`, Mimber self-score 94/100 (7 low `closest` only, asset_url excluded)) | `go run ./cmd/mimber audit --json` → `mimber-reference/audit.json` starter prompt |

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
| `assets/timber.scss.liquid` | SCSS legacy 58K (evergreen S1: `*zoom`/`prefixer` removed) | Keep for diff vs `base.css` |
| `assets/base.css` | Vanilla CSS 66K (Dawn/Horizon, no SCSS) — `var(--color-*)` via `snippets/css-variables.liquid` `{% style %}` | Vanilla CSS; edit `base.css` + `css-variables` not SCSS |
| `assets/gift-card.css` | Vanilla 9.7K (from `gift-card.scss.liquid`) | Same pattern |
| `snippets/css-variables.liquid` | Dawn/Horizon — `{% style %}:root{--color-primary:{{ settings.color_primary }}}` inline | Paste to client `layout/theme.liquid` `<head>` |
| `layout/theme.liquid` (now `mepto.js` + `base.css` + `css-variables` vs `jquery/1.12.4`+`modernizr`+`fastclick`+`timber.scss.css`) | Styles/vendor/shell — modernized per slices 7,11–13 | Diff vs client; remove `timber.scss.css`/`jquery`/`handlebars` tags, add `base.css` + `css-variables` |
| `bower.json` | Legacy — removed | — |
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
| `src/index.js` | Legacy combined 1059L fallback (`window.timber` all) + `src/entry/{global,product,collection,customer,cart}.js` per-template (<14K gzip) | Entry; per-template via `type="module"` `splitting` |
| `src/shopify-api.js` | Locale-aware `cartUrl()` via `Shopify.routes.root {{ routes.root_url }}` | Keep for locale |
| `dist/timber.esm.js` / `dist/timber.pkgd.js` / `dist/timber.pkgd.min.js` | Legacy combined 1059L fallback — **`esbuild` Go** `es2017≈last3` `minify` | Copy `pkgd.min.js` → client `assets/timber.js` only if not using splits |
| `dist/{global,product,collection,customer,cart}.js` + `dist/chunks/` | Split ESM primary (<14K gzip each) | `{{ 'global.js' | asset_url }}` `type="module"` per-template |
| `assets/base.css` / `assets/gift-card.css` | Vanilla CSS (Dawn/Horizon) — `dist/theme/assets/base.css` synced | Via `{{ 'base.css' | asset_url }}` + `{% render 'css-variables' %}` |
| `dist/theme/` | **Shopify 1.0 theme for ThemeKit** — `assets/base.css`+`assets/{global,product,...}.js`+`chunks/` (modern), `layout/theme.liquid`, `config/`, `snippets/`, `templates/` | `go run ./cmd/mimber deploy` → `dist/theme` (`directory: dist/theme` in `config.yml`) |
| `vendor/themekit/` | **Bundled ThemeKit fork** `oreoorbitz/themekit` (Go, 1.0) + `esbuild` (`github.com/evanw/esbuild v0.25`) — `cmd/mimber` | `go build -o bin/mimber ./cmd/mimber` → single Go CLI (JS bundler + ThemeKit) |
| `config.yml.example` | ThemeKit legacy config (store + `theme_id` + `preview_theme_id`) | `cp config.yml.example config.yml`, fill `x.y` + `z` |
| `cmd/mimber/main.go` + `vendor/themekit/cmd/mimber/` | **Go orchestrator** `mimber` (`Cobra` + `esbuild` Go) — `build`/`deploy`/`preview`/`harness` | `go run ./cmd/mimber` or `bin/mimber` |
| `playwright.config.mjs` + `tests/preview.spec.js` | Playwright harness — `_ab=0&_fd=0&_sc=1&preview_theme_id=z` | `go run ./cmd/mimber harness --preview` (full) / `harness` (local) |
| `package.json` (`type:module`, `browserslist last 3`) | `esbuild` Go `v0.25` `es2017≈last3` + `splitting`, `eslint@9`/`prettier@3`/`vitest@4`/`stylelint@16` | Quality gates: `npm run check`/`lint:css`/`test:all` + `audit` |
| `vendor/themekit/cmd/mimber/audit.go` + `scripts/audit.mjs` | `mimber audit` (Go Cobra, 411L) + JS fallback — 13 rules (incl. `liquid-img-url-legacy`/`liquid-legacy-img-src`), score 0–100, `audit.json`/`audit.md` | `go run ./cmd/mimber audit --json` or `node scripts/audit.mjs --json` → LLM starter JSON (excludes frozen `assets/timber.js.liquid` + `asset_url` logos) |
| `scripts/liquid-check.mjs` + `tests/unit/liquid.test.js` | [liquidjs](https://liquidjs.com) https://github.com/harttle/liquidjs `v10` — `image_url`/`image_tag`/`paginate`/`form`/`render` mocks + dummy context, `liquid:check` 42/42 | `npm run liquid:check` / `liquid:check:json` + `go run ./cmd/mimber liquid --json` |
| `eslint.config.js` / `.prettierrc` / `.stylelintrc` / `vitest.config.js` / `playwright.config.mjs` | Quality gates — `eslint flat` `vitest jsdom 15 tests` `playwright 2 local` | `npm run lint`/`test`/`test:all` + `liquid:check` |
| `tests/unit/*.test.js` | Vitest jsdom — `money-format`, `url`, `scheduler`, `cache`, `shopify-api` + `shopify-api-locale` + `liquid` | `npx vitest run` |
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
# Requires Go 1.22+ (LLM does the work, developer installs Go) + Node 22 LTS (nvm use, for Playwright)
go version && nvm use
npm install                      # vendor/themekit already as submodule (oreoorbitz/themekit)
go run ./cmd/mimber build        # esbuild Go → dist/* + dist/theme (replaces Vite+Babel)
go run ./cmd/mimber preview --url --store x.y --theme-id z
go run ./cmd/mimber harness --preview  # build → deploy → playwright --grep preview
go run ./cmd/mimber harness      # build → playwright --grep local (offline, 2 tests)
# Single binary: go build -o bin/mimber ./cmd/mimber && ./bin/mimber --help

# One-offs:
npx playwright install --with-deps chromium  # first time only
cp config.yml.example config.yml # fill store=x.y theme_id=z password (or THEMEKIT_STORE/THEMEKIT_THEME_ID)
go vet ./...                     # Go vet for cmd/mimber + vendor/themekit/cmd/mimber
```
node --check src/*.js
grep -c "jQuery" dist/theme/assets/timber.js  # → 0 (comments only in frozen assets/timber.js.liquid)
```

Dist current (slice 13 vanilla): `timber.pkgd.min.js 27K/8.7K` legacy; split `global 2.8K`/`product 0.9K`/`collection 0.3K`/`customer 0.3K`/`cart 4.1K` + chunks `1.2K+0.5K+0.4K` per-page `global 4.9K`/`product 5.8K`/`cart+global 9.0K` (<14K); `base.css 66K/12.1K gzip` vanilla (from `timber.scss.liquid` 58K), `gift-card.css 9.7K`, `css-variables` inline; slices 0–13 complete — JS + CSS vanilla done.

---

## Verify (client after paste)

`node --check assets/timber.js`, `shopify theme check` (no `fastclick`/`respond` 404s), manual: drawer `prepareTransition` (slice 1), `collectionViews ?view=`, `responsiveVideos` wrap, `loginForms #recover`, mobile nav toggle, cart add/update if `ajax-cart` modernized.

---

## Quick links

Upstream Timber `2.2.2` https://github.com/Shopify/Timber — Mepto https://github.com/oreoorbitz/Mepto + bundled ThemeKit fork https://github.com/oreoorbitz/themekit (Go, `vendor/themekit`, 1.0) — Handlebars `1.3.0` 46K **removed slice 7 (native <template>)** — Shopify `shopify_common.js` (keep)
