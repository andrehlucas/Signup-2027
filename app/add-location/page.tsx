'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Building2 } from 'lucide-react';
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
  const { order, setLocation } = useOrder();
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  useEffect(() => {
    if (!order.userInfo.firstName || !order.userInfo.email) {
      router.push('/');
    }
  }, [order.userInfo, router]);

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
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleLocationSelect = (location: AvailableLocation) => {
    setLocation(location);
    router.push('/add-location/customize');
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="location-selection-page">
      <div className="max-w-4xl lg:max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
          data-testid="button-back-info"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Your Information
        </Button>

        <div className="mb-8">
          <ProgressIndicator currentStep={2} />
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
            <div data-testid="locations-list">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Available Locations in {selectedCity}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex flex-col rounded-lg border-2 border-gray-200 hover:border-[#36bff9] hover:shadow-md transition-all overflow-hidden"
                    data-testid={`location-card-${location.id}`}
                  >
                    <div className="w-full bg-gray-200 flex items-center justify-center" style={{ aspectRatio: '1.85 / 1' }}>
                      <Building2 className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-medium text-gray-900">{location.name}</h4>
                          {location.isPremium && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-semibold">
                              <Star className="h-3 w-3 fill-amber-500" />
                              Premium Location
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                            {location.address}
                          </p>
                          <p className="ml-5">{location.addressLine2}</p>
                          <p className="ml-5">{location.city}, {location.stateCode} {location.zipCode}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleLocationSelect(location)}
                        className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white w-full"
                        data-testid={`button-select-location-${location.id}`}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
      </div>
    </div>
  );
}
