'use client';

import { useEffect } from 'react';
import './_preview.css';
import { useRouter } from './_state';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { ProgressIndicator } from './_ProgressIndicator';
import { useOrder } from './_state';
import { useFunnelTracking } from './_state';
import { truckingPrograms } from './_programs';
import { ProgramCard } from './_ProgramCard';

function hasValidUserInfo(u: ReturnType<typeof useOrder>['order']['userInfo']): boolean {
  const len = u.phone.replace(/\D/g, '').length;
  return Boolean(
    u.firstName.trim() && u.lastName.trim() && len >= 7 && len <= 15 &&
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(u.email) &&
    u.email === u.confirmEmail && u.company.trim() && u.termsAccepted
  );
}

function ProgramSelectionPage() {
  const router = useRouter();
  const { order, programId, billing, signupComplete, setProgramId, setBilling, signupPending, signupError, submitSignup } = useOrder();
  const { trackComplete } = useFunnelTracking('choose_program');
  const location = order.location;
  const valid = hasValidUserInfo(order.userInfo) && Boolean(location);

  useEffect(() => {
    if (!hasValidUserInfo(order.userInfo)) router.replace('/');
    else if (!location) router.replace('/add-location');
  }, [order.userInfo, location, router]);

  if (!valid || !location) return null;
  const locked = signupPending || signupComplete;
  const selectedPlan = truckingPrograms.find((plan) => plan.id === programId);

  const handleSubmit = async () => {
    if (!programId || locked) return;
    const outcome = await submitSignup();
    if (outcome === 'success') trackComplete();
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="program-selection-page">
      <div className="mx-auto max-w-4xl lg:max-w-6xl">
        <div className="mb-8"><ProgressIndicator currentStep={3} disabled={locked} /></div>

        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Choose Your Program</h1>
            <p className="mt-2 text-sm text-gray-600">Select a program and billing preference. No payment will be collected.</p>
          </div>
          <div className="flex items-start gap-3 md:max-w-xs md:border-l md:border-gray-200 md:pl-6">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{location.name}</p>
              <p className="mt-1 text-gray-500">{location.city}, {location.stateCode}</p>
            </div>
          </div>
        </header>

        <fieldset disabled={locked} className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2" data-testid="programs-list">
          <legend className="sr-only">Programs</legend>
          {truckingPrograms.map((plan) => (
            <ProgramCard
              key={plan.id}
              plan={plan}
              selected={programId === plan.id}
              billing={billing}
              disabled={locked}
              onSelect={(id, frequency) => {
                if (locked) return;
                setProgramId(id);
                if (frequency) setBilling(frequency);
              }}
            />
          ))}
        </fieldset>

        {signupError && <p className="mt-5 text-sm text-error-700" role="alert" data-testid="signup-error">{signupError}</p>}
        {signupPending && <p className="mt-5 text-sm text-gray-600" role="status">Completing your signup…</p>}
        {signupComplete && (
          <p className="mt-5 rounded-lg bg-success-50 px-4 py-3 text-sm font-medium text-success-700" role="status" data-testid="signup-success">
            Signup complete. No payment was collected.
          </p>
        )}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
          <Button hierarchy="link-gray" size="lg" disabled={locked} onClick={() => router.push('/add-location')} data-testid="button-back">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <div className="flex flex-wrap items-center justify-end gap-4">
            {selectedPlan && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{selectedPlan.label}</span>
                {' · '}{billing === 'monthly' ? 'Monthly' : 'Annual'}
              </p>
            )}
            <Button hierarchy="primary" size="lg" disabled={!programId || locked} loading={signupPending} onClick={handleSubmit} data-testid="button-complete-signup">
              Complete signup
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function CurrentProgramPage() {
  return <div className="program-current-preview min-h-screen bg-gray-50">
    <header className="bg-white border-b border-gray-100 py-5 px-6 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        <img src="/__mockup/images/opus-vo-main-logo.svg" alt="Opus Virtual Offices" className="h-11" />
      </div>
    </header>
    <ProgramSelectionPage />
  </div>;
}
