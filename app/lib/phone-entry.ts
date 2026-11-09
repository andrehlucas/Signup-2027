import {
  AsYouType, getCountryCallingCode, parseDigits, parseIncompletePhoneNumber,
  type CountryCode, type E164Number,
} from 'libphonenumber-js/max';

export interface PhoneEntry {
  text: string;
  value: E164Number | undefined;
  country: CountryCode;
}

// Pure formatting, independent of DOM selection, keyboard events or input masks.
export function formatPhoneEntry(raw: string, country: CountryCode): PhoneEntry {
  const input = parseIncompletePhoneNumber(
    raw.normalize('NFKC').trim().replace(/^tel:\s*/i, '').replace(/^00/, '+'),
  );
  const formatter = new AsYouType(country);
  const text = formatter.input(input);
  const number = formatter.getNumber();
  if (number?.isValid()) {
    const resolvedCountry = number.country &&
      number.countryCallingCode !== getCountryCallingCode(country) ? number.country : country;
    return { text: number.formatNational(), value: number.number, country: resolvedCountry };
  }
  return { text, value: formatter.getNumberValue(), country };
}

export function formatPhoneEdit(
  raw: string,
  previous: string,
  country: CountryCode,
  inputType: string,
  selection: number | null,
) {
  let edited = raw;
  let digitsBeforeCaret = selection === null ? undefined : parseDigits(raw.slice(0, selection)).length;
  // Deleting a formatting separator should remove the adjacent digit, not
  // continually put the same separator back and trap the Backspace key.
  if (selection !== null && inputType.startsWith('delete') &&
    raw.length < previous.length && parseDigits(raw) === parseDigits(previous)) {
    const backwards = inputType === 'deleteContentBackward';
    let index = backwards ? selection - 1 : selection;
    while (index >= 0 && index < raw.length && !/\d/.test(raw[index])) index += backwards ? -1 : 1;
    if (index >= 0 && index < raw.length) {
      edited = raw.slice(0, index) + raw.slice(index + 1);
      if (backwards && digitsBeforeCaret !== undefined) digitsBeforeCaret = Math.max(0, digitsBeforeCaret - 1);
    }
  }
  const entry = formatPhoneEntry(edited, country);
  let caret: number | undefined;
  if (digitsBeforeCaret !== undefined) {
    if (digitsBeforeCaret >= parseDigits(edited).length) caret = entry.text.length;
    else if (digitsBeforeCaret === 0) caret = 0;
    else {
      let digits = 0;
      for (let index = 0; index < entry.text.length; index++) {
        if (/\d/.test(entry.text[index]) && ++digits === digitsBeforeCaret) {
          caret = index + 1;
          break;
        }
      }
    }
  }
  return { ...entry, caret };
}
