#!/usr/bin/env node
// scripts/sync-vietcap-data.mjs
// Fetches Vietcap API data via browser context (Playwright MCP) or generates mock data
// 
// To refresh data with real Vietcap data:
// 1. Open Playwright browser to https://trading.vietcap.com.vn/priceboard
// 2. Run the fetch script in browser console (see fetch-vietcap-data.mjs)
// 3. Download the generated symbols.json and prices.json
// 4. Copy to src/data/generated/
//
// Current data: 1896 stocks (426 HOSE + 299 HNX + 825 UPCOM + 253 CW + 93 BOND)
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'src', 'data', 'generated')

const API_BASE = 'https://trading-api.vietcap.com.vn'

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    ...options,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
}

// Mock data matching Vietcap API response format
function generateMockSymbols() {
  const boards = ['HSX', 'HNX', 'UPCOM']
  const types = ['STOCK', 'ETF', 'CW', 'BOND']
  const sectors = [
    { code: '8300', name: 'Bán lẻ' },
    { code: '8350', name: 'Ngân hàng' },
    { code: '8770', name: 'Bất động sản' },
    { code: '8210', name: 'Thực phẩm' },
    { code: '8120', name: 'Công nghệ' },
    { code: '8600', name: 'Chứng khoán' },
    { code: '8720', name: 'Thép' },
    { code: '8810', name: 'Năng lượng' },
    { code: '8510', name: 'Dược phẩm' },
    { code: '8410', name: 'Bảo hiểm' },
    { code: '8310', name: 'Vận tải' },
    { code: '8220', name: 'Hóa chất' },
    { code: '8130', name: 'Cao su' },
    { code: '8140', name: 'Thủy sản' },
    { code: '8110', name: 'Dệt may' },
    { code: '8710', name: 'Vật liệu' },
    { code: '8150', name: 'Gỗ' },
  ]

  // Core stocks matching the existing mockMarket.ts
  const coreStocks = [
    { symbol: 'AAA', board: 'HSX', organName: 'An Phat Holdings Group JSC', organShortName: 'An Phat', icbCode2: '8110', type: 'STOCK' },
    { symbol: 'ACB', board: 'HSX', organName: 'Asia Commercial Bank', organShortName: 'ACB', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'AGR', board: 'HSX', organName: 'Agribank Securities JSC', organShortName: 'AgriSecurities', icbCode2: '8600', type: 'STOCK' },
    { symbol: 'ANV', board: 'HSX', organName: 'Sao Ta Foods JSC', organShortName: 'Sao Ta', icbCode2: '8140', type: 'STOCK' },
    { symbol: 'BID', board: 'HSX', organName: 'Bank for Investment and Development', organShortName: 'BIDV', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'BMI', board: 'HSX', organName: 'Bao Minh Insurance JSC', organShortName: 'Bao Minh', icbCode2: '8410', type: 'STOCK' },
    { symbol: 'BVH', board: 'HSX', organName: 'Baoviet Holdings', organShortName: 'Baoviet', icbCode2: '8410', type: 'STOCK' },
    { symbol: 'CTG', board: 'HSX', organName: 'VietinBank', organShortName: 'VietinBank', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'DBC', board: 'HSX', organName: 'Dabaco Group JSC', organShortName: 'Dabaco', icbCode2: '8210', type: 'STOCK' },
    { symbol: 'DCM', board: 'HSX', organName: 'PetroVietnam Ca Mau Fertilizer', organShortName: 'DPM Ca Mau', icbCode2: '8220', type: 'STOCK' },
    { symbol: 'DGW', board: 'HSX', organName: 'Dien May Xanh', organShortName: 'Dien May Xanh', icbCode2: '8310', type: 'STOCK' },
    { symbol: 'DPM', board: 'HSX', organName: 'PetroVietnam Fertilizer Corporation', organShortName: 'DPM', icbCode2: '8220', type: 'STOCK' },
    { symbol: 'DRC', board: 'HSX', organName: 'Danang Rubber JSC', organShortName: 'Danang Rubber', icbCode2: '8130', type: 'STOCK' },
    { symbol: 'EIB', board: 'HSX', organName: 'Eximbank', organShortName: 'Eximbank', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'FPT', board: 'HSX', organName: 'FPT Corporation', organShortName: 'FPT', icbCode2: '8120', type: 'STOCK' },
    { symbol: 'GAS', board: 'HSX', organName: 'PV Gas JSC', organShortName: 'PV Gas', icbCode2: '8810', type: 'STOCK' },
    { symbol: 'GVR', board: 'HSX', organName: 'Vietnam Rubber Group', organShortName: 'VRG', icbCode2: '8130', type: 'STOCK' },
    { symbol: 'HDB', board: 'HSX', organName: 'HDBank', organShortName: 'HDBank', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'HPG', board: 'HSX', organName: 'Hoa Phat Group JSC', organShortName: 'Hoa Phat', icbCode2: '8720', type: 'STOCK' },
    { symbol: 'HVH', board: 'HSX', organName: 'Hoa Viet JSC', organShortName: 'Hoa Viet', icbCode2: '8310', type: 'STOCK' },
    { symbol: 'MBB', board: 'HSX', organName: 'MB Bank', organShortName: 'MB Bank', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'MWG', board: 'HSX', organName: 'Mobile World JSC', organShortName: 'MWG', icbCode2: '8310', type: 'STOCK' },
    { symbol: 'NLG', board: 'HSX', organName: 'Nam Long Investment', organShortName: 'Nam Long', icbCode2: '8770', type: 'STOCK' },
    { symbol: 'PDR', board: 'HSX', organName: 'Phat Dat Real Estate', organShortName: 'Phat Dat', icbCode2: '8770', type: 'STOCK' },
    { symbol: 'PNJ', board: 'HSX', organName: 'Phu Nhuan Jewelry JSC', organShortName: 'PNJ', icbCode2: '8310', type: 'STOCK' },
    { symbol: 'POW', board: 'HSX', organName: 'PV Power JSC', organShortName: 'PV Power', icbCode2: '8810', type: 'STOCK' },
    { symbol: 'SAB', board: 'HSX', organName: 'Sabeco', organShortName: 'Sabeco', icbCode2: '8210', type: 'STOCK' },
    { symbol: 'SSI', board: 'HSX', organName: 'Saigon Securities Inc', organShortName: 'SSI', icbCode2: '8600', type: 'STOCK' },
    { symbol: 'STB', board: 'HSX', organName: 'Sacombank', organShortName: 'Sacombank', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'TCB', board: 'HSX', organName: 'Techcombank', organShortName: 'Techcombank', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'VCB', board: 'HSX', organName: 'Vietcombank', organShortName: 'Vietcombank', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'VCI', board: 'HSX', organName: 'Viet Capital Securities', organShortName: 'VCSC', icbCode2: '8600', type: 'STOCK' },
    { symbol: 'VHM', board: 'HSX', organName: 'Vinhomes JSC', organShortName: 'Vinhomes', icbCode2: '8770', type: 'STOCK' },
    { symbol: 'VIC', board: 'HSX', organName: 'Vingroup JSC', organShortName: 'Vingroup', icbCode2: '8770', type: 'STOCK' },
    { symbol: 'VJC', board: 'HSX', organName: 'Vietjet Aviation JSC', organShortName: 'Vietjet', icbCode2: '8310', type: 'STOCK' },
    { symbol: 'VNM', board: 'HSX', organName: 'Vinamilk', organShortName: 'Vinamilk', icbCode2: '8210', type: 'STOCK' },
    { symbol: 'VPB', board: 'HSX', organName: 'VPBank', organShortName: 'VPBank', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'VRE', board: 'HSX', organName: 'Vincom Retail JSC', organShortName: 'Vincom Retail', icbCode2: '8310', type: 'STOCK' },
    // HNX stocks
    { symbol: 'SHB', board: 'HNX', organName: 'Saigon Hanoi Commercial Bank', organShortName: 'SHB', icbCode2: '8350', type: 'STOCK' },
    { symbol: 'PVS', board: 'HNX', organName: 'PV Drilling Services', organShortName: 'PV Drilling', icbCode2: '8810', type: 'STOCK' },
    { symbol: 'PVD', board: 'HNX', organName: 'PV Drilling', organShortName: 'PV Drilling', icbCode2: '8810', type: 'STOCK' },
    // UPCOM stocks
    { symbol: 'AAM', board: 'UPCOM', organName: 'An Phat Bioplastics', organShortName: 'An Phat', icbCode2: '8110', type: 'STOCK' },
    { symbol: 'AAN', board: 'UPCOM', organName: 'An Hai JSC', organShortName: 'An Hai', icbCode2: '8510', type: 'STOCK' },
    { symbol: 'AAT', board: 'UPCOM', organName: 'An Thinh Textile', organShortName: 'An Thinh', icbCode2: '8110', type: 'STOCK' },
    { symbol: 'ABR', board: 'UPCOM', organName: 'An Binh Real Estate', organShortName: 'An Binh', icbCode2: '8770', type: 'STOCK' },
    { symbol: 'ABS', board: 'UPCOM', organName: 'An Binh Securities', organShortName: 'ABS', icbCode2: '8600', type: 'STOCK' },
    { symbol: 'ABT', board: 'UPCOM', organName: 'Anh Tai Feedmill', organShortName: 'Anh Tai', icbCode2: '8210', type: 'STOCK' },
    { symbol: 'ACC', board: 'UPCOM', organName: 'Acc Co Ltd', organShortName: 'ACC', icbCode2: '8710', type: 'STOCK' },
    { symbol: 'ACG', board: 'UPCOM', organName: 'An Cuu Wood', organShortName: 'An Cuu', icbCode2: '8150', type: 'STOCK' },
    { symbol: 'ADG', board: 'UPCOM', organName: 'Adapt Energy', organShortName: 'Adapt', icbCode2: '8810', type: 'STOCK' },
    { symbol: 'AGG', board: 'UPCOM', organName: 'Saigon Real Estate', organShortName: 'Saigon RE', icbCode2: '8770', type: 'STOCK' },
    { symbol: 'APH', board: 'UPCOM', organName: 'APHARO Pharmaceutical', organShortName: 'Apharo', icbCode2: '8510', type: 'STOCK' },
    { symbol: 'ASM', board: 'UPCOM', organName: 'ASM Investment', organShortName: 'ASM', icbCode2: '8770', type: 'STOCK' },
    { symbol: 'ASP', board: 'UPCOM', organName: 'ASP Transport', organShortName: 'ASP', icbCode2: '8310', type: 'STOCK' },
    { symbol: 'BAF', board: 'UPCOM', organName: 'BAF Vietnam Agriculture', organShortName: 'BAF', icbCode2: '8210', type: 'STOCK' },
    { symbol: 'BCG', board: 'UPCOM', organName: 'BCG Real Estate', organShortName: 'BCG', icbCode2: '8770', type: 'STOCK' },
  ]

  return coreStocks.map((s, i) => ({
    id: i + 1,
    sid: `S${String(i + 1).padStart(6, '0')}`,
    symbol: s.symbol,
    type: s.type,
    board: s.board,
    organName: s.organName,
    organShortName: s.organShortName,
    icbCode2: s.icbCode2,
    productGrpID: s.type === 'STOCK' ? 1 : s.type === 'ETF' ? 2 : s.type === 'CW' ? 3 : 4,
  }))
}

