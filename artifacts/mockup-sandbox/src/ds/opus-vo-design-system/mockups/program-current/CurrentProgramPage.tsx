'use client';

import { useEffect } from 'react';
import './_preview.css';
import { useRouter } from './_state';
import { Check, Flame, MapPin } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { Badge } from '@workspace/opus-vo-design-system/components/ui/badge';
import { ProgressIndicator } from './_ProgressIndicator';
import { useOrder } from './_state';
import { useFunnelTracking } from './_state';
import { truckingPrograms, type ProgramBilling } from './_programs';
import { ProgramCard } from './_ProgramCard';

function BillingSwitcher({
  billing,
  disabled,
  onChange,
}: {
  billing: ProgramBilling;
  disabled: boolean;
  onChange: (billing: ProgramBilling) => void;
}) {
  return (
    <section className="mx-auto mb-8 flex max-w-md flex-col gap-3" aria-label="Billing options">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
        <p id="current-billing-label" className="mb-3 text-center text-sm font-medium text-gray-700">Billing frequency</p>
        <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="current-billing-label" aria-describedby="current-billing-note">
          {(['monthly', 'annual'] as const).map((frequency) => {
            const selected = billing === frequency;
            return (
              <div key={frequency} className="flex min-w-0 flex-col gap-2">
                <Button
                  type="button"
                  hierarchy={selected ? 'primary' : 'secondary'}
                  size="lg"
                  className="w-full"
                  disabled={disabled}
                  aria-pressed={selected}
                  data-testid={`button-billing-${frequency}`}
                  onClick={() => onChange(frequency)}
                >
                  <span className="flex h-4 w-4 items-center justify-center" aria-hidden="true">
                    <Check className={`h-4 w-4 ${selected ? '' : 'invisible'}`} />
                  </span>
                  {frequency === 'monthly' ? 'Monthly' : 'Yearly'}
                </Button>
                <p className="text-center text-xs text-gray-600">
                  {frequency === 'monthly' ? 'Pay every month' : 'Pay once a year'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Badge color="warning" variant="pill" size="md" leadingIcon={<Flame className="h-4 w-4" aria-hidden="true" />}>
          Save over 16% with yearly billing
        </Badge>
        <p id="current-billing-note" className="text-center text-xs text-gray-600">
          Pay for 10 months up front, get 12 months of service.
        </p>
      </div>
    </section>
  );
}

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
  const { order, programId, billing, signupComplete, setBilling, signupPending, signupError, continueToCheckout } = useOrder();
  const { trackComplete } = useFunnelTracking('choose_program');
  const location = order.location;
  const valid = hasValidUserInfo(order.userInfo) && Boolean(location);

  useEffect(() => {
    if (!hasValidUserInfo(order.userInfo)) router.replace('/');
    else if (!location) router.replace('/add-location');
  }, [order.userInfo, location, router]);

  if (!valid || !location) return null;
  const locked = signupPending || signupComplete;
  const handleSelect = async (id: (typeof truckingPrograms)[number]['id']) => {
    if (locked) return;
    const outcome = await continueToCheckout(id);
    if (outcome === 'success') trackComplete();
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="program-selection-page">
      <div className="mx-auto max-w-4xl lg:max-w-6xl">
        <div className="mb-8"><ProgressIndicator currentStep={3} disabled={locked} /></div>

        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Choose Your Program</h1>
            <p className="mt-2 text-sm text-gray-600">Choose a program and billing preference to go straight to checkout.</p>
          </div>
          <div className="flex items-start gap-3 md:max-w-xs md:border-l md:border-gray-200 md:pl-6">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{location.name}</p>
              <p className="mt-1 text-gray-500">{location.city}, {location.stateCode}</p>
            </div>
          </div>
        </header>

        <BillingSwitcher billing={billing} disabled={signupPending || signupComplete} onChange={setBilling} />

        <fieldset disabled={locked} className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2" data-testid="programs-list">
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

        {signupError && <p className="mt-5 text-sm text-error-700" role="alert" data-testid="signup-error">{signupError}</p>}
        {signupPending && <p className="mt-5 text-sm text-gray-600" role="status">Preparing checkout…</p>}
      </div>
    </div>
  );
}

export default function CurrentProgramPage() {
  return <div className="signup-flow program-current-preview min-h-screen bg-gray-50">
    <header className="bg-white border-b border-gray-100 py-5 px-6 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        <img src="/__mockup/images/opus-vo-main-logo.svg" alt="Opus Virtual Offices" className="h-11" />
      </div>
    </header>
    <ProgramSelectionPage />
  </div>;
}
