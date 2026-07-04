/** @deprecated Use CSS variables instead */
export type ThemeTokens = {
  appBg: string
  navBg: string
  navBorder: string
  navItemColor: string
  idxColBorder: string
  idxTitle: string
  glItemBorder: string
  glNameColor: string
  filterBorder: string
  searchText: string
  tabFg: string
  tabBorder: string
  tableBg: string
  rowOdd: string
  rowEven: string
  rowBorder: string
  rowHover: string
  cellBorder: string
  cellBorderL: string
  symColor: string
  volColor: string
  iconBg: string
  iconColor: string
  text: string
  textMuted: string
  toggleBg: string
  togglePos: string
  toggleLabel: string
  toggleIcon: string
  toggleTitle: string
}

export type RawStock = {
  s: string
  ng: string
  cl: number
  r: number
  fl: number
  lp: number
  lq: number
  pct: number
  tv: number
  hi: number
  lo: number
  fb: number
  fs: number
  rm: number
}

export type StockState = RawStock & {
  tk: number
  b3p: number
  b3q: number
  b2p: number
  b2q: number
  b1p: number
  b1q: number
  a1p: number
  a1q: number
  a2p: number
  a2q: number
  a3p: number
  a3q: number
  fl_: 'u' | 'd' | null
  fts: number
  ipts: number[]
}

export type StockRow = {
  sym: string
  ng: string
  bg: string
  ceil: string
  tc: string
  floor: string
  b3p: string
  b3q: string
  b3c: string
  b2p: string
  b2q: string
  b2c: string
  b1p: string
  b1q: string
  b1c: string
  lp: string
  lq: string
  lc: string
  pct: string
  pc: string
  chg: string
  tvol: string
  a1p: string
  a1q: string
  a1c: string
  a2p: string
  a2q: string
  a2c: string
  a3p: string
  a3q: string
  a3c: string
  hi: string
  hc: string
  avg: string
  ac: string
  lo: string
  oc: string
  fbuy: string
  fsell: string
  fbal: string
  fbc: string
  room: string
  kltt: string
  sparkPts: string
  sparkFill: string
  onChart: () => void
  watchlisted?: boolean
  onToggleWatchlist?: () => void
}

export type MarketIndexState = {
  n: string
  v: number
  ch: number
  pct: number
  vol: string
  up: number
  dn: number
  nc: number
  h: number[]
}

export type MarketIndexView = {
  name: string
  color: string
  val: string
  chg: string
  vol: string
  up: number
  dn: number
  nc: number
  pts: string
  fill: string
  statusBg: string
  gradId: string
  onClick: () => void
}

export type ChartState = {
  open: boolean
  sym: string
  range: string
}

export type ChartView = {
  sym: string
  lp: string
  lc: string
  chg: string
  chgBg: string
  linePts: string
  fillPath: string
  refY: number
  yLabels: string[]
  vbars: { x: string; y: string; w: string; h: string; c: string }[]
  stats: { label: string; val: string; color: string }[]
  ranges: { label: string; bg: string; fg: string; border: string; onClick: () => void }[]
}

export type TopMoverItem = {
  sym: string
  pct: string
  lp: string
  vol: string
  pc: string
  onChart: () => void
}

export type TradeHistoryItem = {
  sym: string
  time: string
  price: string
  qty: string
  side: string
  sideColor: string
  priceColor: string
  timeColor: string
  volColor: string
}

export type BreadthData = {
  label: string
  upCnt: number
  total: number
  upPct: number
  upColor: string
}
