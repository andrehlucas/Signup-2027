'use client';

import { Check, X } from 'lucide-react';
import {
  truckingPrograms,
  truckingSharedFeaturesSummary,
  truckingProOnlyFeatures,
  type ProgramBilling,
  type TruckingProgramId,
} from './_programs';
import styles from './_ProgramCard.module.css';

type Program = (typeof truckingPrograms)[number];

interface ProgramCardProps {
  plan: Program;
  selected: boolean;
  billing: ProgramBilling;
  disabled: boolean;
  onSelect: (id: TruckingProgramId, billing?: ProgramBilling) => void;
}

function Feature({ label, included = true }: { label: string; included?: boolean }) {
  return (
    <li className={`${styles.feature} ${included ? '' : styles.excluded}`}>
      <span className={styles.featureIcon}>
        {included ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
      </span>
      <span>
        {!included && <span className="sr-only">Not included: </span>}
        {label}
      </span>
    </li>
  );
}

/** Presentation adapted from the user's uploaded TruckingPricingCards export. */
export function ProgramCard({ plan, selected, billing, disabled, onSelect }: ProgramCardProps) {
  return (
    <article
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      data-testid={`program-card-${plan.id}`}
    >
      <div className={styles.top}>
        <h2 className={styles.title}>
          <span className={styles.brandName}>Opus Trucking</span>
          <span className={styles.planBadge}>{plan.label}</span>
        </h2>
        <p className={styles.description}>{plan.description}</p>
        <div className={styles.pricing}>
          {(['monthly', 'annual'] as const).map((frequency) => {
            const checked = selected && billing === frequency;
            return (
              <label
                key={frequency}
                className={`${styles.priceOption} ${checked ? styles.checked : ''} ${disabled ? styles.disabled : ''}`}
              >
                <span className={styles.billingLabel}>
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
                  {frequency === 'annual' && (
                    <span className={styles.promo}>
                      <span>2 months free</span>
                    </span>
                  )}
                </span>
                <span className={styles.price}>
                  ${frequency === 'monthly' ? plan.monthly : plan.annualTotal.toLocaleString('en-US')}
                </span>
                <span className={styles.unit}>{frequency === 'monthly' ? 'Billed monthly' : 'Billed yearly'}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div className={styles.features}>
        <h3 className={styles.featuresHeading}>What&apos;s included</h3>
        <p className={styles.summary}>{truckingSharedFeaturesSummary}</p>
        <ul className={styles.featureList}>
          <Feature label={`${plan.meetingHours} Hours Meeting Room Access per month`} />
          <Feature label="Vault" />
          <Feature label="Digital Document Storage" />
          <Feature label="Registered Agent" />
          {truckingProOnlyFeatures.map((feature) => (
            <Feature key={feature} label={feature} included={plan.id === 'pro'} />
          ))}
        </ul>
      </div>
    </article>
  );
}