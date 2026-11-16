'use client';

import { useMemo, useState } from 'react';
import { Building2, Check, MapPin, Star } from 'lucide-react';
import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { Selector } from '@astryxdesign/core/Selector';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { useOrder } from '../context';
import {
  AvailableLocation,
  getLocationCityOptions,
  sampleLocations,
} from '../types';
import { getCountryLocations, getLocationRegions, LOCATION_COUNTRIES, type LocationCountry } from '../location-regions';

interface LocationSelectorProps {
  onSelect: (location: AvailableLocation) => void;
  onCancel?: () => void;
}

const flag = (country: string) => (
  // Decorative: the option label names the country.
  <img src={`/flags/${country.toLowerCase()}.svg`} alt="" aria-hidden="true" width={24} height={16} />
);

const countryOptions = LOCATION_COUNTRIES.map(country => ({ ...country, icon: flag(country.value) }));

function LocationCard({
  location,
  isSelected,
  onSelect,
}: {
  location: AvailableLocation;
  isSelected: boolean;
  onSelect: (location: AvailableLocation) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(location.imageUrl && location.imageUrl !== '/placeholder-building.jpg' && !imageFailed);

  return (
    <Card
      padding={0}
      // DESIGN.md: the selected card takes a thin blue-ink outline. An outline
      // (not an inset shadow) so it paints over the photo at the top edge.
      className={`overflow-hidden ${isSelected ? '[outline:2px_solid_var(--color-text-accent)] [outline-offset:-2px]' : ''}`}
      data-testid={`location-card-${location.id}`}
    >
      <VStack height="100%">
        <AspectRatio ratio={1.85} fit="cover" className="bg-[var(--color-background-muted)]">
          {hasImage ? (
            <img src={location.imageUrl} alt={location.name} loading="lazy" onError={() => setImageFailed(true)} />
          ) : (
            <VStack gap={1} hAlign="center" vAlign="center" height="100%">
              <Icon icon={Building2} size="lg" color="secondary" />
              <Text type="supporting" color="secondary">Image unavailable</Text>
            </VStack>
          )}
        </AspectRatio>

        <StackItem size="fill">
          <VStack gap={3} padding={4} height="100%">
            <VStack gap={1}>
              <HStack gap={2} vAlign="center" wrap="wrap">
                <Heading level={4}>{location.name}</Heading>
                {location.isPremium && (
                  <Badge variant="yellow" icon={<Icon icon={Star} size="sm" />} label="Premium Location" />
                )}
              </HStack>
              <HStack gap={1} vAlign="start">
                <Icon icon={MapPin} size="sm" color="secondary" aria-hidden="true" />
                <VStack gap={0}>
                  <Text type="supporting" color="secondary">{location.address}</Text>
                  {location.addressLine2 && <Text type="supporting" color="secondary">{location.addressLine2}</Text>}
                  <Text type="supporting" color="secondary">
                    {location.city}, {location.stateCode} {location.zipCode}
                  </Text>
                </VStack>
              </HStack>
            </VStack>

            {/* Pushes the action to the bottom so buttons line up across a row. */}
            <StackItem size="fill" />

            <Button
              type="button"
              variant={isSelected ? 'secondary' : 'primary'}
              label={isSelected ? 'Selected' : 'Select'}
              icon={isSelected ? <Icon icon={Check} size="sm" /> : undefined}
              aria-pressed={isSelected}
              onClick={() => onSelect(location)}
              width="100%"
              data-testid={`button-select-location-${location.id}`}
            />
          </VStack>
        </StackItem>
      </VStack>
    </Card>
  );
}

export function LocationSelector({ onSelect, onCancel }: LocationSelectorProps) {
  const { order, locationFilters, setLocationFilters } = useOrder();
  const selectedCountry = locationFilters.country ?? 'US';
  const countryName = LOCATION_COUNTRIES.find(country => country.value === selectedCountry)!.label;
  const regionLabel = selectedCountry === 'CA' ? 'Province / territory' : selectedCountry === 'PR' ? 'Territory' : 'State';
  const allRegionsLabel = selectedCountry === 'CA' ? 'All provinces / territories' : selectedCountry === 'PR' ? 'All areas' : 'All states';
  const states = useMemo(() => getLocationRegions(selectedCountry), [selectedCountry]);
  const countryLocations = useMemo(() => getCountryLocations(selectedCountry, sampleLocations), [selectedCountry]);
  const selectedState = locationFilters.state;
  const selectedCity = locationFilters.city || 'all';
  const hasLocationSearch = Boolean(selectedState || selectedCity !== 'all');
  const cities = useMemo(
    () => getLocationCityOptions(selectedState, countryLocations),
    [selectedState, countryLocations]
  );
  const locations = useMemo(() => {
    if (!hasLocationSearch) return [];
    const stateLocations = selectedState ? countryLocations.filter(location => location.state === selectedState) : countryLocations;
    return selectedCity && selectedCity !== 'all'
      ? stateLocations.filter((location) => location.city === selectedCity)
      : stateLocations;
  }, [selectedState, selectedCity, countryLocations, hasLocationSearch]);

  const handleStateChange = (state: string) => {
    setLocationFilters({ country: selectedCountry, state: state === 'all' ? '' : state, city: 'all' });
  };

  const handleCityChange = (city: string) => {
    if (city === 'all') {
      setLocationFilters({ country: selectedCountry, state: selectedState, city: 'all' });
      return;
    }
    const option = cities.find(option => option.value === city);
    if (option) setLocationFilters({ country: selectedCountry, state: option.state, city: option.city });
  };

  const handleCountryChange = (country: string) => {
    setLocationFilters({ country: country as LocationCountry, state: '', city: 'all' });
  };

  return (
    <Card className="signup-surface md:p-6" padding={5}>
      <VStack gap={6}>
        <VStack gap={4}>
          <HStack gap={2} vAlign="center" wrap="wrap">
            <StackItem size="fill">
              <Heading level={2}>Select Your Location</Heading>
            </StackItem>
            {/* Phones: a compact flag picker in the header replaces the third filter. */}
            <StackItem className="md:hidden">
              <Selector
                label="Country / region"
                isLabelHidden
                options={countryOptions}
                value={selectedCountry}
                onChange={handleCountryChange}
                renderValue={option => flag(option.value)}
                width={88}
                data-testid="select-country-mobile"
              />
            </StackItem>
            {onCancel && (
              // When the row wraps on phones, keep Cancel at the end.
              <StackItem className="ml-auto">
                <Button
                  type="button"
                  variant="secondary"
                  label="Cancel"
                  onClick={onCancel}
                  data-testid="button-cancel-location"
                />
              </StackItem>
            )}
          </HStack>

          <Grid columns={{ minWidth: 220, max: 3, repeat: 'fit' }} gap={4}>
            <Selector
              label="City"
              options={[{ value: 'all', label: 'All cities' }, ...cities]}
              value={selectedCity}
              onChange={handleCityChange}
              hasSearch
              searchPlaceholder="Search city…"
              emptySearchText="No matching cities."
              data-testid="select-city"
            />
            <Selector
              label={regionLabel}
              options={[{ value: 'all', label: allRegionsLabel }, ...states.map(state => ({ value: state, label: state }))]}
              value={selectedState || 'all'}
              onChange={handleStateChange}
              hasSearch
              searchPlaceholder={`Search ${regionLabel.toLowerCase()}…`}
              emptySearchText={`No matching ${regionLabel.toLowerCase()}.`}
              data-testid="select-state"
            />
            <VStack className="hidden md:flex">
              <Selector
                label="Country / region"
                options={countryOptions}
                value={selectedCountry}
                onChange={handleCountryChange}
                data-testid="select-country"
              />
            </VStack>
          </Grid>
        </VStack>

        {!hasLocationSearch ? (
          <EmptyState
            role="status"
            icon={<Icon icon={MapPin} size="lg" color="secondary" />}
            title="Find your office location"
            description={`Select a ${regionLabel.toLowerCase()} or city to see available locations.`}
            headingLevel={3}
            data-testid="locations-search-prompt"
          />
        ) : locations.length > 0 ? (
          <VStack gap={3} data-testid="locations-list">
            <Heading level={3}>
              {selectedState
                ? `Available locations in ${selectedCity === 'all' ? selectedState : `${selectedCity}, ${selectedState}`}`
                : `Available locations in ${countryName}`}
            </Heading>
            <Grid columns={{ minWidth: 260, max: 3 }} gap={4}>
              {locations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  isSelected={order.location?.id === location.id}
                  onSelect={onSelect}
                />
              ))}
            </Grid>
          </VStack>
        ) : (
          <EmptyState
            icon={<Icon icon={Building2} size="lg" color="secondary" />}
            title="No locations listed"
            description={`No locations are currently listed in ${selectedState ? `${selectedState}, ` : ''}${countryName}.`}
            headingLevel={3}
            actions={
              <Button
                type="button"
                variant="secondary"
                label="Clear filters"
                onClick={() => setLocationFilters({ country: selectedCountry, state: '', city: 'all' })}
                data-testid="button-search-all-states"
              />
            }
            data-testid="locations-empty"
          />
        )}
      </VStack>
    </Card>
  );
}
