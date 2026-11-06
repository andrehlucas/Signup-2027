import assert from 'node:assert/strict';
import test from 'node:test';
import { sampleLocations, samplePhoneNumbers, resolveLocalPhoneNumber, getPhoneNumbersForLocation } from './types';

const miami = sampleLocations.find(location => location.city === 'Miami')!;
const boca = sampleLocations.find(location => location.city === 'Boca Raton')!;

test('auto-assigns a local number for each catalog location', () => {
  for (const location of sampleLocations) {
    const number = resolveLocalPhoneNumber(location, null);
    assert.ok(number?.isAvailable, location.city);
  }
  assert.equal(resolveLocalPhoneNumber(miami, null)?.areaCode, '305');
  assert.equal(resolveLocalPhoneNumber(boca, null)?.areaCode, '561');
});

test('each prototype location offers multiple area codes and more than seven options per code', () => {
  assert.equal(new Set(samplePhoneNumbers.map(number => number.id)).size, samplePhoneNumbers.length);
  assert.equal(new Set(samplePhoneNumbers.map(number => number.number)).size, samplePhoneNumbers.length);
  for (const location of sampleLocations) {
    const numbers = getPhoneNumbersForLocation(location).filter(number => number.isAvailable);
    const codes = new Set(numbers.map(number => number.areaCode));
    assert.ok(codes.size > 1, location.city);
    for (const code of codes) {
      assert.ok(numbers.filter(number => number.areaCode === code).length > 7, `${location.city}: ${code}`);
    }
  }
  assert.ok(getPhoneNumbersForLocation(miami).some(number => number.areaCode === '786'));
  assert.ok(!getPhoneNumbersForLocation(boca).some(number => number.areaCode === '786'));
});

test('preserves an available custom choice and replaces incompatible choices', () => {
  const alternate = samplePhoneNumbers.find(number => number.id === 'pn-2')!;
  assert.equal(resolveLocalPhoneNumber(miami, alternate)?.id, alternate.id);
  assert.equal(resolveLocalPhoneNumber(boca, alternate)?.areaCode, '561');
  assert.equal(resolveLocalPhoneNumber(null, alternate), null);
});

test('does not assign unavailable numbers or silently default an unknown city to Miami', () => {
  const first = samplePhoneNumbers[0];
  first.isAvailable = false;
  try {
    assert.notEqual(resolveLocalPhoneNumber(miami, first)?.id, first.id);
    assert.equal(resolveLocalPhoneNumber(miami, first)?.id, 'pn-2');
  } finally {
    first.isAvailable = true;
  }
  assert.equal(resolveLocalPhoneNumber({ ...miami, city: 'Unknown City' }, null), null);
});
