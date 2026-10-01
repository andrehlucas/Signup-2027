'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  path: string;
}

interface ProgressIndicatorProps {
  currentStep: number;
  disabled?: boolean;
}

const steps: Step[] = [
  { id: 1, name: 'Your Info', path: '/' },
  { id: 2, name: 'Pick Your Location', path: '/add-location' },
  { id: 3, name: 'Choose Your Program', path: '/add-location/program' },
];

export function ProgressIndicator({ currentStep, disabled = false }: ProgressIndicatorProps) {
  const router = useRouter();

  return (
    <nav aria-label="Progress" className="w-full" data-testid="progress-indicator">
      <ol className="flex items-center justify-center">
        {steps.map((step, stepIdx) => {
          const isComplete = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li
              key={step.name}
              className={`relative flex items-center ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}
            >
              {isComplete ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => router.push(step.path)}
                  className="flex items-center cursor-pointer group z-10 rounded focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200"
                  data-testid={`step-nav-${step.id}`}
                  aria-label={`Go back to ${step.name}`}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 shadow-sm transition-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-brand-200 group-hover:ring-offset-2 flex-shrink-0"
                    data-testid={`step-${step.id}-complete`}
                  >
                    <Check className="h-5 w-5 text-white" aria-hidden="true" strokeWidth={2.5} />
                  </span>
                  <span className="ml-2.5 text-sm font-medium text-gray-700 group-hover:text-brand-600 hidden sm:block whitespace-nowrap">
                    {step.name}
                  </span>
                </button>
              ) : (
                <div
                  className={`flex items-center z-10 ${isCurrent ? 'cursor-default' : ''}`}
                  data-testid={`step-nav-${step.id}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0 ${
                      isCurrent
                        ? 'bg-brand-500 shadow-md ring-4 ring-brand-100'
                        : 'border-2 border-gray-200 bg-white'
                    }`}
                    data-testid={`step-${step.id}-${isCurrent ? 'current' : 'upcoming'}`}
                  >
                    <span className={`${isCurrent ? 'text-white font-bold' : 'text-gray-400'} text-sm`}>
                      {step.id}
                    </span>
                  </span>
                  <span className={`ml-2.5 text-sm hidden sm:block whitespace-nowrap ${
                    isCurrent ? 'font-semibold text-brand-600' : 'font-medium text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                </div>
              )}

              {stepIdx !== steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 rounded-full ${isComplete ? 'bg-brand-500' : 'bg-gray-200'}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}