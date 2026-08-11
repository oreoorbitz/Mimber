import { describe, it, expect, vi } from 'vitest'
import { scheduler } from '../../src/scheduler.js'

describe('scheduler', () => {
  it('batches measure/mutate via rAF then flush', async () => {
    const m = vi.fn()
    const mu = vi.fn()
    scheduler.measure(m)
    scheduler.mutate(mu)
    // flush immediately (rAF not needed in test)
    scheduler.flush()
    expect(m).toHaveBeenCalledTimes(1)
    expect(mu).toHaveBeenCalledTimes(1)
  })
})
