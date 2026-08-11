// collection — only on collection template (sort + view toggle). ~1K gzip
import { collectionViews } from '../utils.js'
import { cacheSelectors } from '../cache.js'

if (typeof window !== 'undefined') {
  window.timber = window.timber || {}
  window.timber.collectionViews = () => collectionViews(window.timber)
  const initCollection = () => {
    try {
      cacheSelectors(window.timber)
    } catch {}
    try {
      collectionViews(window.timber)
    } catch {}
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', initCollection)
  else queueMicrotask(initCollection)
}
