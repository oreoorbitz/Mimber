module github.com/oreoorbitz/Mimber

go 1.25.5

require github.com/Shopify/themekit v1.3.2

require github.com/evanw/esbuild v0.25.0

require (
	github.com/oreoorbitz/goliquid v0.0.0-00010101000000-000000000000
	github.com/spf13/cobra v0.0.0-20180722215644-7c4570c3ebeb
)

require (
	github.com/google/jsonschema-go v0.4.2 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/mark3labs/mcp-go v0.58.0
	github.com/santhosh-tekuri/jsonschema/v6 v6.0.2 // indirect
	github.com/spf13/cast v1.7.1 // indirect
	github.com/yosida95/uritemplate/v3 v3.0.2 // indirect
	golang.org/x/text v0.14.0 // indirect
)

replace github.com/Shopify/themekit => ./vendor/themekit

replace github.com/oreoorbitz/goliquid => ../goliquid
