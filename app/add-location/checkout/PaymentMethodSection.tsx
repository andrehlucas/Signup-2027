'use client';

import { CreditCard } from 'lucide-react';
import { Input } from '@/app/components/ui/input';

function DisabledPaymentField({
  id,
  label,
  placeholder,
  testId,
  className,
}: {
  id: string;
  label: string;
  placeholder: string;
  testId?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        disabled
        aria-describedby="payment-fields-disabled-note"
        className="w-full"
        data-testid={testId}
      />
    </div>
  );
}

export function PaymentMethodSection() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6" data-testid="payment-method-section">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <CreditCard className="h-5 w-5 text-gray-600" aria-hidden="true" />
        Payment Method
      </h2>

      <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
          <CreditCard className="h-5 w-5 text-gray-600" aria-hidden="true" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Credit / Debit Card</p>
          <p className="text-xs text-gray-500">Card entry is unavailable</p>
        </div>
      </div>

      <p
        id="payment-fields-disabled-note"
        className="mb-5 rounded-lg border border-warning-200 bg-warning-50 p-3 text-sm text-warning-800"
      >
        Payment processing is not connected. These disabled fields show the payment section layout only;
        no card details are collected or transmitted. No payment is collected and no paid service is activated.
      </p>

      <fieldset disabled className="space-y-4 opacity-70">
        <legend className="sr-only">Payment and billing details (unavailable)</legend>
        <DisabledPaymentField
          id="cardholder-name"
          label="Cardholder Name"
          placeholder="Name as shown on card"
          testId="input-cardholder-name"
        />
        <DisabledPaymentField
          id="card-number"
          label="Card Number"
          placeholder="Card number will be available when payment processing is connected"
          testId="input-card-number"
        />

        <div className="grid grid-cols-2 gap-4">
          <DisabledPaymentField
            id="card-expiry"
            label="Expiry Date"
            placeholder="MM/YY"
            testId="input-expiry-date"
          />
          <DisabledPaymentField
            id="card-cvc"
            label="CVC"
            placeholder="3- or 4-digit security code"
            testId="input-cvv"
          />
        </div>

        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-900">Billing Address</h3>
          <DisabledPaymentField
            id="billing-street"
            label="Street Address"
            placeholder="Street and building number"
            testId="input-billing-address"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DisabledPaymentField id="billing-city" label="City" placeholder="City" testId="input-billing-city" />
            <DisabledPaymentField id="billing-state" label="State" placeholder="State or region" testId="input-billing-state" />
          </div>
          <div className="w-full sm:w-1/2">
            <DisabledPaymentField
              id="billing-zip"
              label="ZIP Code"
              placeholder="ZIP or postal code"
              testId="input-billing-zip"
            />
          </div>
        </div>
      </fieldset>
    </section>
  );
}