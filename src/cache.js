// timber.cacheSelectors — Mepto/native
// Why: single bulk query, shape-stable object, no $.find chain re-query.
import { $ } from './mepto.js'

const q = (sel, root = document) => root.querySelector(sel)
const qq = (sel, root = document) => [...root.querySelectorAll(sel)]

export const cacheSelectors = (timber) => {
  // Keep $ prefix for bw compat; values are Mepto collections if mepto present else native arrays/elements
  // Use mepto where available so callers can .on/.toggleClass; fall back to native query.
  const mepto = $ ? window.mepto || window.jQuery : null
  const useMepto = !!mepto
  const sel = (s) => (useMepto ? mepto(s) : qq(s))
  const sel1 = (s) => (useMepto ? mepto(s) : q(s))

  // Product thumbs: $('#ProductThumbs').find('a.product-single__thumbnail')
  const thumbRoot = q('#ProductThumbs')
  const thumbImages = thumbRoot ? (useMepto ? mepto('#ProductThumbs').find('a.product-single__thumbnail') : qq('a.product-single__thumbnail', thumbRoot)) : sel('a.product-single__thumbnail__empty__')

  timber.cache = {
    // General
    $html: useMepto ? mepto('html') : q('html'),
    $body: useMepto ? mepto(document.body) : document.body,

    // Navigation
    $navigation: sel1('#AccessibleNav'),
    $mobileSubNavToggle: sel('.mobile-nav__toggle'),

    // Collection
    $changeView: sel('.change-view'),

    // Product
    $productImage: sel1('#ProductPhotoImg'),
    $thumbImages: thumbImages,

    // Customer
    $recoverPasswordLink: sel1('#RecoverPassword'),
    $hideRecoverPasswordLink: sel1('#HideRecoverPasswordLink'),
    $recoverPasswordForm: sel1('#RecoverPasswordForm'),
    $customerLoginForm: sel1('#CustomerLoginForm'),
    $passwordResetSuccess: sel1('#ResetSuccess'),
  }
  // Normalize thumbImages empty sentinel: if no root, make empty mepto/array
  if (!thumbRoot && timber.cache.$thumbImages && timber.cache.$thumbImages.length === 0) {
    // already empty
  }
  return timber.cache
}
