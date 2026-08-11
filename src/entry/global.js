// global — runs on every page (header/nav/drawers). <14KB gzip (~7K). Global scope.
// HTTP/2: single small global + conditional scoped chunks (product/collection/customer/cart) — avoids loading product logic on blog etc.
import { attachPrepareTransition } from '../prepare-transition.js'
import { installFormatMoney } from '../money-format.js'
import { cacheSelectors } from '../cache.js'
import { accessibleNav } from '../accessible-nav.js'
import { drawersInit } from '../drawers.js'
import { mobileNavToggle, responsiveVideos } from '../utils.js'

if (typeof window !== 'undefined') {
  window.Shopify = window.Shopify || {}
  installFormatMoney(window.Shopify)
  attachPrepareTransition()
  window.timber = window.timber || {}
  window.timber.cacheSelectors = () => cacheSelectors(window.timber)
  window.timber.accessibleNav = () => accessibleNav(window.timber)
  window.timber.drawersInit = () => drawersInit(window.timber)

  const initGlobal = () => {
    cacheSelectors(window.timber)
    try {
      accessibleNav(window.timber)
    } catch {}
    try {
      drawersInit(window.timber)
    } catch {}
    try {
      mobileNavToggle(window.timber)
    } catch {}
    try {
      responsiveVideos()
    } catch {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGlobal)
  else queueMicrotask(initGlobal)
}
