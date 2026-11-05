'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, ChevronRight, MapPin, Star, Building2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { BundleInlineSelector } from '@/app/components/ui/bundle-inline-selector';
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
  getLocationsByState,
  Bundle,
  AvailableLocation,
} from '../types';

const planTierColors: Record<string, { accent: string; surface: string }> = {
  essentials: { accent: '#596579', surface: '#f2f4f6' },
  plus: { accent: '#185f58', surface: '#edf6f4' },
  pro: { accent: '#345b91', surface: '#eef2f8' },
  premium: { accent: '#80591e', surface: '#f7f2e9' },
  prestige: { accent: '#754965', surface: '#f5eef3' },
};

export default function PickPlanPage() {
  const router = useRouter();
  const { order, setLocation, setBundle } = useOrder();
  const bundleComparisonHeadingRef = useRef<HTMLHeadingElement>(null);
  const [subStep, setSubStep] = useState<'location' | 'review'>(order.location ? 'review' : 'location');
  const { trackComplete } = useFunnelTracking('pick_plan');

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const states = useMemo(() => getStates(), []);
  const upgradeBundles = useMemo(
    () => bundles.filter((bundle) => bundle.id !== 'essentials'),
    []
  );
  const cities = useMemo(
    () => (selectedState ? getCitiesByState(selectedState) : []),
    [selectedState]
  );
  const allStateLocations = useMemo(
    () => (selectedState ? getLocationsByState(selectedState) : []),
    [selectedState]
  );
  const availableLocations = useMemo(
    () => (selectedCity && selectedCity !== 'all') ? allStateLocations.filter(loc => loc.city === selectedCity) : allStateLocations,
    [allStateLocations, selectedCity]
  );

  useEffect(() => {
    if (order.location && !order.bundle) {
      setBundle(bundles[0]);
    }
  }, [order.location, order.bundle, setBundle]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity('');
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

  const handleChangePlan = (event: MouseEvent<HTMLButtonElement>) => {
    const heading = bundleComparisonHeadingRef.current;
    if (!heading) return;

    heading.focus({ preventScroll: true });
    heading.scrollIntoView({
      behavior: event.detail === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
  };

  if (subStep === 'location') {
    return (
      <div className="signup-shell p-4 lg:p-8" data-testid="pick-plan-page-location">
        <div className="max-w-4xl lg:max-w-6xl mx-auto">
          <div className="mb-8">
            <ProgressIndicator currentStep={2} />
          </div>

          <div className="signup-surface p-5 md:p-6 mb-6">
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

              {selectedState && cities.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger data-testid="select-city">
                      <SelectValue placeholder="All cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" data-testid="option-city-all">All cities</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city} data-testid={`option-city-${city}`}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {selectedState && availableLocations.length > 0 && (
              <div data-testid="locations-list">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Available Locations in {selectedCity && selectedCity !== 'all' ? selectedCity + ',' : ''} {selectedState}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableLocations.map((location) => (
                    <div
                      key={location.id}
                      className="flex flex-col rounded-xl border border-gray-200 hover:border-gray-400 transition-colors overflow-hidden"
                      data-testid={`location-card-${location.id}`}
                    >
                      <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden" style={{ aspectRatio: '1.85 / 1' }}>
                        {location.imageUrl && location.imageUrl !== '/placeholder-building.jpg' ? (
                          <img
                            src={location.imageUrl}
                            alt={location.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-12 w-12 text-gray-400" />
                        )}
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
                          className="signup-primary w-full"
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
          </div>
        </div>
      </div>
    );
  }

  if (!order.location) {
    return null;
  }

  const essentialsPlan = bundles[0];
  const selectedPlanTheme = order.bundle
    ? planTierColors[order.bundle.id] || planTierColors.essentials
    : null;

  return (
    <div className="signup-shell px-4 pt-4 pb-8 lg:px-8 lg:pt-8" data-testid="pick-plan-page">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <ProgressIndicator currentStep={2} />
        </div>

        <div
          className="signup-surface mb-5 overflow-hidden"
          data-testid="review-package-card"
        >
          <div
            className="flex items-center justify-between gap-x-3 px-5 py-4 sm:gap-x-5 sm:px-6 sm:py-5"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="min-w-0">
              {order.bundle ? (
                <div className="flex flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                  <h1
                    className="text-2xl font-bold leading-tight tracking-tight sm:text-[28px]"
                    style={{ color: selectedPlanTheme?.accent }}
                    data-testid="selected-plan-name"
                  >
                    {order.bundle.tier}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                    <Check className="h-3.5 w-3.5" style={{ color: selectedPlanTheme?.accent }} />
                    Selected
                  </span>
                </div>
              ) : (
                <h1 className="text-xl font-semibold text-gray-900" data-testid="selected-plan-name">
                  Choose a plan
                </h1>
              )}
            </div>

            {order.bundle && (
              <p className="flex flex-shrink-0 items-baseline gap-1.5 text-gray-900" data-testid="selected-plan-price">
                <span className="text-2xl font-bold tabular-nums">${order.bundle.price}</span>
                <span className="text-sm text-gray-600">/mo</span>
              </p>
            )}
          </div>

          <div
            className="flex flex-col gap-2 border-t border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-x-5 sm:px-6"
            data-testid="review-location-card"
          >
            <div className="flex min-w-0 items-start gap-2.5 sm:flex-1">
              <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-gray-500" aria-hidden="true" />
              <p className="min-w-0 break-words text-sm leading-6" data-testid="heading-pick-plan">
                <span className="font-semibold text-gray-900">{order.location.address}</span>
                <span className="text-gray-600">
                  {order.location.addressLine2 ? `, ${order.location.addressLine2}` : ''}
                  {`, ${order.location.city}, ${order.location.stateCode} ${order.location.zipCode}`}
                </span>
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1 self-start sm:gap-2 sm:self-auto">
              <button
                type="button"
                onClick={() => setSubStep('location')}
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-2 text-sm font-medium text-gray-600 underline decoration-gray-300 underline-offset-4 transition-[color,transform] duration-150 ease-out hover:text-gray-900 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#345b91] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
                data-testid="button-change-location"
              >
                Change location
              </button>
              <span className="h-4 w-px bg-gray-200" aria-hidden="true" />
              <button
                type="button"
                onClick={handleChangePlan}
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md px-2 text-sm font-medium text-gray-600 underline decoration-gray-300 underline-offset-4 transition-[color,transform] duration-150 ease-out hover:text-gray-900 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#345b91] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
                data-testid="button-change-plan"
              >
                Change plan
              </button>
            </div>
          </div>

          {order.bundle && (
            <details className="group border-t border-gray-100" data-testid="details-included-services">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#345b91] sm:px-6">
                View included services
                <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
              </summary>
              <ul className="grid grid-cols-1 gap-x-5 gap-y-2 border-t border-gray-100 px-5 py-4 sm:grid-cols-2 sm:px-6">
                {Object.entries(order.bundle.features)
                  .filter(([, enabled]) => enabled)
                  .map(([key]) => (
                    <li key={key} className="flex items-start gap-2 text-sm" data-testid={`feature-${key}`}>
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-600" />
                      <span className="leading-snug text-gray-700">
                        {featureLabels[key] || key}{key === 'appointmentMaking' && ' (20/mo)'}
                      </span>
                    </li>
                  ))}
              </ul>
            </details>
          )}
        </div>

        <section className="mb-5" aria-labelledby="bundle-comparison-title">
          <div className="mb-1">
            <h2
              id="bundle-comparison-title"
              ref={bundleComparisonHeadingRef}
              tabIndex={-1}
              className="scroll-mt-6 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#345b91] focus:ring-offset-2"
            >
              Compare bundles
            </h2>
            <p className="text-sm text-gray-600">
              Compare the optional features included with each upgrade.
            </p>
          </div>
          <BundleInlineSelector
            bundles={upgradeBundles}
            selectedBundleId={order.bundle?.id}
            onSelect={setBundle}
            essentialsBundle={essentialsPlan}
          />
        </section>

        <Button
          onClick={handleContinue}
          disabled={!order.bundle}
          className="signup-primary w-full h-12 text-base"
          data-testid="button-continue-customize"
        >
          Continue to Add-ons
          <ChevronRight className="h-4 w-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
