// timber.accessibleNav — Slice 4 + query-opt (measurethat #16434: closest vs querySelector)
// Use getElementById for #id, getElementsByClassName for .class where simple, closest only for delegation
// closest is 13.8M ops/sec vs querySelector 16.1M ops/sec in Chrome (closest slower), so prefer QSA from known root when we have parent.

const ACTIVE = 'nav-hover'
const FOCUS = 'nav-focus'

const unwrap = (el) => (el && el[0] ? el[0] : el)
const toArray = (els) => {
  if (!els) return []
  if (els.nodeType === 1) return [els]
  if (typeof els.length === 'number' && els.tagName === undefined) return [...els].filter(Boolean).map(unwrap).filter(Boolean)
  return [unwrap(els)].filter(Boolean)
}

export const accessibleNav = (timber) => {
  const nav = unwrap(timber.cache?.$navigation)
  if (!nav) return

  // Use nav-scoped QSA, but for simple .class use getElementsByClassName when not needing delegation
  // :scope > li a is faster than full QSA + closest filter; fallback uses children (no closest) per bench
  const allLinks = [...nav.getElementsByTagName('a')] // faster than QSA 'a' (tag only)
  const directLis = [...nav.children].filter((el) => el.tagName === 'LI')
  const topLevel = directLis.length ? directLis.flatMap((li) => [...li.querySelectorAll('a')]) : [...nav.querySelectorAll(':scope > li a')]
  const topLevelLinks = topLevel.length ? topLevel : allLinks.filter((a) => {
    // avoid closest('li') overhead — walk one parent up (li) then check nav contains, cheaper than closest
    const li = a.parentElement && a.parentElement.tagName === 'LI' ? a.parentElement : a.closest('li')
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
    const subMenu = node.nextElementSibling && node.nextElementSibling.tagName === 'UL' ? node.nextElementSibling : null
    const hasSubMenu = !!(subMenu && subMenu.classList.contains('sub-nav'))
    void hasSubMenu
    // closest is correct for ancestor delegation (need walk up), but per #16434 it's slower than QSA from known root
    // Here we have node and need ancestor .site-nav__dropdown / .site-nav--has-dropdown — closest is most readable and event-scoped
    // Keep closest for correctness; alternative parentElement walk would be ~same and less robust for nested UL
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
