'use client';

import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
}

interface ProgressIndicatorProps {
  currentStep: number;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { id: 1, name: 'Your Info' },
  { id: 2, name: 'Location' },
  { id: 3, name: 'Customize & Checkout' },
];

export function ProgressIndicator({ currentStep, steps = defaultSteps }: ProgressIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full" data-testid="progress-indicator">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-[#36bff9]" data-testid="text-step-title">
          {steps.find(s => s.id === currentStep)?.name || ''}
        </h3>
        <div className="w-full max-w-md mx-auto h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-[#36bff9] rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
            data-testid="progress-bar"
          />
        </div>
      </div>
      <ol className="flex items-center justify-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
          >
            {step.id < currentStep ? (
              <div className="flex items-center">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#36bff9]"
                  data-testid={`step-${step.id}-complete`}
                >
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <span className="ml-3 text-sm font-medium text-gray-900 hidden sm:block">
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
              <div className="flex items-center" aria-current="step">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#36bff9] bg-white"
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
        ))}
      </ol>
    </nav>
  );
}
