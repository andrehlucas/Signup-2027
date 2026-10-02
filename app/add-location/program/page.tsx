'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useOrder } from '../context';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';
import { truckingPrograms, type TruckingProgramId } from '../../../shared/trucking-programs';
import { ProgramCard } from './ProgramCard';

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
  const { order, programId, billing, signupComplete, signupPending, signupError, continueToCheckout } = useOrder();
  const { trackComplete } = useFunnelTracking('choose_program');
  const errorRef = useRef<HTMLParagraphElement>(null);
  const location = order.location;
  const valid = hasValidUserInfo(order.userInfo) && Boolean(location);

  useEffect(() => {
    if (!hasValidUserInfo(order.userInfo)) router.replace('/');
    else if (!location) router.replace('/add-location');
  }, [order.userInfo, location, router]);

  useEffect(() => {
    if (signupError && errorRef.current) {
      errorRef.current.focus();
      errorRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [signupError]);

  if (!valid || !location) return null;
  const locked = signupPending || signupComplete;

  const handleSelect = async (id: TruckingProgramId) => {
    if (locked) return;
    const outcome = await continueToCheckout(id);
    if (outcome === 'success') trackComplete();
  };

  return (
    <div className="signup-flow min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="program-selection-page">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7"><ProgressIndicator currentStep={3} disabled={locked} /></div>

        <header className="mb-7 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">Choose Your Program</h1>
            <p className="mt-2 text-base text-gray-600">Choose a program and billing preference to go straight to checkout.</p>
          </div>
          <div className="flex items-start gap-3 md:max-w-xs md:border-l md:border-gray-200 md:pl-6">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{location.name}</p>
              <p className="mt-1 text-gray-500">{location.city}, {location.stateCode}</p>
            </div>
          </div>
        </header>

        <fieldset disabled={locked} className="grid grid-cols-1 gap-4 md:grid-cols-2" data-testid="programs-list">
          <legend className="sr-only">Programs</legend>
          {truckingPrograms.map((plan) => (
            <ProgramCard
              key={plan.id}
              plan={plan}
              selected={programId === plan.id}
              billing={billing}
              disabled={locked}
              loading={signupPending && programId === plan.id}
              onSelect={handleSelect}
            />
          ))}
        </fieldset>

        {signupError && <p ref={errorRef} tabIndex={-1} className="mt-5 text-sm text-error-700" role="alert" data-testid="signup-error">{signupError}</p>}
        {signupPending && <p className="mt-5 text-sm text-gray-600" role="status">Preparing checkout…</p>}
      </div>
    </div>
  );
}