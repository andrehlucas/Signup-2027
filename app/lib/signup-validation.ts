import { z } from 'zod';
import { type CountryCode } from 'libphonenumber-js/max';
import { phoneCountries, phoneExample, validPhone } from './phone';

export const SIGNUP_LIMITS = { name: 80, email: 254, company: 160 } as const;
export type SignupField = 'firstName' | 'lastName' | 'phone' | 'email' | 'confirmEmail' | 'company' | 'terms';
export interface SignupFields {
  firstName: string;
  lastName: string;
  phone?: string;
  countryRegion: CountryCode;
  email: string;
  confirmEmail: string;
  company: string;
  termsAccepted: boolean;
}

const emailSchema = z.string().max(SIGNUP_LIMITS.email).email();
// Allow international names, initials and common name punctuation, not numbers or markup.
const nameCharacters = /^[\p{L}\p{M}\p{Zs}.'’ʼ,\-\u2010\u2011\u00b7\u200c\u200d]+$/u;

export function validateSignup(fields: SignupFields): Partial<Record<SignupField, string>> {
  const errors: Partial<Record<SignupField, string>> = {};
  for (const [key, label] of [['firstName', 'First name'], ['lastName', 'Last name']] as const) {
    const value = fields[key].trim();
    if (!value) errors[key] = `${label} is required`;
    else if (value.length > SIGNUP_LIMITS.name) errors[key] = `${label} must be ${SIGNUP_LIMITS.name} characters or fewer`;
    else if (!nameCharacters.test(value) || !/\p{L}/u.test(value)) {
      errors[key] = 'Use letters and name punctuation, such as hyphens or apostrophes';
    }
  }

  if (!fields.phone) errors.phone = 'Phone number is required';
  else if (!validPhone(fields.phone, fields.countryRegion)) {
    const country = phoneCountries.find(country => country.region === fields.countryRegion);
    const example = phoneExample(fields.countryRegion);
    errors.phone = `Enter a valid phone number for ${country?.name || fields.countryRegion}${example ? `, for example ${example}` : ''}.`;
  }

  for (const [key, label] of [['email', 'Email address'], ['confirmEmail', 'Confirm email address']] as const) {
    const value = fields[key].trim();
    if (!value) errors[key] = key === 'confirmEmail' ? 'Please confirm your email address' : `${label} is required`;
    else if (!emailSchema.safeParse(value).success) errors[key] = 'Enter a valid email address, such as name@example.com';
  }
  if (!errors.email && !errors.confirmEmail && fields.email.trim().toLowerCase() !== fields.confirmEmail.trim().toLowerCase()) {
    errors.confirmEmail = 'Email addresses do not match';
  }

  const company = fields.company.trim();
  if (!company) errors.company = 'Company name is required';
  else if (company.length > SIGNUP_LIMITS.company) errors.company = `Company name must be ${SIGNUP_LIMITS.company} characters or fewer`;
  else if (!/[\p{L}\p{N}]/u.test(company) || /[<>\u0000-\u001f\u007f]/u.test(company)) {
    errors.company = 'Enter your company name using letters, numbers and business punctuation';
  }
  if (!fields.termsAccepted) errors.terms = 'You must agree to the Terms of Use';
  return errors;
}
