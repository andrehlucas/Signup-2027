'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useOrder } from '../context';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';
import {
  truckingPrograms,
  truckingSharedFeaturesSummary,
  truckingProOnlyFeatures,
} from '../../../shared/trucking-programs';

const highlighted = ['Vault', 'Digital Document Storage'];

function hasValidUserInfo(u: ReturnType<typeof useOrder>['order']['userInfo']): boolean {
  const len = u.phone.replace(/\D/g, '').length;
  return Boolean(
    u.firstName.trim() && u.lastName.trim() && len >= 7 && len <= 15 &&
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(u.email) &&
    u.email === u.confirmEmail && u.company.trim() && u.termsAccepted
  );
}

export default function ProgramSelectionPage() {
  const router = useRouter();
  const { order, programId, billing, signupComplete, setProgramId, setBilling, signupPending, signupError, submitSignup } = useOrder();
  const isSubmitting = signupPending;
  const error = signupError;
  const { trackComplete } = useFunnelTracking('choose_program');
  const location = order.location;
  const valid = hasValidUserInfo(order.userInfo) && Boolean(location);

  useEffect(() => {
    if (!hasValidUserInfo(order.userInfo)) router.replace('/');
    else if (!location) router.replace('/add-location');
  }, [order.userInfo, location, router]);

  if (!valid || !location) return null;
  const locked = isSubmitting || signupComplete;

  const handleSubmit = async () => {
    if (!programId || locked) return;
    const outcome = await submitSignup();
    if (outcome === 'success') trackComplete();
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="program-selection-page">
      <div className="max-w-4xl lg:max-w-6xl mx-auto">
        <div className="mb-8"><ProgressIndicator currentStep={3} disabled={locked} /></div>
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Choose Your Program</h1>
          <p className="text-sm text-gray-600 mb-1">
            {location.name} — {location.city}, {location.stateCode}
          </p>
          <p className="text-sm text-gray-600">
            Choose your program to complete signup. No payment will be collected.
          </p>
        </div>
        <div>
          <fieldset disabled={locked} className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="programs-list">
            <legend className="sr-only">Programs</legend>
            {truckingPrograms.map((plan) => {
              const selected = programId === plan.id;
              const isPro = plan.id === 'pro';
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg ${selected ? 'ring-2 ring-brand-500' : 'ring-1 ring-gray-200'}`}
                  data-testid={`program-card-${plan.id}`}
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold leading-tight text-gray-900">
                      Opus Trucking<br />
                      <span className={isPro ? 'text-brand-800' : 'text-brand-400'}>{plan.label}</span>
                    </h2>
                    <p className="mt-3 text-sm text-gray-600">{plan.description}</p>
                    <div className="mt-5 space-y-2">
                      {(['monthly', 'annual'] as const).map((b) => {
                        const checked = selected && billing === b;
                        return (
                          <label
                            key={b}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 ${checked ? 'bg-brand-50 ring-1 ring-brand-300' : 'ring-1 ring-transparent'}`}
                          >
                            <input
                              type="radio"
                              name="program-billing"
                              className="h-4 w-4 accent-brand-600"
                              checked={checked}
                              onChange={() => { setProgramId(plan.id); setBilling(b); }}
                              data-testid={`radio-billing-${plan.id}-${b}`}
                            />
                            {b === 'monthly' ? (
                              <span className="text-gray-900">
                                <span className="text-4xl font-extrabold">${plan.monthly}</span>
                                <span className="ml-1 text-sm font-medium text-gray-600">/ mo</span>
                                <span className="sr-only"> billed monthly</span>
                              </span>
                            ) : (
                              <span className="text-gray-900">
                                <span className="text-lg font-bold">${plan.annualTotal.toLocaleString('en-US')}</span>
                                <span className="ml-1 text-sm font-medium text-gray-600">/ year</span>
                                <span className="ml-2 text-xs text-success-700">2 months free</span>
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                    <Button
                      className="mt-5 w-full rounded-xl bg-gradient-to-b from-brand-400 to-brand-600 text-white shadow-lg"
                      hierarchy="primary"
                      size="lg"
                      aria-pressed={selected}
                      disabled={locked}
                      onClick={() => setProgramId(plan.id)}
                      data-testid={`button-select-${plan.id}`}
                    >
                      {selected ? `Selected ${plan.label}` : `Select ${plan.label}`}
                    </Button>
                  </div>
                  <div className="flex-1 border-t border-gray-100 bg-gray-25 p-6">
                    <h3 className="text-xs font-semibold uppercase text-gray-500">What’s included</h3>
                    <p className="mt-3 text-sm text-gray-600">{truckingSharedFeaturesSummary}</p>
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-center gap-3 text-sm font-medium text-gray-800">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-400 text-white"><Check className="h-3 w-3" aria-hidden="true" /></span>
                        {plan.meetingHours} Hours Meeting Room Access per month
                      </li>
                      {highlighted.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm font-medium text-gray-800">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-400 text-white"><Check className="h-3 w-3" aria-hidden="true" /></span>{f}
                        </li>
                      ))}
                      {truckingProOnlyFeatures.map((f) => (
                        <li key={f} className={`flex items-center gap-3 text-sm ${isPro ? 'font-medium text-gray-800' : 'text-gray-400'}`}>
                          {isPro ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-400 text-white"><Check className="h-3 w-3" aria-hidden="true" /></span>
                          ) : (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400"><X className="h-3 w-3" aria-hidden="true" /></span>
                          )}
                          {!isPro && <span className="sr-only">Not included: </span>}{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </fieldset>

          {error && <p className="mt-5 text-sm text-red-700" role="alert" data-testid="signup-error">{error}</p>}
          {isSubmitting && <p className="mt-5 text-sm text-gray-600" role="status">Completing your signup…</p>}
          {signupComplete && (
            <p className="mt-5 rounded-md bg-success-50 px-3 py-2 text-sm font-medium text-success-700" role="status" data-testid="signup-success">
              Signup complete. No payment was collected.
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
            <Button hierarchy="secondary" size="lg" disabled={locked} onClick={() => router.push('/add-location')} data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              hierarchy="primary"
              size="lg"
              disabled={!programId || locked}
              loading={isSubmitting}
              onClick={handleSubmit}
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
