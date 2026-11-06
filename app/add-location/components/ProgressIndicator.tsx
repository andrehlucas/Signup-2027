'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

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
  { id: 2, name: 'Pick Your Location', path: '/add-location/pick-plan' },
  { id: 3, name: 'Customize', path: '/add-location/customize' },
  { id: 4, name: 'Checkout', path: '/add-location/checkout' },
];

export function ProgressIndicator({ currentStep, steps = defaultSteps }: ProgressIndicatorProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const activeStep = steps.find(step => step.id === currentStep);
  const currentPosition = steps.findIndex(step => step.id === currentStep) + 1;

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 640px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <nav
      aria-label="Enrollment progress"
      className="mx-auto w-full max-w-3xl"
      data-testid="progress-indicator"
    >
      {activeStep && (
        <div className="sm:hidden" data-testid="mobile-progress">
          <div className="flex items-center justify-between gap-3">
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  ref={mobileTriggerRef}
                  type="button"
                  className="inline-flex min-h-11 min-w-0 items-center gap-1.5 rounded-md text-left text-sm font-semibold text-[#006d91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006d91] focus-visible:ring-offset-2"
                  aria-label={`Enrollment steps, ${activeStep.name}, step ${currentPosition} of ${steps.length}`}
                  data-testid="mobile-step-trigger"
                >
                  <span className="truncate">{activeStep.name}</span>
                  <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[min(20rem,calc(100vw-2rem))] sm:hidden data-[state=open]:animate-none data-[state=closed]:animate-none"
                aria-label="Enrollment steps"
                onCloseAutoFocus={(event) => {
                  event.preventDefault();
                  if (!window.matchMedia('(min-width: 640px)').matches) {
                    mobileTriggerRef.current?.focus({ preventScroll: true });
                  }
                }}
                data-testid="mobile-step-menu"
              >
                {steps.map(step => {
                  const isCompleted = step.id < currentStep;
                  const isCurrent = step.id === currentStep;
                  return (
                    <DropdownMenuItem
                      key={step.id}
                      disabled={!isCompleted}
                      aria-current={isCurrent ? 'step' : undefined}
                      className={`min-h-11 gap-3 px-3 data-[disabled]:opacity-100 ${isCurrent ? 'font-semibold text-[#006d91]' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}
                      onSelect={() => router.push(step.path)}
                      data-testid={`mobile-step-nav-${step.id}`}
                    >
                      <span className="flex w-4 shrink-0 justify-center text-xs" aria-hidden="true">
                        {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                      </span>
                      <span>{step.name}</span>
                      {isCompleted && <span className="sr-only">, completed</span>}
                      {isCurrent && <span className="ml-auto text-xs">Current</span>}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="shrink-0 text-xs font-medium tabular-nums text-gray-600" data-testid="mobile-step-count">
              Step {currentPosition} of {steps.length}
            </span>
          </div>
          <div className="mt-1 flex gap-1.5" aria-hidden="true">
            {steps.map(step => (
              <span
                key={step.id}
                className={`h-1 flex-1 rounded-full ${step.id === currentStep ? 'bg-[#36bff9]' : step.id < currentStep ? 'bg-slate-400' : 'bg-gray-200'}`}
                data-testid={`mobile-step-segment-${step.id}`}
              />
            ))}
          </div>
        </div>
      )}
      <ol
        className="hidden gap-x-4 gap-y-4 sm:grid sm:grid-flow-col sm:auto-cols-fr sm:grid-cols-none sm:gap-5"
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
