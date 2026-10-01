'use client';

import { ArrowUpRight, Check, Minus } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { Badge } from '@workspace/opus-vo-design-system/components/ui/badge';
import { truckingPrograms, truckingSharedFeaturesSummary, truckingProOnlyFeatures, type ProgramBilling, type TruckingProgramId } from './_programs';
import styles from './_ProgramCard.module.css';

type Program = (typeof truckingPrograms)[number];

function Feature({ label, included = true }: { label: string; included?: boolean }) {
  return <li className={`${styles.feature} ${included ? '' : styles.excluded}`}>
    <span className={styles.featureIcon}>{included ? <Check aria-hidden="true" /> : <Minus aria-hidden="true" />}</span>
    <span>{!included && <span className="sr-only">Not included: </span>}{label}</span>
  </li>;
}

/** Studiova source structure: plan → price → description → divider → benefits → bottom CTA.
 * Only the structure is adapted; all product content comes from the extracted Opus data.
 */
export function ProgramCard({ plan, selected, billing, onSelect }: {
  plan: Program;
  selected: boolean;
  billing: ProgramBilling;
  onSelect: (id: TruckingProgramId) => void;
}) {
  const annual = billing === 'annual';
  return (
    <article className={`${styles.card} rounded-xl shadow-sm ${selected ? styles.selected : ''}`} data-testid={`program-card-${plan.id}`}>
      <div className={styles.top}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Opus Trucking</p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-900">{plan.label}</h2>
          </div>
          {selected && <Badge color="brand" leadingIcon={<Check className="h-3 w-3" />}>Selected</Badge>}
        </div>
        <div className={styles.pricing} aria-live="polite">
          <div className={styles.priceRow}>
            <span className={`${styles.price} text-5xl font-bold tracking-tight`}>${annual ? Math.round(plan.annualTotal / 12) : plan.monthly}</span>
            <span className="text-sm text-gray-600">{annual ? '/ mo equiv.' : '/ mo'}</span>
          </div>
          {annual ? <div className={styles.priceDetails}>
            <p className="text-sm font-medium text-brand-700">${plan.annualTotal.toLocaleString('en-US')} billed yearly · save ${plan.monthly * 2}/year</p>
            <p className="text-xs text-gray-600">Rounded equivalent · exact ${(plan.annualTotal / 12).toFixed(2)}/mo.</p>
          </div> : <div className={styles.priceDetails}>
            <p className="text-sm font-medium text-gray-700">Billed monthly</p>
            <p className="text-xs text-gray-600">Or get 2 months free with yearly billing.</p>
          </div>}
        </div>
        <p className="mt-5 text-sm text-gray-600">{plan.description}</p>
      </div>
      <div className={styles.features}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600">What&apos;s included</h3>
        <ul className={styles.featureList}>
          <Feature label={`${plan.meetingHours} Hours Meeting Room Access per month`} />
          <Feature label="Registered Agent" />
          <Feature label="Vault & Digital Document Storage" />
        </ul>
        <h4 className="mt-5 text-xs font-semibold text-gray-700">Shared business services</h4>
        <p className="mt-2 text-sm leading-6 text-gray-600">{truckingSharedFeaturesSummary}</p>
        <div className={styles.connections}>
          <h4 className="text-xs font-semibold text-gray-700">Additional communication services</h4>
          <ul className={styles.featureList}>
            {truckingProOnlyFeatures.map((feature) => <Feature key={feature} label={feature} included={plan.id === 'pro'} />)}
          </ul>
          {plan.id === 'essentials' && <p className="mt-2 text-xs text-gray-600">These services are available with Pro, not Essentials.</p>}
        </div>
      </div>
      <div className={styles.bottom}>
        <Button type="button" hierarchy="primary" size="xl" className="w-full"
          trailingIcon={<ArrowUpRight className="h-5 w-5" />} aria-label={`Continue to Checkout with ${plan.label}`}
          onClick={() => onSelect(plan.id)} data-testid={`button-select-${plan.id}`}>Continue to Checkout</Button>
      </div>
    </article>
  );
}