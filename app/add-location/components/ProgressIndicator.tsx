'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuItem } from '@astryxdesign/core/DropdownMenu';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { Text } from '@astryxdesign/core/Text';
import { VisuallyHidden } from '@astryxdesign/core/VisuallyHidden';
import { VStack } from '@astryxdesign/core/VStack';

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

// Bar colours come from the Opus theme (DESIGN.md Navigation > Progress):
// current = Brand Blue, completed = slate, upcoming = neutral gray.
const barClass = (isCurrent: boolean, isCompleted: boolean) =>
  `block h-1 rounded-[var(--radius-full)] ${
    isCurrent
      ? 'bg-[var(--opus-progress-current)]'
      : isCompleted
        ? 'bg-[var(--opus-progress-complete)]'
        : 'bg-[var(--opus-progress-upcoming)]'
  }`;
const focusRing =
  'focus-visible:outline focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)]';

export function ProgressIndicator({ currentStep, steps = defaultSteps }: ProgressIndicatorProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeStep = steps.find(step => step.id === currentStep);
  const currentPosition = steps.findIndex(step => step.id === currentStep) + 1;

  // The step menu only exists on phones; close it if the window widens.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 640px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <VStack
      as="nav"
      aria-label="Enrollment progress"
      width="100%"
      maxWidth={768}
      className="mx-auto"
      data-testid="progress-indicator"
    >
      {activeStep && (
        <VStack gap={1} className="sm:hidden" data-testid="mobile-progress">
          <HStack gap={3} hAlign="between" vAlign="center">
            <DropdownMenu
              isMenuOpen={menuOpen}
              onOpenChange={setMenuOpen}
              alignment="start"
              menuWidth="min(20rem, calc(100vw - 2rem))"
              data-testid="mobile-step-menu"
              renderTrigger={triggerProps => (
                <button
                  {...triggerProps}
                  type="button"
                  className={`inline-flex min-h-11 min-w-0 items-center gap-1.5 rounded-[var(--radius-inner)] text-left ${focusRing}`}
                  aria-label={`Enrollment steps, ${activeStep.name}, step ${currentPosition} of ${steps.length}`}
                  data-testid="mobile-step-trigger"
                >
                  <Text type="supporting" weight="semibold" color="accent" maxLines={1}>{activeStep.name}</Text>
                  <Icon icon={ChevronDown} size="sm" color="accent" />
                </button>
              )}
            >
              {steps.map(step => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                return (
                  <DropdownMenuItem
                    key={step.id}
                    // Future steps are locked; the current step stays enabled so it
                    // reads as emphasised rather than greyed out.
                    isDisabled={!isCompleted && !isCurrent}
                    aria-current={isCurrent ? 'step' : undefined}
                    icon={isCompleted ? <Icon icon={Check} size="sm" /> : <Text type="supporting" color="secondary">{step.id}</Text>}
                    label={
                      <>
                        {isCurrent ? <Text weight="semibold" color="accent">{step.name}</Text> : step.name}
                        {isCompleted && <VisuallyHidden>, completed</VisuallyHidden>}
                      </>
                    }
                    endContent={isCurrent ? <Text type="supporting" color="accent">Current</Text> : undefined}
                    onClick={() => { if (!isCurrent) router.push(step.path); }}
                    data-testid={`mobile-step-nav-${step.id}`}
                  />
                );
              })}
            </DropdownMenu>
            <Text type="supporting" weight="medium" color="secondary" hasTabularNumbers data-testid="mobile-step-count">
              Step {currentPosition} of {steps.length}
            </Text>
          </HStack>
          <HStack gap={1.5} aria-hidden="true">
            {steps.map(step => (
              <span
                key={step.id}
                className={`flex-1 ${barClass(step.id === currentStep, step.id < currentStep)}`}
                data-testid={`mobile-step-segment-${step.id}`}
              />
            ))}
          </HStack>
        </VStack>
      )}

      <ol className="hidden gap-5 sm:grid sm:auto-cols-fr sm:grid-flow-col">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const state = isCompleted ? 'completed' : isCurrent ? 'active' : 'inactive';
          const content = (
            <>
              <span
                aria-hidden="true"
                className={`w-full ${barClass(isCurrent, isCompleted)}`}
                data-testid={`step-${step.id}-${isCompleted ? 'complete' : isCurrent ? 'current' : 'upcoming'}`}
              />
              <Text
                type="supporting"
                weight="semibold"
                color={isCurrent ? 'accent' : isCompleted ? 'primary' : 'secondary'}
                className="whitespace-nowrap"
              >
                <VisuallyHidden>Step {step.id}: </VisuallyHidden>
                {step.name}
                {isCompleted && <VisuallyHidden>, completed</VisuallyHidden>}
              </Text>
            </>
          );

          return (
            <li key={step.id} className="min-w-0" aria-current={isCurrent ? 'step' : undefined} data-state={state}>
              {isCompleted ? (
                // Completed steps navigate back (DESIGN.md: keyboard-accessible backward navigation).
                <button
                  type="button"
                  aria-label={`Return to ${step.name}`}
                  className={`flex min-h-12 w-full flex-col items-start gap-[var(--spacing-3)] rounded-[var(--radius-inner)] text-left ${focusRing}`}
                  onClick={() => router.push(step.path)}
                  data-testid={`step-nav-${step.id}`}
                >
                  {content}
                </button>
              ) : (
                <VStack gap={3} className="min-h-12 w-full" data-testid={`step-nav-${step.id}`}>
                  {content}
                </VStack>
              )}
            </li>
          );
        })}
      </ol>
    </VStack>
  );
}
