import {
  AsYouType, getCountries, getCountryCallingCode, getExampleNumber,
  isSupportedCountry, parsePhoneNumberFromString,
  type CountryCode, type E164Number,
} from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/mobile/examples';

const names = new Intl.DisplayNames(['en'], { type: 'region' });
const preferred: CountryCode[] = ['US', 'CA', 'GB', 'AU'];

export const phoneCountries = getCountries()
  .map(region => ({
    region,
    code: `+${getCountryCallingCode(region)}`,
    name: names.of(region) || region,
    flag: String.fromCodePoint(...[...region].map(letter => 127397 + letter.charCodeAt(0))),
  }))
  .sort((a, b) => {
    const ai = preferred.indexOf(a.region), bi = preferred.indexOf(b.region);
    if (ai >= 0 || bi >= 0) return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
    return a.name.localeCompare(b.name, 'en');
  });

export function phoneCountry(region: string): CountryCode {
  return isSupportedCountry(region) ? region as CountryCode : 'US';
}

export function phoneValue(value: string, region: CountryCode): E164Number | undefined {
  const parsed = parsePhoneNumberFromString(value, region);
  if (parsed) return parsed.number;
  const formatter = new AsYouType(region);
  formatter.input(value);
  return formatter.getNumberValue();
}

export function nationalPhone(value: string | undefined, region: CountryCode): string {
  if (!value) return '';
  const parsed = parsePhoneNumberFromString(value, region);
  if (parsed) return parsed.formatNational().replace(/\D/g, '');
  return value.replace(new RegExp(`^\\+${getCountryCallingCode(region)}`), '').replace(/\D/g, '');
}

export function phoneExample(region: CountryCode): string {
  return getExampleNumber(region, examples)?.formatNational() || '';
}

export function validPhone(value: string | undefined, region: CountryCode): boolean {
  if (!value) return false;
  const parsed = parsePhoneNumberFromString(value, region);
  // Some territories share both a calling code and mobile-number ranges (e.g. AX/FI).
  // Do not reject a valid number just because metadata resolves it to the other region.
  return Boolean(parsed?.isValid() && parsed.countryCallingCode === getCountryCallingCode(region));
}

export function pastedPhone(value: string, region: CountryCode) {
  // Accept international numbers prefixed with "+" or the common "00" prefix.
  const text = value.trim().replace(/^00/, '+');
  const parsed = parsePhoneNumberFromString(text, region);
  if (!parsed || parsed.ext) return undefined;
  const possible = parsed.getPossibleCountries();
  const resolvedRegion = parsed.country || (possible.includes(region) ? region : possible[0]);
  if (!resolvedRegion) return undefined;
  return { value: parsed.number, region: resolvedRegion };
}
