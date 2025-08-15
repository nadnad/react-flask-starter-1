const { chromium } = require('playwright');

async function checkMaterialUIHeading() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://react-flask-starter-1.dev.nadnad.shipyard.host/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check for the "Use Material-UI components" heading
    const heading = await page.locator('h1, h2, h3, h4, h5, h6').filter({ hasText: 'Use Material-UI components' }).first();
    
    if (await heading.count() > 0) {
      console.log('✅ Found "Use Material-UI components" heading');
      console.log('Heading text:', await heading.textContent());
      console.log('Heading tag:', await heading.evaluate(el => el.tagName));
    } else {
      console.log('❌ "Use Material-UI components" heading not found');
      
      // Let's see what headings are actually on the page
      const allHeadings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      console.log('\nAll headings found on the page:');
      for (const h of allHeadings) {
        const text = await h.textContent();
        const tag = await h.evaluate(el => el.tagName);
        console.log(`${tag}: ${text}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkMaterialUIHeading();