// cart — only when ajax cart drawer/modal is enabled (settings.ajax_cart_method == "drawer"). ~7K gzip (ShopifyAPI + ajaxCart)
import { ajaxCart } from '../ajax-cart.js'
import { ShopifyAPI as _ShopifyAPI } from '../shopify-api.js'

if (typeof window !== 'undefined') {
  window.ajaxCart = ajaxCart
  window.ShopifyAPI = _ShopifyAPI
  // ajaxCart init is driven by data-attributes in snippets/ajax-cart-template.liquid — no auto init here
}
