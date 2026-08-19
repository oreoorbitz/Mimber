// Mimber Go orchestrator — thin wrapper that builds/runs the vendored fork's mimber command.
// This lets `go run ./cmd/mimber --help` work from Mimber root without installing the fork binary.
// The fork lives at vendor/themekit (oreoorbitz/themekit, bundled with Mepto).
// For LLM: `go run ./cmd/mimber build` == `npm run build` + `vendor/themekit` deploy harness.
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/oreoorbitz/goliquid/theme"
)

func main() {
	// Intercept static-analysis commands — no store bridge, fine control (like theme-check but offline)
	if len(os.Args) > 1 {
		switch os.Args[1] {
		case "liquid":
			// go run ./cmd/mimber liquid --check ../Mimber [--json]
			// Port of liquidjs + Shopify/liquid for static analysis (not render). Verifies config/ but drops (product/collection) are any.
			check := ""
			jsonOut := false
			for i, a := range os.Args {
				if a == "--check" && i+1 < len(os.Args) {
					check = os.Args[i+1]
				}
				if a == "--json" {
					jsonOut = true
				}
			}
			if check == "" {
				fmt.Println("usage: go run ./cmd/mimber liquid --check <themeRoot> [--json]")
				fmt.Println("  static analysis only, no render, no store auth — verifiable config/ + drops any")
				os.Exit(1)
			}
			report := theme.Check(check)
			if jsonOut {
				enc := json.NewEncoder(os.Stdout)
				enc.SetIndent("", "  ")
				enc.Encode(report)
				return
			}
			fmt.Printf("config issues: %d\n", len(report.Config))
			for _, iss := range report.Config {
				fmt.Printf("  %s: %s\n", iss.File, iss.Msg)
			}
			fmt.Printf("liquid diags: %d\n", len(report.Liquid))
			for _, d := range report.Liquid {
				fmt.Printf("  %s:%d:%d [%s] %s\n", d.File, d.Line, d.Col, d.Rule, d.Msg)
			}
			if len(report.Config) == 0 && len(report.Liquid) == 0 {
				fmt.Println("ok — no verifiable issues, drops (product/collection) are any")
			}
			if len(report.Config) > 0 || len(report.Liquid) > 0 {
				os.Exit(1)
			}
			return
		case "css-analyze":
			// keep existing css-analyzer as subcommand for LLM consistency
			// delegate to cmd/css-analyzer binary
			cssBin := filepath.Join(findRoot(), "cmd", "css-analyzer", "main.go")
			if _, err := os.Stat(cssBin); err == nil {
				args := append([]string{"run", "-mod=mod", "./cmd/css-analyzer"}, os.Args[2:]...)
				cmd := exec.Command("go", args...)
				cmd.Dir = findRoot()
				cmd.Stdout = os.Stdout
				cmd.Stderr = os.Stderr
				cmd.Stdin = os.Stdin
				if err := cmd.Run(); err != nil {
					os.Exit(1)
				}
				return
			}
		case "image":
			imgBin := filepath.Join(findRoot(), "cmd", "image-analyzer", "main.go")
			if _, err := os.Stat(imgBin); err == nil {
				args := append([]string{"run", "-mod=mod", "./cmd/image-analyzer"}, os.Args[2:]...)
				cmd := exec.Command("go", args...)
				cmd.Dir = findRoot()
				cmd.Stdout = os.Stdout
				cmd.Stderr = os.Stderr
				cmd.Stdin = os.Stdin
				if err := cmd.Run(); err != nil {
					os.Exit(1)
				}
				return
			}
		case "js":
			jsBin := filepath.Join(findRoot(), "cmd", "js-analyzer", "main.go")
			if _, err := os.Stat(jsBin); err == nil {
				args := append([]string{"run", "-mod=mod", "./cmd/js-analyzer"}, os.Args[2:]...)
				cmd := exec.Command("go", args...)
				cmd.Dir = findRoot()
				cmd.Stdout = os.Stdout
				cmd.Stderr = os.Stderr
				cmd.Stdin = os.Stdin
				if err := cmd.Run(); err != nil {
					os.Exit(1)
				}
				return
			}
		case "a11y":
			a11yBin := filepath.Join(findRoot(), "cmd", "a11y-analyzer", "main.go")
			if _, err := os.Stat(a11yBin); err == nil {
				args := append([]string{"run", "-mod=mod", "./cmd/a11y-analyzer"}, os.Args[2:]...)
				cmd := exec.Command("go", args...)
				cmd.Dir = findRoot()
				cmd.Stdout = os.Stdout
				cmd.Stderr = os.Stderr
				cmd.Stdin = os.Stdin
				if err := cmd.Run(); err != nil {
					os.Exit(1)
				}
				return
			}
		case "mcp":
			runMCP(os.Args[2:])
			return
		case "preview":
			// local preview --url without vendored themekit (avoids package conflict)
			store := ""
			themeID := ""
			for i, a := range os.Args {
				if a == "--store" && i+1 < len(os.Args) {
					store = os.Args[i+1]
				}
				if a == "--theme-id" && i+1 < len(os.Args) {
					themeID = os.Args[i+1]
				}
			}
			if store == "" {
				store = os.Getenv("THEMEKIT_STORE")
			}
			if themeID == "" {
				themeID = os.Getenv("THEMEKIT_THEME_ID")
			}
			// fallback to config.yml
			if store == "" || themeID == "" {
				cfgPath := filepath.Join(findRoot(), "config.yml")
				if data, err := os.ReadFile(cfgPath); err == nil {
					for _, raw := range strings.Split(string(data), "\n") {
						line := strings.TrimSpace(raw)
						if strings.HasPrefix(line, "#") {
							continue
						}
						if strings.HasPrefix(line, "store:") && store == "" {
							v := strings.TrimSpace(strings.TrimPrefix(line, "store:"))
							v = strings.Trim(v, "\"' ${}")
							// handle ${THEMEKIT_STORE:-default}
							if strings.Contains(raw, "THEMEKIT_STORE") {
								if env := os.Getenv("THEMEKIT_STORE"); env != "" {
									store = env
								} else if idx := strings.Index(v, ":-"); idx != -1 {
									store = strings.Trim(v[idx+2:], "} \"'")
								}
							} else {
								store = v
							}
						}
						if strings.HasPrefix(line, "theme_id:") && themeID == "" {
							v := strings.TrimSpace(line[strings.Index(line, ":")+1:])
							v = strings.Trim(v, "\"' ${}")
							if strings.Contains(raw, "THEMEKIT_THEME_ID") {
								if env := os.Getenv("THEMEKIT_THEME_ID"); env != "" {
									themeID = env
								} else if idx := strings.Index(v, ":-"); idx != -1 {
									themeID = strings.Trim(v[idx+2:], "} \"'")
								}
							} else {
								themeID = v
							}
						}
					}
				}
			}
			if store == "" || themeID == "" {
				fmt.Fprintln(os.Stderr, "preview: missing store or theme_id — set config.yml or THEMEKIT_STORE/THEMEKIT_THEME_ID")
				os.Exit(1)
			}
			store = strings.TrimPrefix(store, "https://")
			store = strings.TrimPrefix(store, "http://")
			store = strings.TrimSuffix(store, "/")
			url := fmt.Sprintf("https://%s?_ab=0&_fd=0&_sc=1&preview_theme_id=%s", store, themeID)
			fmt.Println(url)
			if len(os.Args) > 2 && os.Args[2] == "--url" {
				return
			}
			// if not --url, also try to open? just print
			return
		case "build":
			// pre-flight static checks before delegating to themekit build
			if os.Getenv("MIMBER_SKIP_CHECKS") == "" {
				for _, chk := range [][]string{
					{"run", "-mod=mod", "./cmd/image-analyzer", "--check", "."},
					{"run", "-mod=mod", "./cmd/js-analyzer", "--check", "."},
					{"run", "-mod=mod", "./cmd/a11y-analyzer", "--check", "."},
					{"run", "-mod=mod", "./cmd/css-analyzer", "--json"},
				} {
					c := exec.Command("go", chk...)
					c.Dir = findRoot()
					c.Stdout = os.Stdout
					c.Stderr = os.Stderr
					if err := c.Run(); err != nil {
						if chk[2] == "./cmd/image-analyzer" {
							fmt.Fprintln(os.Stderr, "mimber build: image --check failed — fix legacy img_url / missing image_tag (or MIMBER_SKIP_CHECKS=1 to bypass)")
							os.Exit(1)
						}
						if chk[2] == "./cmd/js-analyzer" {
							fmt.Fprintln(os.Stderr, "mimber build: js --check failed — fix jQuery/handlebars high (or MIMBER_SKIP_CHECKS=1 to bypass)")
							os.Exit(1)
						}
						if chk[2] == "./cmd/a11y-analyzer" {
							fmt.Fprintln(os.Stderr, "mimber build: a11y --check failed — fix missing alt/high (or MIMBER_SKIP_CHECKS=1 to bypass)")
							os.Exit(1)
						}
					}
				}
				// liquid check via node fallback (offline, no store auth)
				if _, err := os.Stat(filepath.Join(findRoot(), "scripts", "liquid-check.mjs")); err == nil {
					c := exec.Command("node", "scripts/liquid-check.mjs")
					c.Dir = findRoot()
					c.Stdout = os.Stdout
					c.Stderr = os.Stderr
					if err := c.Run(); err != nil {
						fmt.Fprintln(os.Stderr, "mimber build: liquid:check failed")
						os.Exit(1)
					}
				}
			}
		}
	}
	root := findRoot()
	// Prefer prebuilt binaries to avoid `go run` vendor inconsistency spam.
	// The wrapper itself is `bin/mimber`; the vendored ThemeKit binary is `vendor/themekit/bin/theme` or `bin/mimber` fallback.
	// For all non-analysis commands, try binaries first.
	binCandidates := []string{
		filepath.Join(root, "bin", "mimber"),
		filepath.Join(root, "vendor", "themekit", "bin", "mimber"),
		filepath.Join(root, "vendor", "themekit", "bin", "theme"),
	}
	// If invoked as build/deploy/preview/harness/open, try binary directly before `go run`
	if len(os.Args) > 1 {
		for _, p := range binCandidates {
			if _, err := os.Stat(p); err == nil {
				// Avoid self-recursion: if p == current executable, skip and use go run module path
				if exe, _ := os.Executable(); exe != "" {
					if same, _ := filepath.EvalSymlinks(exe); same == p {
						continue
					}
					if exe == p {
						continue
					}
				}
				cmd2 := exec.Command(p, os.Args[1:]...)
				cmd2.Stdout = os.Stdout
				cmd2.Stderr = os.Stderr
				cmd2.Stdin = os.Stdin
				cmd2.Dir = root
				if err2 := cmd2.Run(); err2 == nil {
					os.Exit(0)
				}
				// if binary exists but failed, fall through to go run
				break
			}
		}
	}
	// Fallback: `go run` via module path (now in subdir main)
	args := append([]string{"run", "-mod=mod", "github.com/Shopify/themekit/cmd/mimber/main"}, os.Args[1:]...)
	cmd := exec.Command("go", args...)
	cmd.Dir = root
	cmd.Env = append(os.Environ(), "GOFLAGS=-mod=mod", "GOWORK=off")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	if err := cmd.Run(); err != nil {
		// final fallback: try binaries again
		for _, p := range binCandidates {
			if _, err := os.Stat(p); err == nil {
				cmd2 := exec.Command(p, os.Args[1:]...)
				cmd2.Stdout = os.Stdout
				cmd2.Stderr = os.Stderr
				cmd2.Stdin = os.Stdin
				if err2 := cmd2.Run(); err2 == nil {
					os.Exit(0)
				}
			}
		}
		os.Exit(1)
	}
}

func findRoot() string {
	dir, _ := os.Getwd()
	for {
		if _, err := os.Stat(filepath.Join(dir, "vendor", "themekit", "go.mod")); err == nil {
			return dir
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			wd, _ := os.Getwd()
			return wd
		}
		dir = parent
	}
}
