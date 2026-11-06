import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeDraft, encodeDraft, DRAFT_TTL } from './draft';
import { availableAddons, bundles, sampleLocations, getPhoneNumbersForLocation, OrderState } from './types';

const empty: OrderState = {
  userInfo: { firstName: '', lastName: '', phone: '', countryCode: '+1', countryRegion: 'US',
    email: '', confirmEmail: '', company: '', termsAccepted: false },
  location: null, bundle: null, phoneNumber: null, tollFreePhoneNumber: null,
  addons: [], extensionCount: 0, agreementAccepted: false, appliedPromo: null,
};
const location = sampleLocations[0];
const packageAddon = availableAddons.find(addon => addon.packages?.length)!;
const selectedPackage = packageAddon.packages![1] ?? packageAddon.packages![0];
const order: OrderState = {
  ...empty, userInfo: { ...empty.userInfo, firstName: 'Test', email: 'draft@example.invalid' },
  location, bundle: bundles[2], phoneNumber: getPhoneNumbersForLocation(location)[0],
  addons: [{ ...packageAddon, selectedPackage, price: selectedPackage.price }],
  extensionCount: 2, agreementAccepted: true,
};
const filters = { state: location.state, city: location.city };
const now = 1_800_000_000_000;

test('restores contact details, location, plan, package, phone and filters', () => {
  const saved = decodeDraft(encodeDraft(order, filters, now), empty, now);
  assert.equal(saved.order.userInfo.firstName, 'Test');
  assert.equal(saved.order.location?.id, location.id);
  assert.equal(saved.order.bundle?.id, bundles[2].id);
  assert.equal(saved.order.phoneNumber?.id, order.phoneNumber?.id);
  assert.equal(saved.order.addons[0].selectedPackage?.id, selectedPackage.id);
  assert.equal(saved.order.addons[0].price, selectedPackage.price);
  assert.equal(saved.order.extensionCount, 0);
  assert.equal(saved.order.agreementAccepted, false);
  assert.equal(saved.order.appliedPromo, null);
  assert.deepEqual(saved.filters, { ...filters, country: 'US' });
});

test('retired extensions cannot return or add charges from a legacy draft', () => {
  const legacy = JSON.parse(encodeDraft(order, filters, now));
  legacy.extensionCount = 5;
  legacy.addons.push({ id: 'additional-extensions' });
  const saved = decodeDraft(JSON.stringify(legacy), empty, now);
  assert.equal(saved.order.extensionCount, 0);
  assert.ok(!saved.order.addons.some(addon => addon.id === 'additional-extensions'));
  assert.equal(saved.order.location?.id, order.location?.id);
  assert.equal(saved.order.bundle?.id, order.bundle?.id);
  assert.equal(saved.order.phoneNumber?.id, order.phoneNumber?.id);
  assert.equal(saved.order.addons[0].id, order.addons[0].id);
  assert.equal(JSON.parse(encodeDraft(order, filters, now)).extensionCount, 0);
});

test('restores custom business email from the catalog with its monthly price', () => {
  const email = availableAddons.find(addon => addon.id === 'custom-business-email')!;
  const saved = decodeDraft(encodeDraft({ ...order, addons: [email] }, filters, now), empty, now);
  assert.equal(saved.order.addons[0].id, email.id);
  assert.equal(saved.order.addons[0].price, 10);
  assert.equal(saved.order.addons[0].billingCycle, 'monthly');
});

test('preserves nationwide browsing and states without listed offices on refresh', () => {
  for (const state of ['', 'California', 'Alaska']) {
    const savedFilters = { state, city: 'all' };
    const saved = decodeDraft(encodeDraft(order, savedFilters, now), empty, now);
    assert.deepEqual(saved.filters, { ...savedFilters, country: 'US' });
    assert.equal(saved.order.location?.id, location.id);
    assert.equal(saved.order.bundle?.id, bundles[2].id);
  }
});

test('preserves Canada and Puerto Rico browsing without replacing the selected US office', () => {
  for (const savedFilters of [
    { country: 'CA' as const, state: 'Ontario', city: 'all' },
    { country: 'PR' as const, state: 'Puerto Rico', city: 'all' },
  ]) {
    const saved = decodeDraft(encodeDraft(order, savedFilters, now), empty, now);
    assert.deepEqual(saved.filters, savedFilters);
    assert.equal(saved.order.location?.id, location.id);
    assert.equal(saved.order.bundle?.id, order.bundle?.id);
  }
});

test('country changes cannot restore a state or city from a different country', () => {
  const saved = decodeDraft(encodeDraft(order, { country: 'CA', state: 'Florida', city: 'Miami' }, now), empty, now);
  assert.deepEqual(saved.filters, { country: 'CA', state: '', city: '' });
});

test('stores identifiers, not trusted prices, agreement consent or card data', () => {
  const raw = JSON.parse(encodeDraft(order, filters, now));
  assert.equal(raw.bundle, undefined);
  assert.equal(raw.addons[0].price, undefined);
  assert.equal(raw.agreementAccepted, undefined);
  assert.equal(raw.cardNumber, undefined);
  raw.bundle = { ...bundles[2], price: 1 };
  raw.addons[0].price = 1;
  const restored = decodeDraft(JSON.stringify(raw), empty, now);
  assert.equal(restored.order.bundle?.price, bundles[2].price);
  assert.equal(restored.order.addons[0].price, selectedPackage.price);
});

test('rejects invalid, expired, future and incompatible drafts', () => {
  assert.throws(() => decodeDraft('{', empty, now));
  assert.throws(() => decodeDraft('{}', empty, now));
  assert.throws(() => decodeDraft(encodeDraft(order, filters, now - DRAFT_TTL - 1), empty, now));
  assert.throws(() => decodeDraft(encodeDraft(order, filters, now + 120_000), empty, now));
  const invalid = JSON.parse(encodeDraft(order, filters, now));
  invalid.version = 2;
  assert.throws(() => decodeDraft(JSON.stringify(invalid), empty, now));
});

test('ignores removed catalog records and invalid local numbers and filters', () => {
  const raw = JSON.parse(encodeDraft(order, filters, now));
  raw.locationId = sampleLocations[1].id;
  raw.addons.push({ id: 'removed-addon' }, raw.addons[0]);
  raw.filters = { state: 'nonexistent', city: 'nonexistent' };
  const restored = decodeDraft(JSON.stringify(raw), empty, now);
  assert.equal(restored.order.phoneNumber, null);
  assert.equal(restored.order.addons.length, 1);
  assert.equal(restored.filters.state, sampleLocations[1].state);
  assert.equal(restored.filters.city, '');
});
