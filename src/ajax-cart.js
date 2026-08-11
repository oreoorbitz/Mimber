// ajaxCart — Slice 7 (mepto/native, fetch via ShopifyAPI, native <template> — no Handlebars, saves 46K)
// Modern: Object.assign vs $.extend, querySelectorAll vs $, addEventListener vs $.on, scheduler.mutate vs direct DOM.

import { ShopifyAPI } from './shopify-api.js'
import { scheduler } from './scheduler.js'

const q = (sel, root = document) => root.querySelector(sel)
// rquickExpr fast paths — see cache.js (dom-bench 57× gEBCN>qSA, 3292× gEBTN>qSA @20K)
const qq = (sel, root = document) => {
  const bare = sel.trim()
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

const I18N = {
  empty: 'Your cart is empty',
  savingsHtml: 'You save [savings]',
}

let settings = {
  formSelector: 'form[action*="/cart/add"]',
  cartContainer: '#CartContainer',
  addToCartSelector: 'input[type="submit"]',
  cartCountSelector: null,
  cartCostSelector: null,
  moneyFormat: '${{amount}}',
  disableAjaxCart: false,
  enableQtySelectors: true,
  i18n: I18N,
}

let isUpdating = false
let bodyEl, formContainer, addToCart, cartContainer, cartCountSelector, cartCostSelector

const unwrap = (el) => (el && el[0] ? el[0] : el)

const triggerBody = (name, detail) => {
  const b = bodyEl || document.body
  b.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }))
  try {
    const mepto = window.mepto || window.jQuery
    if (mepto && mepto(b).trigger) mepto(b).trigger(name, detail)
  } catch (_) {}
}

const updateCountPrice = (cart) => {
  scheduler.mutate(() => {
    if (cartCountSelector) {
      const el = unwrap(cartCountSelector) || cartCountSelector
      // cartCountSelector may be NodeList/array
      const list =
        cartCountSelector.length !== undefined && cartCountSelector.tagName === undefined
          ? [...cartCountSelector]
          : [cartCountSelector]
      list.forEach((node) => {
        const n = unwrap(node) || node
        if (!n || !n.textContent === undefined) return
        n.textContent = String(cart.item_count)
        n.classList.remove('hidden-count')
        if (cart.item_count === 0) n.classList.add('hidden-count')
        // compat: .html() fallback
        if (n.innerHTML !== undefined && typeof cart.item_count !== 'undefined')
          n.innerHTML = String(cart.item_count)
      })
      void el
    }
    if (cartCostSelector) {
      const fmt =
        window.Shopify && window.Shopify.formatMoney
          ? window.Shopify.formatMoney(cart.total_price, settings.moneyFormat)
          : String(cart.total_price)
      const list =
        cartCostSelector.length !== undefined && cartCostSelector.tagName === undefined
          ? [...cartCostSelector]
          : [cartCostSelector]
      list.forEach((node) => {
        const n = unwrap(node) || node
        if (!n) return
        if (n.innerHTML !== undefined) n.innerHTML = fmt
      })
    }
  })
}

const formOverride = () => {
  if (!formContainer || !formContainer.length) return
  const forms =
    formContainer.length !== undefined && formContainer.tagName === undefined
      ? [...formContainer]
      : [formContainer]
  forms.forEach((form) => {
    const node = unwrap(form) || form
    if (!node || !node.addEventListener) return
    node.addEventListener('submit', (evt) => {
      evt.preventDefault()
      const adds = addToCart
        ? addToCart.length !== undefined && addToCart.tagName === undefined
          ? [...addToCart]
          : [addToCart]
        : []
      adds.forEach((a) => {
        const n = unwrap(a) || a
        if (n && n.classList) {
          n.classList.remove('is-added')
          n.classList.add('is-adding')
        }
      })
      qq('.qty-error').forEach((el) => el.remove())
      ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback)
    })
  })
}

const itemAddedCallback = () => {
  const adds = addToCart
    ? addToCart.length !== undefined && addToCart.tagName === undefined
      ? [...addToCart]
      : [addToCart]
    : []
  adds.forEach((a) => {
    const n = unwrap(a) || a
    if (n && n.classList) {
      n.classList.remove('is-adding')
      n.classList.add('is-added')
    }
  })
  ShopifyAPI.getCart(cartUpdateCallback)
}

