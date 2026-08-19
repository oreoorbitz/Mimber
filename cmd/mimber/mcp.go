package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
	"github.com/oreoorbitz/goliquid/theme"
)

// MCP 2.0 (2026-07-28) — stdio (editor) + Streamable HTTP (remote)
// Usage: bin/mimber mcp --stdio   or  bin/mimber mcp --http :3202
// Tools are read-only by default; deploy/compare need THEMEKIT_PASSWORD and are marked destructive.

func runMCP(args []string) {
	for _, a := range args {
		if a == "--help" || a == "-h" {
			fmt.Println("mimber mcp — MCP 2.0 (2026-07-28) server")
			fmt.Println("  bin/mimber mcp --stdio          stdio (editor: Claude/Cursor)")
			fmt.Println("  bin/mimber mcp --http :3202     Streamable HTTP")
			fmt.Println("Tools: mimber_image_check, mimber_js_check, mimber_a11y_check, mimber_liquid_check, mimber_css_analyze, mimber_preview_url, mimber_build, mimber_deploy, mimber_compare")
			fmt.Println("Resources: mimber://audit/audit.json, mimber://config/config.yml (redacted), mimber://report/compare/README.md (+ png)")
			fmt.Println("Prompts: mimber-modernize, mimber-fix-a11y")
			fmt.Println("  deploy/compare require THEMEKIT_PASSWORD and are destructive — client must confirm")
			return
		}
	}
	useHTTP := ""
	for i, a := range args {
		if a == "--http" && i+1 < len(args) {
			useHTTP = args[i+1]
		}
		if a == "--stdio" {
			useHTTP = ""
		}
	}
	// mcp-go server
	s := server.NewMCPServer("mimber", "2.2.2-mepto.1",
		server.WithToolCapabilities(true),
		server.WithResourceCapabilities(true, true),
		server.WithPromptCapabilities(true),
	)

	// --- Tools ---

	s.AddTool(mcp.NewTool("mimber_image_check",
		mcp.WithDescription("Shopify image modernization: legacy img_url vs image_url: width: + image_tag alt/widths/loading audit (slice 15)"),
		mcp.WithString("themeRoot", mcp.DefaultString("."), mcp.Description("Theme root, default .")),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		root := req.GetString("themeRoot", ".")
		out, err := runGoTool(ctx, "image-analyzer", root)
		return toolResult(out, err)
	})

	s.AddTool(mcp.NewTool("mimber_js_check",
		mcp.WithDescription("Timber→Mimber JS audit: jQuery $.ajax/$.extend/handlebars vs fetch/<template> + locale cartUrl (slices 0-11)"),
		mcp.WithString("themeRoot", mcp.DefaultString(".")),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		root := req.GetString("themeRoot", ".")
		out, err := runGoTool(ctx, "js-analyzer", root)
		return toolResult(out, err)
	})

	s.AddTool(mcp.NewTool("mimber_a11y_check",
		mcp.WithDescription("A11y: alt on image_tag, input label/aria-label, button type/name, heading hierarchy"),
		mcp.WithString("themeRoot", mcp.DefaultString(".")),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		root := req.GetString("themeRoot", ".")
		out, err := runGoTool(ctx, "a11y-analyzer", root)
		return toolResult(out, err)
	})

	s.AddTool(mcp.NewTool("mimber_liquid_check",
		mcp.WithDescription("Liquid static analysis (goliquid offline, no store auth — verifies config/ + drops any)"),
		mcp.WithString("themeRoot", mcp.DefaultString(".")),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		root := req.GetString("themeRoot", ".")
		rep := theme.Check(root)
		b, _ := json.MarshalIndent(rep, "", "  ")
		isErr := len(rep.Config) > 0 || len(rep.Liquid) > 0
		return mcp.NewToolResultText(string(b)), nilIfNotErr(isErr)
	})

	s.AddTool(mcp.NewTool("mimber_css_analyze",
		mcp.WithDescription("CSS splitting audit: 90%+ critical vs base, per-selector usage across Liquid/JS"),
		mcp.WithString("css", mcp.DefaultString("assets/base.css,assets/critical.css")),
		mcp.WithString("content", mcp.DefaultString("layout/**/*.liquid,templates/**/*.liquid,snippets/**/*.liquid")),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		css := req.GetString("css", "assets/base.css,assets/critical.css")
		content := req.GetString("content", "layout/**/*.liquid,templates/**/*.liquid,snippets/**/*.liquid")
		out, err := runCSSAnalyze(ctx, css, content)
		return toolResult(out, err)
	})

	s.AddTool(mcp.NewTool("mimber_preview_url",
		mcp.WithDescription("Print Shopify preview URL https://x.y/?_ab=0&_fd=0&_sc=1&preview_theme_id=z (no API, reads config.yml or THEMEKIT_*)"),
		mcp.WithString("store", mcp.Description("Shopify store x.y")),
		mcp.WithString("themeId", mcp.Description("Preview theme id z")),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		store := req.GetString("store", "")
		themeID := req.GetString("themeId", "")
		if store == "" {
			store = os.Getenv("THEMEKIT_STORE")
		}
		if themeID == "" {
			themeID = os.Getenv("THEMEKIT_THEME_ID")
		}
		if store == "" || themeID == "" {
			// fallback to config.yml via same logic as preview command
			root := findRoot()
			if data, err := os.ReadFile(filepath.Join(root, "config.yml")); err == nil {
				for _, raw := range strings.Split(string(data), "\n") {
					line := strings.TrimSpace(raw)
					if strings.HasPrefix(line, "#") {
						continue
					}
					if strings.HasPrefix(line, "store:") && store == "" {
						v := strings.TrimSpace(strings.TrimPrefix(line, "store:"))
						v = strings.Trim(v, "\"' ${}")
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
			return mcp.NewToolResultError("missing store/themeId — set THEMEKIT_STORE/THEMEKIT_THEME_ID or config.yml"), nil
		}
		store = strings.TrimPrefix(strings.TrimPrefix(store, "https://"), "http://")
		store = strings.TrimSuffix(store, "/")
		url := fmt.Sprintf("https://%s?_ab=0&_fd=0&_sc=1&preview_theme_id=%s", store, themeID)
		return mcp.NewToolResultText(url), nil
	})

	s.AddTool(mcp.NewTool("mimber_build",
		mcp.WithDescription("Build Mimber: esbuild Go + build:theme → dist/timber.* + dist/theme (no store auth)"),
		mcp.WithBoolean("skipChecks", mcp.DefaultBool(false), mcp.Description("Skip image/js/a11y/liquid checks (MIMBER_SKIP_CHECKS=1)")),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		skip := req.GetBool("skipChecks", false)
		cmd := exec.CommandContext(ctx, "go", "run", "-mod=mod", "./cmd/mimber", "build")
		cmd.Dir = findRoot()
		if skip {
			cmd.Env = append(os.Environ(), "MIMBER_SKIP_CHECKS=1")
		}
		out, err := cmd.CombinedOutput()
		if err != nil && len(out) == 0 {
			return mcp.NewToolResultError(err.Error()), nil
		}
		return mcp.NewToolResultText(string(out)), nil
	})

	s.AddTool(mcp.NewTool("mimber_deploy",
		mcp.WithDescription("Deploy dist/theme to Shopify (needs THEMEKIT_PASSWORD, THEMEKIT_STORE, THEMEKIT_THEME_ID — destructive, requires client confirmation)"),
		mcp.WithBoolean("allowLive", mcp.DefaultBool(false), mcp.Description("Allow deploy to live theme (theme_role main) — default false")),
		mcp.WithToolAnnotation(mcp.ToolAnnotation{Title: "Deploy to Shopify", DestructiveHint: boolPtr(true), OpenWorldHint: boolPtr(true)}),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		if os.Getenv("THEMEKIT_PASSWORD") == "" {
			return mcp.NewToolResultError("THEMEKIT_PASSWORD not set — set env or config.yml password"), nil
		}
		args := []string{"run", "-mod=mod", "./cmd/mimber", "deploy"}
		if req.GetBool("allowLive", false) {
			args = append(args, "--allow-live")
		}
		cmd := exec.CommandContext(ctx, "go", args...)
		cmd.Dir = findRoot()
		// ensure theme binary on PATH
		cmd.Env = append(os.Environ(), "PATH="+os.Getenv("PATH")+":"+filepath.Join(findRoot(), "vendor/themekit/bin"))
		out, err := cmd.CombinedOutput()
		if err != nil && len(out) == 0 {
			return mcp.NewToolResultError(err.Error()), nil
		}
		return mcp.NewToolResultText(string(out)), nil
	})

	s.AddTool(mcp.NewTool("mimber_compare",
		mcp.WithDescription("Visual compare base Timber (THEMEKIT_BASE_THEME_ID default 130563932206) vs Mimber (THEMEKIT_THEME_ID) — 5 routes, screenshots + README.md"),
		mcp.WithString("baseThemeId", mcp.Description("Base Timber theme id, default 130563932206")),
		mcp.WithString("themeId", mcp.Description("Mimber theme id, default THEMEKIT_THEME_ID")),
		mcp.WithToolAnnotation(mcp.ToolAnnotation{Title: "Visual compare base vs Mimber", DestructiveHint: boolPtr(false), OpenWorldHint: boolPtr(true)}),
	), func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		baseID := req.GetString("baseThemeId", "")
		if baseID == "" {
			baseID = os.Getenv("THEMEKIT_BASE_THEME_ID")
			if baseID == "" {
				baseID = "130563932206"
			}
		}
		themeID := req.GetString("themeId", "")
		if themeID == "" {
			themeID = os.Getenv("THEMEKIT_THEME_ID")
		}
		cmd := exec.CommandContext(ctx, "npx", "playwright", "test", "--grep", "compare:")
		cmd.Dir = findRoot()
		cmd.Env = append(os.Environ(), "THEMEKIT_BASE_THEME_ID="+baseID)
		if themeID != "" {
			cmd.Env = append(cmd.Env, "THEMEKIT_THEME_ID="+themeID)
		}
		out, err := cmd.CombinedOutput()
		if err != nil && len(out) == 0 {
			return mcp.NewToolResultError(err.Error()), nil
		}
		// append README if exists
		if data, err := os.ReadFile(filepath.Join(findRoot(), "playwright-report/compare/README.md")); err == nil {
			out = append(out, []byte("\n---\n"+string(data))...)
		}
		return mcp.NewToolResultText(string(out)), nil
	})

	// --- Resources ---
	s.AddResource(mcp.NewResource("mimber://audit/audit.json", "audit.json — Timber→Mimber LLM starter 13 rules",
		mcp.WithMIMEType("application/json")), func(ctx context.Context, req mcp.ReadResourceRequest) ([]mcp.ResourceContents, error) {
		root := findRoot()
		data, err := os.ReadFile(filepath.Join(root, "audit.json"))
		if err != nil {
			return nil, err
		}
		return []mcp.ResourceContents{mcp.TextResourceContents{URI: req.Params.URI, MIMEType: "application/json", Text: string(data)}}, nil
	})
	s.AddResource(mcp.NewResource("mimber://config/config.yml", "config.yml (password redacted)",
		mcp.WithMIMEType("text/yaml")), func(ctx context.Context, req mcp.ReadResourceRequest) ([]mcp.ResourceContents, error) {
		root := findRoot()
		data, err := os.ReadFile(filepath.Join(root, "config.yml"))
		if err != nil {
			return nil, err
		}
		// redact password
		lines := strings.Split(string(data), "\n")
		for i, l := range lines {
			if strings.Contains(l, "password:") {
				lines[i] = "  password: \"***redacted***\""
			}
		}
		txt := strings.Join(lines, "\n")
		return []mcp.ResourceContents{mcp.TextResourceContents{URI: req.Params.URI, MIMEType: "text/yaml", Text: txt}}, nil
	})
	s.AddResource(mcp.NewResource("mimber://report/compare/README.md", "compare README — base vs Mimber visual",
		mcp.WithMIMEType("text/markdown")), func(ctx context.Context, req mcp.ReadResourceRequest) ([]mcp.ResourceContents, error) {
		root := findRoot()
		data, err := os.ReadFile(filepath.Join(root, "playwright-report/compare/README.md"))
		if err != nil {
			return nil, err
		}
		return []mcp.ResourceContents{mcp.TextResourceContents{URI: req.Params.URI, MIMEType: "text/markdown", Text: string(data)}}, nil
	})

	// --- Prompts ---
	s.AddPrompt(mcp.NewPrompt("mimber-modernize", mcp.WithPromptDescription("Modernize a Timber fork per audit.json — paste Mimber as mimber-reference/")),
		func(ctx context.Context, req mcp.GetPromptRequest) (*mcp.GetPromptResult, error) {
			return &mcp.GetPromptResult{
				Messages: []mcp.PromptMessage{
					{Role: mcp.RoleUser, Content: mcp.TextContent{Type: "text", Text: "Read mimber-reference/AGENTS.md then modernize this theme per audit.json hits. Prioritize high: handlebars, locale-fetch, jquery-ajax, css-missing-vanilla. Keep diff minimal per slice; preserve client business logic. Run mimber_image_check / mimber_js_check / mimber_a11y_check and fix until 0 high."}},
				},
			}, nil
		})
	s.AddPrompt(mcp.NewPrompt("mimber-fix-a11y",
		mcp.WithPromptDescription("Fix a11y from mimber_a11y_check")),
		func(ctx context.Context, req mcp.GetPromptRequest) (*mcp.GetPromptResult, error) {
			return &mcp.GetPromptResult{
				Messages: []mcp.PromptMessage{
					{Role: mcp.RoleUser, Content: mcp.TextContent{Type: "text", Text: "Run mimber_a11y_check, then fix missing-alt (image_tag alt:), input label for=id + aria-label, button type/name (visually-hidden), heading h1→h2 hierarchy. Verify with mimber_a11y_check --json."}},
				},
			}, nil
		})

	if useHTTP != "" {
		if !strings.HasPrefix(useHTTP, ":") && !strings.Contains(useHTTP, ":") {
			useHTTP = ":" + useHTTP
		}
		fmt.Fprintf(os.Stderr, "mimber mcp: Streamable HTTP on %s (protocol 2026-07-28)\n", useHTTP)
		h := server.NewStreamableHTTPServer(s)
		if err := h.Start(useHTTP); err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		return
	}
	// default stdio
	if err := server.ServeStdio(s); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func runGoTool(ctx context.Context, name, root string) ([]byte, error) {
	// name: image-analyzer / js-analyzer / a11y-analyzer
	bin := filepath.Join(findRoot(), "cmd", name, "main.go")
	cmd := exec.CommandContext(ctx, "go", "run", "-mod=mod", "./cmd/"+name, "--check", root, "--json")
	cmd.Dir = findRoot()
	if _, err := os.Stat(bin); err != nil {
		// fallback to image-analyzer naming
		cmd = exec.CommandContext(ctx, "go", "run", "-mod=mod", "./cmd/"+name, "--check", root, "--json")
	}
	out, err := cmd.CombinedOutput()
	// analyzers exit 1 on issues — still return JSON
	if len(out) == 0 && err != nil {
		return nil, err
	}
	return out, nil
}

func runCSSAnalyze(ctx context.Context, css, content string) ([]byte, error) {
	cmd := exec.CommandContext(ctx, "go", "run", "-mod=mod", "./cmd/css-analyzer", "--json", "--css", css, "--content", content)
	cmd.Dir = findRoot()
	out, err := cmd.CombinedOutput()
	if len(out) == 0 && err != nil {
		return nil, err
	}
	return out, nil
}

func toolResult(out []byte, err error) (*mcp.CallToolResult, error) {
	if err != nil && len(out) == 0 {
		return mcp.NewToolResultError(err.Error()), nil
	}
	// Validate JSON, else wrap as text
	var js json.RawMessage
	if json.Unmarshal(out, &js) == nil {
		return mcp.NewToolResultText(string(out)), nil
	}
	return mcp.NewToolResultText(string(out)), nil
}

func nilIfNotErr(isErr bool) error {
	if isErr {
		return fmt.Errorf("issues found")
	}
	return nil
}

func boolPtr(b bool) *bool { v := b; return &v }
