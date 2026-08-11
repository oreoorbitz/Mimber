import { describe, it, expect } from 'vitest'
import { installFormatMoney } from '../../src/money-format.js'

describe('Shopify.formatMoney', () => {
  const Shopify = { money_format: '${{amount}}' }
  installFormatMoney(Shopify)

  it('formats with default USD comma/period', () => {
    expect(Shopify.formatMoney(1999)).toBe('$19.99')
    expect(Shopify.formatMoney(1999, '${{amount}}')).toBe('$19.99')
  })
  it('handles amount_no_decimals', () => {
    expect(Shopify.formatMoney(2000, '${{amount_no_decimals}}')).toBe('$20')
  })
  it('handles string cents with dot', () => {
    expect(Shopify.formatMoney('19.99', '${{amount}}')).toBe('$19.99')
  })
})
