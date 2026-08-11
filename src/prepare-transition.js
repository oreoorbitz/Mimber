// prepareTransition — Mepto/Native ESM
// Why: Drops jQuery plugin registration; rAF-mutate for offsetWidth thrash (via scheduler mutate).
// Before (1 line, jQuery):
//   (function(a){a.fn.prepareTransition=function(){return this.each(...el[0].offsetWidth...)}})(jQuery)
// After: vanilla + Mepto bridge, measure to read durations, mutate to write + trigger reflow.
import { $ } from './mepto.js'
import { scheduler } from './scheduler.js'

const TRANSITION_DURATION_PROPS = Object.freeze([
  'transitionDuration',
  '-moz-transition-duration',
  '-webkit-transition-duration',
  '-o-transition-duration',
])

function getTransitionDuration(el) {
  const cs = getComputedStyle(el)
  let d = 0
  for (let i = 0; i < TRANSITION_DURATION_PROPS.length; i++) {
    const v = parseFloat(cs.getPropertyValue(TRANSITION_DURATION_PROPS[i]))
    if (!isNaN(v) && v !== 0) d = d || v
  }
  return d
}

const TRANSITION_END_EVENTS = 'TransitionEnd webkitTransitionEnd transitionend oTransitionEnd'

/**
 * Prepare transition on element(s). Adds is-transitioning, triggers reflow via
 * scheduler.mutate so the write is batched, removes on transitionend (once).
 * Mepto fallback: `$(els).prepareTransition()` still bound via bridget.
 */
export const prepareTransition = (els) => {
  const list = els instanceof NodeList || Array.isArray(els) ? [...els] : [els]
  list.forEach((el) => {
    if (!el || el.nodeType !== 1) return
    // read first (measure), then write (mutate)
    scheduler.measure(() => {
      const dur = getTransitionDuration(el)
      scheduler.mutate(() => {
        const onEnd = () => el.classList.remove('is-transitioning')
        // Use {once:true} so we don't leak; Mepto also polyfills .one()
        el.addEventListener('transitionend', onEnd, { once: true })
        el.addEventListener('webkitTransitionEnd', onEnd, { once: true })
        el.addEventListener('TransitionEnd', onEnd, { once: true })
        el.addEventListener('oTransitionEnd', onEnd, { once: true })
        if (dur !== 0) {
          el.classList.add('is-transitioning')
          void el.offsetWidth
        }
      })
    })
  })
  return els
}

export const attachPrepareTransition = () => {
  try {
    const mepto = $(null)
    const proto = mepto && Object.getPrototypeOf(mepto)
    if (proto && typeof proto.prepareTransition === 'undefined') {
      proto.prepareTransition = function () {
        prepareTransition([...this])
        return this
      }
    }
  } catch (_) {}
}
