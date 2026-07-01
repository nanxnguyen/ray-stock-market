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

export function toPolylinePoints(history: number[], w = 100, ht = 22): string {
  if (!history || history.length < 2) return ''
  const mn = Math.min(...history)
  const mx = Math.max(...history)
  const rng = mx - mn || 1
  return history
    .map((v, i) => `${((i / (history.length - 1)) * w).toFixed(1)},${(ht - 2 - ((v - mn) / rng) * (ht - 4)).toFixed(1)}`)
    .join(' ')
}

export function toAreaPath(history: number[], w = 100, ht = 22): string {
  if (!history || history.length < 2) return ''
  const mn = Math.min(...history)
  const mx = Math.max(...history)
  const rng = mx - mn || 1
  const pts = history.map(
    (v, i) => `${((i / (history.length - 1)) * w).toFixed(1)},${(ht - 2 - ((v - mn) / rng) * (ht - 4)).toFixed(1)}`
  )
  return `M 0,${ht} L ${pts.join(' L ')} L ${w},${ht} Z`
}
