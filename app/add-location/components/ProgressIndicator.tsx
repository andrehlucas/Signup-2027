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
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { id: 1, name: 'Your Info', path: '/' },
  { id: 2, name: 'Pick Your Location', path: '/add-location' },
  { id: 3, name: 'Customize', path: '/add-location/customize' },
  { id: 4, name: 'Checkout', path: '/add-location/checkout' },
];

export function ProgressIndicator({ currentStep, steps = defaultSteps }: ProgressIndicatorProps) {
  const router = useRouter();

  const handleStepClick = (step: Step) => {
    if (step.id <= currentStep) {
      router.push(step.path);
    }
  };

  return (
    <nav aria-label="Progress" className="w-full" data-testid="progress-indicator">
      <ol className="flex items-center justify-center">
        {steps.map((step, stepIdx) => {
          const isComplete = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = step.id < currentStep;

          return (
            <li
              key={step.name}
              className={`relative flex items-center ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`flex items-center ${isClickable ? 'cursor-pointer group' : ''} ${isCurrent ? 'cursor-default' : ''} z-10`}
                onClick={() => handleStepClick(step)}
                data-testid={`step-nav-${step.id}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isComplete ? (
                  <>
                    <span
                       className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 shadow-sm transition-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-brand-200 group-hover:ring-offset-2 flex-shrink-0"
                      data-testid={`step-${step.id}-complete`}
                    >
                      <Check className="h-5 w-5 text-white" aria-hidden="true" strokeWidth={2.5} />
                    </span>
                     <span className="ml-2.5 text-sm font-medium text-gray-700 group-hover:text-brand-600 hidden sm:block whitespace-nowrap">
                      {step.name}
                    </span>
                  </>
                ) : isCurrent ? (
                  <>
                    <span
                       className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 shadow-md flex-shrink-0 ring-4 ring-brand-100"
                      data-testid={`step-${step.id}-current`}
                    >
                      <span className="text-white font-bold text-sm">{step.id}</span>
                    </span>
                     <span className="ml-2.5 text-sm font-semibold text-brand-600 hidden sm:block whitespace-nowrap">
                      {step.name}
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-200 bg-white flex-shrink-0"
                      data-testid={`step-${step.id}-upcoming`}
                    >
                      <span className="text-gray-400 text-sm">{step.id}</span>
                    </span>
                    <span className="ml-2.5 text-sm font-medium text-gray-400 hidden sm:block whitespace-nowrap">
                      {step.name}
                    </span>
                  </>
                )}
              </div>

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
