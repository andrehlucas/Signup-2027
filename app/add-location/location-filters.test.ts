import assert from 'node:assert/strict';
import test from 'node:test';
import { getLocationCityOptions, getStates, getLocationsByState, sampleLocations } from './types';

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
