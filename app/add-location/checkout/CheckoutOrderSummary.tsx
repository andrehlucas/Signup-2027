import { MapPin, Package } from 'lucide-react';
import type { AvailableLocation } from '../types';
import type { ProgramBilling } from '../../../shared/trucking-programs';
import type { truckingPrograms } from '../../../shared/trucking-programs';

type Program = (typeof truckingPrograms)[number];

interface CheckoutOrderSummaryProps {
  location: AvailableLocation;
  program: Program;
  billing: ProgramBilling;
}

export function CheckoutOrderSummary({ location, program, billing }: CheckoutOrderSummaryProps) {
  const price = billing === 'monthly' ? program.monthly : program.annualTotal;
  const cadence = billing === 'monthly' ? '/month' : '/year';

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6" data-testid="checkout-order-summary">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
            <MapPin className="h-5 w-5 text-brand-600" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900">Business Location</p>
            <p className="text-sm text-gray-600">{location.name}</p>
            <p className="mt-1 text-sm text-gray-500">{location.address}</p>
            {location.addressLine2 && <p className="text-sm text-gray-500">{location.addressLine2}</p>}
            <p className="text-sm text-gray-500">
              {location.city}, {location.stateCode} {location.zipCode}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
            <Package className="h-5 w-5 text-brand-600" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900">Opus Trucking Program</p>
              <p className="text-sm text-gray-600">{program.name}</p>
              <p className="mt-1 text-sm text-gray-500">{billing === 'monthly' ? 'Monthly billing' : 'Annual billing'}</p>
            </div>
            <p className="whitespace-nowrap text-right font-semibold text-gray-900">
              ${price.toLocaleString('en-US')}
              <span className="font-normal text-gray-500">{cadence}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}