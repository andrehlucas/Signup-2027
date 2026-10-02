'use client';

import { useId } from 'react';
import { Check, Flame } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { Badge } from '@workspace/opus-vo-design-system/components/ui/badge';
import type { ProgramBilling } from '../../../shared/trucking-programs';
import styles from './BillingSwitcher.module.css';

interface BillingSwitcherProps {
  billing: ProgramBilling;
  disabled: boolean;
  onChange: (billing: ProgramBilling) => void;
}

export function BillingSwitcher({ billing, disabled, onChange }: BillingSwitcherProps) {
  const id = useId();
  return (
    <section className="mx-auto mb-8 flex max-w-md flex-col gap-3" aria-label="Billing options">
      <div className={`${styles.panel} rounded-xl border border-gray-200 bg-white p-3`}>
        <p id={`${id}-label`} className="mb-3 text-center text-sm font-medium text-gray-700">Billing frequency</p>
        <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby={`${id}-label`} aria-describedby={`${id}-note`}>
          {(['monthly', 'annual'] as const).map((frequency) => {
            const selected = billing === frequency;
            return (
              <div key={frequency} className="flex min-w-0 flex-col gap-2">
                <Button
                  type="button"
                  hierarchy={selected ? 'primary' : 'secondary'}
                  size="lg"
                  className={`${styles.option} w-full`}
                  disabled={disabled}
                  aria-pressed={selected}
                  aria-describedby={`${id}-${frequency}-description`}
                  data-testid={`button-billing-${frequency}`}
                  onClick={() => onChange(frequency)}
                >
                  <span className="flex h-4 w-4 items-center justify-center" aria-hidden="true">
                    <Check className={`h-4 w-4 ${selected ? '' : 'invisible'}`} />
                  </span>
                  {frequency === 'monthly' ? 'Monthly' : 'Yearly'}
                </Button>
                <p id={`${id}-${frequency}-description`} className="text-center text-xs text-gray-600">
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
        <p id={`${id}-note`} className={`${styles.promoNote} text-center`}>
          2 months free when paid annually
        </p>
      </div>
    </section>
  );
}