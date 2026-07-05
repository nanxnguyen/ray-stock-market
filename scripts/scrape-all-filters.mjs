#!/usr/bin/env node
/**
 * scripts/scrape-all-filters.mjs
 *
 * Scrape Vietcap priceboard data for each filter option.
 * - Uses col-id based extraction from ag-grid
 * - Saves progress after each filter (resume on crash)
 * - Retries failed filters up to 3 times
 * - Builds prices.json with deduped stock data
 *
 * Usage:
 *   node scripts/scrape-all-filters.mjs              # scrape all filters
 *   node scripts/scrape-all-filters.mjs --resume      # skip already-scraped filters
 *   node scripts/scrape-all-filters.mjs --filter HOSE  # scrape only one filter
 */
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'src', 'data', 'generated')

// CLI args
const args = process.argv.slice(2)
const RESUME = args.includes('--resume')
const filterArg = args.find(a => !a.startsWith('--'))
const MAX_RETRIES = 3

// Load filter options
const filterOpts = JSON.parse(readFileSync(join(OUT, 'filter-options.json'), 'utf8'))
const FILTER_OPTIONS = []
for (const group of filterOpts.groups) {
  if (group.options.length > 0) {
    for (const opt of group.options) {
      FILTER_OPTIONS.push({ group: group.id, value: opt.value, label: opt.label })
    }
  } else {
    FILTER_OPTIONS.push({ group: group.id, value: group.id, label: group.label })
  }
}

const filtersToScrape = filterArg
  ? FILTER_OPTIONS.filter(f => f.value === filterArg || f.group === filterArg)
  : FILTER_OPTIONS

console.log(`Found ${FILTER_OPTIONS.length} total filters, scraping ${filtersToScrape.length}`)

// Load existing progress if resuming
const progressPath = join(OUT, 'vietcap-filter-data.json')
let allData = {}
if (RESUME && existsSync(progressPath)) {
  allData = JSON.parse(readFileSync(progressPath, 'utf8'))
  const already = Object.keys(allData).filter(k => allData[k]?.length > 0).length
  console.log(`Resuming: ${already} filters already scraped`)
}

// col-id mapping from Vietcap ag-grid
const COL_MAP = [
  'ceilingPrice', 'referencePrice', 'floorPrice',
  'bidAskData.bidPrice_3', 'bidAskData.bidVolume_3',
  'bidAskData.bidPrice_2', 'bidAskData.bidVolume_2',
  'bidAskData.bidPrice_1', 'bidAskData.bidVolume_1',
  'matchPrice', 'matchVolume', 'rate', 'tradingVolume',
  'bidAskData.askPrice_1', 'bidAskData.askVolume_1',
  'bidAskData.askPrice_2', 'bidAskData.askVolume_2',
  'bidAskData.askPrice_3', 'bidAskData.askVolume_3',
  'high', 'averagePrice', 'low',
  'foreignerBuyVolume', 'foreignerSellVolume',
]

function parseNum(s) {
  if (!s || s === '') return 0
  return parseFloat(s.replace(/,/g, '')) || 0
}

async function extractData(page) {
  return await page.evaluate((colMap) => {
    const rows = document.querySelectorAll('[role="row"]')
    const symbols = []
    const priceData = []

    for (const row of rows) {
      const cells = row.querySelectorAll('[role="gridcell"]')
      if (cells.length === 1) {
        symbols.push(cells[0].textContent.trim())
      } else if (cells.length > 10) {
        const rowData = {}
        for (const cell of cells) {
          const colId = cell.getAttribute('col-id')
          if (colId) {
            rowData[colId] = cell.textContent.trim()
          }
        }
        priceData.push(rowData)
      }
    }

    const result = []
    for (let i = 0; i < Math.min(symbols.length, priceData.length); i++) {
      const d = priceData[i]
      result.push({
        symbol: symbols[i],
        ceil: d['ceilingPrice'] || '',
        tc: d['referencePrice'] || '',
        floor: d['floorPrice'] || '',
        b3p: d['bidAskData.bidPrice_3'] || '',
        b3q: d['bidAskData.bidVolume_3'] || '',
        b2p: d['bidAskData.bidPrice_2'] || '',
        b2q: d['bidAskData.bidVolume_2'] || '',
        b1p: d['bidAskData.bidPrice_1'] || '',
        b1q: d['bidAskData.bidVolume_1'] || '',
        lp: d['matchPrice'] || '',
        lq: d['matchVolume'] || '',
        pct: d['rate'] || '',
        tvol: d['tradingVolume'] || '',
        a1p: d['bidAskData.askPrice_1'] || '',
        a1q: d['bidAskData.askVolume_1'] || '',
        a2p: d['bidAskData.askPrice_2'] || '',
        a2q: d['bidAskData.askVolume_2'] || '',
        a3p: d['bidAskData.askPrice_3'] || '',
        a3q: d['bidAskData.askVolume_3'] || '',
        hi: d['high'] || '',
        avg: d['averagePrice'] || '',
        lo: d['low'] || '',
        fbuy: d['foreignerBuyVolume'] || '',
        fsell: d['foreignerSellVolume'] || '',
      })
    }

    return result
  }, COL_MAP)
}

