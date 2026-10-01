import assert from 'node:assert/strict';
import test from 'node:test';
import { MemStorage } from './storage';
import { prepareCheckout } from './checkout';

const requestId = 'd4b1f72c-3b92-4ff6-9a82-e74fa807ecf8';

function validInput(overrides: Record<string, unknown> = {}) {
  return {
    requestId,
    userInfo: {
      firstName: 'Alex',
      lastName: 'Rivera',
      phone: '+1 (305) 555-0198',
      countryCode: '+1',
      email: 'alex@example.com',
      confirmEmail: 'alex@example.com',
      company: 'Example Co',
      termsAccepted: true,
    },
    locationId: 'loc-1285',
    programId: 'essentials',
    billing: 'monthly',
    ...overrides,
  };
}

test('checkout without a configured destination returns 503 without creating a signup', async () => {
  const storage = new MemStorage();
  const result = await prepareCheckout(storage, validInput(), '');

  assert.equal(result.status, 503);
  assert.deepEqual(result.body, {
    message: 'Checkout is not connected yet. Please try again later.',
  });
  assert.equal(await storage.getSignupByRequestId(requestId), undefined);
});

test('invalid checkout destinations return generic 503 without creating a signup', async () => {
  const invalidDestinations = [
    'http://checkout.example.com',
    'javascript:alert(1)',
    '/checkout',
    'https://user:password@checkout.example.com/pay',
    'https://@checkout.example.com/pay',
    'https://checkout.example.com\\@evil.example/pay',
  ];

  for (const destination of invalidDestinations) {
    const storage = new MemStorage();
    const result = await prepareCheckout(storage, validInput(), destination);

    assert.equal(result.status, 503, `Expected ${destination} to be rejected`);
    assert.deepEqual(result.body, {
      message: 'Checkout is not connected yet. Please try again later.',
    });
    assert.equal(await storage.getSignupByRequestId(requestId), undefined);
  }
});

test('valid checkout destination validates and saves the signup, preserving its query unchanged', async () => {
  const storage = new MemStorage();
  const destination = 'https://checkout.example.com/start?campaign=spring&state=opaque-value';
  const result = await prepareCheckout(storage, validInput(), destination);

  if (result.status !== 201) assert.fail('Expected checkout preparation.');
  assert.equal(result.status, 201);
  assert.deepEqual(result.body, {
    status: 'checkout_ready',
    checkoutUrl: destination,
    signupId: (await storage.getSignupByRequestId(requestId))?.id,
  });
  assert.ok(!result.body.checkoutUrl.includes('alex@example.com'));
  assert.equal((await storage.getSignupByRequestId(requestId))?.email, 'alex@example.com');
});

test('checkout preparation is idempotent for a repeated request', async () => {
  const storage = new MemStorage();
  const destination = 'https://checkout.example.com/pay';
  const first = await prepareCheckout(storage, validInput(), destination);
  const retry = await prepareCheckout(storage, validInput(), destination);

  assert.equal(first.status, 201);
  assert.deepEqual(retry, first);
  assert.equal((await storage.getSignupByRequestId(requestId))?.id, first.status === 201 ? first.body.signupId : undefined);
});

test('invalid signup payload is passed through without creating a record', async () => {
  const storage = new MemStorage();
  const result = await prepareCheckout(storage, { ...validInput(), billing: 'quarterly' }, 'https://checkout.example.com/pay');

  assert.equal(result.status, 400);
  assert.equal(result.body.message, 'Please check your information and try again.');
  assert.ok('errors' in result.body && result.body.errors?.billing);
  assert.equal(await storage.getSignupByRequestId(requestId), undefined);
});