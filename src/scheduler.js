const _raf =
  typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : (fn) => setTimeout(fn, 16)
let _queueMeasure = []
let _queueMutate = []
let _scheduled = false

const flush = () => {
  _scheduled = false
  const m = _queueMeasure.slice()
  const mu = _queueMutate.slice()
  _queueMeasure = []
  _queueMutate = []
  for (let i = 0; i < m.length; i++) m[i]()
  for (let i = 0; i < mu.length; i++) mu[i]()
}

const schedule = () => {
  if (_scheduled) return
  _scheduled = true
  _raf(flush)
}

export const scheduler = {
  measure(fn) {
    _queueMeasure.push(fn)
    schedule()
  },
  mutate(fn) {
    _queueMutate.push(fn)
    schedule()
  },
  flush,
}
