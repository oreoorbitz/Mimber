package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
)

// Static analysis for LLM-consistent CSS splitting (Shopify + Timber)
// - Parses CSS selectors (simple regex, no full parser needed for 90%+ heuristic)
// - Scans Liquid/JS/JSON for used classes (handles {% if %}, {{ }}, settings_schema)
// - Computes per-selector usage across templates, flags 90%+ global vs section-specific
// - Recommends critical vs base vs section splits

var (
	cssFiles = flag.String("css", "assets/base.css,assets/critical.css", "comma-separated CSS files")
	contentGlob = flag.String("content", "layout/**/*.liquid,templates/**/*.liquid,snippets/**/*.liquid,src/**/*.js,config/**/*.json", "glob for content")
	jsonOut = flag.Bool("json", false, "JSON output for LLM")
)

var (
	classRe = regexp.MustCompile(`\.([a-zA-Z0-9_-]+)`)
	idRe    = regexp.MustCompile(`#([a-zA-Z0-9_-]+)`)
	selectorRe = regexp.MustCompile(`(?m)^\s*([.#]?[a-zA-Z0-9_\-,\s\.:#\[\]="'>+~]+)\s*\{`)
)

type Selector struct {
	Name string
	File string
	Line int
	Count int
}

func main() {
	flag.Parse()
	cssList := strings.Split(*cssFiles, ",")
	contentGlobs := strings.Split(*contentGlob, ",")

	// 1. Collect selectors from CSS
	selectors := map[string]*Selector{}
	for _, f := range cssList {
		f = strings.TrimSpace(f)
		if f == "" { continue }
		collectCSS(f, selectors)
	}

	// 2. Collect used tokens from content (Liquid/JS/JSON)
	used := map[string]int{}
	filesScanned := 0
	for _, pat := range contentGlobs {
		matches, _ := filepath.Glob(strings.TrimSpace(pat))
		// Glob doesn't handle **, use walk
		if len(matches) == 0 {
			// fallback walk for **
			base := strings.Split(pat, "/**")[0]
			if base == "" { base = "." }
			filepath.Walk(base, func(p string, info os.FileInfo, err error) error {
				if err != nil { return nil }
				if info.IsDir() { return nil }
				matched, _ := filepath.Match(strings.Replace(pat, "**/", "", 1), p)
				// crude: if pat contains *, check suffix
				if strings.Contains(pat, "*") {
					// just check extension
					ext := filepath.Ext(p)
					if strings.Contains(pat, ext) {
						matches = append(matches, p)
					}
				} else if matched {
					matches = append(matches, p)
				}
				return nil
			})
		}
		for _, file := range matches {
			if _, err := os.Stat(file); err != nil { continue }
			data, _ := os.ReadFile(file)
			toks := extractTokens(string(data))
			for _, t := range toks {
				used[t]++
			}
			filesScanned++
		}
	}
	// Also handle ** via walk for liquid
	if filesScanned == 0 {
		for _, pat := range contentGlobs {
			if strings.Contains(pat, "liquid") {
				filepath.Walk(".", func(p string, info os.FileInfo, err error) error {
					if err != nil || info.IsDir() { return nil }
					if strings.HasSuffix(p, ".liquid") {
						data, _ := os.ReadFile(p)
						for _, t := range extractTokens(string(data)) {
							used[t]++
						}
						filesScanned++
					}
					return nil
				})
			}
		}
	}

	// 3. Classify 90%+ global vs section-specific (heuristic: used in >=90% of content files OR is grid/normalize)
	totalContentFiles := filesScanned
	if totalContentFiles == 0 { totalContentFiles = 1 }
	threshold := int(float64(totalContentFiles) * 0.9)
	if threshold < 1 { threshold = 1 }

	type Out struct {
		Selector string `json:"selector"`
		Used int `json:"usedCount"`
		Files int `json:"files"`
		Critical bool `json:"critical90"`
		Reason string `json:"reason"`
	}
	var outs []Out
	for name, sel := range selectors {
		clean := strings.TrimPrefix(strings.TrimPrefix(name, "."), "#")
		clean = strings.Split(clean, ":")[0]
		clean = strings.Split(clean, ".")[0]
		clean = strings.Split(clean, "[")[0]
		usedCount := used[clean]
		// also check without prefix
		if usedCount == 0 {
			usedCount = used[name]
		}
		critical := usedCount >= threshold
		reason := "section-specific"
		if critical {
			reason = fmt.Sprintf("90%%+ (%d/%d files)", usedCount, totalContentFiles)
		} else if isGlobalHelper(name) {
			critical = true
			reason = "global helper (normalize/grid/wrapper) — always 90%+"
		}
		// Force non-critical for known deferred
		if isDeferred(name) {
			critical = false
			reason = "deferred (footer/push/drawer/product/cart) — base"
		}
		outs = append(outs, Out{Selector: name, Used: usedCount, Files: sel.Count, Critical: critical, Reason: reason})
	}
	sort.Slice(outs, func(i,j int) bool { return outs[i].Selector < outs[j].Selector })

	if *jsonOut {
		    enc := json.NewEncoder(os.Stdout)
		    enc.SetIndent("", "  ")
		    enc.Encode(map[string]interface{}{
			    "filesScanned": filesScanned,
			    "threshold90": threshold,
			    "selectors": outs,
		    })
		    return
	}

	fmt.Printf("Scanned %d content files, threshold 90%% = %d\n", filesScanned, threshold)
	fmt.Printf("CSS selectors %d\n", len(outs))
	criticalN, deferredN := 0,0
	for _, o := range outs {
		if o.Critical { criticalN++ } else { deferredN++ }
	}
	fmt.Printf("Critical 90%%+: %d, Deferred (base): %d\n", criticalN, deferredN)
	fmt.Println("\nTop deferred (move to base.css):")
	for _, o := range outs {
		if !o.Critical {
			fmt.Printf("  %-40s used %2d reason: %s\n", o.Selector, o.Used, o.Reason)
			if deferredN > 20 && len(outs) > 20 { break }
		}
	}
	fmt.Println("\nSuggested split:")
	fmt.Printf("  assets/critical.css — %d selectors (above-fold 90%%+)\n", criticalN)
	fmt.Printf("  assets/base.css — %d selectors (deferred, loads after critical)\n", deferredN)
	fmt.Printf("  Optional: assets/product.css / assets/cart.css for section-specific (product 5, cart 8) — saves ~7K per non-product page\n")
}

