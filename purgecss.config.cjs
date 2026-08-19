/** purgecss.config.cjs — Shopify + Timber + Mepto safelist (10-15% realistic) */
module.exports = {
  content: [
    'layout/**/*.liquid',
    'templates/**/*.liquid',
    'snippets/**/*.liquid',
    'sections/**/*.liquid',
    'src/**/*.js',
    'assets/**/*.js',
    'assets/**/*.js.liquid',
    'config/**/*.json',
    'locales/**/*.json'
  ],
  css: [
    'dist/theme/assets/base.css',
    'dist/theme/assets/critical.css',
    'dist/theme/assets/gift-card.css'
  ],
  // Capture classes inside Liquid {{ }} / {% %} and JS template literals
  defaultExtractor: content => {
    const m = content.match(/[\w-/:]+(?<!:)/g)
    return m || []
  },
  safelist: {
    standard: [
      // Shopify/Timber grid & helpers — always keep (used via settings_schema.json, not literal)
      /^grid/, /^grid__item/, /^one-/, /^two-/, /^three-/, /^four-/, /^five-/, /^six-/, /^seven-/, /^eight-/, /^nine-/, /^ten-/, /^eleven-/,
      /^small--/, /^medium--/, /^large--/, /^medium-down--/, /^push--/, /^pull--/,
      /^show$/, /^hide$/, /^text-/, /^left$/, /^right$/, /^clearfix/, /^wrapper/,
      // Timber sections — may appear via {% include %} conditionals
      /^site-/, /^header/, /^nav/, /^drawer/, /^footer/, /^pagination/, /^breadcrumb/, /^media/, /^table/, /^icon/, /^btn/, /^rte/, /^rte--/,
      /^product/, /^collection/, /^cart/, /^ajaxcart/, /^template-/,
      // RTE merchant content ({{ article.content }}, {{ product.description }}) — not in templates, but rendered
      /^rte/, /^table/, /^media/, /^video-wrapper/, /^note/, /^errors/, /^form-/, /^ul/, /^ol/, /^li/, /^fieldset/, /^legend/, /^optgroup/
    ],
    deep: [
      // JS dynamic via mepto classList.add / CustomEvent
      /is-/, /has-/, /js-/, /active/, /open/, /visible/, /loading/, /error/, /success/, /visible/, /hidden/
    ],
    greedy: [
      // Shopify section/content selectors that purgecss deep misses
      /slick/, /flickity/
    ],
    variables: true,
    keyframes: true
  },
  rejected: true,
  variables: true,
  keyframes: true
}
