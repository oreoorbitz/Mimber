package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var (
	jsonOut = flag.Bool("json", false, "JSON output for LLM")
	checkDir = flag.String("check", ".", "theme root to check")
)

type Issue struct {
	File string `json:"file"`
	Line int    `json:"line"`
	Rule string `json:"rule"`
	Msg  string `json:"msg"`
	Fix  string `json:"fix,omitempty"`
}

var (
	// Shopify image filters
	legacyImgUrlRe = regexp.MustCompile(`\|\s*img_url\s*:\s*['"]\w+['"]`)
	modernImageUrlRe = regexp.MustCompile(`\|\s*image_url\s*:\s*width:\s*\d+`)
	imageTagRe = regexp.MustCompile(`\|\s*image_tag`)
	// Liquid conditionals for images
	imgTagWithSrcRe = regexp.MustCompile(`<img[^>]+\{\{[^}]+\|\s*img_url`)
	altRe = regexp.MustCompile(`alt:\s*[^,|}]+`)
	loadingRe = regexp.MustCompile(`loading:\s*['"](eager|lazy)['"]`)
	fetchPrioRe = regexp.MustCompile(`fetchpriority:\s*['"]high['"]`)
	widthsRe = regexp.MustCompile(`widths:\s*['"][\d,]+['"]`)
)

func main() {
	flag.Parse()
	if flag.NFlag() == 0 {
		fmt.Println("Mimber image analyzer — static check for Timber image modernization (slice 15)")
		fmt.Println("usage: go run ./cmd/image-analyzer --check <themeRoot> [--json]")
		fmt.Println("  checks: legacy img_url, missing image_tag, missing alt/width, LCP eager/fetchpriority, lazy below-fold")
	}
	root := *checkDir
	if flag.NArg() > 0 && *checkDir == "." {
		root = flag.Arg(0)
	}
	issues := analyze(root)
	if *jsonOut {
		enc := json.NewEncoder(os.Stdout)
		enc.SetIndent("", "  ")
		enc.Encode(map[string]interface{}{"issues": issues, "count": len(issues)})
		if len(issues) > 0 { os.Exit(1) }
		return
	}
	fmt.Printf("image issues: %d\n", len(issues))
	for _, iss := range issues {
		fmt.Printf("  %s:%d [%s] %s", iss.File, iss.Line, iss.Rule, iss.Msg)
		if iss.Fix != "" {
			fmt.Printf(" → fix: %s", iss.Fix)
		}
		fmt.Println()
	}
	if len(issues) == 0 {
		fmt.Println("ok — no legacy img_url, all image_tag have alt/widths, LCP eager")
	}
	if len(issues) > 0 { os.Exit(1) }
}

func analyze(root string) []Issue {
	var issues []Issue
	filepath.Walk(root, func(p string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() { return nil }
		if strings.Contains(p, "/vendor/") || strings.HasPrefix(p, "vendor/") { return nil }
		if strings.Contains(p, "/dist/") || strings.HasPrefix(p, "dist/") { return nil }
		if strings.Contains(p, "/node_modules/") || strings.HasPrefix(p, "node_modules/") { return nil }
		if filepath.Ext(p) != ".liquid" { return nil }
		data, _ := os.ReadFile(p)
		rel, _ := filepath.Rel(root, p)
		lines := strings.Split(string(data), "\n")
		for i, line := range lines {
			ln := i + 1
			// Skip dist/ legacy check handled by walk skip
			if strings.Contains(p, "dist/") { return nil }
			// Legacy img_url: 'large' etc. — should be image_url: width: 800
			if legacyImgUrlRe.MatchString(line) {
				issues = append(issues, Issue{File: rel, Line: ln, Rule: "legacy-img-url", Msg: "deprecated img_url: 'large'/'compact' — use image_url: width: 800 + image_tag", Fix: "{{ image | image_url: width: 800 | image_tag: ... }}"})
			}
			// Raw <img src="{{ ... | img_url }}"> without image_tag — should use image_tag filter
			if imgTagWithSrcRe.MatchString(line) && !imageTagRe.MatchString(line) {
				issues = append(issues, Issue{File: rel, Line: ln, Rule: "missing-image-tag", Msg: "<img src=\"{{ ... | img_url }}\"> without image_tag — loses width/height/srcset/focal_point", Fix: "{{ image | image_url: width: 800 | image_tag: alt: ..., loading: 'lazy' }}"})
			}
			// image_tag without alt
			if imageTagRe.MatchString(line) && !altRe.MatchString(line) {
				issues = append(issues, Issue{File: rel, Line: ln, Rule: "missing-alt", Msg: "image_tag without alt: — a11y + LCP", Fix: "alt: image.alt or product.title | escape"})
			}
			// image_tag without widths (srcset) — only for thumbnail/grid featured_image, hero has single width 800
			if imageTagRe.MatchString(line) && !widthsRe.MatchString(line) && strings.Contains(line, "featured_image") && !strings.Contains(line, "fetchpriority") {
				issues = append(issues, Issue{File: rel, Line: ln, Rule: "missing-widths", Msg: "image_tag without widths: '200,400,600' — no srcset", Fix: "widths: '200,400,600'"})
			}
			// LCP hero should be eager + fetchpriority high, not lazy (check product.liquid ProductPhotoImg)
			if strings.Contains(line, "ProductPhotoImg") || strings.Contains(line, "featured_image") && strings.Contains(line, "product.liquid") {
				if imageTagRe.MatchString(line) {
					if !loadingRe.MatchString(line) {
						issues = append(issues, Issue{File: rel, Line: ln, Rule: "lcp-loading", Msg: "hero image missing loading: 'eager' (LCP) — lazy defers LCP", Fix: "loading: 'eager', fetchpriority: 'high'"})
					} else if strings.Contains(line, "loading: 'lazy'") {
						issues = append(issues, Issue{File: rel, Line: ln, Rule: "lcp-lazy", Msg: "hero image lazy — should be eager + fetchpriority high for LCP", Fix: "loading: 'eager', fetchpriority: 'high'"})
					}
					if !fetchPrioRe.MatchString(line) && strings.Contains(line, "eager") {
						issues = append(issues, Issue{File: rel, Line: ln, Rule: "lcp-fetchpriority", Msg: "eager hero missing fetchpriority: 'high'", Fix: "fetchpriority: 'high'"})
					}
				}
			}
			// Modern image_url without image_tag width check
			if modernImageUrlRe.MatchString(line) && !imageTagRe.MatchString(line) && strings.Contains(line, "meta") {
				// og:image is ok without image_tag, skip
			}
		}
		_ = modernImageUrlRe
		return nil
	})
	return issues
}
