# Contributing to Mimber

Mimber is a **reference DB** fork of `Shopify/Timber@2.2.2` modernized with Mepto + Go (`esbuild` + `oreoorbitz/themekit`). Client themes are 5–10yr divergent forks — you diff against Mimber, not ship Mimber as a theme. Slices are small, build stays green, LLM does the per-client port.

## Runtime

- **Go 1.22+** required (`go vet ./...`, `go run ./cmd/mimber build`, `go build -o bin/mimber ./cmd/mimber`). Vendor fork at `vendor/themekit` (submodule `oreoorbitz/themekit`, not `@shopify/themekit` S3).
- **Node 22 LTS** (`nvm use`) for Playwright harness only (`npx playwright test`). JS bundling is **Go `esbuild` `v0.25` `es2017≈last3`** — no `Vite`/`Babel`/`terser` anymore (removed `8694c90`).

## Workflow (human + LLM)

1. **Start at `AGENTS.md`** — router → slice status. LLM prompt: `Read mimber-reference/AGENTS.md then <task>`. Human: same file.
2. **Slice size**: one focused change (e.g., `cacheSelectors` → `src/cache.js`), `go.mod` + `src/*` + `dist/theme`, `AGENTS.md` slice table + File map updated in same commit. Keep `dist/` committed for ThemeKit `dist/theme`.
3. **JS modernization**: `window.mepto||jQuery`, `classList`/`fetch`/`URLSearchParams`/`DOMContentLoaded`, `getElementById`/`getElementsByClassName` per `measurethat #16434`, `DocumentFragment` + `<template>` (handlebars deleted `a12db69`), `scheduler` `rAF` `measure`/`mutate`.
4. **Go orchestration**: `vendor/themekit/cmd/mimber` is canonical `mimber` CLI (`Cobra` + `esbuild` Go + ThemeKit lib). `Mimber/cmd/mimber/main.go` is thin proxy (`go run ./cmd/mimber`). Don’t edit `dist/` by hand.

## Adding a slice

1. Read `LLM_REFERENCE.md` slice exports + `orion/plans/004-mimber-timber-audit.md` if available.
2. Edit `src/*.js` (ESM `type:module`), keep frozen `assets/timber.js.liquid` + `timber.human.js` (496L) untouched.
3. `go run ./cmd/mimber build` (esbuild → `dist/timber.{esm,pkgd}.{js,min.js}` + `dist/theme`), `npx playwright test --grep local` (2 tests), `go vet ./...`, `grep -c jQuery dist/theme/assets/timber.js` → 0.
4. Update `AGENTS.md` Slice status + File map + `Dist current`, `LLM_REFERENCE.md` slice exports, then commit. Push `vendor/themekit` first if you touched the fork (`oreoorbitz/themekit@<sha>`), then `Mimber`.

## Preview harness

```
cp config.yml.example config.yml  # store=x.y theme_id=z password (or THEMEKIT_STORE/THEMEKIT_THEME_ID)
go run ./cmd/mimber harness --preview  # build→deploy (vendor/themekit/bin/theme)→playwright --grep preview → https://x.y/?_ab=0&_fd=0&_sc=1&preview_theme_id=z
go run ./cmd/mimber harness        # local: playwright --grep local
```

ThemeKit is 1.0 (`assets/layout/snippets/templates/config`) — `shopify theme` 2.0 is incompatible, use the Go fork. Order JS→CSS→Liquid.

## PRs, agent files, publishing

- Touch **`AGENTS.md`** + **`LLM_REFERENCE.md`** whenever `src/` or orchestration changes — they are the LLM entrypoint. Keep **`README.md`** (Mimber Mepto overview) and this file consistent with `AGENTS.md`.
- `.github/ISSUE_TEMPLATE.md` / `PULL_REQUEST_TEMPLATE.md` stay lightweight; no Ruby/Bower/Circle `spec` (removed).
- Don’t publish to npm/Shopify store without human approval; don’t add Mepto as hard dep without a slice+test showing it.

## Useful commands

```
go run ./cmd/mimber build          # esbuild + buildTheme
go run ./cmd/mimber preview --url --store x.y --theme-id z
npx playwright test --grep local   # 2 tests
node --check src/*.js
go vet ./...
```
