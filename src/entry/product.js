// product — only on product template (product images + variant pricing). ~2K gzip
import { productPage } from '../product-page.js'
import { productImageSwitch, switchImage } from '../utils.js'
import { cacheSelectors } from '../cache.js'

if (typeof window !== 'undefined') {
  window.timber = window.timber || {}
  window.timber.productPage = productPage
  window.timber.productImageSwitch = () => productImageSwitch(window.timber)
  window.timber.switchImage = switchImage

  const initProduct = () => {
    try {
      cacheSelectors(window.timber)
    } catch {}
    try {
      productImageSwitch(window.timber)
    } catch {}
    // productPage is called per variant via selectCallback in templates/product.liquid, not auto-init
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initProduct)
  else queueMicrotask(initProduct)
}
