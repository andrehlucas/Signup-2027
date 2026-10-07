import { useState } from 'react';
import { Check, Truck } from 'lucide-react';
import { ProgramCard } from './_SourceProgramCard';
import { truckingPrograms, type TruckingProgramId } from './_sourcePrograms';
import styles from './ThreePlans.module.css';

export function ThreePlans() {
  const [selectedId, setSelectedId] = useState<TruckingProgramId | null>(null);
  const selectedPlan = truckingPrograms.find((plan) => plan.id === selectedId);

  return (
    <div className={`${styles.preview} bg-gray-50 font-sans text-foreground`}>
      <header className="border-b border-gray-200 bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 md:px-8">
          <img
            src="/__mockup/images/current-signup-logo.svg"
            alt="Opus Virtual Offices"
            className={styles.logo}
          />
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Truck className="h-5 w-5 text-brand-700" aria-hidden="true" />
            <span>For trucking operators</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
        <section className="flex flex-col gap-3" aria-labelledby="plans-heading">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Opus Trucking programs</p>
          <h1 id="plans-heading" className="text-2xl font-bold tracking-tight text-gray-900 md:text-4xl">
            A business base. Built for the road.
          </h1>
          <p className="max-w-2xl text-base text-gray-600">
            Choose the address, compliance and communication support that fits your operation.
            Compare every inclusion below.
          </p>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {truckingPrograms.map((plan) => (
            <ProgramCard
              key={plan.id}
              plan={plan}
              selected={selectedId === plan.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>

        <div
          id="checkout-preview-notice"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="flex items-start gap-3 rounded-lg border border-gray-200 bg-card p-4 text-sm text-gray-600"
        >
          {selectedPlan && <Check className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />}
          <p>
            {selectedPlan ? (
              <>
                <strong className="font-semibold text-gray-900">{selectedPlan.name} selected · ${selectedPlan.monthly}/mo.</strong>{' '}
                Preview only: no checkout was opened, no payment was taken and no subscription was created.
                Choose another card to change your selection.
              </>
            ) : (
              <>
                <strong className="font-semibold text-gray-900">Interactive preview only.</strong>{' '}
                Continue to Checkout selects a plan here. It does not open checkout or collect payment.
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}

export default ThreePlans;
