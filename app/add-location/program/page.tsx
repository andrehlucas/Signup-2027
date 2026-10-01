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
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Choose Your Program</h1>
          <p className="text-sm text-gray-600 mb-5">
            {location.name} — {location.city}, {location.stateCode}
          </p>
          <p className="mb-5 text-sm text-gray-600">
            Choose your program to complete signup. No payment will be collected.
          </p>

          <div role="group" aria-label="Billing frequency" className="inline-flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 mb-6">
            {(['monthly', 'annual'] as const).map((b) => (
              <Button
                key={b}
                hierarchy={billing === b ? 'primary' : 'tertiary'}
                size="sm"
                aria-pressed={billing === b}
                disabled={locked}
                onClick={() => setBilling(b)}
                data-testid={`button-billing-${b}`}
              >
                {b === 'monthly' ? 'Monthly' : 'Annual — 2 months free'}
              </Button>
            ))}
          </div>

          <fieldset disabled={locked} className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="programs-list">
            <legend className="sr-only">Programs</legend>
            {truckingPrograms.map((plan) => {
              const selected = programId === plan.id;
              const isPro = plan.id === 'pro';
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-lg border-2 p-5 transition-all ${selected ? 'border-brand-500 shadow-md' : 'border-gray-200'}`}
                  data-testid={`program-card-${plan.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-gray-900">{plan.name}</h2>
                    {selected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white" aria-label="Selected">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{plan.description}</p>
                  <p className="mt-4 text-3xl font-extrabold text-gray-900">
                    {billing === 'monthly' ? `$${plan.monthly}` : `$${plan.annualTotal.toLocaleString('en-US')}`}
                    <span className="text-sm font-medium text-gray-500">{billing === 'monthly' ? '/mo' : '/yr'}</span>
                  </p>
                  {billing === 'annual' && <p className="text-xs text-success-700">2 months free · billed annually</p>}
                  {billing === 'monthly' && <p className="text-xs text-gray-500">Or pay annually and get 2 months free</p>}
                  <p className="mt-4 text-xs text-gray-500">{truckingSharedFeaturesSummary}</p>
                  <ul className="mt-3 mb-5 space-y-2 flex-1">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 mt-0.5 text-brand-600" aria-hidden="true" />
                      {plan.meetingHours} Hours Meeting Room Access per month
                    </li>
                    {highlighted.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 mt-0.5 text-brand-600" aria-hidden="true" />{f}
                      </li>
                    ))}
                    {truckingProOnlyFeatures.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-sm ${isPro ? 'text-gray-700' : 'text-gray-400'}`}>
                        {isPro ? <Check className="h-4 w-4 mt-0.5 text-brand-600" aria-hidden="true" /> : <X className="h-4 w-4 mt-0.5" aria-hidden="true" />}
                        {!isPro && <span className="sr-only">Not included: </span>}{f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    hierarchy={selected ? 'primary' : 'secondary'}
                    size="md"
                    aria-pressed={selected}
                    disabled={locked}
                    onClick={() => setProgramId(plan.id)}
                    data-testid={`button-select-${plan.id}`}
                  >
                    {selected ? 'Selected' : `Select ${plan.label}`}
                  </Button>
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
