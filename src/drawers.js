// timber.Drawers — Slice 5
// Native: Object.assign vs $.extend, bind vs $.proxy, CustomEvent vs trigger, classList, prepareTransition via import.

import { prepareTransition } from './prepare-transition.js'
import { scheduler } from './scheduler.js'

const unwrap = (el) => (el && el[0] ? el[0] : el)
const toArray = (els) => {
  if (!els) return []
  if (els.nodeType === 1) return [els]
  if (typeof els.length === 'number' && els.tagName === undefined) return [...els].map(unwrap).filter(Boolean)
  return [unwrap(els)].filter(Boolean)
}
const trigger = (target, name, detail) => {
  const el = unwrap(target) || document.body
  el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }))
  // also try mepto trigger if available (for compat with $(document).on('beforeDrawerOpen.timber'))
  try {
    const mepto = window.mepto || window.jQuery
    if (mepto && mepto(target).trigger) mepto(target).trigger(name, detail)
  } catch (_) {}
}

export class Drawer {
  constructor(id, position, options = {}) {
    const defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position,
    }
    this.config = Object.assign({}, defaults, options)
    this.position = position

    // $nodes: parent = body,html ; page = #PageContainer ; moved = .is-moved-by-drawer
    // .is-moved-by-drawer is simple class -> getElementsByClassName faster than QSA (per bench)
    this.nodes = {
      parent: [document.body, document.documentElement].filter(Boolean),
      page: document.getElementById('PageContainer'),
      moved: [...document.getElementsByClassName('is-moved-by-drawer')],
    }
    this.drawer = document.getElementById(id)
    if (!this.drawer) return false
    this.drawerIsOpen = false
    this.init()
  }

  init() {
    const openEls = [...document.querySelectorAll(this.config.open)]
    openEls.forEach((el) => el.addEventListener('click', this.open.bind(this)))
    const closeEls = this.drawer ? [...this.drawer.querySelectorAll(this.config.close)] : []
    closeEls.forEach((el) => el.addEventListener('click', this.close.bind(this)))
  }

  open(evt) {
    let externalCall = false
    if (evt) evt.preventDefault()
    else externalCall = true

    if (evt && evt.stopPropagation) {
      evt.stopPropagation()
      this.activeSource = evt.currentTarget
    }

    if (this.drawerIsOpen && !externalCall) return this.close()

    const body = (window.timber && window.timber.cache && unwrap(window.timber.cache.$body)) || document.body
    trigger(body, 'beforeDrawerOpen.timber', this)

    scheduler.mutate(() => {
      this.nodes.moved.forEach((el) => el.classList.add('is-transitioning'))
      prepareTransition(this.drawer)
      this.nodes.parent.forEach((el) => el.classList.add(this.config.openClass, this.config.dirOpenClass))
    })
    this.drawerIsOpen = true

    this.trapFocus(this.drawer, 'drawer_focus')

    if (this.config.onDrawerOpen && typeof this.config.onDrawerOpen === 'function' && !externalCall) {
      this.config.onDrawerOpen()
    }

    if (this.activeSource && this.activeSource.getAttribute && this.activeSource.getAttribute('aria-expanded') !== null) {
      this.activeSource.setAttribute('aria-expanded', 'true')
    }

    // lock scrolling + page click close (namespaced .drawer)
    if (this.nodes.page) {
      this._onTouchMove = (e) => { e.preventDefault(); return false }
      this._onPageClick = (e) => { this.close(); e.preventDefault(); return false }
      this.nodes.page.addEventListener('touchmove', this._onTouchMove, { passive: false })
      this.nodes.page.addEventListener('click', this._onPageClick)
    }

    trigger(body, 'afterDrawerOpen.timber', this)
  }

  close() {
    if (!this.drawerIsOpen) return
    const body = (window.timber && window.timber.cache && unwrap(window.timber.cache.$body)) || document.body
    trigger(body, 'beforeDrawerClose.timber', this)

    if (document.activeElement && document.activeElement.blur) {
      try { document.activeElement.blur() } catch (_) {}
      // also mepto trigger blur for compat
      try { const mepto = window.mepto || window.jQuery; if (mepto) mepto(document.activeElement).trigger('blur') } catch (_) {}
    }

    scheduler.mutate(() => {
      this.nodes.moved.forEach((el) => prepareTransition(el))
      prepareTransition(this.drawer)
      this.nodes.parent.forEach((el) => el.classList.remove(this.config.dirOpenClass, this.config.openClass))
    })
    this.drawerIsOpen = false

    this.removeTrapFocus(this.drawer, 'drawer_focus')

    if (this.nodes.page) {
      if (this._onTouchMove) this.nodes.page.removeEventListener('touchmove', this._onTouchMove)
      if (this._onPageClick) this.nodes.page.removeEventListener('click', this._onPageClick)
      // remove any remaining .drawer handlers (compat: off('.drawer') removed all)
      this._onTouchMove = null
      this._onPageClick = null
    }

    trigger(body, 'afterDrawerClose.timber', this)
  }

  trapFocus(container, eventNamespace) {
    const el = unwrap(container)
    if (!el) return
    const eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin'
    // store handler for removal
    this._focusHandler = (evt) => {
      if (el !== evt.target && !el.contains(evt.target)) el.focus()
    }
    this._focusEventName = eventName
    el.setAttribute('tabindex', '-1')
    el.focus()
    document.addEventListener('focusin', this._focusHandler)
    // also namespaced compat via mepto if available
    try { const mepto = window.mepto || window.jQuery; if (mepto) mepto(document).on(eventName, this._focusHandler) } catch (_) {}
  }

  removeTrapFocus(container, eventNamespace) {
    const el = unwrap(container)
    if (!el) return
    const eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin'
    el.removeAttribute('tabindex')
    if (this._focusHandler) {
      document.removeEventListener('focusin', this._focusHandler)
      try { const mepto = window.mepto || window.jQuery; if (mepto) mepto(document).off(eventName) } catch (_) {}
      this._focusHandler = null
    } else {
      document.removeEventListener('focusin', () => {})
      try { const mepto = window.mepto || window.jQuery; if (mepto) mepto(document).off(eventName) } catch (_) {}
    }
  }
}

export const drawersInit = (timber) => {
  timber.LeftDrawer = new Drawer('NavDrawer', 'left')
  // Preserve Liquid gate: only init RightDrawer if ajaxCart present or setting says drawer
  // Original: {% if settings.ajax_cart_method == "drawer" %} timber.RightDrawer = new timber.Drawers('CartDrawer','right',{onDrawerOpen: ajaxCart.load}); {% endif %}
  // Modern: check window.ajaxCart or window.settings
  const ajaxCart = window.ajaxCart
  const shouldInitRight = (() => {
    // If Liquid already rendered, timber.RightDrawer may be expected; init if CartDrawer exists
    if (document.getElementById('CartDrawer')) return true
    return !!ajaxCart
  })()
  if (shouldInitRight) {
    timber.RightDrawer = new Drawer('CartDrawer', 'right', {
      onDrawerOpen: ajaxCart && ajaxCart.load ? ajaxCart.load : undefined,
    })
  }
}
