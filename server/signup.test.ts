import assert from 'node:assert/strict';
import test from 'node:test';
import type { FunnelEvent, FunnelSession } from '../shared/schema';
import { MemStorage } from './storage';
import { completeSignup } from './signup';
import { buildFunnelSummary } from './funnel-summary';

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
    programId: 'essentials',
    billing: 'monthly',
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

test('signup requires a valid program and billing selection', async () => {
  const storage = new MemStorage();
  const { programId: _programId, ...withoutProgram } = validInput();
  const missingProgram = await completeSignup(storage, withoutProgram);
  assert.equal(missingProgram.status, 400);
  assert.ok(missingProgram.body.errors?.programId);

  const { billing: _billing, ...withoutBilling } = validInput();
  const missingBilling = await completeSignup(storage, withoutBilling);
  assert.equal(missingBilling.status, 400);
  assert.ok(missingBilling.body.errors?.billing);

  const invalidProgram = await completeSignup(storage, validInput({ programId: 'enterprise' }));
  assert.equal(invalidProgram.status, 400);
  assert.ok(invalidProgram.body.errors?.programId);

  const invalidBilling = await completeSignup(storage, validInput({ billing: 'quarterly' }));
  assert.equal(invalidBilling.status, 400);
  assert.ok(invalidBilling.body.errors?.billing);
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

test('idempotency fingerprints include program and billing selections', async () => {
  const storage = new MemStorage();
  const first = await completeSignup(storage, validInput());
  assert.equal(first.status, 201);

  const changedProgram = await completeSignup(storage, validInput({ programId: 'pro' }));
  assert.equal(changedProgram.status, 409);

  const changedBilling = await completeSignup(storage, validInput({ billing: 'annual' }));
  assert.equal(changedBilling.status, 409);
});

test('signup persists catalog prices quoted for each program and billing choice', async () => {
  const storage = new MemStorage();
  const locationsBefore = await storage.getLocations();
  const choices = [
    { programId: 'essentials', billing: 'monthly', monthlyPrice: 129, annualTotal: 1290, selectedPrice: 129 },
    { programId: 'essentials', billing: 'annual', monthlyPrice: 129, annualTotal: 1290, selectedPrice: 1290 },
    { programId: 'pro', billing: 'monthly', monthlyPrice: 179, annualTotal: 1790, selectedPrice: 179 },
    { programId: 'pro', billing: 'annual', monthlyPrice: 179, annualTotal: 1790, selectedPrice: 1790 },
    { programId: 'works', billing: 'monthly', monthlyPrice: 239, annualTotal: 2390, selectedPrice: 239 },
    { programId: 'works', billing: 'annual', monthlyPrice: 239, annualTotal: 2390, selectedPrice: 2390 },
  ] as const;

  for (const [index, choice] of choices.entries()) {
    const id = `d4b1f72c-3b92-4ff6-9a82-e74fa807ef0${index}`;
    const result = await completeSignup(storage, validInput({
      requestId: id,
      programId: choice.programId,
      billing: choice.billing,
    }));
    assert.equal(result.status, 201);
    const record = await storage.getSignupByRequestId(id);
    assert.equal(record?.programId, choice.programId);
    assert.equal(record?.billing, choice.billing);
    assert.equal(record?.quotedMonthlyPrice, choice.monthlyPrice);
    assert.equal(record?.quotedAnnualTotal, choice.annualTotal);
    assert.equal(record?.quotedPrice, choice.selectedPrice);
  }

  assert.deepEqual(await storage.getLocations(), locationsBefore);
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

test('funnel analytics reports the three current stages and only choose_program completion', () => {
  const event = (id: string, sessionId: string, step: string, eventType: string): FunnelEvent => ({
    id,
    sessionId,
    step,
    eventType,
    timestamp: '2026-02-09T12:00:00Z',
    duration: null,
    metadata: null,
  } as FunnelEvent);
  const summary = buildFunnelSummary(
    [
      event('info-enter', 'new-session', 'your_info', 'enter'),
      event('location-enter', 'new-session', 'pick_location', 'enter'),
      event('location-complete', 'new-session', 'pick_location', 'complete'),
      event('program-enter', 'new-session', 'choose_program', 'enter'),
      event('program-complete', 'new-session', 'choose_program', 'complete'),
      event('legacy-checkout', 'legacy-session', 'checkout', 'complete'),
    ],
    [
      { sessionId: 'new-session', completed: false } as FunnelSession,
      { sessionId: 'legacy-session', completed: true } as FunnelSession,
    ],
  );

  assert.deepEqual(summary.steps.map(({ step }) => step), [
    'your_info',
    'pick_location',
    'choose_program',
  ]);
  assert.equal(summary.steps.find(({ step }) => step === 'pick_location')?.completed, 1);
  assert.equal(summary.steps.find(({ step }) => step === 'choose_program')?.completed, 1);
  assert.deepEqual(summary.sessions, { total: 2, completed: 1 });
  assert.ok(summary.recentEvents.some(({ step }) => step === 'checkout'));
});