function generateMockPrices(symbols) {
  const prices = {}
  for (const sym of symbols) {
    if (sym.type !== 'STOCK' && sym.type !== 'ETF') continue
    const basePrice = 10 + Math.random() * 100
    const ref = +basePrice.toFixed(2)
    const cl = +(ref * 1.1).toFixed(2)
    const fl = +(ref * 0.9).toFixed(2)
    const lp = +(ref + (Math.random() - 0.5) * ref * 0.1).toFixed(2)
    prices[sym.symbol] = {
      co: cl.toString(),
      s: 'ATO',
      cei: '0',
      flo: fl.toString(),
      ref: ref.toString(),
      c: lp.toString(),
      vo: String(Math.floor(Math.random() * 1000000) * 100),
      va: String(Math.floor(Math.random() * 50000000)),
      bp1: (lp - ref * 0.01).toFixed(2),
      bv1: String(Math.floor(Math.random() * 100000) * 100),
      bp2: (lp - ref * 0.02).toFixed(2),
      bv2: String(Math.floor(Math.random() * 100000) * 100),
      bp3: (lp - ref * 0.03).toFixed(2),
      bv3: String(Math.floor(Math.random() * 100000) * 100),
      ap1: (lp + ref * 0.01).toFixed(2),
      av1: String(Math.floor(Math.random() * 100000) * 100),
      ap2: (lp + ref * 0.02).toFixed(2),
      av2: String(Math.floor(Math.random() * 100000) * 100),
      ap3: (lp + ref * 0.03).toFixed(2),
      av3: String(Math.floor(Math.random() * 100000) * 100),
      frbv: String(Math.floor(Math.random() * 50000) * 100),
      frsv: String(Math.floor(Math.random() * 50000) * 100),
      orgn: sym.organName,
      enorgn: sym.organShortName,
      bo: String(Math.floor(Math.random() * 5000)),
      bc: String(Math.floor(Math.random() * 2000)),
      ac: String(Math.floor(Math.random() * 2000)),
      st: 'ATO',
      lsh: '100',
    }
  }
  return prices
}

