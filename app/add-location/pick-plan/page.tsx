'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronDown, ChevronRight, MapPin, Phone } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { BundleInlineSelector } from '@/app/components/ui/bundle-inline-selector';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { LocationSelector } from '../components/LocationSelector';
import { LocalPhoneNumberDialog } from '../components/LocalPhoneNumberDialog';
import { useOrder } from '../context';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';
import {
  bundles,
  featureLabels,
  AvailableLocation,
  getPhoneNumbersForLocation,
  resolveLocalPhoneNumber,
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
  const { order, setLocation, setBundle, setLocationFilters, setPhoneNumber } = useOrder();
  const bundleComparisonHeadingRef = useRef<HTMLHeadingElement>(null);
  const [subStep, setSubStep] = useState<'location' | 'review'>(order.location ? 'review' : 'location');
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const phoneNumbers = useMemo(
    () => order.location ? getPhoneNumbersForLocation(order.location).filter(number => number.isAvailable) : [],
    [order.location]
  );
  const assignedPhone = resolveLocalPhoneNumber(order.location, order.phoneNumber);
  const { trackComplete } = useFunnelTracking('pick_plan');

  const upgradeBundles = useMemo(
    () => bundles.filter((bundle) => bundle.id !== 'essentials'),
    []
  );

  useEffect(() => {
    if (order.location && !order.bundle) {
      setBundle(bundles[0]);
    }
  }, [order.location, order.bundle, setBundle]);

  useEffect(() => {
    // Also fills the phone for drafts saved before assignment happened on this step.
    if (assignedPhone?.id !== order.phoneNumber?.id) setPhoneNumber(assignedPhone);
  }, [assignedPhone, order.phoneNumber, setPhoneNumber]);

  const handleLocationSelect = (location: AvailableLocation) => {
    setLocation(location);
    setSubStep('review');
  };

  const handleChangeLocation = () => {
    if (order.location) {
      setLocationFilters({ state: order.location.state, city: order.location.city });
    }
    setSubStep('location');
  };

  const handleCancelLocationChange = () => {
    if (order.location) {
      setLocationFilters({ state: order.location.state, city: order.location.city });
    }
    setSubStep('review');
  };

  const handleContinue = () => {
    if (order.location && order.bundle && assignedPhone) {
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

          <LocationSelector
            onSelect={handleLocationSelect}
            onCancel={order.location ? handleCancelLocationChange : undefined}
          />
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
                onClick={handleChangeLocation}
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

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 sm:px-6" data-testid="review-phone-row">
            <div className="flex min-w-0 items-start gap-2.5">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
              <div className="min-w-0" aria-live="polite">
                <p className="text-xs font-medium text-gray-600">Business phone number</p>
                {assignedPhone ? (
                  <>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums text-gray-900" data-testid="review-business-phone">{assignedPhone.number}</p>
                    <p className="mt-1 text-xs leading-5 text-gray-600" data-testid="phone-lock-notice">Phone numbers locked for another 30 minutes</p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-gray-700" role="status">No local numbers are currently available. Choose another location to continue.</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPhoneDialogOpen(true)}
              disabled={phoneNumbers.length === 0}
              aria-label="Edit business phone number"
              className="inline-flex min-h-11 shrink-0 items-center rounded-md px-2 text-sm font-medium text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#345b91] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              data-testid="button-edit-review-phone"
            >Edit</button>
          </div>

          {order.bundle && (
            <details open className="group border-t border-gray-100" data-testid="details-included-services">
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

        <LocalPhoneNumberDialog
          open={phoneDialogOpen}
          onOpenChange={setPhoneDialogOpen}
          numbers={phoneNumbers}
          selected={assignedPhone}
          city={order.location.city}
          onSave={setPhoneNumber}
        />

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
          disabled={!order.bundle || !assignedPhone}
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
