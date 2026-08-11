// timber — first slice: prepareTransition + formatMoney
// Full theme index will re-export subsequent slices; this slice is independently shippable.
import { prepareTransition, attachPrepareTransition } from './prepare-transition.js'
import { installFormatMoney } from './money-format.js'
import { replaceUrlParam } from './url.js'

if (typeof window !== 'undefined') {
  window.Shopify = window.Shopify || {}
  installFormatMoney(window.Shopify)
  attachPrepareTransition()
}

export { prepareTransition, replaceUrlParam }
// eslint-disable-next-line no-undef
export const ShopifyFormatMoney = typeof Shopify !== 'undefined' ? Shopify.formatMoney : undefined
