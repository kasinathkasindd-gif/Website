const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [,, inp, out, scaleArg] = process.argv;
  const svg = fs.readFileSync(inp, 'utf8');
  const m = svg.match(/width="(\d+)" height="(\d+)"/);
  const w = +m[1], h = +m[2];
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: +(scaleArg || 1) });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  await browser.close();
  console.log('rendered', out);
})();
