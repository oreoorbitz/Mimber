// Shopify.formatMoney — Mepto/modern pass
// Why: hoisted regex, defaultOption inline, formatWithDelimiters hoisted; native Object.assign.
// Contract preserved: Shopify.formatMoney(cents, format) with {{amount}} placeholders.
const PLACEHOLDER_RE = /\{\{\s*(\w+)\s*\}\}/
const THOUSANDS_RE = /(\d)(?=(\d\d\d)+(?!\d))/g

const formatWithDelimiters = (number, precision = 2, thousands = ',', decimal = '.') => {
  if (isNaN(number) || number == null) return '0'
  number = (number / 100.0).toFixed(precision)
  const parts = number.split('.')
  const dollars = parts[0].replace(THOUSANDS_RE, `$1${thousands}`)
  const cents = parts[1] ? decimal + parts[1] : ''
  return dollars + cents
}

export const installFormatMoney = (Shopify) => {
  if (Shopify.formatMoney) return Shopify
  const ShopifyWithFormat = Shopify
  ShopifyWithFormat.formatMoney = (cents, format) => {
    let value = ''
    const formatString = format || ShopifyWithFormat.money_format || ''
    if (typeof cents === 'string') cents = cents.replace('.', '')
    const ph = formatString.match(PLACEHOLDER_RE)
    if (!ph) return formatString
    switch (ph[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2)
        break
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0)
        break
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',')
        break
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',')
        break
      default:
        value = formatWithDelimiters(cents, 2)
    }
    return formatString.replace(PLACEHOLDER_RE, value)
  }
  return ShopifyWithFormat
}

export { formatWithDelimiters }
