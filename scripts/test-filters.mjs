import { chromium } from 'playwright';

const urls = [
  { group: 'HOSE', value: 'VNMidCap', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNMidCap' },
  { group: 'HOSE', value: 'VNSmallCap', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNSmallCap' },
  { group: 'HOSE', value: 'VNAllShare', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNAllShare' },
  { group: 'HOSE', value: 'VNDiamond', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNDiamond' },
  { group: 'HOSE', value: 'VNFinLead', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNFinLead' },
  { group: 'HOSE', value: 'VNFinSelect', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNFinSelect' },
  { group: 'HOSE', value: 'VNDividend', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNDividend' },
  { group: 'HOSE', value: 'VNMiTech', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNMiTech' },
  { group: 'HOSE', value: 'GDTT_HOSE', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=GDTT_HOSE' },
  { group: 'HOSE', value: 'ODD_LOT_HOSE', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=ODD_LOT_HOSE' },
  { group: 'HOSE', value: 'VN50_Growth', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VN50_Growth' },
  { group: 'HOSE', value: 'VNFin', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNFin' },
  { group: 'HOSE', value: 'VNInd', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNInd' },
  { group: 'HOSE', value: 'VNMat', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNMat' },
  { group: 'HOSE', value: 'VNReal', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNReal' },
  { group: 'HOSE', value: 'VNCons', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNCons' },
  { group: 'HOSE', value: 'VNEne', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNEne' },
  { group: 'HOSE', value: 'VNHeal', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNHeal' },
  { group: 'HOSE', value: 'VNUti', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNUti' },
  { group: 'HOSE', value: 'VNXAllShare', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=HOSE&filter-value=VNXAllShare' },
  { group: 'BOND', value: 'BOND_PRIVATE', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=BOND&filter-value=BOND_PRIVATE' },
  { group: 'BOND', value: 'PRIVATE_BOND', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=BOND&filter-value=PRIVATE_BOND' },
  { group: 'BOND', value: 'BOND_LISTED', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=BOND&filter-value=BOND_LISTED' },
  { group: 'BOND', value: 'LISTED_BOND', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=BOND&filter-value=LISTED_BOND' },
  { group: 'DERIVATIVE', value: 'INDEX_FU', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=DERIVATIVE&filter-value=INDEX_FU' },
  { group: 'DERIVATIVE', value: 'BOND_FU', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=DERIVATIVE&filter-value=BOND_FU' },
  { group: 'DERIVATIVE', value: 'GDTT_DERIVATIVE', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=DERIVATIVE&filter-value=GDTT_DERIVATIVE' },
  { group: 'SECTOR', value: 'ALL', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=SECTOR&filter-value=ALL' },
  { group: 'SECTOR', value: '8810', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=SECTOR&filter-value=8810' },
  { group: 'SECTOR', value: '8220', url: 'https://trading.vietcap.com.vn/priceboard?filter-group=SECTOR&filter-value=8220' },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const results = [];

  for (let i = 0; i < urls.length; i++) {
    const { group, value, url } = urls[i];
    const page = await context.newPage();
    
    let apiRowCount = null;
    let apiEndpoint = '';
    
    page.on('response', async (response) => {
      const reqUrl = response.url();
      if (reqUrl.includes('priceboard/tickers/price')) {
        try {
          const body = await response.text();
          const json = JSON.parse(body);
          if (Array.isArray(json)) {
            apiRowCount = json.length;
            apiEndpoint = reqUrl.replace('https://trading.vietcap.com.vn', '');
          }
        } catch(e) {}
      }
    });

    try {
      console.error(`[${i + 1}/${urls.length}] ${group}/${value}...`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(6000);

      const domCount = await page.evaluate(() => {
        const allRows = document.querySelectorAll('[role="row"]');
        let dataRows = 0;
        for (const row of allRows) {
          if (row.querySelector('[role="gridcell"]')) dataRows++;
        }
        return dataRows;
      });

      const noData = await page.evaluate(() => {
        return document.body.innerText.includes('Không có dữ liệu');
      });

      results.push({ group, value, apiCount: apiRowCount, domCount, noData, apiEndpoint });
      console.error(`  -> API: ${apiRowCount ?? 'N/A'}, DOM: ${domCount}, NoData: ${noData}`);
    } catch (err) {
      results.push({ group, value, apiCount: null, domCount: 0, noData: true, apiEndpoint: `ERROR: ${err.message.split('\n')[0]}` });
      console.error(`  -> ERROR: ${err.message.split('\n')[0]}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Print results
  console.log('\n' + '='.repeat(115));
  console.log('VIETCAP PRICEBOARD FILTER TEST RESULTS');
  console.log('Test Date: ' + new Date().toISOString());
  console.log('Market Status: CLOSED (weekend) — stock price data unavailable; only structural/sector data returns');
  console.log('='.repeat(115));
  console.log(`${'#'.padStart(3)} | ${'Group'.padEnd(12)} | ${'Filter Value'.padEnd(20)} | ${'API Rows'.padStart(8)} | ${'DOM Rows'.padStart(8)} | ${'No Data?'.padEnd(9)} | API Endpoint`);
  console.log('-'.repeat(115));
  
  let currentGroup = '';
  for (let i = 0; i < results.length; i++) {
    const { group, value, apiCount, domCount, noData, apiEndpoint } = results[i];
    if (group !== currentGroup) {
      if (currentGroup !== '') console.log('·'.repeat(115));
      currentGroup = group;
    }
    const apiStr = apiCount === null ? 'N/A' : String(apiCount);
    const domStr = String(domCount);
    const ndStr = noData ? 'YES' : 'no';
    const ep = apiEndpoint || '(none)';
    console.log(`${String(i + 1).padStart(3)} | ${group.padEnd(12)} | ${value.padEnd(20)} | ${apiStr.padStart(8)} | ${domStr.padStart(8)} | ${ndStr.padEnd(9)} | ${ep}`);
  }
  console.log('='.repeat(115));

  // Summary by group
  console.log('\nSUMMARY BY GROUP:');
  const groups = [...new Set(results.map(r => r.group))];
  for (const g of groups) {
    const items = results.filter(r => r.group === g);
    const apiCounts = items.map(r => r.apiCount).filter(c => c !== null);
    const total = apiCounts.reduce((a, b) => a + b, 0);
    const nonEmpty = apiCounts.filter(c => c > 0).length;
    console.log(`  ${g.padEnd(12)}: ${items.length} filters, ${nonEmpty} with data, total API rows: ${total}`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
