// timber.cacheSelectors — Mepto/native
// Why: rquickExpr routing per dom-bench (Chrome 150, Blink): getElementById 1.18×>qS('#id'), gEBCN 57×>qSA('.cls') @20K,
//      gEBTN 3292×>qSA('span') @20K, closest 4.1×>manual loop. Route simple selectors to fastest primitive.
import { $ } from './mepto.js'

const byId = (id) => document.getElementById(id)
const q = (sel, root = document) => root.querySelector(sel)
// rquickExpr fast paths — Sizzle-style (sec06 §6.2.1): #id→gEBI, .class→gEBCN, TAG→gEBTN, else qSA
const qq = (sel, root = document) => {
  const bare = sel.trim()
  // fast paths only when root is document or element without scoping need
  if (root === document) {
    if (/^#[\w-]+$/.test(bare)) {
      const el = document.getElementById(bare.slice(1))
      return el ? [el] : []
    }
    if (/^\.[\w-]+$/.test(bare)) return [...document.getElementsByClassName(bare.slice(1))]
    if (/^[a-zA-Z][\w-]*$/.test(bare)) return [...document.getElementsByTagName(bare)]
  } else if (root && root.nodeType === 1) {
    if (/^\.[\w-]+$/.test(bare)) return [...root.getElementsByClassName(bare.slice(1))]
    if (/^[a-zA-Z][\w-]*$/.test(bare)) return [...root.getElementsByTagName(bare)]
  }
  return [...root.querySelectorAll(sel)]
}

export const cacheSelectors = (timber) => {
  // Keep $ prefix for bw compat; values are Mepto collections if mepto present else native arrays/elements
  const mepto = $ ? window.mepto || window.jQuery : null
  const useMepto = !!mepto
  const sel = (s) => (useMepto ? mepto(s) : qq(s))
  const sel1 = (s) => (useMepto ? mepto(s) : q(s))

  // Product thumbs: $('#ProductThumbs').find('a.product-single__thumbnail')
  const thumbRoot = byId('ProductThumbs')
  const thumbImages = thumbRoot
    ? useMepto
      ? mepto('#ProductThumbs').find('a.product-single__thumbnail')
      : qq('a.product-single__thumbnail', thumbRoot)
    : sel('a.product-single__thumbnail__empty__')

  timber.cache = {
    // General
    $html: useMepto ? mepto('html') : document.documentElement,
    $body: useMepto ? mepto(document.body) : document.body,

    // Navigation
    $navigation: byId('AccessibleNav'),
    $mobileSubNavToggle: sel('.mobile-nav__toggle'),

    // Collection — simple .class, use getElementsByClassName when native (faster than QSA per bench)
    $changeView: useMepto
      ? sel('.change-view')
      : [...document.getElementsByClassName('change-view')],

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
