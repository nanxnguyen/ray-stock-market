// src/types/vietcap.ts

export type VietcapSymbol = {
  symbol: string
  type: 'STOCK' | 'CW' | 'BOND' | 'FU' | 'ETF'
  board: 'HSX' | 'HNX' | 'UPCOM' | 'BOND' | 'DELISTED'
  companyName: string
  companyNameEn: string
  id?: number
  sid?: string
  organName?: string
  organShortName?: string
  icbCode2?: string
  productGrpID?: number
}

export type VietcapPrice = {
  co: string
  s: string
  cei: string
  flo: string
  ref: string
  c: string
  vo: string
  va: string
  bp1: string
  bv1: string
  bp2: string
  bv2: string
  bp3: string
  bv3: string
  ap1: string
  av1: string
  ap2: string
  av2: string
  ap3: string
  av3: string
  frbv: string
  frsv: string
  orgn: string
  enorgn: string
  bo: string
  bc: string
  ac: string
  st: string
  lsh: string
}

export type VietcapIndexConfig = {
  boardPriority: number
  columnNumber: number
  enBoardName: string
  enIndexName: string
  group: string
  indexMapping: string
  isOddLot: boolean
  isPutThrough: boolean
  platform: string
  type: string
  viBoardName: string
  viIndexName: string
}

export type VietcapSector = {
  icbCode: string
  icbName: string
  icbNameEn: string
  level: number
  parentIcbCode: string
}

export type VietcapFilterGroup =
  | 'WL' | 'HOSE' | 'HNX' | 'UPCOM'
  | 'DERIVATIVE' | 'CW' | 'SECTOR' | 'BOND'
  | 'VN30' | 'VN100' | 'VNMidCap' | 'VNSmallCap' | 'VNAllShare'
  | 'VNDiamond' | 'VNFinLead' | 'VNFinSelect' | 'VNDividend' | 'VNMiTech'
  | 'ETF' | 'GDTT_HOSE' | 'ODD_LOT_HOSE'
  | 'VN50_Growth' | 'VNFin' | 'VNInd' | 'VNMat' | 'VNIT' | 'VNReal'
  | 'VNCons' | 'VNEne' | 'VNHeal' | 'VNSI' | 'VNUti' | 'VNX50' | 'VNXAllShare'
  | 'HNX30' | 'HNXCon' | 'HNXFin' | 'HNXLCap' | 'HNXMSCap' | 'HNXMan'
  | 'GDTT_HNX' | 'ODD_LOT_HNX'
  | 'GDTT_UPCOM' | 'ODD_LOT_UPCOM'
  | 'INDEX_FU' | 'BOND_FU' | 'GDTT_DERIVATIVE'
  | 'BOND_PRIVATE' | 'BOND_LISTED'

export type FilterOption = {
  label: string
  value: string
  icon?: string
}

export type FilterGroupConfig = {
  id: string
  label: string
  hasDropdown: boolean
  columns: number
  options: FilterOption[]
}

export type VietcapFilterState = {
  group: VietcapFilterGroup
  value: string
  searchText: string
  watchlist: string[]
}