const itemErrorCallback = (xhr) => {
  let data = {}
  try {
    data = JSON.parse(xhr.responseText || '{}')
  } catch (_) {}
  const adds = addToCart
    ? addToCart.length !== undefined && addToCart.tagName === undefined
      ? [...addToCart]
      : [addToCart]
    : []
  adds.forEach((a) => {
    const n = unwrap(a) || a
    if (n && n.classList) n.classList.remove('is-adding', 'is-added')
  })
  if (data.message && data.status == 422) {
    const errDiv = document.createElement('div')
    errDiv.className = 'errors qty-error'
    errDiv.textContent = data.description || data.message
    const fc =
      unwrap(formContainer) || (formContainer && formContainer[0] ? formContainer[0] : null)
    const anchor = fc && fc.parentNode ? fc : document.body
    if (fc && fc.after) fc.after(errDiv)
    else anchor.appendChild(errDiv)
  }
}

const cartUpdateCallback = (cart) => {
  updateCountPrice(cart)
  buildCart(cart)
}

const buildCart = (cart) => {
  const container = unwrap(cartContainer) || cartContainer
  if (!container) return
  scheduler.mutate(() => {
    container.innerHTML = ''
    if (cart.item_count === 0) {
      const p = document.createElement('p')
      p.textContent = (settings.i18n && settings.i18n.empty) || I18N.empty
      container.appendChild(p)
      cartCallback(cart)
      return
    }
    // native <template> path (no Handlebars, saves 46K) — falls back to simple list if no template
    const tmpl = document.getElementById('CartTemplate')
    if (!tmpl || !tmpl.content) {
      const frag = document.createDocumentFragment()
      cart.items.forEach((cartItem, index) => {
        const div = document.createElement('div')
        div.textContent = `${cartItem.product_title} x ${cartItem.quantity}`
        void index
        frag.appendChild(div)
      })
      container.appendChild(frag)
      cartCallback(cart)
      return
    }
    const fmt = (c) =>
      window.Shopify && window.Shopify.formatMoney
        ? window.Shopify.formatMoney(c, settings.moneyFormat)
        : String(c)
    const frag = document.createDocumentFragment()
    // clone the template shell once (form + footer)
    const shell = tmpl.content.cloneNode(true)
    const itemsRoot = shell.querySelector('[data-ajaxcart-items]') || shell
    const priceEl = shell.querySelector('[data-ajaxcart-totalPrice]')
    const savingsEl = shell.querySelector('[data-ajaxcart-savings]')
    const noteEl = shell.querySelector('[data-ajaxcart-note]')
    if (priceEl) priceEl.textContent = fmt(cart.total_price)
    if (savingsEl) {
      if (cart.total_discount === 0) savingsEl.style.display = 'none'
      else {
        const tpl = (settings.i18n && settings.i18n.savingsHtml) || I18N.savingsHtml
        savingsEl.querySelector('em').textContent = tpl.replace(
          '[savings]',
          fmt(cart.total_discount)
        )
        savingsEl.style.display = ''
      }
    }
    if (noteEl) noteEl.value = cart.note || ''

    cart.items.forEach((cartItem, idx) => {
      let prodImg =
        '//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif'
      if (cartItem.image != null)
        prodImg = cartItem.image.replace(/(\.[^.]*)$/, '_small$1').replace('http:', '')
      const line = idx + 1
      const row = document.createElement('div')
      row.className = 'ajaxcart__product'
      const discountsApplied = cartItem.line_price !== cartItem.original_line_price
      const propsHtml = cartItem.properties
        ? Object.entries(cartItem.properties)
            .map(([k, v]) => (v ? `<span class="ajaxcart__product-meta">${k}: ${v}</span>` : ''))
            .join('')
        : ''
      const discountsHtml = discountsApplied
        ? `<small class="ajaxcart-item__price-strikethrough"><s>${fmt(cartItem.original_line_price)}</s></small><br><span>${fmt(cartItem.line_price)}</span>`
        : `<span>${fmt(cartItem.line_price)}</span>`
      const eachDiscounts =
        discountsApplied && cartItem.discounts && cartItem.discounts.length
          ? `<div class="grid--full display-table"><div class="grid__item text-right">${cartItem.discounts.map((d) => `<small class="ajaxcart-item__discount">${d.title}</small><br>`).join('')}</div></div>`
          : ''
      const vendorHtml = cartItem.vendor
        ? `<span class="ajaxcart__product-meta">${cartItem.vendor}</span>`
        : ''
      const variationHtml = cartItem.variant_title
        ? `<span class="ajaxcart__product-meta">${cartItem.variant_title}</span>`
        : ''
      row.innerHTML = `<div class="ajaxcart__row" data-line="${line}"><div class="grid"><div class="grid__item one-quarter"><a href="${cartItem.url}" class="ajaxcart__product-image"><img src="${prodImg}" alt=""></a></div><div class="grid__item three-quarters"><p><a href="${cartItem.url}" class="ajaxcart__product-name">${cartItem.product_title}</a>${variationHtml}${propsHtml}${vendorHtml}</p><div class="grid--full display-table"><div class="grid__item display-table-cell one-half"><div class="ajaxcart__qty"><button type="button" class="ajaxcart__qty-adjust ajaxcart__qty--minus icon-fallback-text" data-id="${cartItem.key}" data-qty="${cartItem.quantity - 1}" data-line="${line}"><span class="icon icon-minus" aria-hidden="true"></span><span class="visually-hidden">Reduce</span></button><input type="text" name="updates[]" class="ajaxcart__qty-num" value="${cartItem.quantity}" min="0" data-id="${cartItem.key}" data-line="${line}" aria-label="quantity" pattern="[0-9]*"><button type="button" class="ajaxcart__qty-adjust ajaxcart__qty--plus icon-fallback-text" data-id="${cartItem.key}" data-line="${line}" data-qty="${cartItem.quantity + 1}"><span class="icon icon-plus" aria-hidden="true"></span><span class="visually-hidden">Increase</span></button></div></div><div class="grid__item display-table-cell one-half text-right">${discountsHtml}</div>${eachDiscounts}</div></div></div></div>`
      itemsRoot.appendChild(row)
    })

    container.appendChild(shell)
    cartCallback(cart)
  })
}

