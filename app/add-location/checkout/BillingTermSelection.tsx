'use client';

import type { ProgramBilling } from '../../../shared/trucking-programs';

interface BillingTermSelectionProps {
  billing: ProgramBilling;
  monthlyPrice: number;
  annualTotal: number;
  disabled: boolean;
  onChange: (billing: ProgramBilling) => void;
}

export function BillingTermSelection({
  billing,
  monthlyPrice,
  annualTotal,
  disabled,
  onChange,
}: BillingTermSelectionProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6" data-testid="payment-term-section">
      <h2 className="mb-2 text-lg font-semibold text-gray-900">Billing Preference</h2>
      <p className="mb-4 text-sm text-gray-600">
        Choose how you would like your Opus Trucking program billed.
      </p>

      <fieldset disabled={disabled} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <legend className="sr-only">Billing preference</legend>
        {([
          {
            value: 'monthly',
            label: 'Monthly',
            cadence: 'Billed monthly',
            price: `$${monthlyPrice.toLocaleString('en-US')}/month`,
            testId: 'checkout-billing-monthly',
          },
          {
            value: 'annual',
            label: 'Annual',
            cadence: 'Billed yearly',
            price: `$${annualTotal.toLocaleString('en-US')}/year`,
            testId: 'checkout-billing-annual',
          },
        ] as const).map((option) => {
          const selected = billing === option.value;
          return (
            <label
              key={option.value}
              className={`flex min-h-24 cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors ${
                selected
                  ? 'border-brand-300 bg-brand-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
              data-testid={option.testId}
            >
              <input
                type="radio"
                name="checkout-billing"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              />
              <span className="flex flex-1 items-start justify-between gap-3">
                <span>
                  <span className="block font-semibold text-gray-900">{option.label}</span>
                  <span className="mt-1 block text-sm text-gray-600">{option.cadence}</span>
                </span>
                <span className="whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  {option.price}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>
      <p className="mt-4 text-sm text-gray-500">
        This is your signup pricing preference only. Payment processing is not connected.
      </p>
    </section>
  );
}