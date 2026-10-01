'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, MapPin, X } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { Badge } from '@workspace/opus-vo-design-system/components/ui/badge';
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
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Program</h1>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-900">
            <MapPin className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
            {location.name} — {location.city}, {location.stateCode}
          </p>
          <p className="text-sm text-gray-600">
            Choose your program to complete signup. No payment will be collected.
          </p>
        </div>
        <div>
          <fieldset disabled={locked} className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="programs-list">
            <legend className="sr-only">Programs</legend>
            {truckingPrograms.map((plan) => {
              const selected = programId === plan.id;
              const isPro = plan.id === 'pro';
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none focus-within:ring-4 focus-within:ring-brand-100 ${selected ? 'border-brand-500 shadow-md ring-1 ring-brand-500' : 'border-gray-200 hover:border-brand-300'}`}
                  data-testid={`program-card-${plan.id}`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-base font-semibold text-gray-900">{plan.name}</h2>
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white ${selected ? '' : 'invisible'}`} aria-hidden="true">
                          <Check className="h-4 w-4" />
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                    <div className="mt-5 overflow-hidden rounded-lg border border-gray-200 divide-y divide-gray-200">
                      {(['monthly', 'annual'] as const).map((b) => {
                        const checked = selected && billing === b;
                        return (
                          <label
                            key={b}
                            className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors motion-reduce:transition-none focus-within:bg-brand-50 ${checked ? 'bg-brand-50' : 'bg-white hover:bg-gray-50'}`}
                          >
                            <input
                              type="radio"
                              name="program-billing"
                              className="h-4 w-4 shrink-0 accent-brand-600"
                              checked={checked}
                              onChange={() => { setProgramId(plan.id); setBilling(b); }}
                              data-testid={`radio-billing-${plan.id}-${b}`}
                            />
                            {b === 'monthly' ? (
                              <span className="flex min-w-0 flex-wrap items-baseline gap-x-1 text-gray-900">
                                <span className="text-3xl font-semibold tabular-nums">${plan.monthly}</span>
                                <span className="text-sm font-medium text-gray-600">/ mo</span>
                                <span className="sr-only"> billed monthly</span>
                              </span>
                            ) : (
                              <span className="flex min-w-0 flex-wrap items-baseline gap-x-1 text-gray-900">
                                <span className="text-lg font-semibold tabular-nums">${plan.annualTotal.toLocaleString('en-US')}</span>
                                <span className="text-sm font-medium text-gray-600">/ year</span>
                                <Badge className="ml-1" color="success" variant="pill" size="sm">2 months free</Badge>
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                    <Button
                      className="mt-4 w-full"
                      hierarchy={selected ? 'primary' : 'secondary'}
                      size="lg"
                      aria-pressed={selected}
                      disabled={locked}
                      onClick={() => setProgramId(plan.id)}
                      data-testid={`button-select-${plan.id}`}
                    >
                      {selected ? `Selected ${plan.label}` : `Select ${plan.label}`}
                    </Button>
                  </div>
                  <div className="flex-1 border-t border-gray-100 bg-gray-50 p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">What’s included</h3>
                    <p className="mt-3 text-sm text-gray-600">{truckingSharedFeaturesSummary}</p>
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-start gap-2 text-sm font-medium text-gray-900">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                        {plan.meetingHours} Hours Meeting Room Access per month
                      </li>
                      {highlighted.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />{f}
                        </li>
                      ))}
                      {truckingProOnlyFeatures.map((f) => (
                        <li key={f} className={`flex items-start gap-2 text-sm ${isPro ? 'text-gray-700' : 'text-gray-400'}`}>
                          {isPro ? (
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                          ) : (
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
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
    </div>
  );
}
