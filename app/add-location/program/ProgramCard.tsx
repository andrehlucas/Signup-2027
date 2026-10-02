'use client';

import { Check, X } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import choiceStyles from '../components/ChoiceButton.module.css';
import {
  truckingPrograms,
  truckingSharedFeaturesSummary,
  truckingProOnlyFeatures,
  type ProgramBilling,
  type TruckingProgramId,
} from '../../../shared/trucking-programs';
import styles from './ProgramCard.module.css';

type Program = (typeof truckingPrograms)[number];

interface ProgramCardProps {
  plan: Program;
  selected: boolean;
  billing: ProgramBilling;
  disabled: boolean;
  loading: boolean;
  onSelect: (id: TruckingProgramId) => void;
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
export function ProgramCard({ plan, selected, billing, disabled, loading, onSelect }: ProgramCardProps) {
  const buttonLabel = 'Continue to Checkout';
  return (
    <article
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      data-testid={`program-card-${plan.id}`}
    >
      <div className={styles.top}>
        <h2 className={styles.title}>
          <span className={styles.brandName}>
            <span>{plan.name}</span>
          </span>
        </h2>
        <p className={styles.description}>{plan.description}</p>
        <div className={styles.pricing} aria-live="polite">
          <div className={styles.priceRow}>
            <span className={styles.price}>
              ${billing === 'monthly' ? plan.monthly : Math.round(plan.annualTotal / 12)}
            </span>
            <span className={styles.unit}>{billing === 'monthly' ? '/ mo' : '/ mo equiv.'}</span>
          </div>
          {billing === 'annual' ? (
            <div className={styles.annualDetails}>
              <p className={styles.annualTotal}>
                ${plan.annualTotal.toLocaleString('en-US')} due for the year · save ${plan.monthly * 2}
              </p>
            </div>
          ) : (
            <p className={`${styles.monthlyNote} font-bold`}>Billed monthly - Or pay annually and get 2 months free</p>
          )}
        </div>
        <Button
          type="button"
          hierarchy="primary"
          size="xl"
          className={`${styles.cta} ${choiceStyles.button} w-full`}
          disabled={disabled}
          loading={loading}
          aria-label={`${buttonLabel} with ${plan.label}`}
          onClick={() => onSelect(plan.id)}
          data-testid={`button-select-${plan.id}`}
        >
          {buttonLabel}
        </Button>
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