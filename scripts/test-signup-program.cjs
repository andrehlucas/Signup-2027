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
    const assertTextOnlyBack = async () => {
      const background = await page.getByTestId('button-back').evaluate(element => {
        const styles = getComputedStyle(element);
        return { color: styles.backgroundColor, image: styles.backgroundImage };
      });
      assert.equal(background.color, 'rgba(0, 0, 0, 0)', 'Back remains a text-only link');
      assert.equal(background.image, 'none', 'Back has no background image');
    };
    const assertNavigationColor = async (testId, disabled = false) => {
      if (!disabled) {
        await page.waitForFunction(id => {
          const element = document.querySelector(`[data-testid="${id}"]`);
          return element && getComputedStyle(element).backgroundColor === 'rgb(99, 161, 215)';
        }, testId, { timeout: 5000 });
      }
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
    const assertBillingFrequency = async frequency => {
      // Check resting colors after pointer/keyboard activation, not hover colors.
      await page.mouse.move(0, 0);
      const monthlyPressed = frequency === 'monthly' ? 'true' : 'false';
      const annualPressed = frequency === 'annual' ? 'true' : 'false';
      assert.equal(await page.getByTestId('button-billing-monthly').getAttribute('aria-pressed'), monthlyPressed);
      assert.equal(await page.getByTestId('button-billing-annual').getAttribute('aria-pressed'), annualPressed);
      const selectedId = `button-billing-${frequency}`;
      const otherId = `button-billing-${frequency === 'monthly' ? 'annual' : 'monthly'}`;
      await page.waitForFunction(({ selectedId, otherId }) => {
        const selected = document.querySelector(`[data-testid="${selectedId}"]`);
        const other = document.querySelector(`[data-testid="${otherId}"]`);
        if (!selected || !other) return false;
        const current = getComputedStyle(selected);
        const inactive = getComputedStyle(other);
        if (selected.disabled) {
          return [current, inactive].every(style => {
            const channels = style.backgroundColor.match(/[\d.]+/g).slice(0, 3).map(Number);
            return Math.max(...channels) - Math.min(...channels) <= 8 &&
              style.backgroundImage === 'none' && style.boxShadow === 'none' &&
              style.color === 'rgb(65, 70, 81)';
          });
        }
        return current.backgroundColor === 'rgb(2, 106, 162)' &&
          current.color === 'rgb(255, 255, 255)' &&
          inactive.backgroundColor !== current.backgroundColor &&
          inactive.color !== current.color;
      }, { selectedId, otherId }, { timeout: 5000 });
      if (await page.getByTestId(selectedId).isDisabled()) {
        await assertNavigationColor(selectedId, true);
        await assertNavigationColor(otherId, true);
      } else {
        const colors = await page.getByTestId(selectedId).evaluate(element => {
          const style = getComputedStyle(element);
          return { background: style.backgroundColor, border: style.borderColor, shadow: style.boxShadow };
        });
        assert.equal(colors.border, colors.background, 'selected billing option has a solid matching border');
        assert.notEqual(colors.shadow, 'none', 'billing option has the approved subtle shadow');
        // White text on official brand-600 meets WCAG AA.
        const luminance = [2, 106, 162].map(value => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
        assert.ok(1.05 / (luminance + 0.05) >= 4.5, 'selected billing text meets WCAG AA contrast');
      }
      const selected = page.getByTestId(selectedId);
      const other = page.getByTestId(otherId);
      const selectedBox = await selected.boundingBox();
      const otherBox = await other.boundingBox();
      assert.ok(Math.abs(selectedBox.width - otherBox.width) <= 1, 'billing options have equal widths');
      assert.equal(await selected.locator('svg').evaluate(node => getComputedStyle(node).visibility), 'visible');
      assert.equal(await other.locator('svg').evaluate(node => getComputedStyle(node).visibility), 'hidden');
    };
    const assertCallToActionColor = async (testId, disabled = false) => {
      // Wait for all shared button styles to finish their 150ms transition.
      await page.waitForFunction(({ id, disabled }) => {
        const button = document.querySelector(`[data-testid="${id}"]`);
        if (!button) return false;
        const background = getComputedStyle(button).backgroundColor;
        const styles = getComputedStyle(button);
        if (!disabled) {
          const badge = button.closest('article')?.querySelector('h2 > span:last-child');
          if (!badge || !styles.backgroundImage.includes('linear-gradient')) return false;
          const badgeStyles = getComputedStyle(badge);
          return ['backgroundImage', 'color', 'borderColor', 'borderRadius', 'boxShadow', 'fontWeight']
            .every(key => styles[key] === badgeStyles[key]);
        }
        const channels = background.match(/[\d.]+/g).slice(0, 3).map(Number);
        return Math.max(...channels) - Math.min(...channels) <= 8 &&
          styles.backgroundImage === 'none' && styles.boxShadow === 'none';
      }, { id: testId, disabled }, { timeout: 5000 });
      const { background, isDisabled } = await page.getByTestId(testId).evaluate(element => ({
        background: getComputedStyle(element).backgroundColor,
        isDisabled: element.disabled,
      }));
      assert.equal(isDisabled, disabled, `${testId} disabled state`);
      if (disabled) {
        await assertNavigationColor(testId, true);
        const image = await page.getByTestId(testId).evaluate(element => getComputedStyle(element).backgroundImage);
        assert.equal(image, 'none', `${testId} has no disabled gradient`);
      } else {
        const styles = await page.getByTestId(testId).evaluate(element => {
          const badge = element.closest('article').querySelector('h2 > span:last-child');
          const properties = ['backgroundImage', 'color', 'borderColor', 'borderRadius', 'boxShadow', 'fontWeight'];
          const snapshot = node => Object.fromEntries(properties.map(key => [key, getComputedStyle(node)[key]]));
          return { button: snapshot(element), badge: snapshot(badge) };
        });
        assert.deepEqual(styles.button, styles.badge, `${testId} matches its plan badge`);
        assert.equal(styles.button.color, 'rgb(255, 255, 255)', `${testId} has white text`);
      }
    };
    const assertCardCallToAction = async (planId, planName) => {
      const button = page.getByTestId(`button-select-${planId}`);
      const buttonLabel = 'Continue to Checkout';
      assert.equal(await button.getAttribute('aria-label'), `${buttonLabel} with ${planName}`);
      assert.equal((await button.innerText()).trim(), buttonLabel);
      await assertCallToActionColor(`button-select-${planId}`);
      await button.hover();
      await assertCallToActionColor(`button-select-${planId}`);
      await page.mouse.move(0, 0);
    };
    const assertDealBadge = async () => {
      // The design-system Badge nests its text inside the styled pill.
      const badge = page.getByText('Save over 16% with yearly billing', { exact: true }).locator('..');
      const styles = await badge.evaluate(element => {
        const style = getComputedStyle(element);
        return { background: style.backgroundColor, image: style.backgroundImage, foreground: style.color, border: style.borderColor, insideButton: Boolean(element.closest('button')) };
      });
      assert.equal(styles.background, 'rgb(255, 250, 235)', 'approved warm warning background');
      assert.equal(styles.image, 'none', 'approved offer uses a soft fill, not the previous gradient');
      assert.equal(styles.foreground, 'rgb(181, 71, 8)');
      const luminance = channels => channels.map(value => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      assert.ok((luminance([255, 250, 235]) + .05) / (luminance([181, 71, 8]) + .05) >= 4.5, 'offer text meets AA contrast');
      assert.equal(styles.border, 'rgb(254, 223, 137)', 'offer badge has a warm outline');
      assert.equal(styles.insideButton, false, 'offer is separate from the Yearly button');
      const badgeBox = await badge.boundingBox();
      const yearlyBox = await page.getByTestId('button-billing-annual').boundingBox();
      assert.ok(badgeBox.y > yearlyBox.y + yearlyBox.height, 'offer sits below the options without overlap');
      assert.equal(await page.getByText('Pay every month', { exact: true }).count(), 1);
      assert.equal(await page.getByText('Pay once a year', { exact: true }).count(), 1);
    };
    const isFullyVisibleInViewport = async testId => page.waitForFunction(id => {
      const element = document.querySelector(`[data-testid="${id}"]`);
      if (!element) return false;
      const { top, bottom } = element.getBoundingClientRect();
      return top >= 0 && bottom <= window.innerHeight;
    }, testId, { timeout: 5000 });
    const cardClass = async planId => page.getByTestId(`program-card-${planId}`).getAttribute('class');
    const assertNoProgramFooter = async () => {
      assert.equal(await page.getByTestId('program-selection-page').locator('footer').count(), 0, 'program page has no navigation footer');
      assert.equal(await page.getByTestId('button-back').count(), 0, 'program page has no Back button');
      assert.equal(await page.getByTestId('button-complete-signup').count(), 0, 'program page has no Continue footer button');
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
    await assertTextOnlyBack();
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
    await assertNoProgramFooter();
    await assertNavigationColor('step-3-current');
    assert.equal(await page.getByTestId('signup-success').count(), 0, 'program page has no signup-complete banner');
    assert.equal(await page.getByRole('group', { name: 'Billing frequency', exact: true }).count(), 1);
    assert.equal(await page.getByRole('button', { name: 'Monthly', exact: true }).count(), 1);
    assert.equal(await page.getByRole('button', { name: /^Yearly\b/ }).count(), 1);
    assert.equal(await page.locator('[data-testid^="radio-program-"]').count(), 0, 'cards have no program radio controls');
    assert.equal(await page.locator('[data-testid^="radio-billing-"]').count(), 0, 'billing frequency is not selected per card');
    await assertBillingFrequency('monthly');
    await assertCardCallToAction('essentials', 'Essentials');
    await assertCardCallToAction('pro', 'Pro');
    await assertDealBadge();
    const keyboardButton = page.getByTestId('button-select-essentials');
    await page.keyboard.press('Tab');
    await keyboardButton.focus();
    assert.equal(await keyboardButton.evaluate(node => node.matches(':focus-visible')), true);
    assert.equal(await keyboardButton.evaluate(node => getComputedStyle(node).outlineStyle), 'solid', 'checkout keyboard focus is visible');
    await page.keyboard.down('Space');
    assert.equal(await keyboardButton.evaluate(node => getComputedStyle(node).transform), 'none', 'keyboard press does not animate');
    // Blur before release so this focus check does not submit checkout.
    await keyboardButton.evaluate(node => node.blur());
    await page.keyboard.up('Space');
    assert.equal(await page.getByTestId('signup-error').count(), 0);
    if (process.env.REDUCED_MOTION === 'true') {
      const card = page.getByTestId('program-card-essentials');
      await card.hover();
      assert.equal(await card.evaluate(node => getComputedStyle(node).transform), 'none');
      assert.equal(await card.evaluate(node => getComputedStyle(node).transitionDuration), '0s');
      await page.mouse.move(0, 0);
    }
    const essentialsCard = page.getByTestId('program-card-essentials');
    const proCard = page.getByTestId('program-card-pro');
    const essentialsInitialClass = await cardClass('essentials');
    const proInitialClass = await cardClass('pro');
    assert.match(await essentialsCard.innerText(), /\$199/);
    assert.match(await essentialsCard.innerText(), /month/i);
    assert.match(await proCard.innerText(), /\$249/);
    assert.match(await proCard.innerText(), /month/i);
    fs.mkdirSync('screenshots', { recursive: true });
    await page.screenshot({ path: 'screenshots/program-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 375, height: 812 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    await assertBillingFrequency('monthly');
    await assertDealBadge();
    await page.screenshot({ path: 'screenshots/program-mobile.png', fullPage: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByTestId('button-billing-annual').click();
    await assertBillingFrequency('annual');
    assert.match(await essentialsCard.innerText(), /\$166/);
    assert.match(await essentialsCard.innerText(), /month/i);
    assert.match(await essentialsCard.innerText(), /\$1,990/);
    assert.match(await proCard.innerText(), /\$208/);
    assert.match(await proCard.innerText(), /month/i);
    assert.match(await proCard.innerText(), /\$2,490/);
    await page.screenshot({ path: 'screenshots/program-desktop-yearly.png', fullPage: true });
    await page.setViewportSize({ width: 375, height: 812 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, 'yearly layout has no mobile overflow');
    await page.screenshot({ path: 'screenshots/program-mobile-yearly.png', fullPage: true });
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `yearly layout has no overflow at ${width}px`);
      await page.getByTestId('button-billing-monthly').click();
      await assertBillingFrequency('monthly');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, `monthly layout has no overflow at ${width}px`);
      await page.getByTestId('button-billing-annual').focus();
      await page.keyboard.press('Space');
      await assertBillingFrequency('annual');
    }
    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByTestId('button-billing-monthly').click();
    await assertBillingFrequency('monthly');
    if (process.env.VISUAL_ONLY === 'true') {
      assert.deepEqual(errors, []);
      console.log('PASS: monthly and yearly program prices, desktop/mobile layout, no overflow.');
      return;
    }
    const observedCheckoutRequests = [];
    page.on('request', request => {
      if (request.method() === 'POST' && new URL(request.url()).pathname === '/api/checkout') {
        observedCheckoutRequests.push(request.postDataJSON());
      }
    });
    await page.setViewportSize({ width: 375, height: 812 });
    const essentialsMonthlyRequest = page.waitForRequest(request =>
      request.method() === 'POST' && new URL(request.url()).pathname === '/api/checkout'
    );
    await page.getByTestId('button-select-essentials').scrollIntoViewIfNeeded();
    await isFullyVisibleInViewport('button-select-essentials');
    await page.getByTestId('button-select-essentials').click();
    const essentialsMonthlyPayload = (await essentialsMonthlyRequest).postDataJSON();
    assert.equal(essentialsMonthlyPayload.programId, 'essentials', 'first Essentials click submits the clicked plan');
    assert.equal(essentialsMonthlyPayload.billing, 'monthly', 'first Essentials click submits current monthly billing');
    await page.getByTestId('signup-error').waitFor();
    assert.match(await page.getByTestId('signup-error').innerText(), /Checkout is not connected yet/);
    await isFullyVisibleInViewport('signup-error');
    assert.notEqual(await cardClass('essentials'), essentialsInitialClass, 'failed checkout retains Essentials selection');
    await assertCallToActionColor('button-select-essentials');
    await assertCallToActionColor('button-select-pro');
    assert.equal(observedCheckoutRequests.length, 1);

    const selectedEssentialsClass = await cardClass('essentials');
    await page.getByTestId('button-billing-annual').click();
    await assertBillingFrequency('annual');
    assert.equal(await cardClass('essentials'), selectedEssentialsClass, 'billing switch preserves Essentials selection');
    assert.match(await essentialsCard.innerText(), /\$1,990/);
    assert.equal(observedCheckoutRequests.length, 1, 'billing switcher does not post checkout');
    await page.getByTestId('button-billing-monthly').click();
    await assertBillingFrequency('monthly');
    assert.equal(await cardClass('essentials'), selectedEssentialsClass, 'switching back to monthly preserves Essentials selection');
    assert.equal(observedCheckoutRequests.length, 1, 'monthly switcher does not post checkout');
    await page.getByTestId('button-billing-annual').click();
    await assertBillingFrequency('annual');
    assert.equal(await cardClass('essentials'), selectedEssentialsClass, 'latest annual selection preserves Essentials');
    assert.equal(observedCheckoutRequests.length, 1, 'switching billing never posts checkout by itself');

    await page.getByTestId('step-nav-2').click();
    await page.getByTestId('location-selection-page').waitFor();
    assert.equal(await page.getByTestId('select-state').isDisabled(), false, 'location is editable before checkout is pending');
    await page.getByTestId('button-continue').scrollIntoViewIfNeeded();
    await page.getByTestId('button-continue').click();
    await page.getByTestId('program-selection-page').waitFor();
    assert.equal(observedCheckoutRequests.length, 1, 'returning to the program page does not implicitly post checkout');
    await assertBillingFrequency('annual');
    assert.equal(await cardClass('essentials'), selectedEssentialsClass, 'program choice survives navigation to location and back');
    assert.match(await essentialsCard.innerText(), /\$1,990/);
    await assertNoProgramFooter();
    const checkoutUrl = 'https://checkout.example.test/checkout.php';
    await page.route(checkoutUrl, route => route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html><body><h1>Checkout test destination</h1></body></html>',
    }));
    let calls = 0;
    let proRequestId;
    let finish;
    let held;
    const intercepted = new Promise(resolve => { held = resolve; });
    const release = new Promise(resolve => { finish = resolve; });
    await page.route('**/api/checkout', async route => {
      calls += 1;
      const body = route.request().postDataJSON();
      assert.equal(body.programId, 'pro', 'a new Pro click must not reuse the previously selected Essentials plan');
      assert.equal(body.billing, 'annual', 'Pro click submits the latest global annual billing selection');
      if (calls === 1) {
        proRequestId = body.requestId;
        await route.fulfill({ status: 503, contentType: 'application/json', body: '{"message":"Test retry"}' });
        return;
      }
      assert.equal(body.requestId, proRequestId, 'retrying the same Pro annual selection keeps its request identity');
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
    await page.setViewportSize({ width: 1280, height: 900 });
    await assertCardCallToAction('pro', 'Pro');
    await page.getByTestId('button-select-pro').scrollIntoViewIfNeeded();
    await isFullyVisibleInViewport('button-select-pro');
    await page.getByTestId('button-select-pro').click();
    await page.getByTestId('signup-error').waitFor();
    assert.equal(calls, 1, 'first Pro annual checkout fails once before retry');
    assert.notEqual(await cardClass('pro'), proInitialClass, 'failed Pro checkout retains Pro selection');
    assert.equal(await cardClass('essentials'), essentialsInitialClass, 'choosing Pro deselects the prior Essentials selection');
    await assertCallToActionColor('button-select-pro');
    await page.getByTestId('button-select-pro').click();
    await page.waitForFunction(() => document.querySelector('[data-testid="signup-error"]')?.textContent.includes('unexpected checkout response'));
    assert.equal(await page.getByTestId('button-select-pro').isEnabled(), true, 'unsafe checkout URL is rejected without locking the flow');
    await assertCallToActionColor('button-select-pro');
    await page.getByTestId('button-select-pro').click();
    await intercepted;
    assert.equal(calls, 3, 'only the failed request, rejected URL and pending successful retry are sent');
    assert.equal(observedCheckoutRequests.length, 4, 'one Essentials request plus three Pro retries');
    assert.equal(observedCheckoutRequests[1].programId, 'pro');
    assert.equal(observedCheckoutRequests[1].billing, 'annual');
    assert.equal(observedCheckoutRequests[2].requestId, observedCheckoutRequests[1].requestId);
    assert.equal(observedCheckoutRequests[3].requestId, observedCheckoutRequests[1].requestId);
    await assertCallToActionColor('button-select-essentials', true);
    await assertCallToActionColor('button-select-pro', true);
    assert.equal(await page.getByTestId('button-billing-monthly').isDisabled(), true, 'monthly switch is locked while signup is pending');
    assert.equal(await page.getByTestId('button-billing-annual').isDisabled(), true, 'annual switch is locked while signup is pending');
    await assertBillingFrequency('annual');
    assert.equal(await page.getByTestId('step-nav-2').isDisabled(), true, 'completed step navigation is locked while signup is pending');
    await assertNavigationColor('step-2-complete', true);
    await assertNoProgramFooter();
    assert.equal(await page.getByTestId('signup-success').count(), 0, 'pending program page has no signup-complete banner');

    for (const testId of ['button-select-essentials', 'button-select-pro']) {
      await page.getByTestId(testId).evaluate(element => {
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });
    }
    await page.waitForTimeout(100);
    assert.equal(calls, 3, 'disabled card CTAs reject duplicate clicks while checkout is pending');

    await page.goBack();
    await page.getByTestId('location-selection-page').waitFor();
    assert.equal(await page.getByTestId('select-state').isDisabled(), true);
    assert.equal(await page.getByTestId('button-back').isDisabled(), true, 'location Back is locked during signup');
    await assertTextOnlyBack();
    await assertNavigationColor('button-continue', true);
    await assertNavigationColor('step-1-complete', true);
    assert.equal(await page.getByTestId('step-nav-1').isDisabled(), true, 'completed step navigation remains locked at location');
    await page.goForward();
    await page.getByTestId('program-selection-page').waitFor();
    await assertCallToActionColor('button-select-essentials', true);
    await assertCallToActionColor('button-select-pro', true);
    assert.equal(await page.getByTestId('button-billing-monthly').isDisabled(), true, 'monthly switch remains locked after browser forward');
    assert.equal(await page.getByTestId('button-billing-annual').isDisabled(), true, 'annual switch remains locked after browser forward');
    assert.equal(await page.getByTestId('step-nav-2').isDisabled(), true, 'completed step navigation remains locked after browser forward');
    await assertNavigationColor('step-2-complete', true);
    assert.notEqual(await cardClass('pro'), proInitialClass, 'selected Pro card remains selected after browser navigation');
    await assertBillingFrequency('annual');
    await assertNoProgramFooter();
    assert.equal(await page.getByTestId('signup-success').count(), 0);
    assert.equal(calls, 3, 'browser Back and Forward do not create checkout requests');
    finish();
    await page.waitForURL(checkoutUrl);
    await page.getByRole('heading', { name: 'Checkout test destination' }).waitFor();
    assert.equal(calls, 3, 'only failed request, rejected URL and successful retry');
    assert.equal(page.url(), checkoutUrl, 'Continue redirects without putting customer details in the URL');
    assert.deepEqual(errors, []);
    console.log('PASS: location navigation, in-card checkout, retained selections, missing checkout, safe redirect, retry identity and pending navigation locks.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});