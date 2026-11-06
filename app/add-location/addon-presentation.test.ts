import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getInitialCustomizationAddons, sortCustomizationAddons } from './addon-presentation';
import { availableAddons, bundles, getIncludedAddonIds, isAddonIncludedInBundle } from './types';

const preferred = ['callout', 'custom-business-email', 'supervised-transfer', 'message-taking', 'appointment-scheduling'];

test('requested add-ons stay first in exact order without mutating the catalog', () => {
  const before = availableAddons.map(addon => addon.id);
  const sorted = sortCustomizationAddons(availableAddons);
  assert.deepEqual(sorted.slice(0, 5).map(addon => addon.id), preferred);
  assert.deepEqual(availableAddons.map(addon => addon.id), before);
  assert.ok(!sorted.some(addon => addon.id === 'additional-extensions'));
});

test('every bundle keeps all included add-ons visible without displacing the preferred five', () => {
  const sorted = sortCustomizationAddons(availableAddons);
  for (const bundle of bundles) {
    const visible = getInitialCustomizationAddons(sorted, bundle);
    assert.deepEqual(visible.slice(0, 5).map(addon => addon.id), preferred, bundle.tier);
    for (const id of getIncludedAddonIds(bundle)) {
      assert.ok(visible.some(addon => addon.id === id), `${bundle.tier}: ${id}`);
    }
    assert.ok(visible.every(addon => preferred.includes(addon.id) || isAddonIncludedInBundle(addon.id, bundle)));
  }
  assert.deepEqual(getInitialCustomizationAddons(sorted, null).map(addon => addon.id), preferred);
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
