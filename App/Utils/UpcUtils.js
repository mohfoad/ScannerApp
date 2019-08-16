/**
 * Trying to deprecate both:
 *  - product/utils/upc.js
 *  - @sageapp/product-utils/upcTools.js
 *
 * This util is the accurate way of working with UPCs, the others were mainly hacks
 */

const STANDARD_SIZE = 14
const ZEROS = '0'.repeat(STANDARD_SIZE)

const defaultStandardize = (upc) => (ZEROS + upc).slice(-1 * STANDARD_SIZE)

const handlers = {
  invalid: {
    // invalid codes are codes too
    key: 'invalid',
    validate: () => false,
    standardize: defaultStandardize
  },

  PLU: {
    key: 'PLU',
    validate: (plu) => {
      if (plu.length < 4 || plu.length > 5) return false

      let num = parseInt(plu, 10)
      if (Number.isNaN(num)) return false

      return (
        (num >= 3000 && num < 5000) ||
        (num >= 93000 && num < 95000) || // organic variants
        (num >= 83000 && num <= 85000)
      ) // future groups
    },
    standardize: defaultStandardize
  },

  UPCE: {
    key: 'UPCE',
    validate: (upce) => {
      return upce.length === 6
    },
    standardize: (upce) => {
      if (!handlers.UPCE.validate(upce)) return defaultStandardize(upce)
      const standard = convertUPCEtoUPCa(upce)
      return standard == null ? defaultStandardize(upce) : defaultStandardize(standard)
    }
  },

  GTIN: {
    key: 'GTIN',
    validate: (gtin) => {
      if (gtin.length < 8 && gtin.length > 14) return false
      if (gtin.length < 12) return true
      // 12, 13 and 14 formats should have the check digit in them so we can validate it
      const check = getCheckDigit(gtin.slice(0, -1))
      return gtin[gtin.length - 1] === check
    },
    standardize: (gtin) => {
      if (!handlers.GTIN.validate(gtin)) return defaultStandardize(gtin)

      // there shouldn't be any check digits for length <= 11, so we compute it and add it
      if (gtin.length < 12) {
        const check = getCheckDigit(gtin)
        return defaultStandardize(gtin + check)
      }

      return defaultStandardize(gtin)
    }
  }
}

Object.assign(handlers, {
  4: handlers.PLU,
  5: handlers.PLU,
  6: handlers.UPCE,
  8: handlers.GTIN,
  9: handlers.GTIN,
  10: handlers.GTIN,
  11: handlers.GTIN,
  12: handlers.GTIN,
  13: handlers.GTIN
})

const getUPCFormat = (upc) => {
  if (upc == null) return 'invalid'

  const handler = handlers[upc.length]
  if (!handler) return 'invalid'

  return handler.key
}

const getValidUPCFormat = (upc) => {
  const key = getUPCFormat(upc)
  if (key === 'invalid') return 'invalid'
  return handlers[key].validate(upc) ? key : 'invalid'
}

/**
 * Computes GTIN check digit
 *
 * https://www.gs1.org/services/how-calculate-check-digit-manually
 */
const getCheckDigit = (str) => {
  if (!str || str.length > 13) return null
  let sum = 0
  for (let [i, ch] of str
    .split('')
    .reverse()
    .entries()) {
    sum += parseInt(ch) * (i % 2 === 0 ? 3 : 1)
  }
  return '' + ((10 - (sum % 10)) % 10)
}

/**
 * Handles UPC-E to UPC-A / GTIN-12 conversion
 *
 * @source http://www.taltech.com/barcodesoftware/symbologies/upc
 */
const convertUPCEtoUPCa = (upce) => {
  if (upce.length !== 6) return null

  const [a, b, c, d, e, T] = upce
  const map = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a, b, c, d, e, X: '' }

  const patterns = [
    '0ab00000cdeX', // T = 0
    '0ab10000cdeX', // T = 1
    '0ab20000cdeX', // T = 2
    '0abc00000deX', // T = 3
    '0abcd00000eX', // T = 4
    '0abcde00005X', // T = 5
    '0abcde00006X', // T = 6
    '0abcde00007X', // T = 7
    '0abcde00008X', // T = 8
    '0abcde00009X' // T = 9
  ]

  const code = patterns[T].split('')
    .map((ch) => map[ch])
    .join('')
  const check = getCheckDigit(code)
  if (check == null) return null
  return code + check
}

const standardize = (original) => {
  const format = getValidUPCFormat(original)
  return { standard: handlers[format].standardize(original), format, original }
}

module.exports = {
  getUPCFormat,
  getValidUPCFormat,
  getCheckDigit,
  convertUPCEtoUPCa,
  standardize
}
