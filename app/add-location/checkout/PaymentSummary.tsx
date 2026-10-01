'use client';

import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { Check } from 'lucide-react';
import type { ProgramBilling } from '../../../shared/trucking-programs';
import type { truckingPrograms } from '../../../shared/trucking-programs';

type Program = (typeof truckingPrograms)[number];

interface PaymentSummaryProps {
  program: Program;
  billing: ProgramBilling;
  accepted: boolean;
  locked: boolean;
  pending: boolean;
  complete: boolean;
  error: string;
  onComplete: () => void;
}

export function PaymentSummary({
  program,
  billing,
  accepted,
  locked,
  pending,
  complete,
  error,
  onComplete,
}: PaymentSummaryProps) {
  const price = billing === 'monthly' ? program.monthly : program.annualTotal;
  const cadence = billing === 'monthly' ? 'month' : 'year';

  return (
    <aside className="lg:sticky lg:top-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6" data-testid="payment-summary">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Signup Summary</h2>

        <div className="mb-4 space-y-3">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-gray-600">{program.name}</span>
            <span className="whitespace-nowrap font-medium text-gray-900">
              ${price.toLocaleString('en-US')}/{cadence}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Billing preference</span>
            <span className="font-medium text-gray-900">{billing === 'monthly' ? 'Monthly' : 'Annual'}</span>
          </div>
        </div>

        <div className="mb-5 border-t border-gray-200 pt-4">
          <div className="flex items-start justify-between gap-4">
            <span className="font-semibold text-gray-900">Signup preference</span>
            <span className="text-right">
              <span className="block text-2xl font-bold text-gray-900">
                ${price.toLocaleString('en-US')}
              </span>
              <span className="text-sm text-gray-500">per {cadence}</span>
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Catalog price only. No payment is collected on this page.
          </p>
        </div>

        {pending && (
          <p className="mb-4 text-sm text-gray-600" role="status" data-testid="signup-pending">
            Completing your signup…
          </p>
        )}
        {error && (
          <p className="mb-4 text-sm text-error-700" role="alert" data-testid="signup-error">
            {error}
          </p>
        )}
        {complete && (
          <p className="mb-4 rounded-lg bg-success-50 px-4 py-3 text-sm font-medium text-success-700" role="status" data-testid="signup-success">
            Signup complete. No payment was collected and no paid service was activated.
          </p>
        )}

        <Button
          onClick={onComplete}
          disabled={!accepted || locked}
          loading={pending}
          hierarchy="primary"
          size="lg"
          className="w-full"
          data-testid="button-complete-checkout"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Complete signup
        </Button>
        <p className="mt-3 text-center text-xs text-gray-500">
          Signup only. Payment processing is not connected.
        </p>
      </div>
    </aside>
  );
}