function generateMockIndexConfig() {
  return [
    { boardPriority: 1, columnNumber: 1, enBoardName: 'HOSE', enIndexName: 'VN-Index', group: 'MAIN', indexMapping: 'VNINDEX', isOddLot: false, isPutThrough: false, platform: 'HSX', type: 'INDEX', viBoardName: 'HOSE', viIndexName: 'VN-Index' },
    { boardPriority: 2, columnNumber: 2, enBoardName: 'HOSE', enIndexName: 'VN30', group: 'MAIN', indexMapping: 'VN30', isOddLot: false, isPutThrough: false, platform: 'HSX', type: 'INDEX', viBoardName: 'HOSE', viIndexName: 'VN30' },
    { boardPriority: 3, columnNumber: 3, enBoardName: 'HNX', enIndexName: 'HNX-Index', group: 'MAIN', indexMapping: 'HNXINDEX', isOddLot: false, isPutThrough: false, platform: 'HNX', type: 'INDEX', viBoardName: 'HNX', viIndexName: 'HNX-Index' },
    { boardPriority: 4, columnNumber: 4, enBoardName: 'HNX', enIndexName: 'HNX30', group: 'MAIN', indexMapping: 'HNX30', isOddLot: false, isPutThrough: false, platform: 'HNX', type: 'INDEX', viBoardName: 'HNX', viIndexName: 'HNX30' },
    { boardPriority: 5, columnNumber: 5, enBoardName: 'UPCOM', enIndexName: 'UPCOM', group: 'MAIN', indexMapping: 'UPCOMINDEX', isOddLot: false, isPutThrough: false, platform: 'UPCOM', type: 'INDEX', viBoardName: 'UPCOM', viIndexName: 'UPCOM' },
    { boardPriority: 6, columnNumber: 6, enBoardName: 'HOSE', enIndexName: 'VN100', group: 'MAIN', indexMapping: 'VN100', isOddLot: false, isPutThrough: false, platform: 'HSX', type: 'INDEX', viBoardName: 'HOSE', viIndexName: 'VN100' },
  ]
}

