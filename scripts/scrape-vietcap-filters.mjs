#!/usr/bin/env node
// scripts/scrape-vietcap-filters.mjs
// Scrapes Vietcap priceboard data for each filter option using Playwright
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'src', 'data', 'generated')

// Filter options to scrape
const FILTER_OPTIONS = [
  // HOSE
  { group: 'HOSE', value: 'HOSE', label: 'HOSE' },
  { group: 'HOSE', value: 'VN30', label: 'VN30' },
  { group: 'HOSE', value: 'VN100', label: 'VN100' },
  { group: 'HOSE', value: 'VNMidCap', label: 'VNMidCap' },
  { group: 'HOSE', value: 'VNSmallCap', label: 'VNSmallCap' },
  { group: 'HOSE', value: 'VNAllShare', label: 'VNAllShare' },
  { group: 'HOSE', value: 'VNDiamond', label: 'VNDiamond' },
  { group: 'HOSE', value: 'VNFinLead', label: 'VNFinLead' },
  { group: 'HOSE', value: 'VNFinSelect', label: 'VNFinSelect' },
  { group: 'HOSE', value: 'VNDividend', label: 'VNDividend' },
  { group: 'HOSE', value: 'VNMiTech', label: 'VNMiTech' },
  { group: 'HOSE', value: 'ETF', label: 'ETF' },
  { group: 'HOSE', value: 'GDTT_HOSE', label: 'GDTT HOSE' },
  { group: 'HOSE', value: 'ODD_LOT_HOSE', label: 'Lô lẻ HOSE' },
  { group: 'HOSE', value: 'VN50_Growth', label: 'VN50 Growth' },
  { group: 'HOSE', value: 'VNFin', label: 'VNFin' },
  { group: 'HOSE', value: 'VNInd', label: 'VNInd' },
  { group: 'HOSE', value: 'VNMat', label: 'VNMat' },
  { group: 'HOSE', value: 'VNIT', label: 'VNIT' },
  { group: 'HOSE', value: 'VNReal', label: 'VNReal' },
  { group: 'HOSE', value: 'VNCons', label: 'VNCons' },
  { group: 'HOSE', value: 'VNEne', label: 'VNEne' },
  { group: 'HOSE', value: 'VNHeal', label: 'VNHeal' },
  { group: 'HOSE', value: 'VNSI', label: 'VNSI' },
  { group: 'HOSE', value: 'VNUti', label: 'VNUti' },
  { group: 'HOSE', value: 'VNX50', label: 'VNX50' },
  { group: 'HOSE', value: 'VNXAllShare', label: 'VNXAllShare' },
  // HNX
  { group: 'HNX', value: 'HNX', label: 'HNX' },
  { group: 'HNX', value: 'HNX30', label: 'HNX30' },
  { group: 'HNX', value: 'HNXCon', label: 'HNXCon' },
  { group: 'HNX', value: 'HNXFin', label: 'HNXFin' },
  { group: 'HNX', value: 'HNXLCap', label: 'HNXLCap' },
  { group: 'HNX', value: 'HNXMSCap', label: 'HNXMSCap' },
  { group: 'HNX', value: 'HNXMan', label: 'HNXMan' },
  { group: 'HNX', value: 'GDTT_HNX', label: 'GDTT HNX' },
  { group: 'HNX', value: 'ODD_LOT_HNX', label: 'Lô lẻ HNX' },
  // UPCOM
  { group: 'UPCOM', value: 'UPCOM', label: 'UPCOM' },
  { group: 'UPCOM', value: 'GDTT_UPCOM', label: 'GDTT UPCOM' },
  { group: 'UPCOM', value: 'ODD_LOT_UPCOM', label: 'Lô lẻ UPCOM' },
  // Phái Sinh
  { group: 'DERIVATIVE', value: 'INDEX_FU', label: 'HĐTL chỉ số' },
  { group: 'DERIVATIVE', value: 'BOND_FU', label: 'HĐTL TPCP' },
  { group: 'DERIVATIVE', value: 'GDTT_DERIVATIVE', label: 'GDTT Phái sinh' },
  // Chứng Quyền
  { group: 'CW', value: 'CW', label: 'Chứng Quyền' },
  // Trái phiếu
  { group: 'BOND', value: 'BOND_PRIVATE', label: 'TP riêng lẻ' },
  { group: 'BOND', value: 'BOND_LISTED', label: 'TP niêm yết' },
]

// Scrape function will be injected via Playwright
const SCRAPE_FUNCTION = `
  async () => {
    // Wait for table to load
    await new Promise(r => setTimeout(r, 2000));
    
    // Get all rows from the table
    const rows = [];
    const tableRows = document.querySelectorAll('tr[class*="row"]');
    
    for (const row of tableRows) {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        const rowData = [];
        for (const cell of cells) {
          rowData.push(cell.textContent.trim());
        }
        rows.push(rowData);
      }
    }
    
    return rows;
  }
`

async function scrapeFilterOption(page, option) {
  const url = `https://trading.vietcap.com.vn/priceboard?filter-group=${option.group}&filter-value=${option.value}`;
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for data to load
    
    // Extract data from table
    const data = await page.evaluate(async () => {
      await new Promise(r => setTimeout(r, 2000));
      
      const rows = [];
      const tableRows = document.querySelectorAll('tr');
      
      for (const row of tableRows) {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
          const rowData = [];
          for (const cell of cells) {
            rowData.push(cell.textContent.trim());
          }
          rows.push(rowData);
        }
      }
      
      return rows;
    });
    
    return data;
  } catch (error) {
    console.error(`Error scraping ${option.label}: ${error.message}`);
    return [];
  }
}

async function main() {
  console.log('Starting Vietcap filter scraping...');
  
  // Dynamic import for Playwright
  const { chromium } = await import('playwright');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const allData = {};
  
  for (const option of FILTER_OPTIONS) {
    console.log(`Scraping ${option.label} (${option.group}/${option.value})...`);
    
    const data = await scrapeFilterOption(page, option);
    allData[option.value] = data;
    
    console.log(`  → ${data.length} rows`);
  }
  
  await browser.close();
  
  // Save all scraped data
  writeFileSync(join(OUT, 'vietcap-filter-data.json'), JSON.stringify(allData, null, 2));
  console.log(`\nAll data saved to vietcap-filter-data.json`);
}

main().catch(console.error);
