'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { LOCATION_COUNTRIES, type LocationCountry } from '../location-regions';

export function MobileCountrySelector({
  value, onChange,
}: {
  value: LocationCountry;
  onChange: (country: LocationCountry) => void;
}) {
  const selected = LOCATION_COUNTRIES.find(country => country.value === value)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-14 shrink-0 gap-1 bg-gray-50 px-1.5 hover:bg-gray-100 focus-visible:ring-[#006d91]"
          aria-label={`Country / region: ${selected.label}. Change country`}
          data-testid="select-country-mobile"
        >
          <img src={`/flags/${value.toLowerCase()}.svg`} alt="" aria-hidden="true" width={24} height={16} className="h-4 w-6 object-contain" />
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-600" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        collisionPadding={16}
        className="w-52 data-[state=open]:animate-none data-[state=closed]:animate-none"
      >
        <DropdownMenuRadioGroup
          aria-label="Country / region"
          value={value}
          onValueChange={country => onChange(country as LocationCountry)}
        >
          {LOCATION_COUNTRIES.map(country => (
            <DropdownMenuRadioItem
              key={country.value}
              value={country.value}
              className="min-h-11 gap-3 text-base"
              data-testid={`mobile-country-option-${country.value}`}
            >
              <img src={`/flags/${country.value.toLowerCase()}.svg`} alt="" aria-hidden="true" width={28} height={20} className="h-5 w-7 object-contain" />
              {country.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