function buildPrices(allData) {
  const prices = []
  for (const stocks of Object.values(allData)) {
    for (const s of stocks) {
      prices.push({
        symbol: s.symbol,
        ceil: parseNum(s.ceil),
        ref: parseNum(s.tc),
        floor: parseNum(s.floor),
        match: parseNum(s.lp),
        matchVol: parseNum(s.lq),
        high: parseNum(s.hi),
        low: parseNum(s.lo),
        open: 0,
        avg: parseNum(s.avg),
        volume: parseNum(s.lq),
        value: parseNum(s.tvol),
        foreignBuyVol: parseNum(s.fbuy),
        foreignSellVol: parseNum(s.fsell),
        bid1: parseNum(s.b1p),
        bidVol1: parseNum(s.b1q),
        bid2: parseNum(s.b2p),
        bidVol2: parseNum(s.b2q),
        bid3: parseNum(s.b3p),
        bidVol3: parseNum(s.b3q),
        ask1: parseNum(s.a1p),
        askVol1: parseNum(s.a1q),
        ask2: parseNum(s.a2p),
        askVol2: parseNum(s.a2q),
        ask3: parseNum(s.a3p),
        askVol3: parseNum(s.a3q),
      })
    }
  }

  const seen = new Set()
  const unique = []
  for (const p of prices) {
    if (!seen.has(p.symbol)) {
      seen.add(p.symbol)
      unique.push(p)
    }
  }
  return unique
}

async function scrapeFilter(page, option, retryCount = 0) {
  const url = `https://trading.vietcap.com.vn/priceboard?filter-group=${option.group}&filter-value=${option.value}`

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(4000)
    const data = await extractData(page)
    return data
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`  Retry ${retryCount + 1}/${MAX_RETRIES}...`)
      await page.waitForTimeout(2000)
      return scrapeFilter(page, option, retryCount + 1)
    }
    throw error
  }
}

async function main() {
  console.log('Starting Vietcap filter scraping...')

  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  const page = await context.newPage()

  let totalRows = 0
  let scraped = 0

  for (const option of filtersToScrape) {
    // Skip if already scraped and resuming
    if (RESUME && allData[option.value]?.length > 0) {
      totalRows += allData[option.value].length
      scraped++
      continue
    }

    console.log(`[${scraped + 1}/${filtersToScrape.length}] ${option.label} (${option.value})...`)

    try {
      const data = await scrapeFilter(page, option)
      allData[option.value] = data
      totalRows += data.length
      scraped++
      console.log(`  → ${data.length} rows`)

      // Save progress after each filter
      writeFileSync(join(OUT, 'vietcap-filter-data.json'), JSON.stringify(allData, null, 2))
    } catch (error) {
      console.error(`  FAILED after ${MAX_RETRIES} retries: ${error.message}`)
      allData[option.value] = []
    }
  }

  await browser.close()

  // Build and save prices.json
  const uniquePrices = buildPrices(allData)
  writeFileSync(join(OUT, 'prices.json'), JSON.stringify(uniquePrices, null, 2))

  console.log(`\nDone!`)
  console.log(`  Filter data: ${totalRows} rows across ${scraped} filters`)
  console.log(`  prices.json: ${uniquePrices.length} unique stocks`)
}

main().catch(console.error)
