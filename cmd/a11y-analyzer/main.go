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
	File     string `json:"file"`
	Line     int    `json:"line"`
	Rule     string `json:"rule"`
	Severity string `json:"severity"`
	Msg      string `json:"msg"`
	Hint     string `json:"hint"`
	Snippet  string `json:"snippet"`
}

var (
	// image_tag without alt: — stricter than image-analyzer (a11y)
	imageTagAltRe = regexp.MustCompile(`\|\s*image_tag`)
	altRe         = regexp.MustCompile(`alt:\s*[^,|}]+`)
	// raw <img> without alt
	imgTagRe        = regexp.MustCompile(`<img[^>]*>`)
	imgAltRe        = regexp.MustCompile(`alt\s*=\s*["'][^"']*["']|alt:\s*`)
	imgAriaHiddenRe = regexp.MustCompile(`aria-hidden\s*=\s*["']true["']`)
	// inputs
	inputRe           = regexp.MustCompile(`<input[^>]*>`)
	inputAriaRe       = regexp.MustCompile(`aria-label\s*=|aria-labelledby\s*=`)
	inputTypeHiddenRe = regexp.MustCompile(`type\s*=\s*["']hidden["']`)
	inputTypeSubmitRe = regexp.MustCompile(`type\s*=\s*["']submit["']`)
	inputIdRe         = regexp.MustCompile(`id\s*=\s*["']([^"']+)["']`)
	labelForRe        = regexp.MustCompile(`<label[^>]*for\s*=\s*["']([^"']+)["']`)
	// buttons
	buttonRe         = regexp.MustCompile(`<button[^>]*>`)
	buttonTypeRe     = regexp.MustCompile(`type\s*=\s*["'](button|submit|reset)["']`)
	buttonAriaRe     = regexp.MustCompile(`aria-label\s*=|title\s*=`)
	visuallyHiddenRe = regexp.MustCompile(`visually-hidden|fallback-text|aria-hidden`)
	buttonTextRe     = regexp.MustCompile(`\{\{.*?\}\}|[A-Za-z]{2,}`)
	// headings
	headingRe = regexp.MustCompile(`<h([1-6])[^>]*>`)
)

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
	fmt.Printf("a11y issues: %d\n", len(issues))
	byRule := map[string]int{}
	for _, iss := range issues {
		byRule[iss.Rule]++
		fmt.Printf("  %s:%d [%s/%s] %s → %s\n    %s\n", iss.File, iss.Line, iss.Rule, iss.Severity, iss.Msg, iss.Hint, iss.Snippet)
	}
	if len(issues) == 0 {
		fmt.Println("ok — alt/label/button/heading a11y")
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
	return false
}

