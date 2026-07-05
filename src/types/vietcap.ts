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
  | 'FU' | 'CW' | 'SECTOR' | 'BOND'
  | 'VN30' | 'VN100' | 'VNMIDCAP' | 'VNSMALLCAP' | 'VNALLSHARE'
  | 'VNDIAMOND' | 'VNFINLEAD' | 'VNFINSELECT' | 'VNDIVIDEND' | 'VNMITECH'
  | 'ETF' | 'PUT_THROUGH_HOSE' | 'ODD_LOT_HOSE'
  | 'VN50_GROWTH' | 'VNFIN' | 'VNIND' | 'VNMAT' | 'VNIT' | 'VNREAL'
  | 'VNCONS' | 'VNEE' | 'VNHEAL' | 'VNSI' | 'VNUTI' | 'VNX50' | 'VNXALLSHARE'
  | 'HNX30' | 'HNXCON' | 'HNXFIN' | 'HNXLCAP' | 'HNXMSCAP' | 'HNXMAN'
  | 'PUT_THROUGH_HNX' | 'ODD_LOT_HNX'
  | 'PUT_THROUGH_UPCOM' | 'ODD_LOT_UPCOM'
  | 'FU_INDEX' | 'BOND_FU' | 'DERIVATIVE'
  | 'PRIVATE_BOND' | 'LISTED_BOND'

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
