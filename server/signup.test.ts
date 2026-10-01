import assert from 'node:assert/strict';
import test from 'node:test';
import { MemStorage } from './storage';
import { completeSignup } from './signup';

const requestId = 'd4b1f72c-3b92-4ff6-9a82-e74fa807ecf8';

function validInput(overrides: Record<string, unknown> = {}) {
  return {
    requestId,
    userInfo: {
      firstName: ' Alex ',
      lastName: ' Rivera ',
      phone: '+1 (305) 555-0198',
      countryCode: '+1',
      email: 'alex@example.com',
      confirmEmail: 'alex@example.com',
      company: ' Example Co ',
      termsAccepted: true,
    },
    locationId: 'loc-1285',
    ...overrides,
  };
}

test('signup requires the complete user information payload', async () => {
  const storage = new MemStorage();
  const result = await completeSignup(storage, { requestId, locationId: 'loc-1285', userInfo: {} });

  assert.equal(result.status, 400);
  assert.ok(result.body.errors?.['userInfo.firstName']);
  assert.ok(result.body.errors?.['userInfo.email']);
  assert.ok(result.body.errors?.['userInfo.termsAccepted']);
  assert.equal(await storage.getSignupByRequestId(requestId), undefined);
});

test('signup rejects an unknown location and does not mutate catalog locations', async () => {
  const storage = new MemStorage();
  const locationsBefore = await storage.getLocations();
  const result = await completeSignup(storage, validInput({ locationId: 'not-a-real-location' }));

  assert.equal(result.status, 400);
  assert.ok(result.body.errors?.locationId);
  assert.deepEqual(await storage.getLocations(), locationsBefore);
  assert.equal(await storage.getSignupByRequestId(requestId), undefined);
});

test('signup requires accepted terms and matching valid email addresses', async () => {
  const storage = new MemStorage();
  const termsResult = await completeSignup(storage, validInput({
    userInfo: { ...validInput().userInfo, termsAccepted: false },
  }));
  assert.equal(termsResult.status, 400);
  assert.match(termsResult.body.errors?.['userInfo.termsAccepted'] ?? '', /accept the terms/i);

  const emailResult = await completeSignup(storage, validInput({
    userInfo: { ...validInput().userInfo, confirmEmail: 'different@example.com' },
  }));
  assert.equal(emailResult.status, 400);
  assert.match(emailResult.body.errors?.['userInfo.confirmEmail'] ?? '', /do not match/i);

  const invalidEmailResult = await completeSignup(storage, validInput({
    userInfo: { ...validInput().userInfo, email: 'not-an-email' },
  }));
  assert.equal(invalidEmailResult.status, 400);
  assert.ok(invalidEmailResult.body.errors?.['userInfo.email']);
});

test('signup is idempotent by request ID and conflicts on a changed payload', async () => {
  const storage = new MemStorage();
  const first = await completeSignup(storage, validInput());
  const repeated = await completeSignup(storage, validInput());

  assert.equal(first.status, 201);
  assert.deepEqual(repeated, first);
  if (first.status !== 201) assert.fail('Expected signup completion.');
  assert.deepEqual(Object.keys(first.body).sort(), ['createdAt', 'id', 'status']);
  assert.equal(first.body.status, 'completed');
  assert.ok(first.body.id);

  const changed = await completeSignup(storage, validInput({
    userInfo: { ...validInput().userInfo, firstName: 'Different' },
  }));
  assert.equal(changed.status, 409);
  assert.equal((await storage.getSignupByRequestId(requestId))?.id, first.body.id);
});

test('successful signup stores a separate record without adding a catalog location', async () => {
  const storage = new MemStorage();
  const locationsBefore = await storage.getLocations();
  const result = await completeSignup(storage, validInput());

  assert.equal(result.status, 201);
  assert.deepEqual(await storage.getLocations(), locationsBefore);
  assert.equal(await storage.getLocation('loc-1285'), undefined);

  const record = await storage.getSignupByRequestId(requestId);
  assert.ok(record);
  assert.equal(record?.locationId, 'loc-1285');
  assert.equal(record?.firstName, 'Alex');
  assert.equal(record?.company, 'Example Co');
  assert.equal(record?.status, 'completed');
});