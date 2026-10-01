'use client';

import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import type { ProgramBilling } from '../../../shared/trucking-programs';
import styles from './BillingSwitcher.module.css';

interface BillingSwitcherProps {
  billing: ProgramBilling;
  disabled: boolean;
  onChange: (billing: ProgramBilling) => void;
}

export function BillingSwitcher({ billing, disabled, onChange }: BillingSwitcherProps) {
  return (
    <section className={styles.switcher} aria-label="Billing options">
      <div className={styles.group} role="group" aria-label="Billing frequency">
        <Button
          type="button"
          hierarchy={billing === 'monthly' ? 'primary' : 'secondary'}
          size="md"
          disabled={disabled}
          aria-pressed={billing === 'monthly'}
          data-testid="button-billing-monthly"
          onClick={() => onChange('monthly')}
          className={`${styles.segment} ${billing === 'monthly' ? styles.active : ''}`}
        >
          <span className={styles.segmentContent}>
            <span className={styles.checkSlot} aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="m3.5 8.25 3 3 6-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>Monthly</span>
          </span>
        </Button>
        <Button
          type="button"
          hierarchy={billing === 'annual' ? 'primary' : 'secondary'}
          size="md"
          disabled={disabled}
          aria-pressed={billing === 'annual'}
          data-testid="button-billing-annual"
          onClick={() => onChange('annual')}
          className={`${styles.segment} ${styles.annualSegment} ${billing === 'annual' ? styles.active : ''}`}
        >
          <span className={styles.segmentContent}>
            <span className={styles.checkSlot} aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="m3.5 8.25 3 3 6-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>Yearly</span>
          </span>
          <span className={styles.savingBadge}>Save over 16%</span>
        </Button>
      </div>
      <p className={styles.note}>Pay for 10 months up front, get 12 months of service.</p>
    </section>
  );
}