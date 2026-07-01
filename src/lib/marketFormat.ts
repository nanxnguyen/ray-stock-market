export function minMaxRange(arr: number[]): [number, number, number] {
  if (!arr || arr.length === 0) return [0, 0, 0]
  let mn = arr[0]
  let mx = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < mn) mn = arr[i]
    if (arr[i] > mx) mx = arr[i]
  }
  return [mn, mx, mx - mn]
}

export function formatPrice(v: number): string {
  return (+v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function formatQuantity(v: number): string {
  return v ? Math.abs(Math.round(v)).toLocaleString('en-US') : ''
}

export function priceColor(price: number, reference: number, ceiling: number, floor: number): string {
  if (+price >= +ceiling) return '#c084fc'
  if (+price <= +floor) return '#38bdf8'
  if (+price > +reference) return '#4ade80'
  if (+price < +reference) return '#f87171'
  return '#facc15'
}

export function toPolylinePoints(history: number[], w = 100, ht = 22, range?: [number, number, number]): string {
  if (!history || history.length < 2) return ''
  const [mn, , rng] = range || minMaxRange(history)
  const effectiveRng = rng || 1
  return history
    .map((v, i) => `${((i / (history.length - 1)) * w).toFixed(1)},${(ht - 2 - ((v - mn) / effectiveRng) * (ht - 4)).toFixed(1)}`)
    .join(' ')
}

export function toAreaPath(history: number[], w = 100, ht = 22, range?: [number, number, number]): string {
  if (!history || history.length < 2) return ''
  const [mn, , rng] = range || minMaxRange(history)
  const effectiveRng = rng || 1
  const pts = history.map(
    (v, i) => `${((i / (history.length - 1)) * w).toFixed(1)},${(ht - 2 - ((v - mn) / effectiveRng) * (ht - 4)).toFixed(1)}`
  )
  return `M 0,${ht} L ${pts.join(' L ')} L ${w},${ht} Z`
}
