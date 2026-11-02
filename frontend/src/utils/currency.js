/**
 * Universal Currency & Localization Helper for SHOPSYNC
 * Strictly formats in Indian Rupee (₹ / INR) using Indian numbering system (en-IN).
 * Examples: ₹499, ₹1,299, ₹1,25,000
 */

export const formatINR = (amount, options = {}) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0'
  }

  const num = Math.round(Number(amount))
  const formatted = num.toLocaleString('en-IN')
  return `₹${formatted}`
}

export const formatINRDecimal = (amount, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0.00'
  }

  const num = Number(amount)
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
  return `₹${formatted}`
}

export const CURRENCY_SYMBOL = '₹'
export const CURRENCY_CODE = 'INR'

export default formatINR
