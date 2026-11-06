import { US_STATES } from '../lib/us-states';
import type { AvailableLocation } from './types';

export const LOCATION_COUNTRY_CODES = ['US', 'CA', 'PR'] as const;
export type LocationCountry = typeof LOCATION_COUNTRY_CODES[number];
export const LOCATION_COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'PR', label: 'Puerto Rico' },
];

const canadianRegions = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Yukon',
];

export function getLocationRegions(country: LocationCountry): string[] {
  if (country === 'CA') return [...canadianRegions];
  if (country === 'PR') return ['Puerto Rico'];
  return [...US_STATES];
}

export function getCountryLocations(country: LocationCountry, catalog: AvailableLocation[]): AvailableLocation[] {
  return catalog.filter(location => (location.countryCode ?? 'US') === country);
}
