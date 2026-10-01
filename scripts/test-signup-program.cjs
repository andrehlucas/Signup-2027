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
    await page.goto(`${process.env.TEST_BASE_URL}/add-location/checkout`, { waitUntil: 'networkidle' });
    await page.getByTestId('heading-signup').waitFor();
    assert.equal(new URL(page.url()).pathname, '/', 'direct checkout entry returns to missing user info');
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
    assert.equal(await page.getByTestId('button-continue-checkout').isDisabled(), true, 'footer requires a program choice');
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
    await page.getByTestId('radio-billing-essentials-monthly').check();
    await page.getByTestId('button-continue-checkout').click();
    await page.getByTestId('checkout-page').waitFor();
    assert.match(await page.getByTestId('checkout-order-summary').innerText(), /Essentials/);
    assert.match(await page.getByTestId('checkout-order-summary').innerText(), /\$199\b/);
    assert.equal(await page.getByTestId('button-complete-checkout').isDisabled(), true, 'checkout requires review confirmation');
    await page.getByTestId('checkout-billing-annual').click();
    assert.match(await page.getByTestId('checkout-order-summary').innerText(), /\$1,990\b/);
    await page.getByTestId('button-back-checkout').click();
    assert.equal(await page.getByTestId('radio-billing-essentials-annual').isChecked(), true, 'checkout billing changes persist on program page');
    await page.getByTestId('radio-billing-pro-monthly').check();
    assert.equal(await page.getByTestId('button-continue-checkout').isEnabled(), true);
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
      assert.deepEqual(Object.keys(body).sort(), ['billing', 'locationId', 'programId', 'requestId', 'userInfo'], 'no card or billing address is transmitted');
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
    await page.getByTestId('button-continue-checkout').click();
    await page.getByTestId('checkout-page').waitFor();
    assert.equal(calls, 0, 'continuing to checkout does not submit signup');
    assert.equal(await page.getByTestId('step-4-current').count(), 1);
    assert.match(await page.getByTestId('checkout-order-summary').innerText(), /Pro/);
    assert.match(await page.getByTestId('checkout-order-summary').innerText(), /\$2,490\b/);
    assert.equal(await page.getByTestId('input-card-number').isDisabled(), true, 'raw card entry is disabled without a processor');
    assert.match(await page.getByTestId('payment-method-section').innerText(), /not connected|not yet connected/i);
    await page.getByTestId('checkbox-agreement').click();
    await page.getByTestId('checkout-billing-monthly').click();
    assert.match(await page.getByTestId('checkout-order-summary').innerText(), /\$249\b/);
    assert.equal(await page.getByTestId('checkbox-agreement').isChecked(), false, 'changed billing requires fresh confirmation');
    assert.equal(await page.getByTestId('button-complete-checkout').isDisabled(), true);
    await page.getByTestId('checkout-billing-annual').click();
    await page.screenshot({ path: 'screenshots/checkout-desktop.png', fullPage: true });
    for (const width of [768, 375]) {
      await page.setViewportSize({ width, height: 812 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `checkout fits ${width}px viewport`);
    }
    await page.screenshot({ path: 'screenshots/checkout-mobile.png', fullPage: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByTestId('checkbox-agreement').click();
    await page.getByTestId('button-complete-checkout').click();
    await page.getByTestId('signup-error').waitFor();
    await page.getByTestId('button-complete-checkout').click();
    await intercepted;
    await page.goBack();
    await page.getByTestId('program-selection-page').waitFor();
    assert.equal(await page.getByTestId('button-continue-checkout').isDisabled(), true);
    assert.equal(await page.getByTestId('radio-billing-essentials-monthly').isDisabled(), true);
    await page.goBack();
    await page.getByTestId('location-selection-page').waitFor();
    assert.equal(await page.getByTestId('select-state').isDisabled(), true);
    await page.goForward();
    await page.getByTestId('program-selection-page').waitFor();
    assert.equal(await page.getByTestId('radio-billing-pro-annual').isChecked(), true);
    await page.goForward();
    await page.getByTestId('checkout-page').waitFor();
    assert.equal(await page.getByTestId('button-complete-checkout').isDisabled(), true);
    assert.equal(await page.getByTestId('button-back-checkout').isDisabled(), true);
    assert.equal(await page.getByTestId('checkbox-agreement').isDisabled(), true);
    assert.equal(await page.getByTestId('checkout-billing-monthly').isDisabled(), true);
    finish();
    await page.getByTestId('signup-success').waitFor();
    assert.equal(calls, 2, 'only failed request and one successful retry');
    assert.equal(await page.getByTestId('button-complete-checkout').isDisabled(), true);
    assert.match(await page.getByTestId('signup-success').innerText(), /No payment was collected/);
    assert.deepEqual(errors, []);
    console.log('PASS: signup -> location -> program -> restored checkout, four plan prices, mobile/tablet, retained choice, confirmation, retry identity, pending back-navigation locks, no card collection or payment.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});