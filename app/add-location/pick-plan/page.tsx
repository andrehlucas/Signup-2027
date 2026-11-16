'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { VStack } from '@astryxdesign/core/VStack';
import { Check, ChevronDown, ChevronUp, MapPin, Phone, TriangleAlert } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Divider } from '@astryxdesign/core/Divider';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { BundleInlineSelector } from '@/app/components/ui/bundle-inline-selector';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { LocationSelector } from '../components/LocationSelector';
import { LocalPhoneNumberDialog } from '../components/LocalPhoneNumberDialog';
import { EnrollmentSummaryFooter } from '../components/EnrollmentSummaryFooter';
import { useScrollFooterVisibility } from '../use-scroll-footer-visibility';
import { useOrder } from '../context';
import { tierScope } from '../bundle-theme';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';
import {
  bundles,
  featureLabels,
  AvailableLocation,
  getPhoneNumbersForLocation,
  resolveLocalPhoneNumber,
} from '../types';

export default function PickPlanPage() {
  const router = useRouter();
  const { order, setLocation, setBundle, setLocationFilters, setPhoneNumber } = useOrder();
  const bundleCardsRef = useRef<HTMLElement>(null);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [subStep, setSubStep] = useState<'location' | 'review'>(order.location ? 'review' : 'location');
  const [footerVisible] = useScrollFooterVisibility({ enabled: subStep === 'review' });
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const phoneNumbers = useMemo(
    () => order.location ? getPhoneNumbersForLocation(order.location).filter(number => number.isAvailable) : [],
    [order.location]
  );
  const assignedPhone = resolveLocalPhoneNumber(order.location, order.phoneNumber);
  const { trackComplete } = useFunnelTracking('pick_plan');

  const upgradeBundles = useMemo(
    () => bundles.filter((bundle) => bundle.id !== 'essentials'),
    []
  );

  useEffect(() => {
    if (order.location && !order.bundle) {
      setBundle(bundles[0]);
    }
  }, [order.location, order.bundle, setBundle]);

  useEffect(() => {
    // Also fills the phone for drafts saved before assignment happened on this step.
    if (assignedPhone?.id !== order.phoneNumber?.id) setPhoneNumber(assignedPhone);
  }, [assignedPhone, order.phoneNumber, setPhoneNumber]);

  const handleLocationSelect = (location: AvailableLocation) => {
    setLocation(location);
    setSubStep('review');
  };

  const handleChangeLocation = () => {
    if (order.location) {
      setLocationFilters({ country: order.location.countryCode ?? 'US', state: order.location.state, city: order.location.city });
    }
    setSubStep('location');
  };

  const handleCancelLocationChange = () => {
    if (order.location) {
      setLocationFilters({ country: order.location.countryCode ?? 'US', state: order.location.state, city: order.location.city });
    }
    setSubStep('review');
  };

  const handleContinue = () => {
    if (order.location && order.bundle && assignedPhone) {
      trackComplete({ bundle: order.bundle.name });
      router.push('/add-location/customize');
    }
  };

  const handleChangePlan = (event: MouseEvent<HTMLButtonElement>) => {
    const keyboard = event.detail === 0;
    requestAnimationFrame(() => {
      const trigger = bundleCardsRef.current;
      if (!trigger) return;
      trigger.focus({ preventScroll: true });
      trigger.scrollIntoView({
        behavior: keyboard || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'start',
      });
    });
  };

  if (subStep === 'location') {
    return (
      <VStack className="signup-shell p-4 lg:p-8" hAlign="center" data-testid="pick-plan-page-location">
        <VStack gap={6} width="100%" maxWidth={1152}>
          <ProgressIndicator currentStep={2} />
          <LocationSelector
            onSelect={handleLocationSelect}
            onCancel={order.location ? handleCancelLocationChange : undefined}
          />
        </VStack>
      </VStack>
    );
  }

  if (!order.location) {
    return null;
  }

  const essentialsPlan = bundles[0];
  const enabledFeatures = order.bundle
    ? Object.entries(order.bundle.features).filter(([, enabled]) => enabled).map(([key]) => key)
    : [];

  return (
    <VStack className="signup-shell px-4 pt-4 pb-64 lg:px-8 lg:pt-8" hAlign="center" data-testid="pick-plan-page">
      <VStack gap={5} width="100%" maxWidth={1024}>
        <ProgressIndicator currentStep={2} />

        <Card className="signup-surface overflow-hidden" padding={0} data-testid="review-package-card">
          <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap" padding={5} aria-live="polite" aria-atomic="true">
            <Heading level={1} data-testid="review-office-heading">Your new office details</Heading>
            {order.bundle && (
              <VStack gap={0} hAlign="end" style={tierScope(order.bundle.id)}>
                <Text size="2xl" weight="bold" hasTabularNumbers className="whitespace-nowrap" data-testid="selected-plan-price">
                  ${order.bundle.price}<Text type="supporting" color="secondary"> /mo</Text>
                </Text>
                <Text type="supporting" weight="semibold" color="accent" data-testid="selected-plan-name">
                  {order.bundle.tier}
                </Text>
              </VStack>
            )}
          </HStack>

          <Divider />

          <HStack gap={3} hAlign="between" vAlign="center" wrap="wrap" paddingInline={5} paddingBlock={3} data-testid="review-location-card">
            <HStack gap={2} vAlign="start">
              <Icon icon={MapPin} size="sm" color="secondary" />
              <VStack gap={0}>
                <Text type="supporting" color="secondary">Your new office address</Text>
                <Text data-testid="heading-pick-plan">
                  <Text weight="semibold">{order.location.address}</Text>
                  <Text color="secondary">
                    {order.location.addressLine2 ? `, ${order.location.addressLine2}` : ''}
                    {`, ${order.location.city}, ${order.location.stateCode} ${order.location.zipCode}`}
                  </Text>
                </Text>
              </VStack>
            </HStack>
            <HStack gap={1} vAlign="center">
              <Button type="button" variant="ghost" label="Change location" onClick={handleChangeLocation} data-testid="button-change-location" />
              {order.bundle && order.bundle.id !== essentialsPlan.id && (
                <Button type="button" variant="ghost" label="Change Bundle" onClick={handleChangePlan} data-testid="button-change-plan" />
              )}
            </HStack>
          </HStack>

          <Divider />

          <HStack gap={3} hAlign="between" vAlign="center" paddingInline={5} paddingBlock={3} data-testid="review-phone-row">
            <StackItem size="fill" className="min-w-0">
            <HStack gap={2} vAlign="start">
              <Icon icon={Phone} size="sm" color="secondary" />
              <VStack gap={1} aria-live="polite">
                <Text type="supporting" color="secondary">Your new office phone number</Text>
                {assignedPhone ? (
                  <HStack gap={3} vAlign="center" wrap="wrap">
                    <Text weight="semibold" hasTabularNumbers data-testid="review-business-phone">{assignedPhone.number}</Text>
                    <HStack
                      gap={2}
                      vAlign="start"
                      className="rounded-[var(--radius-element)] bg-[var(--color-warning-muted)] px-3 py-2 text-[var(--color-on-warning-muted)]"
                      data-testid="phone-lock-notice"
                    >
                      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <Text type="supporting" color="inherit">
                        Phone numbers locked for another <Text weight="semibold" color="inherit">30 minutes</Text>
                      </Text>
                    </HStack>
                  </HStack>
                ) : (
                  <Text role="status">No local numbers are currently available. Choose another location to continue.</Text>
                )}
              </VStack>
            </HStack>
            </StackItem>
            <StackItem size="static">
            <Button
              type="button"
              variant="ghost"
              label="Edit"
              aria-label="Edit business phone number"
              isDisabled={phoneNumbers.length === 0}
              onClick={() => setPhoneDialogOpen(true)}
              data-testid="button-edit-review-phone"
            />
            </StackItem>
          </HStack>

          {order.bundle && (
            <>
              <Divider />
              <VStack paddingInline={5} paddingBlock={3}>
              <Collapsible
                defaultIsOpen
                trigger={<Text weight="semibold">View included services</Text>}
                data-testid="details-included-services"
              >
                <Grid columns={{ minWidth: 240, max: 2 }} gap={2} className="pt-3">
                  {enabledFeatures.map((key) => (
                    <HStack key={key} gap={2} vAlign="start" data-testid={`feature-${key}`}>
                      <Icon icon={Check} size="sm" color="secondary" />
                      <Text type="supporting">
                        {featureLabels[key] || key}{key === 'appointmentMaking' && ' (20/mo)'}
                      </Text>
                    </HStack>
                  ))}
                </Grid>
              </Collapsible>
              </VStack>
            </>
          )}
        </Card>

        <LocalPhoneNumberDialog
          open={phoneDialogOpen}
          onOpenChange={setPhoneDialogOpen}
          numbers={phoneNumbers}
          selected={assignedPhone}
          city={order.location.city}
          onSave={setPhoneNumber}
        />

        <VStack as="section" aria-labelledby="bundle-cards-title">
          <VStack
            ref={bundleCardsRef}
            tabIndex={-1}
            gap={3}
            className="scroll-mt-6 rounded-[var(--radius-element)] focus-visible:outline focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)]"
          >
            <HStack gap={4} hAlign="between" vAlign="center" wrap="wrap">
              <Heading level={2} id="bundle-cards-title">Bundle &amp; Save</Heading>
              {order.bundle && order.bundle.id !== essentialsPlan.id && (
                <Button
                  type="button"
                  variant="ghost"
                  label={`Return to Essentials · $${essentialsPlan.price}/mo`}
                  onClick={() => setBundle(essentialsPlan)}
                  data-testid="button-return-to-essentials"
                />
              )}
            </HStack>
            <BundleInlineSelector
              bundles={upgradeBundles}
              selectedBundleId={order.bundle?.id}
              onSelect={setBundle}
              essentialsBundle={essentialsPlan}
              comparisonOpen={comparisonOpen}
              comparisonId="bundle-comparison-content"
              comparisonControl={
                <Heading level={2} id="bundle-comparison-title">
                  <Button
                    type="button"
                    variant="ghost"
                    label="Compare Bundles"
                    aria-expanded={comparisonOpen}
                    aria-controls="bundle-comparison-content"
                    endContent={<Icon icon={comparisonOpen ? ChevronUp : ChevronDown} size="sm" />}
                    onClick={() => setComparisonOpen(open => !open)}
                    data-testid="button-toggle-bundle-comparison"
                  />
                </Heading>
              }
            />
          </VStack>
        </VStack>
      </VStack>

      <VStack
        className={`fixed inset-x-0 z-50 transition-[bottom] duration-300 ease-in-out motion-reduce:transition-none ${footerVisible ? 'bottom-0' : '-bottom-full pointer-events-none'}`}
        data-testid="footer-wrapper"
        aria-hidden={!footerVisible}
        ref={(element: HTMLElement | null) => { if (element) element.inert = !footerVisible; }}
      >
        <EnrollmentSummaryFooter
          phoneNumber={assignedPhone}
          onContinue={handleContinue}
          disabled={!order.bundle || !assignedPhone}
          continueTestId="button-continue-customize"
          continueLabel="Continue to add-ons"
          compactWidth
        />
      </VStack>
    </VStack>
  );
}
