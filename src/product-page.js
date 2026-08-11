// timber.productPage — Slice 3
// Why: bulk reads then single mutate, no jQuery chain re-query, classList/prop native.
// Keeps: Shopify.formatMoney, Shopify.Image.switchImage, Liquid i18n strings (passed via options.i18n or defaults).
import { scheduler } from './scheduler.js'
import { switchImage } from './utils.js'

const I18N_DEFAULTS = {
  addToCart: 'Add to cart',
  soldOut: 'Sold out',
  unavailable: 'Unavailable',
  compareAt: 'Compare at',
}

const byId = (id) => document.getElementById(id)
// rquickExpr — see cache.js (gEBCN 57×, gEBTN 3292× over qSA @20K)
const qq = (sel, root = document) => {
  const bare = sel.trim()
  if (root === document) {
    if (/^\.[\w-]+$/.test(bare)) return [...document.getElementsByClassName(bare.slice(1))]
    if (/^[a-zA-Z][\w-]*$/.test(bare)) return [...document.getElementsByTagName(bare)]
  } else if (root && root.nodeType === 1) {
    if (/^\.[\w-]+$/.test(bare)) return [...root.getElementsByClassName(bare.slice(1))]
    if (/^[a-zA-Z][\w-]*$/.test(bare)) return [...root.getElementsByTagName(bare)]
  }
  return [...root.querySelectorAll(sel)]
}

export const productPage = (options = {}) => {
  const moneyFormat = options.money_format || (window.Shopify && window.Shopify.money_format) || ''
  const variant = options.variant
  const i18n = { ...I18N_DEFAULTS, ...(options.i18n || {}) }

  // selectors — byId for #id (fastest, per measurethat #16434 companion: getElementById > QSA)
  const productImage = byId('ProductPhotoImg')
  const addToCart = byId('AddToCart')
  const productPrice = byId('ProductPrice')
  const comparePrice = byId('ComparePrice')
  const quantityElements = qq('.quantity-selector, label + .js-qty')
  const addToCartText = byId('AddToCartText')

  scheduler.mutate(() => {
    if (variant) {
      if (variant.featured_image && productImage) {
        const newImg = variant.featured_image
        // Shopify.Image.switchImage is legacy CDN helper (shopify_common.js) — keep if present
        if (
          window.Shopify &&
          window.Shopify.Image &&
          typeof window.Shopify.Image.switchImage === 'function'
        ) {
          window.Shopify.Image.switchImage(newImg, productImage, switchImage)
        } else {
          switchImage(newImg && newImg.src ? newImg.src : newImg, null, productImage)
        }
      }

      if (variant.available) {
        if (addToCart) {
          addToCart.classList.remove('disabled')
          addToCart.disabled = false
        }
        if (addToCartText) addToCartText.textContent = i18n.addToCart
        for (let i = 0, n = quantityElements.length; i < n; i++) quantityElements[i].style.display = ''
        // mepto .show() sets display block; keep default
        if (quantityElements.length === 1 && quantityElements[0].style.display === 'none')
          quantityElements[0].style.display = 'block'
        for (let i = 0, n = quantityElements.length; i < n; i++) if (quantityElements[i].style.display === 'none') quantityElements[i].style.display = 'block'
      } else {
        if (addToCart) {
          addToCart.classList.add('disabled')
          addToCart.disabled = true
        }
        if (addToCartText) addToCartText.textContent = i18n.soldOut
        for (let i = 0, n = quantityElements.length; i < n; i++) quantityElements[i].style.display = 'none'
      }

      if (productPrice) {
        const fmt =
          window.Shopify && window.Shopify.formatMoney
            ? window.Shopify.formatMoney(variant.price, moneyFormat)
            : String(variant.price)
        productPrice.innerHTML = fmt
      }

      if (comparePrice) {
        if (variant.compare_at_price > variant.price) {
          const cfmt =
            window.Shopify && window.Shopify.formatMoney
              ? window.Shopify.formatMoney(variant.compare_at_price, moneyFormat)
              : String(variant.compare_at_price)
          comparePrice.innerHTML = `${i18n.compareAt} ${cfmt}`
          comparePrice.style.display = 'block'
        } else {
          comparePrice.style.display = 'none'
        }
      }
    } else {
      if (addToCart) {
        addToCart.classList.add('disabled')
        addToCart.disabled = true
      }
      if (addToCartText) addToCartText.textContent = i18n.unavailable
      for (let i = 0, n = quantityElements.length; i < n; i++) quantityElements[i].style.display = 'none'
    }
  })
}
