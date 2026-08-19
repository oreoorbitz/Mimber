package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
)

var (
	jsonOut  = flag.Bool("json", false, "JSON output for LLM")
	checkDir = flag.String("check", ".", "theme root to check")
)

type Issue struct {
	File    string `json:"file"`
	Line    int    `json:"line"`
	Rule    string `json:"rule"`
	Severity string `json:"severity"`
	Msg     string `json:"msg"`
	Hint    string `json:"hint"`
	Snippet string `json:"snippet"`
}

type rule struct {
	ID       string
	Title    string
	Severity string
	Re       *regexp.Regexp
	Hint     string
}

var rules = []rule{
	{"jquery-ajax", "jQuery $.ajax vs fetch + Mepto", "high", regexp.MustCompile(`\$\.ajax\s*\(|jQuery\.ajax\s*\(`), "Use fetch + ShopifyAPI (src/shopify-api.js)"},
	{"jquery-extend-proxy", "jQuery $.extend/$.proxy vs Object.assign/bind", "medium", regexp.MustCompile(`\$\.extend\s*\(|\$\.proxy\s*\(`), "Object.assign / bind"},
	{"jquery-selector", "jQuery selector $()/jQuery() vs Mepto/native", "medium", regexp.MustCompile(`\$\(\s*['"\[]|jQuery\(\s*['"\[]`), "window.mepto||jQuery or querySelectorAll"},
	{"handlebars", "Handlebars vs native <template>", "high", regexp.MustCompile(`handlebars(\.min)?\.js|Handlebars\.compile|\{\{#?items\}\}`), "Delete handlebars.min.js 46K, use <template> (slice 7)"},
	{"locale-fetch", "Cart fetch not locale-aware", "high", regexp.MustCompile(`fetch\(\s*['"]/cart(\.js|/add\.js|/change\.js|/update\.js)['"]`), "cartUrl('/cart.js') via Shopify.routes.root {{ routes.root_url }} (slice 11)"},
	{"locale-form", "Product form action not locale-aware", "medium", regexp.MustCompile(`action="/cart/add"`), `action="{{ routes.root_url }}cart/add"`},
	{"css-legacy-scss", "Legacy timber.scss.css still loaded", "medium", regexp.MustCompile(`timber\.scss\.css`), "Dawn/Horizon: {% render 'css-variables' %} + {{ 'base.css' | asset_url }} (slice 13)"},
	{"js-splitting", "Single timber.js vs per-template split", "medium", regexp.MustCompile(`\{\{\s*'timber\.js'\s*\|`), `type="module" per-template global/product/collection/customer/cart (slice 9)`},
	{"css-vendor-prefix", "Vendor prefix / IE hack in SCSS (*zoom, -webkit-)", "low", regexp.MustCompile(`\*zoom:\s*1|@mixin prefixer|-ms-transform|-webkit-transform:\s*translateZ\(0\)`), "Evergreen: transform native, will-change only (slice 12)"},
	{"perf-closest", "Perf: closest in hot path", "low", regexp.MustCompile(`\.closest\(`), "Keep closest only for delegation"},
	// liquid image rules are covered by image-analyzer, but keep for audit parity (warn only if image-analyzer not run)
	{"liquid-img-url-legacy", "Liquid img_url deprecated", "medium", regexp.MustCompile(`img_url:`), "Use {{ image | image_url: width: 800 | image_tag: ... }}"},
	{"liquid-legacy-img-src", "Legacy <img src=\"{{ ... }}\"> vs image_tag", "medium", regexp.MustCompile(`<img\s+src="\s*\{\{`), "Use image_tag (auto srcset/width/height)"},
}

var frozen = []string{"assets/timber.js.liquid", "assets/timber.human.js", "assets/ajax-cart.js.liquid"}

func main() {
	flag.Parse()
	if flag.NArg() > 0 && *checkDir == "." {
		*checkDir = flag.Arg(0)
	}
	root := *checkDir
	issues := analyze(root)
	sort.Slice(issues, func(i, j int) bool {
		if issues[i].Rule != issues[j].Rule {
			return issues[i].Rule < issues[j].Rule
		}
		if issues[i].File != issues[j].File {
			return issues[i].File < issues[j].File
		}
		return issues[i].Line < issues[j].Line
	})
	if *jsonOut {
		enc := json.NewEncoder(os.Stdout)
		enc.SetIndent("", "  ")
		enc.Encode(map[string]interface{}{"issues": issues, "count": len(issues), "target": root})
		if hasHigh(issues) {
			os.Exit(1)
		}
		return
	}
	fmt.Printf("js issues: %d\n", len(issues))
	byRule := map[string]int{}
	for _, iss := range issues {
		byRule[iss.Rule]++
		fmt.Printf("  %s:%d [%s/%s] %s → %s\n    %s\n", iss.File, iss.Line, iss.Rule, iss.Severity, iss.Msg, iss.Hint, iss.Snippet)
	}
	if len(issues) == 0 {
		fmt.Println("ok — no jQuery/handlebars/locale/splitting issues")
	} else {
		for r, c := range byRule {
			fmt.Printf("  %s: %d\n", r, c)
		}
	}
	if hasHigh(issues) {
		os.Exit(1)
	}
}

