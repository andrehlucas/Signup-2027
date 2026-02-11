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
  { id: 2, name: 'Pick Your Plan', path: '/add-location/pick-plan' },
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
          const isClickable = step.id < currentStep;

          return (
            <li
              key={step.name}
              className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
            >
              {step.id < currentStep ? (
                <div
                  className={`flex items-center ${isClickable ? 'cursor-pointer group' : ''}`}
                  onClick={() => handleStepClick(step)}
                  data-testid={`step-nav-${step.id}`}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#36bff9] transition-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-[#36bff9]/30 group-hover:ring-offset-2"
                    data-testid={`step-${step.id}-complete`}
                  >
                    <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-900 group-hover:text-[#36bff9] hidden sm:block">
                    {step.name}
                  </span>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className="absolute right-0 top-4 h-0.5 w-8 sm:w-20 bg-[#36bff9]"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ) : step.id === currentStep ? (
                <div
                  className="flex items-center cursor-pointer group"
                  aria-current="step"
                  onClick={() => handleStepClick(step)}
                  data-testid={`step-nav-${step.id}`}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#36bff9] bg-white transition-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-[#36bff9]/30 group-hover:ring-offset-2"
                    data-testid={`step-${step.id}-current`}
                  >
                    <span className="text-[#36bff9] font-semibold">{step.id}</span>
                  </span>
                  <span className="ml-3 text-sm font-medium text-[#36bff9] hidden sm:block">
                    {step.name}
                  </span>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className="absolute right-0 top-4 h-0.5 w-8 sm:w-20 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white"
                    data-testid={`step-${step.id}-upcoming`}
                  >
                    <span className="text-gray-500">{step.id}</span>
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-500 hidden sm:block">
                    {step.name}
                  </span>
                  {stepIdx !== steps.length - 1 && (
                    <div
                      className="absolute right-0 top-4 h-0.5 w-8 sm:w-20 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
