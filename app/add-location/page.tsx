'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Check, MapPin, Star } from 'lucide-react';
import { Badge } from '@workspace/opus-vo-design-system/components/ui/badge';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { ProgressIndicator } from './components/ProgressIndicator';
import { useOrder } from './context';
import { useFunnelTracking } from '../hooks/use-funnel-tracking';
import { getLocationsByState, getStates } from './types';

function hasValidUserInfo(userInfo: ReturnType<typeof useOrder>['order']['userInfo']): boolean {
  const phoneLength = userInfo.phone.replace(/\D/g, '').length;
  return Boolean(
    userInfo.firstName.trim() &&
    userInfo.lastName.trim() &&
    phoneLength >= 7 &&
    phoneLength <= 15 &&
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userInfo.email) &&
    userInfo.email === userInfo.confirmEmail &&
    userInfo.company.trim() &&
    userInfo.termsAccepted
  );
}

export default function LocationSelectionPage() {
  const router = useRouter();
  const {
    order,
    selectedState,
    signupComplete,
    setLocation,
    setSelectedState,
    completeSignup,
  } = useOrder();
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const requestIdRef = useRef<string | null>(null);
  const isSubmittingRef = useRef(false);
  const isUserInfoValid = hasValidUserInfo(order.userInfo);
  const { trackComplete } = useFunnelTracking('pick_location' as Parameters<typeof useFunnelTracking>[0]);

  useEffect(() => {
    if (!isUserInfoValid) {
      router.replace('/');
      return;
    }
    setIsReady(true);
  }, [isUserInfoValid, router]);

  const states = useMemo(() => getStates(), []);
  const locations = useMemo(
    () => (selectedState ? getLocationsByState(selectedState) : []),
    [selectedState]
  );
  const selectedLocation = order.location?.state === selectedState ? order.location : null;

  const handleStateChange = (state: string) => {
    if (signupComplete) return;
    setSelectedState(state);
    setLocation(null);
    requestIdRef.current = crypto.randomUUID();
    setError('');
  };

  const handleLocationSelect = (locationId: string) => {
    if (signupComplete || order.location?.id === locationId) return;
    const location = locations.find((availableLocation) => availableLocation.id === locationId);
    if (!location) return;
    setLocation(location);
    requestIdRef.current = crypto.randomUUID();
    setError('');
  };

  const handleCompleteSignup = async () => {
    if (!selectedLocation || signupComplete || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError('');
    requestIdRef.current ??= crypto.randomUUID();

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: requestIdRef.current,
          userInfo: order.userInfo,
          locationId: selectedLocation.id,
        }),
      });

      let responseData: { status?: string; message?: string; error?: string } | null = null;
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
          responseData?.error ||
          'We could not complete your signup. Please try again.'
        );
      }

      if (responseData?.status !== 'completed') {
        throw new Error('We received an unexpected response. Please try again.');
      }

      completeSignup();
      trackComplete();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'We could not complete your signup. Please try again.'
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (!isReady || !isUserInfoValid) return null;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="location-selection-page">
      <div className="max-w-4xl lg:max-w-6xl mx-auto">
        <div className="mb-8">
          <ProgressIndicator currentStep={2} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h1 className="text-lg font-semibold text-gray-900 mb-4">Select Your Location</h1>

          <div className="mb-6 max-w-sm">
            <label htmlFor="select-state" className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <Select
              value={selectedState}
              onValueChange={handleStateChange}
              disabled={signupComplete}
            >
              <SelectTrigger id="select-state" data-testid="select-state">
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

          {selectedState && locations.length > 0 && (
            <fieldset data-testid="locations-list">
              <legend className="text-sm font-medium text-gray-700 mb-3">
                Available locations in {selectedState}
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location) => {
                  const isSelected = selectedLocation?.id === location.id;
                  return (
                    <label key={location.id} className="block cursor-pointer">
                      <input
                        type="radio"
                        name="location"
                        value={location.id}
                        checked={isSelected}
                        onChange={() => handleLocationSelect(location.id)}
                        disabled={signupComplete}
                        aria-label={`${location.city}, ${location.state} — ${location.address}`}
                        className="peer sr-only"
                        data-testid={`radio-location-${location.id}`}
                      />
                      <div
                        className={`h-full flex flex-col rounded-lg border-2 transition-all overflow-hidden peer-focus-visible:ring-4 peer-focus-visible:ring-brand-200 ${
                          isSelected
                            ? 'border-brand-500 shadow-md'
                            : 'border-gray-200 hover:border-brand-300 hover:shadow-md'
                        }`}
                        data-testid={`location-card-${location.id}`}
                      >
                        <div className="w-full bg-gray-100 flex items-center justify-center" style={{ aspectRatio: '1.85 / 1' }}>
                          <Building2 className="h-12 w-12 text-gray-400" aria-hidden="true" />
                        </div>
                        <div className="p-4 flex flex-col gap-3 flex-1">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h2 className="font-medium text-gray-900">{location.name}</h2>
                              {isSelected && (
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-white" aria-label="Selected">
                                  <Check className="h-4 w-4" aria-hidden="true" />
                                </span>
                              )}
                            </div>
                            {location.isPremium && (
                              <Badge
                                color="warning"
                                variant="pill"
                                size="sm"
                                leadingIcon={<Star className="h-3 w-3 fill-current" />}
                                className="mb-2"
                              >
                                Premium Location
                              </Badge>
                            )}
                            <div className="text-sm text-gray-600">
                              <p className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                                {location.address}
                              </p>
                              {location.addressLine2 && <p className="ml-5">{location.addressLine2}</p>}
                              <p className="ml-5">{location.city}, {location.stateCode} {location.zipCode}</p>
                            </div>
                          </div>
                          <span className={`text-sm font-semibold ${isSelected ? 'text-brand-700' : 'text-gray-500'}`}>
                            {isSelected ? 'Selected' : 'Choose this location'}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {!selectedState && (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" aria-hidden="true" />
              <p>Select a state to view available locations</p>
            </div>
          )}

          {selectedState && locations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" aria-hidden="true" />
              <p>There are no available locations in {selectedState}.</p>
            </div>
          )}

          {error && (
            <p className="mt-5 text-sm text-red-700" role="alert" data-testid="signup-error">
              {error}
            </p>
          )}

          {isSubmitting && (
            <p className="mt-5 text-sm text-gray-600" role="status">
              Completing your signup…
            </p>
          )}

          {signupComplete && (
            <p className="mt-5 rounded-md bg-success-50 px-3 py-2 text-sm font-medium text-success-700" role="status" data-testid="signup-success">
              Signup complete. No payment was collected.
            </p>
          )}

          <div className="mt-6 flex flex-col items-start gap-3 border-t border-gray-100 pt-5">
            <Button
              onClick={handleCompleteSignup}
              hierarchy="primary"
              size="lg"
              disabled={!selectedLocation || signupComplete || isSubmitting}
              loading={isSubmitting}
              data-testid="button-complete-signup"
            >
              Complete signup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}