func hasHigh(issues []Issue) bool {
	for _, iss := range issues {
		if iss.Severity == "high" {
			return true
		}
	}
	// also fail on medium if any? match audit.mjs: image/js high fail, but for JS analyzer fail on high only to avoid perf-closest noise
	return false
}

func analyze(root string) []Issue {
	var issues []Issue
	// pre-read for js-splitting global.js check
	hasGlobalJS := false
	filepath.Walk(root, func(p string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return nil
		}
		if strings.Contains(p, "/vendor/") || strings.HasPrefix(p, "vendor/") {
			if info.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		if strings.Contains(p, "/node_modules/") || strings.HasPrefix(p, "node_modules/") || strings.Contains(p, "/dist/") || strings.HasPrefix(p, "dist/") || strings.Contains(p, "/performance/") {
			return nil
		}
		if filepath.Base(p) == "audit.json" || filepath.Base(p) == "audit.md" || filepath.Base(p) == "liquid-audit.json" {
			return nil
		}
		if strings.Contains(filepath.Base(p), "global.js") {
			hasGlobalJS = true
		}
		return nil
	})

	filepath.Walk(root, func(p string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if info.IsDir() {
			name := info.Name()
			if name == "node_modules" || name == "dist" || name == ".git" || name == "vendor" || name == ".next" || name == "performance" {
				return filepath.SkipDir
			}
			return nil
		}
		// skip generated audit artifacts
		base := filepath.Base(p)
		if base == "audit.json" || base == "audit.md" || base == "liquid-audit.json" {
			return nil
		}
		ext := strings.ToLower(filepath.Ext(p))
		if ext != ".js" && ext != ".liquid" && ext != ".scss" && ext != ".css" && ext != ".json" {
			// also .liquid is the main, but .js.liquid counted as .liquid ext? filepath.Ext gives .liquid, ok
			if !strings.HasSuffix(strings.ToLower(p), ".liquid") {
				return nil
			}
		}
		rel, _ := filepath.Rel(root, p)
		rel = filepath.ToSlash(rel)
		for _, f := range frozen {
			if rel == f || strings.HasPrefix(rel, f) {
				return nil
			}
		}
		// asset_url logos excluded for liquid-legacy-img-src already handled per-line
		data, err := os.ReadFile(p)
		if err != nil {
			return nil
		}
		content := string(data)
		lines := strings.Split(content, "\n")
		for i, line := range lines {
			ln := i + 1
			for _, r := range rules {
				if r.ID == "handlebars" && rel == "snippets/ajax-cart-template.liquid" {
					continue
				}
				if r.ID == "css-legacy-scss" && strings.Contains(line, "<!--") && strings.Contains(line, "timber.scss.css") {
					continue
				}
				if r.ID == "js-splitting" && hasGlobalJS {
					continue
				}
				if r.ID == "jquery-selector" && strings.TrimSpace(line) != "" && strings.HasPrefix(strings.TrimSpace(line), "//") {
					continue
				}
				if r.ID == "liquid-legacy-img-src" && (strings.Contains(line, "asset_url") || strings.Contains(line, "shopify_asset_url")) {
					continue
				}
				// perf-closest is noisy in mepto.js itself — only flag if file is not mepto.js? Keep but low severity, not failing
				if r.ID == "perf-closest" && strings.Contains(rel, "mepto.js") {
					// still report but demote — audit.mjs flags it, but JS analyzer should surface as low
					// keep it
				}
				if r.Re.MatchString(line) {
					snip := strings.TrimSpace(line)
					if len(snip) > 120 {
						snip = snip[:120]
					}
					issues = append(issues, Issue{
						File:     rel,
						Line:     ln,
						Rule:     r.ID,
						Severity: r.Severity,
						Msg:      r.Title,
						Hint:     r.Hint,
						Snippet:  snip,
					})
				}
			}
		}
		return nil
	})

	// synthetic css-missing-vanilla like audit.mjs
	hasBase := exists(filepath.Join(root, "assets/base.css"))
	hasVars := exists(filepath.Join(root, "snippets/css-variables.liquid"))
	if !hasBase || !hasVars {
		miss := "assets/base.css"
		if !hasVars {
			miss = "snippets/css-variables.liquid (+ assets/base.css)"
		}
		issues = append(issues, Issue{File: "assets/base.css", Line: 1, Rule: "css-missing-vanilla", Severity: "high", Msg: "Missing vanilla CSS", Hint: "Generate base.css via npx sass (slice 13, Dawn/Horizon)", Snippet: "missing " + miss})
	}
	return issues
}

func exists(p string) bool {
	_, err := os.Stat(p)
	return err == nil
}
