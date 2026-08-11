// Mimber Go orchestrator — thin wrapper that builds/runs the vendored fork's mimber command.
// This lets `go run ./cmd/mimber --help` work from Mimber root without installing the fork binary.
// The fork lives at vendor/themekit (oreoorbitz/themekit, bundled with Mepto).
// For LLM: `go run ./cmd/mimber build` == `npm run build` + `vendor/themekit` deploy harness.
package main

import (
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	root := findRoot()
	bin := filepath.Join(root, "vendor", "themekit", "cmd", "mimber")
	// run the fork's mimber via go run
	args := append([]string{"run", "./vendor/themekit/cmd/mimber"}, os.Args[1:]...)
	cmd := exec.Command("go", args...)
	cmd.Dir = root
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	if err := cmd.Run(); err != nil {
		// fallback: try already-built bin/mimber or vendor/themekit/bin/mimber
		for _, p := range []string{filepath.Join(root, "bin", "mimber"), filepath.Join(root, "vendor", "themekit", "bin", "mimber")} {
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
