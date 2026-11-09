import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getInitialCustomizationAddons, partitionCustomizationAddons, sortCustomizationAddons } from './addon-presentation';
import { availableAddons, bundles, getIncludedAddonIds, isAddonIncludedInBundle } from './types';

const preferred = ['callout', 'custom-business-email', 'supervised-transfer', 'message-taking', 'appointment-scheduling'];

test('requested add-ons stay first in exact order without mutating the catalog', () => {
  const before = availableAddons.map(addon => addon.id);
  const sorted = sortCustomizationAddons(availableAddons);
  assert.deepEqual(sorted.slice(0, 5).map(addon => addon.id), preferred);
  assert.deepEqual(availableAddons.map(addon => addon.id), before);
  assert.ok(!sorted.some(addon => addon.id === 'additional-extensions'));
});

test('every bundle separates every included add-on from the complete optional catalog in priority order', () => {
  const sorted = sortCustomizationAddons(availableAddons);
  for (const bundle of bundles) {
    const { includedAddons, optionalAddons } = partitionCustomizationAddons(sorted, bundle);
    assert.deepEqual(new Set(includedAddons.map(addon => addon.id)), new Set(getIncludedAddonIds(bundle)), bundle.tier);
    assert.deepEqual(optionalAddons, sorted.filter(addon => !isAddonIncludedInBundle(addon.id, bundle)));
    assert.equal(includedAddons.length + optionalAddons.length, sorted.length);
    assert.ok(!optionalAddons.some(addon => includedAddons.includes(addon)));
    assert.equal(new Set([...includedAddons, ...optionalAddons].map(addon => addon.id)).size, sorted.length);
  }
});

test('each initial preview contains optional preferred services, rounded up with the next real optional card', () => {
  const sorted = sortCustomizationAddons(availableAddons);
  const expectedCounts = [6, 4, 4, 2, 2];
  bundles.forEach((bundle, index) => {
    const preview = getInitialCustomizationAddons(sorted, bundle);
    const { optionalAddons } = partitionCustomizationAddons(sorted, bundle);
    const optionalPreferred = preferred.filter(id => !isAddonIncludedInBundle(id, bundle));
    assert.deepEqual(preview.slice(0, optionalPreferred.length).map(addon => addon.id), optionalPreferred, bundle.tier);
    assert.equal(preview.length, expectedCounts[index], bundle.tier);
    assert.equal(preview.length % 2, 0, bundle.tier);
    assert.ok(preview.every(addon => optionalAddons.includes(addon)));
    assert.equal(new Set(preview.map(addon => addon.id)).size, preview.length);
  });
});

test('Essentials and no bundle have no included line and retain the full optional catalog', () => {
  const sorted = sortCustomizationAddons(availableAddons);
  for (const bundle of [null, bundles[0]]) {
    const { includedAddons, optionalAddons } = partitionCustomizationAddons(sorted, bundle);
    assert.deepEqual(includedAddons, []);
    assert.deepEqual(optionalAddons, sorted);
    assert.deepEqual(getInitialCustomizationAddons(sorted, bundle).slice(0, 5).map(addon => addon.id), preferred);
  }
});

test('changing bundles reclassifies services without mutating the catalog or losing optional services', () => {
  const sorted = sortCustomizationAddons(availableAddons);
  const before = sorted.map(addon => addon.id);
  const premium = partitionCustomizationAddons(sorted, bundles.find(bundle => bundle.id === 'premium')!);
  const platinum = partitionCustomizationAddons(sorted, bundles.find(bundle => bundle.id === 'prestige')!);
  assert.ok(premium.includedAddons.some(addon => addon.id === 'message-taking'));
  assert.ok(platinum.optionalAddons.some(addon => addon.id === 'message-taking'));
  assert.ok(platinum.includedAddons.some(addon => addon.id === 'appointment-scheduling'));
  assert.ok(premium.optionalAddons.some(addon => addon.id === 'appointment-scheduling'));
  // An odd complete optional catalog is real inventory, not a reason to hide a service.
  assert.equal(premium.optionalAddons.length % 2, 1);
  assert.equal(premium.optionalAddons.length + premium.includedAddons.length, sorted.length);
  assert.deepEqual(sorted.map(addon => addon.id), before);
});

test('small, empty and non-preferred inventories never need duplicated or placeholder cards', () => {
  const sorted = sortCustomizationAddons(availableAddons);
  const nonPreferred = sorted.filter(addon => !preferred.includes(addon.id));
  assert.equal(getInitialCustomizationAddons(nonPreferred, null).length, 2);
  assert.deepEqual(getInitialCustomizationAddons([sorted[0]], null), [sorted[0]]);
  assert.deepEqual(getInitialCustomizationAddons([], null), []);
  const includedOnly = sorted.filter(addon => isAddonIncludedInBundle(addon.id, bundles[1]));
  assert.deepEqual(getInitialCustomizationAddons(includedOnly, bundles[1]), []);
  const retired = { ...sorted[0], id: 'additional-extensions' };
  assert.deepEqual(partitionCustomizationAddons([retired], null), { includedAddons: [], optionalAddons: [] });
});

test('custom business email is a $10 monthly optional add-on with the supplied details', () => {
  const email = availableAddons.find(addon => addon.id === 'custom-business-email')!;
  assert.equal(email.name, 'Custom Business Email');
  assert.equal(email.price, 10);
  assert.equal(email.billingCycle, 'monthly');
  assert.ok(email.detailedDescription?.includes('you@yourcompany.com'));
  assert.ok(email.detailedDescription?.includes('domain registration, 10gb secure email hosting'));
  for (const bundle of bundles) assert.equal(isAddonIncludedInBundle(email.id, bundle), false);
});
