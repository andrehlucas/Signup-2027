'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, MapPin, Star, Building2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useOrder } from '../context';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';
import {
  bundles,
  featureLabels,
  getStates,
  getCitiesByState,
  getLocationsByCity,
  Bundle,
  AvailableLocation,
} from '../types';

export default function PickPlanPage() {
  const router = useRouter();
  const { order, setLocation, setBundle } = useOrder();
  const [subStep, setSubStep] = useState<'location' | 'review'>(order.location ? 'review' : 'location');
  const { trackComplete } = useFunnelTracking('pick_plan');

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const states = useMemo(() => getStates(), []);
  const cities = useMemo(
    () => (selectedState ? getCitiesByState(selectedState) : []),
    [selectedState]
  );
  const availableLocations = useMemo(
    () => (selectedCity ? getLocationsByCity(selectedCity) : []),
    [selectedCity]
  );

  useEffect(() => {
    if (order.location) {
      setBundle(bundles[0]);
    }
  }, [order.location]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity('');
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleLocationSelect = (location: AvailableLocation) => {
    setLocation(location);
    setBundle(bundles[0]);
    setSubStep('review');
  };

  const handleContinue = () => {
    if (order.location && order.bundle) {
      trackComplete({ bundle: order.bundle.name });
      router.push('/add-location/customize');
    }
  };

  if (subStep === 'location') {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="pick-plan-page-location">
        <div className="max-w-4xl lg:max-w-6xl mx-auto">
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
                  {availableLocations.map((location) => (
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

  if (!order.location) {
    return null;
  }

  const essentialsPlan = bundles[0];

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-4 pb-8 lg:px-8 lg:pt-8" data-testid="pick-plan-page">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <ProgressIndicator currentStep={2} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 flex items-center gap-4" data-testid="review-location-card">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-[#36bff9]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900" data-testid="heading-pick-plan">
              {order.location.address}
            </p>
            <p className="text-sm text-gray-500">
              {order.location.addressLine2 && <>{order.location.addressLine2}, </>}{order.location.city}, {order.location.stateCode} {order.location.zipCode}
            </p>
          </div>
          <button
            onClick={() => setSubStep('location')}
            className="text-sm text-[#36bff9] hover:text-[#2aa8e0] font-medium flex-shrink-0"
            data-testid="button-change-location"
          >
            Change
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-5" data-testid="review-package-card">
          <div className="bg-[#36bff9] text-white flex items-center justify-between px-5 py-3">
            <h3 className="text-base font-bold">{essentialsPlan.name}</h3>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold">${essentialsPlan.price}</span>
              <span className="text-white/80 text-xs">/mo</span>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(essentialsPlan.features)
                .filter(([, enabled]) => enabled)
                .map(([key]) => (
                  <div key={key} className="flex items-start gap-2 text-xs" data-testid={`feature-${key}`}>
                    <div className="w-4 h-4 rounded-full bg-[#36bff9] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="text-gray-700 leading-snug">{featureLabels[key]}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full h-12 bg-[#36bff9] hover:bg-[#2aa8e0] text-white text-base font-semibold"
          data-testid="button-continue-customize"
        >
          Continue to Add-ons
          <ChevronRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
