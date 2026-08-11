// timber.accessibleNav — Slice 4 + query-opt (dom-bench Chrome 150: closest 4.1× > manual loop, gEBCN 57× > qSA)
// Use getElementById for #id, getElementsByClassName for .class, closest for delegation (C++ walk, no per-level JS→C++ crossing)

const ACTIVE = 'nav-hover'
const FOCUS = 'nav-focus'

const unwrap = (el) => (el && el[0] ? el[0] : el)
const toArray = (els) => {
  if (!els) return []
  if (els.nodeType === 1) return [els]
  if (typeof els.length === 'number' && els.tagName === undefined)
    return [...els].filter(Boolean).map(unwrap).filter(Boolean)
  return [unwrap(els)].filter(Boolean)
}

export const accessibleNav = (timber) => {
  const nav = unwrap(timber.cache?.$navigation)
  if (!nav) return

  // Use nav-scoped QSA, but for simple .class use getElementsByClassName when not needing delegation
  // :scope > li a is faster than full QSA + closest filter; fallback uses children (no closest) per bench
  const allLinks = [...nav.getElementsByTagName('a')] // faster than QSA 'a' (tag only)
  const directLis = [...nav.children].filter((el) => el.tagName === 'LI')
  const topLevel = directLis.length
    ? directLis.flatMap((li) => [...li.querySelectorAll('a')])
    : [...nav.querySelectorAll(':scope > li a')]
  const topLevelLinks = topLevel.length
    ? topLevel
    : allLinks.filter((a) => {
        const li = a.closest('li')
        return li && li.parentElement === nav
      })

  // parents: simple class -> getElementsByClassName is faster than QSA per bench, but need array; use QSA for scoped nav still fine
  // Keep QSA for direct nav scope, but avoid global document QSA
  const parents = [...nav.getElementsByClassName('site-nav--has-dropdown')]
  const subMenuLinks = [...nav.querySelectorAll('.site-nav__dropdown a')] // descendant, needs QSA

  const body = unwrap(timber.cache?.$body) || document.body

  const addFocus = (els) => toArray(els).forEach((el) => el.classList.add(FOCUS))
  const removeFocus = (els) => toArray(els).forEach((el) => el.classList.remove(FOCUS))
  const showDropdown = (el) => {
    const node = unwrap(el)
    if (!node) return
    node.classList.add(ACTIVE)
    setTimeout(() => {
      const onTouch = () => hideDropdown(node)
      // store handler for removal
      body._mimberHideHandler = onTouch
      body.addEventListener('touchstart', onTouch)
    }, 250)
  }
  const hideDropdown = (el) => {
    const node = unwrap(el)
    if (!node) return
    node.classList.remove(ACTIVE)
    if (body._mimberHideHandler) {
      body.removeEventListener('touchstart', body._mimberHideHandler)
      body._mimberHideHandler = null
    }
  }
  const handleFocus = (el) => {
    const node = unwrap(el)
    if (!node) return
    const subMenu =
      node.nextElementSibling && node.nextElementSibling.tagName === 'UL'
        ? node.nextElementSibling
        : null
    const hasSubMenu = !!(subMenu && subMenu.classList.contains('sub-nav'))
    void hasSubMenu
    // closest is 4.1× over manual loop per dom-bench Chrome 150 (C++ walk) — keep for delegation
    const isSubItem = !!node.closest('.site-nav__dropdown')
    if (!isSubItem) {
      removeFocus(topLevelLinks)
      addFocus(node)
    } else {
      const newFocus = node.closest('.site-nav--has-dropdown')?.querySelector('a')
      if (newFocus) addFocus(newFocus)
    }
  }

  parents.forEach((el) => {
    const enter = (evt) => {
      if (!el.classList.contains(ACTIVE)) evt.preventDefault()
      showDropdown(el)
    }
    el.addEventListener('mouseenter', enter)
    el.addEventListener('touchstart', enter, { passive: false })
    el.addEventListener('mouseleave', () => hideDropdown(el))
  })

  subMenuLinks.forEach((el) => {
    el.addEventListener('touchstart', (evt) => evt.stopImmediatePropagation())
  })

  allLinks.forEach((el) => {
    el.addEventListener('focus', () => handleFocus(el))
    el.addEventListener('blur', () => removeFocus(topLevelLinks))
  })
}