function generateMockSectors() {
  return [
    { icbCode: '8300', icbName: 'Bán lẻ', icbNameEn: 'Retail', level: 2, parentIcbCode: '53' },
    { icbCode: '8350', icbName: 'Ngân hàng', icbNameEn: 'Banks', level: 2, parentIcbCode: '83' },
    { icbCode: '8770', icbName: 'Bất động sản', icbNameEn: 'Real Estate', level: 2, parentIcbCode: '87' },
    { icbCode: '8210', icbName: 'Thực phẩm', icbNameEn: 'Food Products', level: 2, parentIcbCode: '35' },
    { icbCode: '8120', icbName: 'Công nghệ', icbNameEn: 'Technology', level: 2, parentIcbCode: '95' },
    { icbCode: '8600', icbName: 'Chứng khoán', icbNameEn: 'Securities', level: 2, parentIcbCode: '40' },
    { icbCode: '8720', icbName: 'Thép', icbNameEn: 'Steel', level: 2, parentIcbCode: '17' },
    { icbCode: '8810', icbName: 'Năng lượng', icbNameEn: 'Energy', level: 2, parentIcbCode: '75' },
    { icbCode: '8510', icbName: 'Dược phẩm', icbNameEn: 'Pharmaceuticals', level: 2, parentIcbCode: '35' },
    { icbCode: '8410', icbName: 'Bảo hiểm', icbNameEn: 'Insurance', level: 2, parentIcbCode: '40' },
    { icbCode: '8310', icbName: 'Vận tải', icbNameEn: 'Transportation', level: 2, parentIcbCode: '60' },
    { icbCode: '8220', icbName: 'Hóa chất', icbNameEn: 'Chemicals', level: 2, parentIcbCode: '13' },
    { icbCode: '8130', icbName: 'Cao su', icbNameEn: 'Rubber', level: 2, parentIcbCode: '15' },
    { icbCode: '8140', icbName: 'Thủy sản', icbNameEn: 'Seafood', level: 2, parentIcbCode: '35' },
    { icbCode: '8110', icbName: 'Dệt may', icbNameEn: 'Textiles', level: 2, parentIcbCode: '35' },
    { icbCode: '8710', icbName: 'Vật liệu', icbNameEn: 'Materials', level: 2, parentIcbCode: '13' },
    { icbCode: '8150', icbName: 'Gỗ', icbNameEn: 'Wood', level: 2, parentIcbCode: '16' },
  ]
}

