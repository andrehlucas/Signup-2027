import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import {
  truckingPrograms,
  truckingSharedFeatures,
  truckingProFeatures,
  truckingWorksFeatures,
  type TruckingProgramId,
} from './_sourcePrograms';
import styles from './_SourceProgramCard.module.css';

type Program = (typeof truckingPrograms)[number];

interface ProgramCardProps {
  plan: Program;
  selected: boolean;
  onSelect: (id: TruckingProgramId) => void;
}

function Feature({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-3 text-sm font-medium text-gray-700">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-primary-foreground">
        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
      </span>
      <span>{label}</span>
    </li>
  );
}

function FeatureGroup({ title, features }: { title: string; features: readonly string[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600">{title}</h3>
      <ul className="flex flex-col gap-3">
        {features.map((feature) => <Feature key={feature} label={feature} />)}
      </ul>
    </section>
  );
}

/** Retains the extracted Opus card's price / CTA / checked-inclusions composition. */
export function ProgramCard({ plan, selected, onSelect }: ProgramCardProps) {
  return (
    <article
      className={`${styles.card} flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-card shadow-xs ${selected ? styles.selected : ''}`}
      aria-labelledby={`plan-title-${plan.id}`}
      data-testid={`program-card-${plan.id}`}
    >
      <div className="flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-2">
          <h2 id={`plan-title-${plan.id}`} className="text-xl font-semibold tracking-tight text-gray-900">
            <span className="block">Opus Trucking -</span>
            <span className="block">{plan.label}</span>
          </h2>
          <p className={`${styles.description} text-sm text-gray-600`}>{plan.description}</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-gray-900">${plan.monthly}</span>
            <span className="text-sm font-medium text-gray-600">/mo</span>
          </div>
          <p className="text-sm font-bold text-gray-700">
            Billed monthly - Or pay annually and get 2 months free
          </p>
        </div>
        <Button
          type="button"
          hierarchy="primary"
          size="xl"
          className="w-full"
          trailingIcon={<ArrowRight className="h-5 w-5" />}
          aria-label={`Continue to Checkout with ${plan.name} (preview only)`}
          aria-pressed={selected}
          aria-describedby="checkout-preview-notice"
          onClick={() => onSelect(plan.id)}
          data-testid={`button-select-${plan.id}`}
        >
          Continue to Checkout
        </Button>
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-gray-600">
          <span>{plan.featureCount} included features</span>
          <span className={selected ? 'text-brand-700' : ''}>
            {selected ? 'Selected for preview' : 'Monthly plan'}
          </span>
        </div>
        <div className="contents" role="status" aria-live="polite" aria-atomic="true">
          {selected && (
            <p className="text-sm text-brand-700">
              Preview only. Your plan is selected; no checkout, payment or subscription was created.
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 border-t border-gray-200 bg-gray-25 p-6">
        <FeatureGroup title="Business & compliance · all plans" features={truckingSharedFeatures} />
        {plan.id !== 'essentials' && (
          <div className="border-t border-gray-200 pt-6">
            <FeatureGroup title="Call handling · Pro & Works" features={truckingProFeatures} />
          </div>
        )}
        {plan.id === 'works' && (
          <div className="border-t border-gray-200 pt-6">
            <FeatureGroup title="More communication · Works" features={truckingWorksFeatures} />
          </div>
        )}
      </div>
    </article>
  );
}
