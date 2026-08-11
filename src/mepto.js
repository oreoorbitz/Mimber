export const $ = (() => {
  if (typeof window !== 'undefined') {
    if (window.mepto) return window.mepto
    if (window.jQuery) return window.jQuery
  }
  return null
})()
export const hasMepto = () => !!$
