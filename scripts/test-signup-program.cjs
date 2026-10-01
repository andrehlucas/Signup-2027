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
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      reducedMotion: process.env.REDUCED_MOTION === 'true' ? 'reduce' : 'no-preference',
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const assertNavigationColor = async (testId, disabled = false) => {
      const { background, foreground } = await page.getByTestId(testId).evaluate(element => {
        const styles = getComputedStyle(element);
        return { background: styles.backgroundColor, foreground: styles.color };
      });
      const rgb = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
      const backgroundRgb = rgb(background);
      if (disabled) {
        assert.ok(Math.max(...backgroundRgb) - Math.min(...backgroundRgb) <= 8, `${testId} has a gray disabled background`);
        assert.notEqual(background, 'rgb(99, 161, 215)');
      } else {
        assert.equal(background, 'rgb(99, 161, 215)', `${testId} uses #63a1d7`);
      }
      const luminance = values => values.map(value => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      const light = Math.max(luminance(backgroundRgb), luminance(rgb(foreground)));
      const dark = Math.min(luminance(backgroundRgb), luminance(rgb(foreground)));
      assert.ok((light + 0.05) / (dark + 0.05) >= 4.5, `${testId} text meets WCAG AA contrast`);
    };
    const assertFooterVisible = async (testId) => {
      await page.waitForFunction(id => {
        const button = document.querySelector(`[data-testid="${id}"]`);
        if (!button || button.disabled) return false;
        const { top, bottom } = button.getBoundingClientRect();
        return top >= 0 && bottom <= window.innerHeight;
      }, testId, { timeout: 5000 });
    };
    await page.goto(process.env.TEST_BASE_URL, { waitUntil: 'networkidle' });
    await assertNavigationColor('button-continue');
    await assertNavigationColor('step-1-current');
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
    await assertNavigationColor('button-continue', true);
    await assertNavigationColor('button-back');
    await assertNavigationColor('step-1-complete');
    await assertNavigationColor('step-2-current');
    await page.getByTestId('select-state').click();
    await page.getByRole('option', { name: 'Florida', exact: true }).click();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('[data-testid^="location-card-"]').first().click();
    await assertFooterVisible('button-continue');
    await assertNavigationColor('button-continue');
    const selectedLocationId = await page.locator('input[name="location"]:checked').getAttribute('data-testid');
    const [backBounds, continueBounds] = await page.evaluate(() =>
      ['button-back', 'button-continue'].map(id => {
        const { x, y, height } = document.querySelector(`[data-testid="${id}"]`).getBoundingClientRect();
        return { x, y, height };
      })
    );
    assert.ok(backBounds.x < continueBounds.x, 'location Back is left of Continue');
    assert.ok(Math.abs((backBounds.y + backBounds.height / 2) - (continueBounds.y + continueBounds.height / 2)) < 2, 'location footer buttons share a row on mobile');
    fs.mkdirSync('screenshots', { recursive: true });
    await page.screenshot({ path: 'screenshots/location-footer-mobile.png' });
    await page.getByTestId('button-back').click();
    await page.getByTestId('input-first-name').waitFor();
    assert.equal(await page.getByTestId('input-first-name').inputValue(), 'Flow', 'Back retains user information');
    await page.getByTestId('button-continue').click();
    await page.getByTestId('location-selection-page').waitFor();
    assert.equal(await page.getByTestId(selectedLocationId).isChecked(), true, 'Back retains location selection');
    await page.getByTestId('button-continue').click();
    await page.getByTestId('program-selection-page').waitFor();
    await page.setViewportSize({ width: 1280, height: 900 });
    assert.equal(await page.locator('[data-testid^="button-select-"]').count(), 0, 'cards have no navigation buttons');
    assert.equal(await page.getByTestId('button-complete-signup').isDisabled(), true, 'footer requires a program choice');
    await assertNavigationColor('button-complete-signup', true);
    await assertNavigationColor('button-back');
    await assertNavigationColor('step-3-current');
    assert.equal(await page.getByTestId('button-complete-signup').innerText(), 'Continue');
    assert.equal(await page.getByTestId('signup-success').count(), 0, 'program page has no signup-complete banner');
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
    await page.getByTestId('radio-billing-essentials-monthly').check();
    await assertFooterVisible('button-complete-signup');
    await page.getByTestId('radio-billing-essentials-annual').check();
    await assertFooterVisible('button-complete-signup');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByTestId('radio-billing-pro-monthly').check();
    await assertFooterVisible('button-complete-signup');
    assert.equal(await page.getByTestId('button-complete-signup').isEnabled(), true);
    await page.getByTestId('button-complete-signup').hover();
    await assertNavigationColor('button-complete-signup');
    await page.getByTestId('button-back').click();
    await page.getByTestId('button-continue').click();
    assert.equal(await page.getByTestId('radio-billing-pro-monthly').isChecked(), true);
    await page.getByTestId('radio-billing-pro-annual').check();
    await assertFooterVisible('button-complete-signup');
    assert.match(await page.getByTestId('program-card-pro').innerText(), /\$2,490/);
    await page.getByTestId('button-complete-signup').click();
    await page.getByTestId('signup-error').waitFor();
    assert.match(await page.getByTestId('signup-error').innerText(), /Checkout is not connected yet/);
    assert.equal(await page.getByTestId('radio-billing-pro-annual').isChecked(), true, 'missing checkout preserves selections');
    assert.equal(await page.getByTestId('button-complete-signup').isEnabled(), true, 'missing checkout leaves the flow editable');
    const checkoutUrl = 'https://checkout.example.test/checkout.php';
    await page.route(checkoutUrl, route => route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html><body><h1>Checkout test destination</h1></body></html>',
    }));
    let calls = 0;
    let firstId;
    let finish;
    let held;
    const intercepted = new Promise(resolve => { held = resolve; });
    const release = new Promise(resolve => { finish = resolve; });
    await page.route('**/api/checkout', async route => {
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
      if (calls === 2) {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'checkout_ready', checkoutUrl: 'javascript:alert(1)' }),
        });
        return;
      }
      held();
      await release;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'checkout_ready', checkoutUrl, signupId: 'test-signup' }),
      });
    });
    await page.getByTestId('button-complete-signup').click();
    await page.getByTestId('signup-error').waitFor();
    await page.getByTestId('button-complete-signup').click();
    await page.waitForFunction(() => document.querySelector('[data-testid="signup-error"]')?.textContent.includes('unexpected checkout response'));
    assert.equal(await page.getByTestId('button-complete-signup').isEnabled(), true, 'unsafe checkout URL is rejected without locking the flow');
    await page.getByTestId('button-complete-signup').click();
    await intercepted;
    await page.goBack();
    await page.getByTestId('location-selection-page').waitFor();
    assert.equal(await page.getByTestId('select-state').isDisabled(), true);
    assert.equal(await page.getByTestId('button-back').isDisabled(), true, 'location Back is locked during signup');
    await assertNavigationColor('button-back', true);
    await assertNavigationColor('button-continue', true);
    await assertNavigationColor('step-1-complete', true);
    await page.goForward();
    await page.getByTestId('program-selection-page').waitFor();
    assert.equal(await page.getByTestId('button-complete-signup').isDisabled(), true);
    await assertNavigationColor('button-complete-signup', true);
    await assertNavigationColor('button-back', true);
    assert.equal(await page.getByTestId('radio-billing-essentials-monthly').isDisabled(), true);
    assert.equal(await page.getByTestId('radio-billing-pro-annual').isChecked(), true);
    assert.equal(await page.getByTestId('signup-success').count(), 0);
    finish();
    await page.waitForURL(checkoutUrl);
    await page.getByRole('heading', { name: 'Checkout test destination' }).waitFor();
    assert.equal(calls, 3, 'only failed request, rejected URL and successful retry');
    assert.equal(page.url(), checkoutUrl, 'Continue redirects without putting customer details in the URL');
    assert.deepEqual(errors, []);
    console.log('PASS: location Back, program Continue, auto-scroll, retained choice, missing checkout, safe redirect, retry identity and pending navigation locks.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});