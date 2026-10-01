'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useOrder } from '../context';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';
import { truckingPrograms } from '../../../shared/trucking-programs';
import { AgreementPanel } from './AgreementPanel';
import { BillingTermSelection } from './BillingTermSelection';
import { CheckoutOrderSummary } from './CheckoutOrderSummary';
import { PaymentMethodSection } from './PaymentMethodSection';
import { PaymentSummary } from './PaymentSummary';

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

export default function CheckoutPage() {
  const router = useRouter();
  const {
    order,
    programId,
    billing,
    setBilling,
    setAgreementAccepted,
    signupPending,
    signupComplete,
    signupError,
    submitSignup,
  } = useOrder();
  const { trackComplete } = useFunnelTracking('checkout');
  const validUserInfo = hasValidUserInfo(order.userInfo);
  const location = order.location;
  const program = truckingPrograms.find((candidate) => candidate.id === programId);
  const locked = signupPending || signupComplete;
  const ready = validUserInfo && Boolean(location) && Boolean(program);

  useEffect(() => {
    if (!validUserInfo) router.replace('/');
    else if (!location) router.replace('/add-location');
    else if (!program) router.replace('/add-location/program');
  }, [validUserInfo, location, program, router]);

  const handleComplete = async () => {
    if (!program || !location || !order.agreementAccepted || locked) return;
    const outcome = await submitSignup();
    if (outcome === 'success') trackComplete();
  };

  if (!ready || !location || !program) return null;

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="checkout-page">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <ProgressIndicator currentStep={4} disabled={locked} />
        </div>

        <header className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900" data-testid="heading-checkout">
            Complete Your Signup
          </h1>
          <p className="text-gray-600">
            Review your program and billing preference before completing signup.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CheckoutOrderSummary location={location} program={program} billing={billing} />
            <BillingTermSelection
              billing={billing}
              monthlyPrice={program.monthly}
              annualTotal={program.annualTotal}
              disabled={locked}
              onChange={setBilling}
            />
            <PaymentMethodSection />
            <AgreementPanel
              accepted={order.agreementAccepted}
              disabled={locked}
              onAcceptedChange={setAgreementAccepted}
            />
          </div>

          <div className="lg:col-span-1">
            <PaymentSummary
              program={program}
              billing={billing}
              accepted={order.agreementAccepted}
              locked={locked}
              pending={signupPending}
              complete={signupComplete}
              error={signupError}
              onComplete={handleComplete}
            />
          </div>
        </div>

        <footer className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          <Button
            hierarchy="link-gray"
            size="lg"
            disabled={locked}
            onClick={() => router.push('/add-location/program')}
            data-testid="button-back-checkout"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <p className="max-w-md text-right text-xs text-gray-500">
            Completing signup does not collect payment or activate a paid service.
          </p>
        </footer>
      </div>
    </div>
  );
}