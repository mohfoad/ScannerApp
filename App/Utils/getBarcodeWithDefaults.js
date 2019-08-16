import _ from 'lodash'

export default function getBarcodeWithDefaults (data, barcode) {
  if (!data || typeof data == null) throw new Error('Did not provide valid data arg')
  if (!barcode) return null

  const transform = [
    [ 'default', barcode ],
    [ 'EAN-13', _.padStart(barcode, 13, '0') ],
    [ 'EAN-12', _.padStart(barcode, 12, '0') ],
    // Private labels are weird, mkay:
    //  - we get the UPCs as e.g. 0223780000000 (last 6 digits 0)
    //  - but each store will fill those last 6 digits randomly for the same product
    //  - so we need to check if this UPC is a potential private label
    barcode.length >= 11
      ? [ 'private-label', _.padStart(barcode.replace(/.{5}$/, '00000'), 13, '0') ]
      : null
  ].filter(x => !!x)

  for (let [ name, newBarcode ] of transform) {
    if (data.getUPC(newBarcode)) return newBarcode
  }

  return barcode
}
