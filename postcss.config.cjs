module.exports = {
  plugins: [
    require('cssnano')({
      preset: ['default', {
        // keep Shopify Liquid vars untouched, merge aggressively
        calc: true,
        colormin: true,
        convertValues: true,
        discardComments: { removeAll: true },
        discardDuplicates: true,
        mergeLonghand: true,
        minifyFontValues: true,
        normalizeCharset: true,
      }]
    })
  ]
}
