'use client';

import { Check } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';

const steps = [
  { id: 1, name: 'Your Info' },
  { id: 2, name: 'Pick Your Location' },
  { id: 3, name: 'Choose Your Program' },
];

// Source chrome from the extracted CurrentProgramPage, with local-only actions.
export function ProgressIndicator({ currentStep, onNavigate }: {
  currentStep: number;
  onNavigate: (name: string) => void;
}) {
  return (
    <nav aria-label="Progress" className="w-full" data-testid="progress-indicator">
      <ol className="flex items-center justify-center">
        {steps.map((step, stepIdx) => {
          const isComplete = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          return (
            <li key={step.name} className={`relative flex items-center ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
              {isComplete ? (
                <Button type="button" hierarchy="link-gray" size="md" onClick={() => onNavigate(step.name)}
                  aria-label={`Go back to ${step.name}`} data-testid={`step-nav-${step.id}`}>
                  <span className="signup-step-dot flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 shadow-sm shrink-0"
                    data-testid={`step-${step.id}-complete`}>
                    <Check className="h-5 w-5 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </span>
                  <span className="ml-2.5 text-sm font-medium text-gray-700 hidden sm:block whitespace-nowrap">{step.name}</span>
                </Button>
              ) : (
                <div className="flex items-center z-10" data-testid={`step-nav-${step.id}`} aria-current={isCurrent ? 'step' : undefined}>
                  <span className="signup-step-dot flex h-9 w-9 items-center justify-center rounded-full shrink-0 bg-brand-500 shadow-md ring-4 ring-brand-100">
                    <span className="text-white font-bold text-sm">{step.id}</span>
                  </span>
                  <span className="ml-2.5 text-sm hidden sm:block whitespace-nowrap font-semibold text-brand-600">{step.name}</span>
                </div>
              )}
              {stepIdx !== steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 rounded-full ${isComplete ? 'signup-step-connector--complete bg-brand-500' : 'bg-gray-200'}`} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}