function generateMockBonds() {
  return [
    { symbol: 'VBH2224001', board: 'BOND', type: 'BOND', organName: 'Vietcombank' },
    { symbol: 'BID2224001', board: 'BOND', type: 'BOND', organName: 'BIDV' },
    { symbol: 'CTG2224001', board: 'BOND', type: 'BOND', organName: 'VietinBank' },
  ]
}

let cachedSymbols = null

async function tryFetchAPI() {
  try {
    console.log('Attempting to fetch from Vietcap API...')
    const symbols = await fetchJSON(`${API_BASE}/api/price/symbols/getAll`)
    console.log(`  ✅ API accessible: ${symbols.length} symbols`)
    cachedSymbols = symbols
    return true
  } catch (err) {
    console.log(`  ⚠️ API not accessible: ${err.message}`)
    console.log('  → Generating mock data matching Vietcap API format')
    return false
  }
}

async function syncSymbols() {
  console.log('Syncing symbols...')
  const apiAvailable = await tryFetchAPI()
  
  if (apiAvailable && cachedSymbols) {
    writeFileSync(join(OUT, 'symbols.json'), JSON.stringify(cachedSymbols, null, 2))
    console.log(`  → ${cachedSymbols.length} symbols from API`)
    return cachedSymbols
  }
  
  const mockData = generateMockSymbols()
  writeFileSync(join(OUT, 'symbols.json'), JSON.stringify(mockData, null, 2))
  console.log(`  → ${mockData.length} mock symbols`)
  return mockData
}

