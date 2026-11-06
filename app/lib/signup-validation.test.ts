import assert from 'node:assert/strict';
import test from 'node:test';
import { SIGNUP_LIMITS, validateSignup, type SignupFields } from './signup-validation';

const valid: SignupFields = {
  firstName: 'Renée', lastName: "O'Neill", phone: '+12025550123', countryRegion: 'US',
  email: 'name+office@example.com', confirmEmail: 'name+office@example.com',
  company: '3M & Partners, LLC', termsAccepted: true,
};

test('enforces every required contact field and terms consent', () => {
  const errors = validateSignup({
    ...valid, firstName: ' ', lastName: '', phone: undefined, email: '',
    confirmEmail: '', company: '\t ', termsAccepted: false,
  });
  assert.deepEqual(Object.keys(errors), ['firstName', 'lastName', 'phone', 'email', 'confirmEmail', 'company', 'terms']);
});

test('accepts international names, initials, punctuation, and legitimate business names', () => {
  for (const name of ['李', 'محمد', 'Жан', 'José', 'Jean-Luc', 'D’Arcy', 'J.', 'de la Cruz', 'Nguyễn']) {
    assert.deepEqual(validateSignup({ ...valid, firstName: name, lastName: name }), {});
  }
  for (const company of ['3M', 'AT&T', '123 Services Ltd.', '東京株式会社', 'Acme + Co.']) {
    assert.deepEqual(validateSignup({ ...valid, company }), {});
  }
});

test('rejects invalid names and company values without silently deleting typed characters', () => {
  for (const name of ['123', 'John123', '<script>', '---', 'Name\u0001']) {
    assert.ok(validateSignup({ ...valid, firstName: name }).firstName);
  }
  for (const company of ['---', '<script>', 'Company\u0001']) {
    assert.ok(validateSignup({ ...valid, company }).company);
  }
});

test('validates both email fields and ignores surrounding whitespace and case when matching', () => {
  assert.deepEqual(validateSignup({ ...valid, email: ' Name+office@example.com ', confirmEmail: 'name+office@EXAMPLE.COM' }), {});
  for (const email of ['plain-text', 'a..b@example.com', 'a@-example.com', 'a@example', 'a@ex ample.com']) {
    assert.ok(validateSignup({ ...valid, email }).email, email);
    assert.ok(validateSignup({ ...valid, confirmEmail: email }).confirmEmail, email);
  }
  assert.ok(validateSignup({ ...valid, confirmEmail: 'other@example.com' }).confirmEmail);
});

test('enforces length limits and country-specific phone validation', () => {
  assert.ok(validateSignup({ ...valid, firstName: 'a'.repeat(SIGNUP_LIMITS.name + 1) }).firstName);
  assert.ok(validateSignup({ ...valid, company: 'a'.repeat(SIGNUP_LIMITS.company + 1) }).company);
  assert.ok(validateSignup({ ...valid, email: `${'a'.repeat(250)}@example.com` }).email);
  assert.ok(validateSignup({ ...valid, phone: '+1202' }).phone);
  assert.ok(validateSignup({ ...valid, phone: '+33612345678' }).phone);
  assert.deepEqual(validateSignup({ ...valid, phone: '+33612345678', countryRegion: 'FR' }), {});
});
