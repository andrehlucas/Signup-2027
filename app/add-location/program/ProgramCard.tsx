'use client';

import { Check, X } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import {
  truckingPrograms,
  truckingProOnlyFeatures,
  type ProgramBilling,
  type TruckingProgramId,
} from '../../../shared/trucking-programs';

type Program = (typeof truckingPrograms)[number];

interface ProgramCardProps {
  plan: Program;
  selected: boolean;
  billing: ProgramBilling;
  disabled: boolean;
  onSelect: (id: TruckingProgramId, billing?: ProgramBilling) => void;
}

export function ProgramCard({ plan, selected, billing, disabled, onSelect }: ProgramCardProps) {
  const isPro = plan.id === 'pro';

  return (
    <div
      className={`relative flex flex-col rounded-xl border bg-white transition-colors duration-200 motion-reduce:transition-none ${
        selected ? 'border-brand-600 ring-1 ring-brand-600' : 'border-gray-200'
      }`}
      data-testid={`program-card-${plan.id}`}
    >
      <div className="p-6 lg:p-8">
        <div className="mb-3 flex min-h-6 items-center justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Opus Trucking</span>
          <span className={`flex items-center gap-1 text-xs font-medium text-brand-700 ${selected ? '' : 'invisible'}`}>
            <Check className="h-4 w-4" aria-hidden="true" />
            Selected
          </span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          <span className="sr-only">Opus Trucking </span>{plan.label}
        </h2>
        <p className="mt-2 min-h-10 text-sm leading-5 text-gray-600">{plan.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:gap-6">
          {(['monthly', 'annual'] as const).map((frequency) => {
            const checked = selected && billing === frequency;
            return (
              <label
                key={frequency}
                className={`flex min-w-0 flex-col border-b-2 pb-3 transition-colors motion-reduce:transition-none ${
                  disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                } ${checked ? 'border-brand-600' : 'border-gray-200 hover:border-brand-300'}`}
              >
                <span className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="program-billing"
                    value={`${plan.id}-${frequency}`}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => onSelect(plan.id, frequency)}
                    className="h-4 w-4 shrink-0 accent-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    data-testid={`radio-billing-${plan.id}-${frequency}`}
                  />
                  {frequency === 'monthly' ? 'Monthly' : 'Annual'}
                </span>
                <span className="text-3xl font-semibold leading-10 tracking-tight tabular-nums text-gray-900">
                  ${frequency === 'monthly' ? plan.monthly : plan.annualTotal.toLocaleString('en-US')}
                </span>
                <span className="mt-1 text-sm text-gray-500">
                  {frequency === 'monthly' ? '/ month' : '/ year'}
                </span>
                <span className={`mt-3 text-xs font-medium ${frequency === 'annual' ? 'text-brand-700' : 'text-gray-500'}`}>
                  {frequency === 'monthly' ? 'Billed monthly' : '2 months free'}
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="shrink-0 whitespace-nowrap text-xl font-semibold tabular-nums text-gray-900">{plan.meetingHours} hours</span>
          <span className="text-sm text-gray-600">meeting room access / month</span>
        </div>
        <ul className="mt-4 space-y-3">
          {truckingProOnlyFeatures.map((feature) => (
            <li key={feature} className={`flex items-center gap-3 text-sm ${isPro ? 'text-gray-700' : 'text-gray-500'}`}>
              {isPro ? (
                <Check className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              ) : (
                <X className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              )}
              {!isPro && <span className="sr-only">Not included: </span>}
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto px-6 pb-6 lg:px-8 lg:pb-8">
        <Button
          hierarchy={selected ? 'primary' : 'secondary'}
          size="lg"
          className="w-full"
          aria-pressed={selected}
          disabled={disabled}
          onClick={() => onSelect(plan.id)}
          data-testid={`button-select-${plan.id}`}
        >
          {selected ? `Selected ${plan.label}` : `Select ${plan.label}`}
        </Button>
      </div>
    </div>
  );
}