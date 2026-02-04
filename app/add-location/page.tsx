'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Building2, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { ProgressIndicator } from './components/ProgressIndicator';
import { useOrder } from './context';
import {
  getStates,
  getCitiesByState,
  getLocationsByCity,
  AvailableLocation,
} from './types';

export default function LocationSelectionPage() {
  const router = useRouter();
  const { setLocation } = useOrder();
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<AvailableLocation | null>(null);

  const states = useMemo(() => getStates(), []);
  const cities = useMemo(
    () => (selectedState ? getCitiesByState(selectedState) : []),
    [selectedState]
  );
  const locations = useMemo(
    () => (selectedCity ? getLocationsByCity(selectedCity) : []),
    [selectedCity]
  );

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity('');
    setSelectedLocation(null);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedLocation(null);
  };

  const handleLocationSelect = (location: AvailableLocation) => {
    setSelectedLocation(location);
  };

  const handleContinue = () => {
    if (selectedLocation) {
      setLocation(selectedLocation);
      router.push('/add-location/customize');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8" data-testid="location-selection-page">
      <Button
        variant="ghost"
        onClick={() => router.push('/')}
        className="mb-6"
        data-testid="button-back-dashboard"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <ProgressIndicator currentStep={1} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-location">
            Add New Location
          </h1>
          <p className="text-gray-600">
            Expand your business with a new prestigious address
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Your Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger data-testid="select-state">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state} data-testid={`option-state-${state}`}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <Select
                value={selectedCity}
                onValueChange={handleCityChange}
                disabled={!selectedState}
              >
                <SelectTrigger data-testid="select-city">
                  <SelectValue placeholder={selectedState ? 'Select a city' : 'Select state first'} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city} data-testid={`option-city-${city}`}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCity && (
            <div className="space-y-3" data-testid="locations-list">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Available Locations in {selectedCity}
              </h3>
              {locations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLocation?.id === location.id
                      ? 'border-[#36bff9] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  data-testid={`location-card-${location.id}`}
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{location.name}</h4>
                      {location.isPremium && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-semibold">
                          <Star className="h-3 w-3 fill-amber-500" />
                          Premium Location
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {location.address}, {location.city}, {location.stateCode} {location.zipCode}
                    </p>
                  </div>
                  <ChevronRight className={`h-5 w-5 flex-shrink-0 ${
                    selectedLocation?.id === location.id ? 'text-[#36bff9]' : 'text-gray-400'
                  }`} />
                </div>
              ))}
            </div>
          )}

          {!selectedState && (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Select a state to view available locations</p>
            </div>
          )}

          {selectedState && !selectedCity && (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Select a city to view available locations</p>
            </div>
          )}
        </div>

        {selectedLocation && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="selected-location-preview">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Location</h3>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{selectedLocation.name}</h4>
                  {selectedLocation.isPremium && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-semibold">
                      <Star className="h-3 w-3 fill-amber-500" />
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-1">{selectedLocation.address}</p>
                <p className="text-gray-600">
                  {selectedLocation.city}, {selectedLocation.stateCode} {selectedLocation.zipCode}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            disabled={!selectedLocation}
            className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white px-8"
            data-testid="button-continue-customize"
          >
            Continue to Customize
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
