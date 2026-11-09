import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCountries, getExampleNumber, type CountryCode } from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/mobile/examples';
import { formatPhoneEdit, formatPhoneEntry } from './phone-entry';

test('national and autofilled international values produce the same enforced national format', () => {
  for (const [country, national, international, text] of [
    ['US', '2025550123', '+1 (202) 555-0123', '(202) 555-0123'],
    ['GB', '07400123456', '+44 7400 123456', '07400 123456'],
    ['FR', '0612345678', '+33\u00a06\u202f12\u202f34\u202f56\u202f78', '06 12 34 56 78'],
    ['AU', '0412345678', '+61 412 345 678', '0412 345 678'],
  ] as const) {
    assert.equal(formatPhoneEntry(national, country).text, text);
    assert.equal(formatPhoneEntry(international, country).text, text);
    assert.equal(formatPhoneEntry(international, country).value, formatPhoneEntry(national, country).value);
  }
});

test('international replacement resolves country, including 00 prefixes, tel URIs and full-width digits', () => {
  for (const raw of ['+44 7400 123456', '0044 7400 123456', 'tel:+44 7400 123456', '＋４４ ７４００ １２３４５６']) {
    assert.deepEqual(formatPhoneEntry(raw, 'US'), { country: 'GB', value: '+447400123456', text: '07400 123456' });
  }
});

test('shared calling-code territories preserve the selected region without rejecting valid examples', () => {
  assert.equal(formatPhoneEntry('+358 40 1234567', 'AX').country, 'AX');
  assert.equal(formatPhoneEntry('+1 416 555 0123', 'CA').country, 'CA');
});

test('all supported countries with a valid mobile example format without losing their E164 value', () => {
  let checked = 0;
  for (const country of getCountries()) {
    const number = getExampleNumber(country, examples);
    if (!number?.isValid()) continue;
    const national = formatPhoneEntry(number.formatNational(), country);
    const international = formatPhoneEntry(number.number, country);
    assert.equal(national.value, number.number, country);
    assert.equal(international.value, number.number, country);
    assert.equal(international.country, country, country);
    assert.equal(international.text, number.formatNational(), country);
    checked++;
  }
  assert.ok(checked > 200, `Only checked ${checked} country fixtures`);
});

test('empty, malformed and incomplete input remains editable without a selection API', () => {
  for (const raw of ['', '+', '+44', '123', 'not a phone', '+999123', '9'.repeat(300)]) {
    assert.doesNotThrow(() => formatPhoneEdit(raw, '', 'US', 'insertReplacementText', null));
  }
  assert.equal(formatPhoneEntry('not a phone', 'US').text, '');
  assert.equal(formatPhoneEntry('+', 'US').text, '+');
  assert.equal(formatPhoneEdit('+1 2025550123', '', 'US', '', null).caret, undefined);
});

test('ordinary mid-number edits preserve a digit-relative caret', () => {
  const edited = formatPhoneEdit('06 17 34 56 78', '06 12 34 56 78', 'FR', 'insertText', 5);
  assert.equal(edited.text, '06 17 34 56 78');
  assert.ok(edited.caret! < 10);
});

test('Backspace and Delete over separators remove an adjacent digit instead of trapping the cursor', () => {
  const original = '(202) 555-0123';
  const backwards = formatPhoneEdit('(202 555-0123', original, 'US', 'deleteContentBackward', 4);
  const forwards = formatPhoneEdit('(202 555-0123', original, 'US', 'deleteContentForward', 4);
  assert.equal(backwards.value, '+1205550123');
  assert.equal(forwards.value, '+1202550123');
  for (const country of ['US', 'GB', 'FR'] as CountryCode[]) {
    assert.doesNotThrow(() => formatPhoneEdit('', '', country, 'deleteContentBackward', 0));
  }
});
