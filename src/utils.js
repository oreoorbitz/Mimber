// timber small utils — Slice 2
// Mepto fallback (window.mepto||jQuery) + native; DocumentFragment/wrap batch + dataset.
import { replaceUrlParam } from './url.js'
import { scheduler } from './scheduler.js'

const on = (els, evt, fn) => {
  const list = !els ? [] : els.length !== undefined && els.tagName === undefined ? [...els] : [els]
  list.forEach((el) => el && el.addEventListener && el.addEventListener(evt, fn))
}
const hasClassList = (el) => !!(el && el.classList)

export const getHash = () => window.location.hash

export const switchImage = (src, _imgObject, el) => {
  // el may be mepto collection, Node, or selector
  const target = el && el[0] ? el[0] : el
  const node = typeof target === 'string' ? document.querySelector(target) : target
  if (!node) return
  // use scheduler mutate to batch src write (avoids layout thrash if many)
  scheduler.mutate(() => { node.setAttribute('src', src) })
}

export const mobileNavToggle = (timber) => {
  const t = timber.cache?.$mobileSubNavToggle
  if (!t) return
  const list = t.length !== undefined ? [...t] : [t]
  if (!list.length || (list.length === 1 && !list[0])) return
  list.forEach((el) => {
    if (!el || !el.addEventListener) return
    el.addEventListener('click', function () {
      const p = this.parentElement
      if (!p) return
      scheduler.mutate(() => p.classList.toggle('mobile-nav--expanded'))
    })
  })
}

export const productImageSwitch = (timber) => {
  const thumbs = timber.cache?.$thumbImages
  if (!thumbs) return
  const list = thumbs.length !== undefined ? [...thumbs] : [thumbs]
  if (!list.length || (list.length === 1 && !list[0])) return
  list.forEach((el) => {
    if (!el || !el.addEventListener) return
    el.addEventListener('click', (evt) => {
      evt.preventDefault()
      const href = el.getAttribute('href')
      switchImage(href, null, timber.cache.$productImage)
    })
  })
}

export const responsiveVideos = () => {
  const vids = [...document.querySelectorAll('iframe[src*="youtube.com/embed"], iframe[src*="player.vimeo"]')]
  const resets = [...document.querySelectorAll('iframe#admin_bar_iframe')]
  // batch wraps in mutate
  scheduler.mutate(() => {
    vids.forEach((el) => {
      if (el.parentElement && el.parentElement.classList.contains('video-wrapper')) return
      const wrap = document.createElement('div')
      wrap.className = 'video-wrapper'
      el.parentNode.insertBefore(wrap, el)
      wrap.appendChild(el)
    })
    // Chrome back-cache iframe src reset — style read then write already batched
    resets.forEach((el) => { el.src = el.src })
  })
}

export const collectionViews = (timber) => {
  const c = timber.cache?.$changeView
  if (!c) return
  const list = c.length !== undefined ? [...c] : [c]
  if (!list.length || (list.length === 1 && !list[0])) return
  list.forEach((el) => {
    if (!el || !el.addEventListener) return
    el.addEventListener('click', function () {
      const view = this.getAttribute('data-view') || (this.dataset && this.dataset.view) || ''
      const url = document.URL
      const hasParams = url.indexOf('?') > -1
      window.location = hasParams ? replaceUrlParam(url, 'view', view) : url + '?view=' + view
    })
  })
}

export const loginForms = (timber) => {
  const showRecover = () => {
    scheduler.mutate(() => {
      const a = timber.cache.$recoverPasswordForm
      const b = timber.cache.$customerLoginForm
      if (a) { const n = a[0] || a; if (n.style) n.style.display = '' ; if (n.style && n.style.display === 'none') n.style.display = 'block'; if (!a.length) n.style.display = '' }
      // normalize: mepto .show() sets display block; native fallback
      const af = a && a[0] ? a[0] : a
      const bf = b && b[0] ? b[0] : b
      if (af && af.style) af.style.display = 'block'
      if (bf && bf.style) bf.style.display = 'none'
    })
  }
  const hideRecover = () => {
    scheduler.mutate(() => {
      const af = timber.cache.$recoverPasswordForm && (timber.cache.$recoverPasswordForm[0] || timber.cache.$recoverPasswordForm)
      const bf = timber.cache.$customerLoginForm && (timber.cache.$customerLoginForm[0] || timber.cache.$customerLoginForm)
      if (af && af.style) af.style.display = 'none'
      if (bf && bf.style) bf.style.display = 'block'
    })
  }
  const aLink = timber.cache.$recoverPasswordLink
  const hLink = timber.cache.$hideRecoverPasswordLink
  const aNode = aLink && (aLink[0] || aLink)
  const hNode = hLink && (hLink[0] || hLink)
  if (aNode && aNode.addEventListener) aNode.addEventListener('click', (e) => { e.preventDefault(); showRecover() })
  if (hNode && hNode.addEventListener) hNode.addEventListener('click', (e) => { e.preventDefault(); hideRecover() })
  if (getHash() === '#recover') showRecover()
}

export const resetPasswordSuccess = (timber) => {
  const el = timber.cache?.$passwordResetSuccess
  const node = el && (el[0] || el)
  if (!node || !node.style) return
  scheduler.mutate(() => { node.style.display = 'block' })
}
