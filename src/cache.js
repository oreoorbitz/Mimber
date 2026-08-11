// timber.cacheSelectors — Mepto/native
// Why: per measurethat #16434 (closest vs querySelector) and getElementById vs QSA, use fastest
// query for situation: getElementById for #id, getElementsByClassName for .class, QSA only for complex.
import { $ } from './mepto.js'

const byId = (id) => document.getElementById(id)
const q = (sel, root = document) => root.querySelector(sel)
const qq = (sel, root = document) => [...root.querySelectorAll(sel)]

export const cacheSelectors = (timber) => {
  // Keep $ prefix for bw compat; values are Mepto collections if mepto present else native arrays/elements
  const mepto = $ ? window.mepto || window.jQuery : null
  const useMepto = !!mepto
  const sel = (s) => (useMepto ? mepto(s) : qq(s))
  const sel1 = (s) => (useMepto ? mepto(s) : q(s))

  // Product thumbs: $('#ProductThumbs').find('a.product-single__thumbnail')
  const thumbRoot = byId('ProductThumbs')
  const thumbImages = thumbRoot ? (useMepto ? mepto('#ProductThumbs').find('a.product-single__thumbnail') : qq('a.product-single__thumbnail', thumbRoot)) : sel('a.product-single__thumbnail__empty__')

  timber.cache = {
    // General
    $html: useMepto ? mepto('html') : document.documentElement,
    $body: useMepto ? mepto(document.body) : document.body,

    // Navigation
    $navigation: byId('AccessibleNav'),
    $mobileSubNavToggle: sel('.mobile-nav__toggle'),

    // Collection — simple .class, use getElementsByClassName when native (faster than QSA per bench)
    $changeView: useMepto ? sel('.change-view') : [...document.getElementsByClassName('change-view')],

    // Product — byId for #id (fastest, per bench), avoids QSA parse
    $productImage: byId('ProductPhotoImg'),
    $thumbImages: thumbImages,

    // Customer — byId
    $recoverPasswordLink: byId('RecoverPassword'),
    $hideRecoverPasswordLink: byId('HideRecoverPasswordLink'),
    $recoverPasswordForm: byId('RecoverPasswordForm'),
    $customerLoginForm: byId('CustomerLoginForm'),
    $passwordResetSuccess: byId('ResetSuccess'),
  }
  // Normalize thumbImages empty sentinel: if no root, make empty mepto/array
  if (!thumbRoot && timber.cache.$thumbImages && timber.cache.$thumbImages.length === 0) {
    // already empty
  }
  return timber.cache
}
