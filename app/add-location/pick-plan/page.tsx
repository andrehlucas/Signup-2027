'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ChevronRight, MapPin, Star, Building2, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [subStep, setSubStep] = useState<'location' | 'plan'>(order.location ? 'plan' : 'location');
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(order.bundle);
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


  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity('');
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleLocationSelect = (location: AvailableLocation) => {
    setLocation(location);
    setSubStep('plan');
  };

  const handleBundleSelect = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setBundle(bundle);
  };

  const handleContinue = () => {
    if (selectedBundle && order.location) {
      trackComplete({ bundle: selectedBundle.name });
      router.push('/add-location/customize');
    }
  };

  const handleBackFromPlan = () => {
    setSubStep('location');
  };

  const upgradeBundles = bundles.filter(b => b.id !== 'essentials');
  const displayBundleName = selectedBundle
    ? (selectedBundle.tier !== 'The Essentials' ? selectedBundle.tier : 'The Essentials')
    : 'The Essentials';

  if (subStep === 'location') {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="pick-plan-page-location">
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-4 pb-48 lg:px-8 lg:pt-8" data-testid="pick-plan-page">
      <Button
        variant="ghost"
        onClick={handleBackFromPlan}
        className="mb-6"
        data-testid="button-back-location"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Location
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <ProgressIndicator currentStep={2} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-pick-plan">
            Pick Your Plan
          </h1>
          <p className="text-gray-500 text-xs">
            for <span className="font-medium">{order.location.name}</span>, {order.location.city}
          </p>
        </div>

        <div
          onClick={() => handleBundleSelect(bundles[0])}
          className={`bg-white rounded-xl border-2 overflow-hidden mb-6 cursor-pointer transition-all ${
            selectedBundle?.id === bundles[0].id
              ? 'border-[#36bff9] ring-2 ring-[#36bff9] shadow-lg shadow-[#36bff9]/20'
              : 'border-gray-200 hover:shadow-md'
          }`}
          data-testid="essentials-info-banner"
        >
          <div className="bg-[#36bff9] text-white text-center py-2 text-sm font-medium">
            Your Office Package
          </div>
          <div className="p-4">
            <div className="mb-3">
              <h3 className="text-base font-medium text-gray-900">{bundles[0].name}</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">${bundles[0].price}</span>
              <span className="text-gray-500 text-sm ml-1">/mo</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(bundles[0].features).map(([key, enabled]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${enabled ? 'bg-[#36bff9]' : 'bg-gray-200'}`}>
                    <Check className={`h-2.5 w-2.5 ${enabled ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-xs ${enabled ? 'text-gray-700' : 'text-gray-400'}`}>{featureLabels[key]}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleBundleSelect(bundles[0]);
              }}
              className={`w-full mt-4 h-10 font-medium ${
                selectedBundle?.id === bundles[0].id
                  ? 'bg-[#36bff9] hover:bg-[#2aa8e0] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
              }`}
              data-testid="button-select-office-package"
            >
              {selectedBundle?.id === bundles[0].id ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Selected
                </>
              ) : (
                'Select'
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-xl mb-6 overflow-hidden" data-testid="bundle-upgrade-section">
          <div
            className="relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0f1c2e 0%, #1a2d4a 40%, #1e3a5f 70%, #1a2d4a 100%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(54, 191, 249, 0.4) 0%, transparent 50%),
                                  radial-gradient(circle at 80% 20%, rgba(54, 191, 249, 0.3) 0%, transparent 40%),
                                  radial-gradient(circle at 60% 80%, rgba(42, 168, 224, 0.2) 0%, transparent 40%)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2336bff9' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-[#36bff9]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Bundle & Save</h2>
                  <p className="text-xs sm:text-sm text-blue-200/80">All features from The Ultimate Office Solution, plus</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {upgradeBundles.map((bundle) => {
                  const isSelected = selectedBundle?.id === bundle.id;
                  return (
                    <div
                      key={bundle.id}
                      onClick={() => handleBundleSelect(bundle)}
                      className={`rounded-xl overflow-hidden flex flex-col transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-[#36bff9] shadow-lg shadow-[#36bff9]/20'
                          : 'hover:shadow-lg hover:shadow-white/5'
                      }`}
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(54,191,249,0.15) 0%, rgba(30,58,95,0.9) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                        border: isSelected ? '1px solid rgba(54,191,249,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      }}
                      data-testid={`bundle-card-${bundle.id}`}
                    >
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#36bff9]">
                            {bundle.badge}
                          </span>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full px-2 py-0.5">
                              <Check className="h-3 w-3" />
                              Active
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">
                          {bundle.tier}
                        </h3>

                        <div className="mb-4">
                          <span className="text-3xl font-bold text-white">${bundle.price}</span>
                          {bundle.originalPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ${bundle.originalPrice}
                            </span>
                          )}
                          <span className="text-gray-400 text-sm ml-1">/mo</span>
                        </div>

                        <div className="space-y-2 flex-1">
                          {Object.entries(bundle.features)
                            .filter(([, enabled]) => enabled)
                            .map(([key]) => (
                              <div key={key} className="flex items-center gap-2 text-sm">
                                <div className="w-4 h-4 rounded-full bg-[#36bff9]/20 flex items-center justify-center flex-shrink-0">
                                  <Check className="h-2.5 w-2.5 text-[#36bff9]" />
                                </div>
                                <span className="text-white text-xs">{featureLabels[key]}</span>
                              </div>
                            ))}
                        </div>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBundleSelect(bundle);
                          }}
                          className={`mt-4 w-full ${
                            isSelected
                              ? 'bg-[#36bff9] hover:bg-[#2aa8e0] text-white'
                              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                          }`}
                          data-testid={`button-select-bundle-${bundle.id}`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Selected
                            </>
                          ) : (
                            'Select'
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50" data-testid="sticky-footer">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#36bff9] flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                {selectedBundle ? (
                  <>
                    <p className="text-sm font-semibold text-gray-900 leading-tight" data-testid="footer-package-name">{displayBundleName}</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight" data-testid="footer-monthly-total">
                      ${selectedBundle.price}<span className="text-sm font-normal text-gray-500">/mo</span>
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-medium text-gray-500" data-testid="footer-package-name">Select your package</p>
                )}
              </div>
            </div>
            <Button
              onClick={handleContinue}
              disabled={!selectedBundle || !order.location}
              className="h-10 px-6 bg-[#36bff9] hover:bg-[#2aa8e0] text-white flex-shrink-0"
              data-testid="button-continue-customize"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
