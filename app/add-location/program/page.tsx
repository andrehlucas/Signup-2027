'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useOrder } from '../context';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';
import { useRevealContinue } from '../../hooks/use-reveal-continue';
import { truckingPrograms } from '../../../shared/trucking-programs';
import { ProgramCard } from './ProgramCard';
import { BillingSwitcher } from './BillingSwitcher';

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
  const { order, programId, billing, signupComplete, setProgramId, setBilling, signupPending, signupError, continueToCheckout } = useOrder();
  const { trackComplete } = useFunnelTracking('choose_program');
  const { continueRef, revealContinue } = useRevealContinue();
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
    const outcome = await continueToCheckout();
    if (outcome === 'success') trackComplete();
  };

  return (
    <div className="signup-flow min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="program-selection-page">
      <div className="mx-auto max-w-4xl lg:max-w-6xl">
        <div className="mb-8"><ProgressIndicator currentStep={3} disabled={locked} /></div>

        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Choose Your Program</h1>
            <p className="mt-2 text-sm text-gray-600">Select a program and billing preference, then continue to checkout.</p>
          </div>
          <div className="flex items-start gap-3 md:max-w-xs md:border-l md:border-gray-200 md:pl-6">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{location.name}</p>
              <p className="mt-1 text-gray-500">{location.city}, {location.stateCode}</p>
            </div>
          </div>
        </header>

        <BillingSwitcher billing={billing} disabled={locked} onChange={setBilling} />

        <fieldset disabled={locked} className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2" data-testid="programs-list">
          <legend className="sr-only">Programs</legend>
          {truckingPrograms.map((plan) => (
            <ProgramCard
              key={plan.id}
              plan={plan}
              selected={programId === plan.id}
              billing={billing}
              disabled={locked}
              onSelect={(id) => {
                if (locked) return;
                setProgramId(id);
                revealContinue();
              }}
            />
          ))}
        </fieldset>

        {signupError && <p className="mt-5 text-sm text-error-700" role="alert" data-testid="signup-error">{signupError}</p>}
        {(signupPending || signupComplete) && <p className="mt-5 text-sm text-gray-600" role="status">{signupComplete ? 'Redirecting to checkout…' : 'Preparing checkout…'}</p>}

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
            <Button className="signup-action" ref={continueRef} style={{ scrollMarginBlock: 16 }} hierarchy="primary" size="lg" disabled={!programId || locked} loading={signupPending} onClick={handleSubmit} data-testid="button-complete-signup">
              Continue
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}