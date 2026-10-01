const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.TEST_BASE_URL, { waitUntil: 'networkidle' });
    await page.getByTestId('button-continue').click();
    await page.getByTestId('error-first-name').waitFor();
    for (const [field, value] of Object.entries({
      'first-name': 'Flow',
      'last-name': 'Tester',
      phone: '3055550199',
      email: 'flow-test@example.com',
      'confirm-email': 'flow-test@example.com',
      company: 'Test Trucking',
    })) {
      await page.getByTestId(`input-${field}`).fill(value);
    }
    await page.getByTestId('checkbox-terms').click();
    await page.getByTestId('button-continue').click();
    await page.getByTestId('location-selection-page').waitFor();
    await page.getByTestId('select-state').click();
    await page.getByRole('option', { name: 'Florida', exact: true }).click();
    await page.locator('[data-testid^="location-card-"]').first().click();
    await page.getByTestId('button-continue').click();
    await page.getByTestId('program-selection-page').waitFor();
    assert.equal(await page.locator('[data-testid^="button-select-"]').count(), 0, 'cards have no navigation buttons');
    assert.equal(await page.getByTestId('button-complete-signup').isDisabled(), true, 'footer requires a program choice');
    assert.match(await page.getByTestId('program-card-essentials').innerText(), /\$199/);
    assert.match(await page.getByTestId('program-card-pro').innerText(), /\$249/);
    assert.match(await page.getByTestId('program-card-essentials').innerText(), /\$1,990/);
    assert.match(await page.getByTestId('program-card-pro').innerText(), /\$2,490/);
    assert.equal(await page.getByRole('group', { name: 'Billing frequency', exact: true }).count(), 0);
    fs.mkdirSync('screenshots', { recursive: true });
    await page.screenshot({ path: 'screenshots/program-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 375, height: 812 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    await page.screenshot({ path: 'screenshots/program-mobile.png', fullPage: true });
    if (process.env.VISUAL_ONLY === 'true') {
      assert.deepEqual(errors, []);
      console.log('PASS: program cards display both prices, desktop/mobile layout, no overflow.');
      return;
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByTestId('radio-billing-pro-monthly').check();
    assert.equal(await page.getByTestId('button-complete-signup').isEnabled(), true);
    await page.getByTestId('button-back').click();
    await page.getByTestId('button-continue').click();
    assert.equal(await page.getByTestId('radio-billing-pro-monthly').isChecked(), true);
    await page.getByTestId('radio-billing-pro-annual').check();
    assert.match(await page.getByTestId('program-card-pro').innerText(), /\$2,490/);
    let calls = 0;
    let firstId;
    let finish;
    let held;
    const intercepted = new Promise(resolve => { held = resolve; });
    const release = new Promise(resolve => { finish = resolve; });
    await page.route('**/api/signup', async route => {
      calls += 1;
      const body = route.request().postDataJSON();
      if (calls === 1) {
        firstId = body.requestId;
        await route.fulfill({ status: 503, contentType: 'application/json', body: '{"message":"Test retry"}' });
        return;
      }
      assert.equal(body.requestId, firstId);
      assert.equal(body.programId, 'pro');
      assert.equal(body.billing, 'annual');
      held();
      await release;
      await route.continue();
    });
    await page.getByTestId('button-complete-signup').click();
    await page.getByTestId('signup-error').waitFor();
    await page.getByTestId('button-complete-signup').click();
    await intercepted;
    await page.goBack();
    await page.getByTestId('location-selection-page').waitFor();
    assert.equal(await page.getByTestId('select-state').isDisabled(), true);
    await page.goForward();
    await page.getByTestId('program-selection-page').waitFor();
    assert.equal(await page.getByTestId('button-complete-signup').isDisabled(), true);
    assert.equal(await page.getByTestId('radio-billing-essentials-monthly').isDisabled(), true);
    finish();
    await page.getByTestId('signup-success').waitFor();
    assert.equal(calls, 2, 'only failed request and one successful retry');
    assert.equal(await page.getByTestId('radio-billing-pro-annual').isChecked(), true);
    assert.match(await page.getByTestId('signup-success').innerText(), /No payment was collected/);
    assert.deepEqual(errors, []);
    console.log('PASS: signup -> location -> program, pricing, mobile, retained choice, retry identity, pending back-navigation lock, no payment.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});