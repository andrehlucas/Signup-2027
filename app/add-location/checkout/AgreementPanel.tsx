'use client';

import { FileText } from 'lucide-react';
import { Checkbox } from '@/app/components/ui/checkbox';

interface AgreementPanelProps {
  accepted: boolean;
  disabled: boolean;
  onAcceptedChange: (accepted: boolean) => void;
}

export function AgreementPanel({ accepted, disabled, onAcceptedChange }: AgreementPanelProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6" data-testid="agreement-section">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <FileText className="h-5 w-5 text-gray-600" aria-hidden="true" />
        Review &amp; Confirm
      </h2>
      <div className="flex items-start gap-3">
        <Checkbox
          id="agreement"
          checked={accepted}
          disabled={disabled}
          onCheckedChange={(checked) => onAcceptedChange(checked === true)}
          className="mt-1"
          data-testid="checkbox-agreement"
        />
        <label htmlFor="agreement" className="cursor-pointer space-y-2 text-sm text-gray-600">
          <span className="block font-medium text-gray-900">Confirm your signup details</span>
          <span className="block">
            I confirm that the program, business location, and billing preference shown in this summary
            reflect the signup I am submitting.
          </span>
          <span className="block">
            This confirmation is not a payment authorization or a new service contract. Payment processing
            is not connected; no payment will be collected and no paid service will be activated.
          </span>
        </label>
      </div>
    </section>
  );
}