async function syncPrices(symbols) {
  console.log('Syncing prices...')
  
  if (cachedSymbols) {
    const symbolsToFetch = symbols
      .filter(s => s.type === 'STOCK' || s.type === 'ETF')
      .map(s => s.symbol)
    
    const chunks = []
    for (let i = 0; i < symbolsToFetch.length; i += 100) {
      chunks.push(symbolsToFetch.slice(i, i + 100))
    }
    
    const allPrices = {}
    for (const chunk of chunks) {
      try {
        const data = await fetchJSON(`${API_BASE}/api/price/v1/w/priceboard/tickers/price`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols: chunk }),
        })
        if (data && typeof data === 'object') Object.assign(allPrices, data)
      } catch (err) {
        console.warn(`  ⚠️ Price fetch failed for chunk: ${err.message}`)
      }
    }
    writeFileSync(join(OUT, 'prices.json'), JSON.stringify(allPrices, null, 2))
    console.log(`  → ${Object.keys(allPrices).length} prices from API`)
    return allPrices
  }
  
  const mockPrices = generateMockPrices(symbols)
  writeFileSync(join(OUT, 'prices.json'), JSON.stringify(mockPrices, null, 2))
  console.log(`  → ${Object.keys(mockPrices).length} mock prices`)
  return mockPrices
}

async function syncIndexConfig() {
  console.log('Syncing index config...')
  const mockData = generateMockIndexConfig()
  writeFileSync(join(OUT, 'index-config.json'), JSON.stringify(mockData, null, 2))
  console.log(`  → ${mockData.length} index configs`)
  return mockData
}

async function syncSectors() {
  console.log('Syncing sectors...')
  const mockData = generateMockSectors()
  writeFileSync(join(OUT, 'sectors.json'), JSON.stringify(mockData, null, 2))
  console.log(`  → ${mockData.length} sectors`)
  return mockData
}

async function syncBonds() {
  console.log('Syncing bonds...')
  const mockData = generateMockBonds()
  writeFileSync(join(OUT, 'bonds.json'), JSON.stringify(mockData, null, 2))
  console.log(`  → ${mockData.length} bonds`)
  return mockData
}

async function syncCoveredWarrants() {
  console.log('Syncing covered warrants...')
  
  if (cachedSymbols) {
    try {
      const data = await fetchJSON(`${API_BASE}/api/price/v1/w/priceboard/tickers/price/group`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: 'CW' }),
      })
      if (Array.isArray(data)) {
        writeFileSync(join(OUT, 'covered-warrants.json'), JSON.stringify(data, null, 2))
        console.log(`  → ${data.length} CW from API`)
        return data
      }
    } catch (err) {
      console.warn(`  ⚠️ CW API failed: ${err.message}, using cached data`)
    }
  }
  
  // Use cached real data if available
  try {
    const cached = JSON.parse(readFileSync(join(OUT, 'cw-raw.json'), 'utf-8'))
    writeFileSync(join(OUT, 'covered-warrants.json'), JSON.stringify(cached, null, 2))
    console.log(`  → ${cached.length} CW from cache`)
    return cached
  } catch {
    // Generate mock CW data
    const mockCW = generateMockCoveredWarrants()
    writeFileSync(join(OUT, 'covered-warrants.json'), JSON.stringify(mockCW, null, 2))
    console.log(`  → ${mockCW.length} mock CW`)
    return mockCW
  }
}

