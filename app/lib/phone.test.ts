import assert from 'node:assert/strict';
import test from 'node:test';
import { getCountries, getExampleNumber } from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/mobile/examples';
import { phoneCountries, phoneValue, nationalPhone, phoneExample, validPhone, pastedPhone } from './phone';

test('offers every supported country and round-trips its example number', () => {
  assert.equal(phoneCountries.length, getCountries().length);
  for (const region of getCountries()) {
    const example = getExampleNumber(region, examples);
    if (!example) continue;
    const national = example.formatNational();
    const value = phoneValue(national, region);
    assert.equal(value, example.number, region);
    assert.equal(validPhone(value, region), true, region);
    assert.equal(phoneValue(nationalPhone(value, region), region), value, region);
    assert.ok(phoneExample(region), region);
  }
});

test('formats national numbers without duplicating the country calling code', () => {
  for (const [region, input, expected] of [
    ['US', '(202) 555-0123', '+12025550123'],
    ['CA', '(416) 555-0123', '+14165550123'],
    ['GB', '07700 900123', '+447700900123'],
    ['FR', '06 12 34 56 78', '+33612345678'],
    ['AU', '0412 345 678', '+61412345678'],
    ['DE', '01512 3456789', '+4915123456789'],
    ['IN', '98765 43210', '+919876543210'],
  ] as const) {
    assert.equal(phoneValue(input, region), expected);
    assert.equal(phoneValue(nationalPhone(expected, region), region), expected);
  }
});

test('international paste detects the country, including shared +1 territories', () => {
  assert.deepEqual(pastedPhone('+44 7700 900123', 'US'), { value: '+447700900123', region: 'GB' });
  assert.deepEqual(pastedPhone('0044 7700 900123', 'FR'), { value: '+447700900123', region: 'GB' });
  assert.deepEqual(pastedPhone('+1 (416) 555-0123', 'US'), { value: '+14165550123', region: 'CA' });
});

test('rejects incomplete, overlong, invalid and wrong-country phone numbers', () => {
  for (const value of [undefined, '+1202', '+10000000000', '+120255501234567890']) {
    assert.equal(validPhone(value, 'US'), false);
  }
  assert.equal(validPhone('+12025550123', 'CA'), true); // Shared North American calling plan.
  assert.equal(validPhone('+33612345678', 'US'), false);
  assert.equal(phoneValue('20', 'US'), '+120');
  assert.equal(nationalPhone('+120', 'US'), '20');
  assert.equal(pastedPhone('+1 202 555 0123 ext 42', 'US'), undefined);
});