const cartCallback = (cart) => {
  scheduler.mutate(() => {
    const b = bodyEl || document.body
    b.classList.remove('drawer--is-loading')
  })
  triggerBody('afterCartLoad.ajaxCart', cart)
  if (window.Shopify && window.Shopify.StorefrontExpressButtons)
    window.Shopify.StorefrontExpressButtons.initialize()
}

const adjustCart = () => {
  const b = bodyEl || document.body
  // delegation: closest is correct here (need ancestor walk from e.target) — per #16434 closest is ~13.8M ops/sec vs QSA 16M in Chrome, but QSA not applicable for event target walk
  b.addEventListener('click', (e) => {
    const target = e.target.closest && e.target.closest('.ajaxcart__qty-adjust')
    if (!target) return
    if (isUpdating) return
    const line = target.getAttribute('data-line') || target.dataset.line
    // qty input is sibling -> parentElement.querySelector is scoped, faster than document QSA
    const qtyEl = target.parentElement
      ? target.parentElement.querySelector('.ajaxcart__qty-num')
      : null
    let qty = qtyEl ? parseInt(qtyEl.value.replace(/\D/g, ''), 10) : 0
    qty = validateQty(qty)
    if (target.classList.contains('ajaxcart__qty--plus')) qty += 1
    else {
      qty -= 1
      if (qty <= 0) qty = 0
    }
    if (line) updateQuantity(line, qty)
    else if (qtyEl) qtyEl.value = String(qty)
  })
  b.addEventListener('change', (e) => {
    const target = e.target.closest && e.target.closest('.ajaxcart__qty-num')
    if (!target) return
    if (isUpdating) return
    const line = target.getAttribute('data-line') || target.dataset.line
    let qty = parseInt(target.value.replace(/\D/g, ''), 10)
    qty = validateQty(qty)
    if (line) updateQuantity(line, qty)
  })
  b.addEventListener('submit', (e) => {
    const form = e.target.closest && e.target.closest('form.ajaxcart')
    if (!form) return
    if (isUpdating) e.preventDefault()
  })
  b.addEventListener('focusin', (e) => {
    const target = e.target.closest && e.target.closest('.ajaxcart__qty-adjust')
    if (!target) return
    setTimeout(() => {
      try {
        target.select()
      } catch (_) {}
    }, 50)
  })

  const updateQuantity = (line, qty) => {
    isUpdating = true
    // attribute selector needs QSA, but scoped to document is correct — no id available
    const row = document.querySelector(`.ajaxcart__row[data-line="${line}"]`)
    if (row) row.classList.add('is-loading')
    if (qty === 0 && row && row.parentElement) row.parentElement.classList.add('is-removed')
    setTimeout(() => ShopifyAPI.changeItem(line, qty, adjustCartCallback), 250)
  }

  b.addEventListener('change', (e) => {
    if (e.target.matches && e.target.matches('textarea[name="note"]')) {
      ShopifyAPI.updateCartNote(e.target.value, () => {})
    }
  })
}

const adjustCartCallback = (cart) => {
  updateCountPrice(cart)
  setTimeout(() => {
    isUpdating = false
    ShopifyAPI.getCart(buildCart)
  }, 150)
}

const validateQty = (qty) => {
  if (parseFloat(qty) == parseInt(qty, 10) && !isNaN(qty)) return qty
  return 1
}

