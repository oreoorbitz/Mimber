// timber.accessibleNav — Slice 4
// Mepto/native: querySelectorAll, classList, closest, addEventListener; scheduler not needed (no layout thrash).

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

  const allLinks = [...nav.querySelectorAll('a')]
  const topLevel = [...nav.querySelectorAll(':scope > li a')].length ? [...nav.querySelectorAll(':scope > li a')] : [...nav.children].flatMap((li) => [...li.querySelectorAll('a')]).filter((a) => a.closest('li') && a.closest('li').parentElement === nav)
  // fallback: children('li').find('a') — use direct children
  const topLevelLinks = topLevel.length ? topLevel : [...nav.querySelectorAll('a')].filter((a) => a.closest('.site-nav--has-dropdown') === null || a.closest('li')?.parentElement === nav)

  const parents = [...nav.querySelectorAll('.site-nav--has-dropdown')]
  const subMenuLinks = [...nav.querySelectorAll('.site-nav__dropdown a')]

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
