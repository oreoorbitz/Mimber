// ShopifyAPI — Slice 6 (ajax-cart dependency)
// fetch + mepto CustomEvent vs jQuery.ajax/trigger. Keeps ShopifyAPI global.

// eslint-disable-next-line no-unused-vars
const attributeToString = (attr) => {
  if (typeof attr !== 'string') {
    attr = String(attr)
    if (attr === 'undefined') attr = ''
  }
  return attr.trim()
}

const trigger = (target, name, detail) => {
  const el = target || document.body
  const node = el && el[0] ? el[0] : el
  if (!node || !node.dispatchEvent) return
  node.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }))
  try {
    const mepto = window.mepto || window.jQuery
    if (mepto && mepto(node).trigger) mepto(node).trigger(name, detail)
  } catch (_) {}
}

const jsonFetch = (url, opts = {}) =>
  fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json' }, ...opts }).then(async (res) => {
    const text = await res.text()
    let data
    try { data = text ? JSON.parse(text) : {} } catch (_) { data = { responseText: text } ; data.responseText = text }
    if (!res.ok) {
      const err = new Error('Shopify API error')
      err.responseText = text
      err.status = res.status
      throw err
    }
    return data
  })

if (typeof window !== 'undefined') {
  window.ShopifyAPI = window.ShopifyAPI || {}
}

const ShopifyAPI = typeof window !== 'undefined' ? window.ShopifyAPI : {}

ShopifyAPI.onCartUpdate = ShopifyAPI.onCartUpdate || function () {}

ShopifyAPI.onError = ShopifyAPI.onError || function (xhr, _textStatus) {
  let data
  try { data = JSON.parse(xhr.responseText || xhr.message || '{}') } catch (_) { data = {} }
  if (data.message) alert(`${data.message}(${data.status}): ${data.description}`)
}

ShopifyAPI.updateCartNote = (note, callback) => {
  const body = document.body
  trigger(body, 'beforeUpdateCartNote.ajaxCart', note)
  fetch('/cart/update.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'note=' + encodeURIComponent(attributeToString(note)),
  })
    .then((r) => r.json())
    .then((cart) => {
      if (typeof callback === 'function') callback(cart)
      else ShopifyAPI.onCartUpdate(cart)
      trigger(body, 'afterUpdateCartNote.ajaxCart', [note, cart])
      trigger(body, 'completeUpdateCartNote.ajaxCart', [null, null, 'success'])
    })
    .catch((err) => {
      trigger(body, 'errorUpdateCartNote.ajaxCart', [err, 'error'])
      ShopifyAPI.onError({ responseText: err.responseText || err.message, status: err.status }, 'error')
      trigger(body, 'completeUpdateCartNote.ajaxCart', [null, err, 'error'])
    })
}

ShopifyAPI.addItemFromForm = (form, callback, errorCallback) => {
  const body = document.body
  const fd = form instanceof HTMLFormElement ? new FormData(form) : new FormData()
  // If form is a selector/string, try to find it
  let formEl = form
  if (typeof form === 'string') formEl = document.querySelector(form)
  const bodyStr = formEl instanceof HTMLFormElement ? new URLSearchParams(new FormData(formEl)).toString() : new URLSearchParams(fd).toString()
  trigger(body, 'beforeAddItem.ajaxCart', form)
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: bodyStr,
  })
    .then(async (res) => {
      const text = await res.text()
      if (!res.ok) {
        const err = new Error(text)
        err.responseText = text
        err.status = res.status
        throw err
      }
      return text ? JSON.parse(text) : {}
    })
    .then((lineItem) => {
      if (typeof callback === 'function') callback(lineItem, form)
      else if (typeof ShopifyAPI.onItemAdded === 'function') ShopifyAPI.onItemAdded(lineItem, form)
      trigger(body, 'afterAddItem.ajaxCart', [lineItem, form])
      trigger(body, 'completeAddItem.ajaxCart', [null, null, 'success'])
    })
    .catch((err) => {
      if (typeof errorCallback === 'function') errorCallback(err, 'error')
      else ShopifyAPI.onError(err, 'error')
      trigger(body, 'errorAddItem.ajaxCart', [err, 'error'])
      trigger(body, 'completeAddItem.ajaxCart', [null, err, 'error'])
    })
}

ShopifyAPI.getCart = (callback) => {
  trigger(document.body, 'beforeGetCart.ajaxCart')
  jsonFetch('/cart.js')
    .then((cart) => {
      if (typeof callback === 'function') callback(cart)
      else ShopifyAPI.onCartUpdate(cart)
      trigger(document.body, 'afterGetCart.ajaxCart', cart)
    })
    .catch((err) => ShopifyAPI.onError(err, 'error'))
}

ShopifyAPI.changeItem = (line, quantity, callback) => {
  const body = document.body
  trigger(body, 'beforeChangeItem.ajaxCart', [line, quantity])
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `quantity=${encodeURIComponent(quantity)}&line=${encodeURIComponent(line)}`,
  })
    .then((r) => r.json())
    .then((cart) => {
      if (typeof callback === 'function') callback(cart)
      else ShopifyAPI.onCartUpdate(cart)
      trigger(body, 'afterChangeItem.ajaxCart', [line, quantity, cart])
      trigger(body, 'completeChangeItem.ajaxCart', [null, null, 'success'])
    })
    .catch((err) => {
      trigger(body, 'errorChangeItem.ajaxCart', [err, 'error'])
      ShopifyAPI.onError(err, 'error')
      trigger(body, 'completeChangeItem.ajaxCart', [null, err, 'error'])
    })
}

export { ShopifyAPI, attributeToString }