const init = (options = {}) => {
  settings = Object.assign({}, settings, options)
  // support Liquid i18n passthrough
  if (options.i18n) settings.i18n = Object.assign({}, I18N, options.i18n)

  // selectors — mepto fallback, else native
  const mepto = window.mepto || window.jQuery
  const sel = (s) => {
    if (!s) return null
    if (mepto) return mepto(s)
    const els = qq(s)
    return els.length === 1 ? els[0] : els
  }

  formContainer = sel(settings.formSelector)
  // cartContainer is single
  const cc = q(settings.cartContainer)
  cartContainer = cc || sel(settings.cartContainer)
  addToCart = formContainer
    ? mepto
      ? formContainer.find
        ? formContainer.find(settings.addToCartSelector)
        : qq(settings.addToCartSelector, unwrap(formContainer) || document)
      : qq(settings.addToCartSelector, unwrap(formContainer) || document)
    : null
  if (mepto) {
    cartCountSelector = settings.cartCountSelector ? mepto(settings.cartCountSelector) : null
    cartCostSelector = settings.cartCostSelector ? mepto(settings.cartCostSelector) : null
  } else {
    cartCountSelector = settings.cartCountSelector ? qq(settings.cartCountSelector) : null
    cartCostSelector = settings.cartCostSelector ? qq(settings.cartCostSelector) : null
  }
  bodyEl = document.body

  isUpdating = false

  if (settings.enableQtySelectors) qtySelectors()

  const adds = addToCart
    ? addToCart.length !== undefined && addToCart.tagName === undefined
      ? [...addToCart]
      : [addToCart]
    : []
  if (!settings.disableAjaxCart && adds.length) formOverride()

  adjustCart()
}

const loadCart = () => {
  const b = bodyEl || document.body
  b.classList.add('drawer--is-loading')
  ShopifyAPI.getCart(cartUpdateCallback)
}

const createQtySelectors = () => {
  const container = unwrap(cartContainer) || document
  const inputs = qq('input[type="number"]', container)
  const tmpl = document.getElementById('AjaxQty')
  if (!tmpl || !tmpl.content) return
  inputs.forEach((el) => {
    const currentQty = el.value
    const clone = tmpl.content.cloneNode(true)
    const qtyInput = clone.querySelector('[data-ajaxcart-qty-num]')
    if (qtyInput) {
      qtyInput.value = currentQty
      qtyInput.setAttribute('data-id', el.getAttribute('data-id') || '')
    }
    clone
      .querySelectorAll('[data-ajaxcart-qty-minus],[data-ajaxcart-qty-plus]')
      .forEach((btn) => btn.setAttribute('data-id', el.getAttribute('data-id') || ''))
    const minus = clone.querySelector('[data-ajaxcart-qty-minus]')
    if (minus) minus.setAttribute('data-qty', String(parseInt(currentQty, 10) - 1))
    const plus = clone.querySelector('[data-ajaxcart-qty-plus]')
    if (plus) plus.setAttribute('data-qty', String(parseInt(currentQty, 10) + 1))
    el.after(clone)
    el.remove()
  })
}

const qtySelectors = () => {
  const numInputs = qq('input[type="number"]')
  if (!numInputs.length) return
  const tmpl = document.getElementById('JsQty')
  if (!tmpl || !tmpl.content) return
  numInputs.forEach((el) => {
    const currentQty = el.value
    const inputName = el.getAttribute('name')
    const inputId = el.getAttribute('id')
    const clone = tmpl.content.cloneNode(true)
    const qtyInput = clone.querySelector('[data-js-qty-num]')
    if (qtyInput) {
      qtyInput.value = currentQty
      qtyInput.setAttribute('data-id', el.getAttribute('data-id') || '')
      if (inputName) qtyInput.setAttribute('name', inputName)
      if (inputId) qtyInput.setAttribute('id', inputId)
    }
    clone
      .querySelectorAll('[data-js-qty-minus],[data-js-qty-plus]')
      .forEach((btn) => btn.setAttribute('data-id', el.getAttribute('data-id') || ''))
    el.after(clone)
    el.remove()
  })
  qq('.js-qty__adjust').forEach((btn) => {
    btn.addEventListener('click', () => {
      const qtyEl = btn.parentElement ? btn.parentElement.querySelector('.js-qty__num') : null
      if (!qtyEl) return
      let qty = parseInt(qtyEl.value.replace(/\D/g, ''), 10)
      qty = validateQty(qty)
      if (btn.classList.contains('js-qty__adjust--plus')) qty += 1
      else {
        qty -= 1
        if (qty <= 1) qty = 1
      }
      qtyEl.value = String(qty)
    })
  })
}

const ajaxCartExport = { init, load: loadCart }

if (typeof window !== 'undefined') window.ajaxCart = ajaxCartExport

export { ajaxCartExport as ajaxCart, init, loadCart, ShopifyAPI }
export default ajaxCartExport