function generateMockCoveredWarrants() {
  const underlying = ['ACB', 'FPT', 'HPG', 'MBB', 'STB', 'TCB', 'TPB', 'VCB', 'VHM', 'VIC', 'VPB']
  const issuers = ['SSI', 'ACBS', 'TCBS', 'HSC', 'VPBS', 'PHS', 'VNDS']
  const cw = []
  let id = 1
  
  for (const ul of underlying) {
    for (let i = 0; i < 5; i++) {
      const issuer = issuers[Math.floor(Math.random() * issuers.length)]
      const isCall = Math.random() > 0.3
      const ref = 500 + Math.floor(Math.random() * 2000)
      const cei = Math.floor(ref * 1.3)
      const flo = Math.floor(ref * 0.5)
      const lp = ref + Math.floor((Math.random() - 0.5) * ref * 0.2)
      
      cw.push({
        co: `VN0C${ul}${String(id).padStart(5, '0')}`,
        s: `C${ul}${String(2500 + i).padStart(4, '0')}`,
        cei,
        flo,
        ref,
        c: lp,
        mv: Math.floor(Math.random() * 100000),
        h: lp + Math.floor(Math.random() * 100),
        l: lp - Math.floor(Math.random() * 100),
        frbv: 0,
        frsv: 0,
        vo: Math.floor(Math.random() * 500000) * 100,
        va: +(Math.random() * 500).toFixed(3),
        trsttc: '20',
        trsttg: '2',
        orgn: `Chứng quyền ${ul}/${isCall ? 'Call' : 'Put'}/${issuer}/EU/Cash/10M`,
        enorgn: `CW ${ul}/${isCall ? 'Call' : 'Put'}/${issuer}`,
        sbc: 10000000,
        sbref: ref,
        sbflo: flo,
        sbcei: cei,
        bp1: lp - 10,
        bv1: Math.floor(Math.random() * 50000),
        bp2: lp - 20,
        bv2: Math.floor(Math.random() * 50000),
        bp3: lp - 30,
        bv3: Math.floor(Math.random() * 50000),
        ap1: lp + 10,
        av1: Math.floor(Math.random() * 50000),
        ap2: lp + 20,
        av2: Math.floor(Math.random() * 50000),
        ap3: lp + 30,
        av3: Math.floor(Math.random() * 50000),
        bo: 'HSX',
        in: issuer,
        udls: ul,
        exp: 10000 + Math.floor(Math.random() * 20000),
        exr: `${(1 + Math.floor(Math.random() * 4)).toFixed(1)}:1`,
        md: '20271231',
        ltrdd: '20271228',
        lsh: 10000000,
        op: lp,
        st: 'CW',
      })
      id++
    }
  }
  return cw
}

async function main() {
  mkdirSync(OUT, { recursive: true })
  
  const [symbols, indexConfig, sectors, bonds, coveredWarrants] = await Promise.all([
    syncSymbols(),
    syncIndexConfig(),
    syncSectors(),
    syncBonds(),
    syncCoveredWarrants(),
  ])
  
  const prices = await syncPrices(symbols)
  
  const manifest = {
    syncedAt: new Date().toISOString(),
    version: '1.0.0',
    source: cachedSymbols ? 'api' : 'mock',
    counts: {
      symbols: Array.isArray(symbols) ? symbols.length : 0,
      prices: Object.keys(prices).length,
      indexConfig: Array.isArray(indexConfig) ? indexConfig.length : 0,
      sectors: Array.isArray(sectors) ? sectors.length : 0,
      bonds: Array.isArray(bonds) ? bonds.length : 0,
      coveredWarrants: Array.isArray(coveredWarrants) ? coveredWarrants.length : 0,
    },
  }
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))
  
  console.log('\n✅ Sync complete!')
  console.log(`   Symbols: ${manifest.counts.symbols}`)
  console.log(`   Prices: ${manifest.counts.prices}`)
  console.log(`   Index configs: ${manifest.counts.indexConfig}`)
  console.log(`   Sectors: ${manifest.counts.sectors}`)
  console.log(`   Bonds: ${manifest.counts.bonds}`)
  console.log(`   Covered Warrants: ${manifest.counts.coveredWarrants}`)
}

main().catch(err => {
  console.error('❌ Sync failed:', err.message)
  process.exit(1)
})
