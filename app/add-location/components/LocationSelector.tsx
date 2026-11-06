'use client';

import { useMemo, useState } from 'react';
import { Building2, Check, MapPin, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { SearchableLocationFilter } from './SearchableLocationFilter';
import { useOrder } from '../context';
import {
  AvailableLocation,
  getCitiesByState,
  getLocationsByState,
  getStates,
} from '../types';

interface LocationSelectorProps {
  onSelect: (location: AvailableLocation) => void;
  onCancel?: () => void;
}

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
    <article
      className={`flex flex-col overflow-hidden rounded-xl border transition-colors ${
        isSelected ? 'border-gray-500' : 'border-gray-200 hover:border-gray-400'
      }`}
      data-testid={`location-card-${location.id}`}
    >
      <div className="flex w-full items-center justify-center overflow-hidden bg-gray-100" style={{ aspectRatio: '1.85 / 1' }}>
        {hasImage ? (
          <img
            src={location.imageUrl}
            alt={location.name}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-600">
            <Building2 className="h-12 w-12" aria-hidden="true" />
            <span className="text-xs">Image unavailable</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-gray-900">{location.name}</h3>
            {location.isPremium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                <Star className="h-3 w-3 fill-amber-500" aria-hidden="true" />
                Premium Location
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            <p className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              {location.address}
            </p>
            {location.addressLine2 && <p className="ml-5">{location.addressLine2}</p>}
            <p className="ml-5">{location.city}, {location.stateCode} {location.zipCode}</p>
          </div>
        </div>

        <Button
          type="button"
          aria-pressed={isSelected}
          onClick={() => onSelect(location)}
          className={`${isSelected ? 'signup-secondary' : 'signup-primary'} w-full`}
          data-testid={`button-select-location-${location.id}`}
        >
          {isSelected && <Check className="mr-2 h-4 w-4" aria-hidden="true" />}
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </div>
    </article>
  );
}

export function LocationSelector({ onSelect, onCancel }: LocationSelectorProps) {
  const { order, locationFilters, setLocationFilters } = useOrder();
  const states = useMemo(() => getStates(), []);
  const selectedState = locationFilters.state;
  const selectedCity = locationFilters.city || (selectedState ? 'all' : '');
  const cities = useMemo(
    () => (selectedState ? getCitiesByState(selectedState) : []),
    [selectedState]
  );
  const locations = useMemo(() => {
    if (!selectedState) return [];
    const stateLocations = getLocationsByState(selectedState);
    return selectedCity && selectedCity !== 'all'
      ? stateLocations.filter((location) => location.city === selectedCity)
      : stateLocations;
  }, [selectedState, selectedCity]);

  const handleStateChange = (state: string) => {
    setLocationFilters({ state, city: state ? 'all' : '' });
  };

  const handleCityChange = (city: string) => {
    if (!selectedState) return;
    setLocationFilters({ state: selectedState, city });
  };

  return (
    <div className="signup-surface mb-6 p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Select Your Location</h2>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="signup-secondary"
            onClick={onCancel}
            data-testid="button-cancel-location"
          >
            Cancel
          </Button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="location-state" className="mb-2 block text-sm font-medium text-gray-700">
            State
          </label>
          <SearchableLocationFilter
            id="location-state"
            label="State"
            value={selectedState}
            onChange={handleStateChange}
            options={states.map(state => ({ value: state, label: state }))}
            placeholder="Select a state"
            testId="select-state"
          />
        </div>

        <div>
          <label htmlFor="location-city" className="mb-2 block text-sm font-medium text-gray-700">
            City
          </label>
          <SearchableLocationFilter
            id="location-city"
            label="City"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedState}
            options={[
              { value: 'all', label: 'All cities' },
              ...cities.map(city => ({ value: city, label: city })),
            ]}
            placeholder={selectedState ? 'All cities' : 'Select a state first'}
            testId="select-city"
          />
        </div>
      </div>

      {!selectedState ? (
        <div className="py-10 text-center text-gray-500">
          <MapPin className="mx-auto mb-3 h-10 w-10 text-gray-300" aria-hidden="true" />
          <p>Select a state to view available locations</p>
        </div>
      ) : locations.length > 0 ? (
        <div data-testid="locations-list">
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Available locations in {selectedCity === 'all' ? selectedState : `${selectedCity}, ${selectedState}`}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                isSelected={order.location?.id === location.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="py-10 text-center text-gray-500" data-testid="locations-empty">
          <Building2 className="mx-auto mb-3 h-10 w-10 text-gray-300" aria-hidden="true" />
          <p>No locations are available for this selection.</p>
        </div>
      )}
    </div>
  );
}
