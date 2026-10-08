'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import {
  truckingPrograms,
  truckingSharedFeatures,
  truckingProFeatures,
  truckingWorksFeatures,
  type TruckingProgramId,
  type ProgramBilling,
} from '../../../shared/trucking-programs';
import styles from './ProgramCard.module.css';
import choiceStyles from '../components/ChoiceButton.module.css';

type Program = (typeof truckingPrograms)[number];

interface ProgramCardProps {
  plan: Program;
  selected: boolean;
  billing: ProgramBilling;
  disabled: boolean;
  loading: boolean;
  onSelect: (id: TruckingProgramId) => void;
}

function Feature({ label }: { label: string }) {
  return (
    <li className="text-sm font-medium text-gray-700">
      {label}
    </li>
  );
}

function FeatureGroup({ title, features, headingClassName = 'text-xs font-semibold uppercase tracking-wide text-gray-600' }: { title?: string; features: readonly string[]; headingClassName?: string }) {
  return (
    <section className="flex flex-col gap-4">
      {title && <h3 className={headingClassName}>{title}</h3>}
      <ul className="list-disc space-y-3 pl-5">
        {features.map((feature) => <Feature key={feature} label={feature} />)}
      </ul>
    </section>
  );
}

/** Retains the approved Opus card's price, checkout action and feature composition. */
export function ProgramCard({ plan, selected, billing, disabled, loading, onSelect }: ProgramCardProps) {
  return (
    <article
      className={`${styles.card} flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-card shadow-xs ${selected ? styles.selected : ''}`}
      aria-labelledby={`plan-title-${plan.id}`}
      data-testid={`program-card-${plan.id}`}
    >
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-2">
          <h2 id={`plan-title-${plan.id}`} className="whitespace-nowrap font-semibold tracking-tight text-gray-900 xl:text-xl text-[20px]">
            {plan.name}
          </h2>
          <p className={`${styles.description} text-sm text-gray-600`}>{plan.description}</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-gray-900">${billing === 'annual' ? Math.round(plan.annualTotal / 12) : plan.monthly}</span>
            <span className="text-sm font-medium text-gray-600">{billing === 'annual' ? '/mo equiv.' : '/mo'}</span>
          </div>
          <p className="text-sm font-bold text-gray-700">
            {billing === 'monthly' ? 'Billed monthly - Or pay annually and get 2 months free' : `${plan.annualTotal.toLocaleString('en-US')} due for the year · save ${plan.monthly * 2}`}
          </p>
        </div>
        <Button
          type="button"
          hierarchy="primary"
          size="xl"
          className={`${choiceStyles.button} w-full`}
          trailingIcon={<ArrowRight className="h-5 w-5" />}
          disabled={disabled}
          loading={loading}
          aria-label={`Continue to Checkout with ${plan.name}`}
          aria-pressed={selected}
          onClick={() => onSelect(plan.id)}
          data-testid={`button-select-${plan.id}`}
        >
          Continue to Checkout
        </Button>
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-gray-600">
          <span>{plan.featureCount} included features</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 bg-gray-25 p-6 pt-[0px]">
        <FeatureGroup features={truckingSharedFeatures} />
        {plan.id !== 'essentials' && (
          <FeatureGroup
            title="Additional features"
            headingClassName="text-xs uppercase tracking-wide font-black text-[color:var(--brand-500)]"
            features={plan.id === 'works' ? [...truckingProFeatures, ...truckingWorksFeatures] : truckingProFeatures}
          />
        )}
      </div>
    </article>
  );
}
