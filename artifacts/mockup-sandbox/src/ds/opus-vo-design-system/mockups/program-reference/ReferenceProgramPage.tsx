'use client';

import { MapPin } from 'lucide-react';
import { ProgressIndicator } from './_ProgressIndicator';
import { useOrder } from './_state';
import { truckingPrograms } from './_programs';
import { ProgramCard } from './_ProgramCard';
import { BillingSwitcher } from './_BillingSwitcher';
import './_preview.css';

function ProgramSelectionPage() {
  const { order, programId, billing, setBilling, previewStatus, continueToCheckout, navigatePreview } = useOrder();
  const location = order.location;
  return (
    <main className="bg-gray-50 p-4 lg:p-8" data-testid="program-selection-page">
      <div className="mx-auto max-w-4xl lg:max-w-6xl">
        <div className="mb-8"><ProgressIndicator currentStep={3} onNavigate={navigatePreview} /></div>
        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Choose Your Program</h1>
            <p className="mt-2 text-sm text-gray-600">Choose a program and billing preference to go straight to checkout.</p>
          </div>
          <div className="flex items-start gap-3 md:max-w-xs md:border-l md:border-gray-200 md:pl-6">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{location.name}</p>
              <p className="mt-1 text-gray-500">{location.city}, {location.stateCode}</p>
            </div>
          </div>
        </header>
        <BillingSwitcher billing={billing} onChange={setBilling} />
        <fieldset className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2" data-testid="programs-list">
          <legend className="sr-only">Programs</legend>
          {truckingPrograms.map((plan) => <ProgramCard key={plan.id} plan={plan} selected={programId === plan.id}
            billing={billing} onSelect={continueToCheckout} />)}
        </fieldset>
        <div role="status" aria-live="polite" aria-atomic="true" data-testid="preview-status"
          className={`mx-auto max-w-5xl text-sm text-brand-800 ${previewStatus ? 'mt-5 rounded-lg border border-brand-200 bg-brand-25 p-4' : ''}`}>
          {previewStatus}
        </div>
      </div>
    </main>
  );
}

export function ReferenceProgramPage() {
  return <div className="signup-flow program-reference-preview bg-gray-50">
    <header className="bg-white border-b border-gray-100 py-5 px-6 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        <img src="/__mockup/images/opus-vo-main-logo.svg" alt="Opus Virtual Offices" className="h-11" />
      </div>
    </header>
    <ProgramSelectionPage />
  </div>;
}

export default ReferenceProgramPage;