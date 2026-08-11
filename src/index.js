// timber — slice 2: cache + small utils (see utils.js)
// Slice 1: prepareTransition + formatMoney
import { prepareTransition, attachPrepareTransition } from './prepare-transition.js'
import { installFormatMoney } from './money-format.js'
import { replaceUrlParam } from './url.js'
import { cacheSelectors } from './cache.js'
import { getHash, switchImage, mobileNavToggle, productImageSwitch, responsiveVideos, collectionViews, loginForms, resetPasswordSuccess } from './utils.js'

if (typeof window !== 'undefined') {
  window.Shopify = window.Shopify || {}
  installFormatMoney(window.Shopify)
  attachPrepareTransition()
  window.timber = window.timber || {}
  // keep legacy names
  window.timber.cacheSelectors = () => cacheSelectors(window.timber)
  window.timber.getHash = getHash
  window.timber.switchImage = switchImage
  window.timber.mobileNavToggle = () => mobileNavToggle(window.timber)
  window.timber.productImageSwitch = () => productImageSwitch(window.timber)
  window.timber.responsiveVideos = responsiveVideos
  window.timber.collectionViews = () => collectionViews(window.timber)
  window.timber.loginForms = () => loginForms(window.timber)
  window.timber.resetPasswordSuccess = () => resetPasswordSuccess(window.timber)
  const _origInit = window.timber.init
  window.timber.init = () => {
    // FastClick removed (evergreen); keep rest, defer to present slices
    cacheSelectors(window.timber)
    if (typeof window.timber.accessibleNav === 'function') try { window.timber.accessibleNav() } catch (_) {}
    if (typeof window.timber.drawersInit === 'function') try { window.timber.drawersInit() } catch (_) {}
    mobileNavToggle(window.timber)
    productImageSwitch(window.timber)
    responsiveVideos()
    collectionViews(window.timber)
    loginForms(window.timber)
  }
  // auto-init on DOM ready (replaces $(timber.init))
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => window.timber.init())
  else queueMicrotask(() => window.timber.init())
}

export { prepareTransition, replaceUrlParam, cacheSelectors, getHash, switchImage, mobileNavToggle, productImageSwitch, responsiveVideos, collectionViews, loginForms, resetPasswordSuccess }
// eslint-disable-next-line no-undef
export const ShopifyFormatMoney = typeof Shopify !== 'undefined' ? Shopify.formatMoney : undefined
