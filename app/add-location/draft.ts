import { z } from 'zod';
import {
  availableAddons, bundles, getPhoneNumbersForLocation,
  sampleLocations, sampleTollFreeNumbers, OrderState,
} from './types';
import { getCountryLocations, getLocationRegions, LOCATION_COUNTRY_CODES, type LocationCountry } from './location-regions';

export const DRAFT_KEY = 'opus-enrollment-draft-v1';
export const DRAFT_TTL = 24 * 60 * 60 * 1000;

export interface LocationFilters {
  country?: LocationCountry;
  state: string;
  city: string;
}

const draftSchema = z.object({
  version: z.literal(1),
  savedAt: z.number().finite(),
  userInfo: z.object({
    firstName: z.string().max(200), lastName: z.string().max(200),
    phone: z.string().max(100), countryCode: z.string().max(10),
    countryRegion: z.string().max(10), email: z.string().max(320),
    confirmEmail: z.string().max(320), company: z.string().max(300),
    termsAccepted: z.boolean(),
  }),
  locationId: z.string().nullable(),
  bundleId: z.string().nullable(),
  phoneId: z.string().nullable(),
  tollFreePhoneId: z.string().nullable(),
  addons: z.array(z.object({ id: z.string(), packageId: z.string().optional() })).max(100),
  extensionCount: z.number().int().min(0).max(1000),
  filters: z.object({ country: z.enum(LOCATION_COUNTRY_CODES).default('US'), state: z.string(), city: z.string() }),
});

// Store catalog references, never copied prices or payment-card fields.
export function encodeDraft(order: OrderState, filters: LocationFilters, now = Date.now()) {
  return JSON.stringify({
    version: 1,
    savedAt: now,
    userInfo: order.userInfo,
    locationId: order.location?.id ?? null,
    bundleId: order.bundle?.id ?? null,
    phoneId: order.phoneNumber?.id ?? null,
    tollFreePhoneId: order.tollFreePhoneNumber?.id ?? null,
    addons: order.addons.map(addon => ({ id: addon.id, packageId: addon.selectedPackage?.id })),
    extensionCount: order.extensionCount,
    filters,
  });
}

export function decodeDraft(raw: string, initial: OrderState, now = Date.now()) {
  const draft = draftSchema.parse(JSON.parse(raw));
  if (now - draft.savedAt > DRAFT_TTL || draft.savedAt > now + 60_000) {
    throw new Error('Enrollment draft expired');
  }
  const location = sampleLocations.find(item => item.id === draft.locationId) ?? null;
  const bundle = bundles.find(item => item.id === draft.bundleId) ?? null;
  const phoneNumber = location
    ? getPhoneNumbersForLocation(location).find(item => item.id === draft.phoneId && item.isAvailable) ?? null
    : null;
  const tollFreePhoneNumber = sampleTollFreeNumbers.find(item => item.id === draft.tollFreePhoneId && item.isAvailable) ?? null;
  const addons = draft.addons.flatMap(saved => {
    const addon = availableAddons.find(item => item.id === saved.id);
    if (!addon) return [];
    if (!addon.packages?.length) return [{ ...addon }];
    const selectedPackage = addon.packages.find(item => item.id === saved.packageId) ?? addon.packages[0];
    return [{ ...addon, selectedPackage, price: selectedPackage.price }];
  }).filter((addon, index, all) => all.findIndex(item => item.id === addon.id) === index);
  const country = draft.filters.country;
  const countryLocations = getCountryLocations(country, sampleLocations);
  const state = draft.filters.state === '' || getLocationRegions(country).includes(draft.filters.state)
    ? draft.filters.state : location && (location.countryCode ?? 'US') === country ? location.state : '';
  const city = draft.filters.city === 'all' || countryLocations.some(item => (!state || item.state === state) && item.city === draft.filters.city)
    ? draft.filters.city : '';
  return {
    order: {
      ...initial, userInfo: draft.userInfo, location, bundle, phoneNumber, tollFreePhoneNumber,
      addons, extensionCount: draft.extensionCount,
      // Consent and promotions must be confirmed again, not trusted from storage.
      agreementAccepted: false, appliedPromo: null,
    } satisfies OrderState,
    filters: { country, state, city },
  };
}
