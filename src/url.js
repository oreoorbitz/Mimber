// replaceUrlParam — native ESM, hoisted regex
const RP_RE_CACHE = new Map()
const getRe = (param) => {
  if (!RP_RE_CACHE.has(param)) RP_RE_CACHE.set(param, new RegExp(`(${param}=).*?(&|$)`, 'g'))
  return RP_RE_CACHE.get(param)
}
export const replaceUrlParam = (url, param, value) => {
  const re = getRe(param)
  // single exec approach: search then replace or append
  const has = url.search(new RegExp(`[?&]${param}=`)) !== -1
  if (has) return url.replace(getRe(param), `$1${value}$2`)
  return url + (url.indexOf('?') > 0 ? '&' : '?') + param + '=' + value
}
