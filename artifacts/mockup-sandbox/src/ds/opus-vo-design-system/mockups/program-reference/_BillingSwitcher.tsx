'use client';

import { Check, Flame } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { Badge } from '@workspace/opus-vo-design-system/components/ui/badge';
import type { ProgramBilling } from './_programs';
import styles from './_BillingSwitcher.module.css';

export function BillingSwitcher({ billing, onChange }: {
  billing: ProgramBilling;
  onChange: (value: ProgramBilling) => void;
}) {
  return (
    <section className={styles.switcher} aria-label="Billing preference">
      <div className={styles.controls}>
        <div className={`${styles.group} rounded-xl`} role="group" aria-label="Choose billing frequency">
          <Button type="button" hierarchy={billing === 'monthly' ? 'primary' : 'tertiary'} size="lg"
            aria-pressed={billing === 'monthly'} onClick={() => onChange('monthly')}
            leadingIcon={billing === 'monthly' ? <Check className="h-5 w-5" /> : undefined}
            data-testid="button-billing-monthly">Monthly</Button>
          <Button type="button" hierarchy={billing === 'annual' ? 'primary' : 'tertiary'} size="lg"
            aria-pressed={billing === 'annual'} onClick={() => onChange('annual')}
            leadingIcon={billing === 'annual' ? <Check className="h-5 w-5" /> : undefined}
            data-testid="button-billing-annual">Yearly</Button>
        </div>
        <Badge color="warning" variant="pill" size="md" leadingIcon={<Flame className="h-4 w-4" />}>Save over 16%</Badge>
      </div>
      <p className="text-sm text-gray-600 text-center">2 months free · Pay for 10 months, get 12 months of service.</p>
    </section>
  );
}