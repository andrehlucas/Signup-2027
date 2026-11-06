import assert from 'node:assert/strict';
import test from 'node:test';
import { getLocationCityOptions, getStates, getLocationsByState, sampleLocations } from './types';
import { getCountryLocations, getLocationRegions, LOCATION_COUNTRIES } from './location-regions';

test('offers US, Canada and Puerto Rico with country-appropriate regions', () => {
  assert.deepEqual(LOCATION_COUNTRIES.map(country => country.value), ['US', 'CA', 'PR']);
  assert.equal(getLocationRegions('US').length, 51);
  assert.equal(getLocationRegions('CA').length, 13);
  assert.ok(getLocationRegions('CA').includes('Ontario'));
  assert.ok(!getLocationRegions('CA').includes('Florida'));
  assert.deepEqual(getLocationRegions('PR'), ['Puerto Rico']);
});

test('country filtering never shows US offices as Canadian or Puerto Rican inventory', () => {
  assert.equal(getCountryLocations('US', sampleLocations).length, sampleLocations.length);
  assert.deepEqual(getCountryLocations('CA', sampleLocations), []);
  assert.deepEqual(getCountryLocations('PR', sampleLocations), []);
  const canada = { ...sampleLocations[0], id: 'test-ca', countryCode: 'CA' as const, city: 'Toronto', state: 'Ontario', stateCode: 'ON' };
  const puertoRico = { ...sampleLocations[0], id: 'test-pr', countryCode: 'PR' as const, city: 'San Juan', state: 'Puerto Rico', stateCode: 'PR' };
  const catalog = [...sampleLocations, canada, puertoRico];
  assert.deepEqual(getCountryLocations('CA', catalog), [canada]);
  assert.deepEqual(getCountryLocations('PR', catalog), [puertoRico]);
  assert.deepEqual(getLocationCityOptions('', getCountryLocations('CA', catalog)).map(option => option.label), ['Toronto, ON']);
});

test('offers all 50 states plus DC without inventing office locations', () => {
  const states = getStates();
  assert.equal(states.length, 51);
  assert.equal(new Set(states).size, 51);
  for (const state of ['Alaska', 'California', 'Florida', 'New York', 'Wyoming', 'District of Columbia']) {
    assert.ok(states.includes(state), state);
  }
  assert.deepEqual(getLocationsByState('California'), []);
});

test('city search is nationwide without a selected state and includes state labels', () => {
  const cities = getLocationCityOptions();
  assert.equal(cities.length, 5);
  assert.deepEqual(cities.find(option => option.city === 'Miami'), {
    value: 'Florida::Miami', label: 'Miami, FL', state: 'Florida', city: 'Miami',
  });
  assert.equal(getLocationCityOptions('Florida').find(option => option.city === 'Miami')?.value, 'Miami');
  assert.deepEqual(getLocationCityOptions('California'), []);
});

test('identical city names in different states remain distinct nationwide options', () => {
  const catalog = [
    { ...sampleLocations[0], city: 'Springfield', state: 'Illinois', stateCode: 'IL' },
    { ...sampleLocations[0], city: 'Springfield', state: 'Massachusetts', stateCode: 'MA' },
  ];
  const cities = getLocationCityOptions('', catalog);
  assert.equal(cities.length, 2);
  assert.equal(new Set(cities.map(city => city.value)).size, 2);
  assert.deepEqual(cities.map(city => city.label), ['Springfield, IL', 'Springfield, MA']);
});
