'use client';

import { useRouter } from 'next/navigation';

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

  return (
    <nav
      aria-label="Enrollment progress"
      className="mx-auto w-full max-w-3xl"
      data-testid="progress-indicator"
    >
      <ol
        className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-flow-col sm:auto-cols-fr sm:grid-cols-none sm:gap-5"
      >
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const state = isCompleted ? 'completed' : isCurrent ? 'active' : 'inactive';
          const content = (
            <>
              <span
                aria-hidden="true"
                className={`block h-1 w-full rounded-full ${
                  isCurrent ? 'bg-[#36bff9]' : isCompleted ? 'bg-slate-400' : 'bg-gray-200'
                }`}
                data-testid={`step-${step.id}-${isCompleted ? 'complete' : isCurrent ? 'current' : 'upcoming'}`}
              />
              <span
                className={`block whitespace-nowrap text-xs font-semibold leading-5 sm:text-sm ${
                  isCurrent
                    ? 'text-[#006d91]'
                    : isCompleted
                      ? 'text-gray-900 group-hover:text-gray-700'
                      : 'text-gray-500'
                }`}
              >
                <span className="sr-only">Step {step.id}: </span>
                {step.name}
                {isCompleted && <span className="sr-only">, completed</span>}
              </span>
            </>
          );

          return (
            <li
              key={step.id}
              className="min-w-0"
              aria-current={isCurrent ? 'step' : undefined}
              data-state={state}
            >
              {isCompleted ? (
                <button
                  type="button"
                  aria-label={`Return to ${step.name}`}
                  className="group flex min-h-12 w-full flex-col items-start gap-3.5 rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006d91] focus-visible:ring-offset-4"
                  onClick={() => router.push(step.path)}
                  data-testid={`step-nav-${step.id}`}
                >
                  {content}
                </button>
              ) : (
                <div
                  className="flex min-h-12 w-full flex-col items-start gap-3.5 text-left"
                  data-testid={`step-nav-${step.id}`}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