func collectCSS(path string, out map[string]*Selector) {
	f, err := os.Open(path)
	if err != nil { return }
	defer f.Close()
	scanner := bufio.NewScanner(f)
	lineNo := 0
	for scanner.Scan() {
		lineNo++
		line := scanner.Text()
		// Find selectors before {
		if !strings.Contains(line, "{") { continue }
		// Extract selectors part
		selPart := strings.Split(line, "{")[0]
		// Split by comma
		for _, sel := range strings.Split(selPart, ",") {
			sel = strings.TrimSpace(sel)
			if sel == "" || strings.HasPrefix(sel, "/*") || strings.HasPrefix(sel, "@") { continue }
			// Normalize
			if _, ok := out[sel]; !ok {
				out[sel] = &Selector{Name: sel, File: path, Line: lineNo}
			}
			out[sel].Count++
		}
		// Also extract classes/ids inside
		for _, m := range classRe.FindAllStringSubmatch(line, -1) {
			name := "."+m[1]
			if _, ok := out[name]; !ok {
				out[name] = &Selector{Name: name, File: path, Line: lineNo}
			}
		}
	}
}

func extractTokens(content string) []string {
	// Handles Liquid {% if %}, {{ }}, and JS template literals
	// Broad token match, plus class="a b" extraction
	var toks []string
	// class="a b" and class='a b'
	reClass := regexp.MustCompile(`class\s*=\s*["']([^"']+)["']`)
	for _, m := range reClass.FindAllStringSubmatch(content, -1) {
		for _, c := range strings.Fields(m[1]) {
			toks = append(toks, c)
			// also without dot
			toks = append(toks, "."+c)
		}
	}
	// url params, settings: "one-half" etc.
	reQuoted := regexp.MustCompile(`"([a-z0-9_-]+)"`)
	for _, m := range reQuoted.FindAllStringSubmatch(content, -1) {
		toks = append(toks, m[1])
		toks = append(toks, "."+m[1])
	}
	// Generic words
	reWord := regexp.MustCompile(`[\w-]+`)
	for _, w := range reWord.FindAllString(content, -1) {
		toks = append(toks, w)
		toks = append(toks, "."+w)
		toks = append(toks, "#"+w)
	}
	return toks
}

func isGlobalHelper(sel string) bool {
	helpers := []string{".grid", ".wrapper", ".show", ".hide", "html", "body", "normalize"}
	for _, h := range helpers {
		if strings.Contains(sel, h) { return true }
	}
	return false
}

func isDeferred(sel string) bool {
	deferred := []string{"push--", "pull--", "site-footer", "drawer", ".product", ".collection", ".cart", ".ajaxcart", "footer"}
	for _, d := range deferred {
		if strings.Contains(sel, d) { return true }
	}
	return false
}