func analyze(root string) []Issue {
	var issues []Issue
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
		base := filepath.Base(p)
		if base == "audit.json" || base == "audit.md" || base == "liquid-audit.json" {
			return nil
		}
		ext := strings.ToLower(filepath.Ext(p))
		if ext != ".liquid" {
			return nil
		}
		rel, _ := filepath.Rel(root, p)
		rel = filepath.ToSlash(rel)
		data, _ := os.ReadFile(p)
		content := string(data)
		lines := strings.Split(content, "\n")
		// collect label for ids per file (handles address form prefix ids)
		labelFors := map[string]bool{}
		for _, l := range lines {
			for _, m := range labelForRe.FindAllStringSubmatch(l, -1) {
				// store base id without liquid {{ form.id }} suffix — use prefix before {{ or _
				raw := m[1]
				// keep full and also prefix before _{{ or {{
				labelFors[raw] = true
				if idx := strings.Index(raw, "{{"); idx > 0 {
					labelFors[strings.TrimSpace(raw[:idx])] = true
				}
				// also store without trailing _+anything after _
				// e.g. AddressFirstName_{{ form.id }} -> AddressFirstName_
				if idx := strings.Index(raw, "_"); idx > 0 {
					labelFors[raw[:idx]] = true
				}
			}
		}
		// also collect id-less label proximity — if file has any <label>, we can be less strict?
		_ = labelFors
		// heading hierarchy per file
		prevLevel := 0
		hasH1 := false
		for i, line := range lines {
			ln := i + 1
			trim := strings.TrimSpace(line)
			if strings.HasPrefix(trim, "{% comment") || strings.HasPrefix(trim, "{%- comment") {
				continue
			}
			// image_tag without alt (high)
			if imageTagAltRe.MatchString(line) && !altRe.MatchString(line) {
				issues = append(issues, Issue{File: rel, Line: ln, Rule: "missing-alt", Severity: "high", Msg: "image_tag without alt:", Hint: "alt: image.alt | product.title | escape", Snippet: trim120(line)})
			}
			// raw <img> without alt and not aria-hidden
			if m := imgTagRe.FindString(line); m != "" {
				if !imgAltRe.MatchString(m) && !imgAriaHiddenRe.MatchString(m) {
					// allow if line also contains image_tag (handled above)
					if !strings.Contains(m, "image_tag") {
						issues = append(issues, Issue{File: rel, Line: ln, Rule: "img-missing-alt", Severity: "high", Msg: "<img> without alt", Hint: `alt="{{ image.alt | escape }}" or image_tag alt:`, Snippet: trim120(line)})
					}
				}
			}
			// <input> without label/aria-label (skip hidden/submit with value, and label for=id)
			if m := inputRe.FindString(line); m != "" {
				if inputTypeHiddenRe.MatchString(m) {
					// skip hidden
				} else if inputTypeSubmitRe.MatchString(m) {
					// submit has value as name — ok
				} else if inputAriaRe.MatchString(m) {
					// has aria-label — ok
				} else {
					// check label for=id match
					if idm := inputIdRe.FindStringSubmatch(m); idm != nil {
						id := idm[1]
						// exact or prefix match for AddressFirstName_{{ form.id }} pattern
						if labelFors[id] {
							// has label for exact id
						} else {
							// try prefix before _{{ or overall prefix
							prefix := id
							if idx := strings.Index(id, "{{"); idx > 0 {
								prefix = strings.TrimSpace(id[:idx])
							}
							// strip trailing _{{...}} suffix
							short := prefix
							if idx := strings.Index(prefix, "_"); idx > 0 {
								short = prefix[:idx]
							}
							if labelFors[prefix] || labelFors[short] || labelFors[id+"_"] {
								// matched label for
							} else {
								// also check any label in nearby lines (±2) as proximity fallback (Timber address form)
								found := false
								for di := -2; di <= 2; di++ {
									ni := i + di
									if ni >= 0 && ni < len(lines) && labelForRe.MatchString(lines[ni]) {
										found = true
										break
									}
								}
								if !found {
									issues = append(issues, Issue{File: rel, Line: ln, Rule: "input-missing-label", Severity: "medium", Msg: "<input> without aria-label/label", Hint: `aria-label="{{ 'general.search.placeholder' | t }}" or <label for="id">`, Snippet: trim120(line)})
								}
							}
						}
					} else {
						// no id and no aria-label — flag unless placeholder as fallback (search)
						if !strings.Contains(m, "placeholder") {
							issues = append(issues, Issue{File: rel, Line: ln, Rule: "input-missing-label", Severity: "medium", Msg: "<input> without aria-label/label", Hint: `aria-label="{{ 'general.search.placeholder' | t }}" or <label for="id">`, Snippet: trim120(line)})
						}
					}
				}
			}
			// <button> without type or name
			if m := buttonRe.FindString(line); m != "" {
				if !buttonTypeRe.MatchString(m) {
					issues = append(issues, Issue{File: rel, Line: ln, Rule: "button-missing-type", Severity: "medium", Msg: "<button> without type=\"button|submit|reset\"", Hint: `type="button"`, Snippet: trim120(line)})
				} else {
					content := contentForButton(lines, i)
					hasName := buttonAriaRe.MatchString(m) || visuallyHiddenRe.MatchString(content) || buttonHasText(content)
					if !hasName {
						issues = append(issues, Issue{File: rel, Line: ln, Rule: "button-missing-name", Severity: "medium", Msg: "icon <button> without accessible name", Hint: `title="{{ '...' | t }}" or <span class="visually-hidden"> or text`, Snippet: trim120(line)})
					}
				}
			}
			// heading hierarchy
			if hm := headingRe.FindStringSubmatch(line); hm != nil {
				lvl := int(hm[1][0] - '0')
				if lvl == 1 {
					if hasH1 {
						issues = append(issues, Issue{File: rel, Line: ln, Rule: "heading-multiple-h1", Severity: "low", Msg: "multiple <h1> in file", Hint: "one h1 per page, then h2→h3", Snippet: trim120(line)})
					}
					hasH1 = true
				}
				if prevLevel != 0 && lvl > prevLevel+1 {
					issues = append(issues, Issue{File: rel, Line: ln, Rule: "heading-skip", Severity: "low", Msg: fmt.Sprintf("heading skip h%d → h%d", prevLevel, lvl), Hint: "don't skip levels (h2 then h3)", Snippet: trim120(line)})
				}
				prevLevel = lvl
			}
		}
		return nil
	})
	return issues
}

func trim120(s string) string {
	s = strings.TrimSpace(s)
	if len(s) > 120 {
		return s[:120]
	}
	return s
}

func contentForButton(lines []string, idx int) string {
	end := idx + 3
	if end > len(lines) {
		end = len(lines)
	}
	return strings.Join(lines[idx:end], "\n")
}

func buttonHasText(content string) bool {
	// strip tags, check for {{ t }} or words
	// button with {{ 'cart.general.checkout' | t }} has accessible name via text
	if strings.Contains(content, "{{") {
		return true
	}
	// strip <span> etc and check remaining text
	re := regexp.MustCompile(`<[^>]*>`)
	txt := re.ReplaceAllString(content, " ")
	txt = strings.TrimSpace(txt)
	if len(txt) >= 2 && buttonTextRe.MatchString(txt) {
		return true
	}
	return false
}
