'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ShoppingCart, X, ChevronDown, ChevronUp, Pencil, DollarSign, Star } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Divider } from '@astryxdesign/core/Divider';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';
import { Selector } from '@astryxdesign/core/Selector';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { BundleSuggestionDialog } from '../components/BundleSuggestionDialog';
import { EnrollmentSummaryFooter } from '../components/EnrollmentSummaryFooter';
import { useScrollFooterVisibility } from '../use-scroll-footer-visibility';
import { BundleInlineSelector } from '@/app/components/ui/bundle-inline-selector';
import { useOrder } from '../context';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';
import {
  bundles,
  featureLabels,
  availableAddons,
  getPhoneNumbersForLocation,
  sampleTollFreeNumbers,
  addonToFeatureMap,
  isAddonIncludedInBundle,
  Bundle,
  PhoneNumber,
  Addon,
} from '../types';
import { useToast } from '@/app/hooks/use-toast';
import { getInitialCustomizationAddons, partitionCustomizationAddons, sortCustomizationAddons } from '../addon-presentation';
import { tierScope } from '../bundle-theme';

export default function CustomizePage() {
  const router = useRouter();
  const { order, setBundle, setPhoneNumber, setTollFreePhoneNumber, addAddon, removeAddon, updateAddon, getCartTotal } = useOrder();
  const { toast } = useToast();
  const selectedBundle = order.bundle;
  const [selectedPhone, setSelectedPhone] = useState<PhoneNumber | null>(order.phoneNumber);
  const [expandedAddons, setExpandedAddons] = useState<Set<string>>(new Set());
  const [showAllAddons, setShowAllAddons] = useState(false);
  const [tollFreeModalOpen, setTollFreeModalOpen] = useState(false);
  const [selectedTollFree, setSelectedTollFree] = useState<PhoneNumber | null>(order.tollFreePhoneNumber);
  const [tempSelectedTollFree, setTempSelectedTollFree] = useState<PhoneNumber | null>(null);
  const [bundleComparisonOpen, setBundleComparisonOpen] = useState(false);
  const [bundleSuggestionOpen, setBundleSuggestionOpen] = useState(false);
  const [suggestionTriggeredFromContinue, setSuggestionTriggeredFromContinue] = useState(false);
  const bundleSectionRef = useRef<HTMLElement>(null);
  const { trackComplete } = useFunnelTracking('customize');

  const [footerPulse, setFooterPulse] = useState(false);
  const pulseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const footerLockedUntilRef = useRef<number>(0);
  const [footerVisible, setFooterVisible] = useScrollFooterVisibility({ lockedUntilRef: footerLockedUntilRef });

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) {
        clearTimeout(pulseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!order.location || !order.bundle) {
      router.push('/add-location/pick-plan');
    }
  }, [order.location, order.bundle, router]);

  const phoneNumbers = useMemo(() => {
    if (!order.location) return [];
    return getPhoneNumbersForLocation(order.location).filter(phone => phone.isAvailable);
  }, [order.location]);

  useEffect(() => {
    if (phoneNumbers.length > 0 && !selectedPhone) {
      const autoAssigned = phoneNumbers[0];
      setSelectedPhone(autoAssigned);
      setPhoneNumber(autoAssigned);
    }
  }, [phoneNumbers, selectedPhone, setPhoneNumber]);

  const hasTollFree = useMemo(() => {
    if (!selectedBundle) return false;
    if (selectedBundle.features.tollFreeNumber) return true;
    return order.addons.some(a => a.id === 'toll-free');
  }, [selectedBundle, order.addons]);

  useEffect(() => {
    if (hasTollFree && !selectedTollFree) {
      const autoAssigned = sampleTollFreeNumbers[0];
      setSelectedTollFree(autoAssigned);
      setTollFreePhoneNumber(autoAssigned);
    }
    if (!hasTollFree && selectedTollFree) {
      setSelectedTollFree(null);
      setTollFreePhoneNumber(null);
    }
  }, [hasTollFree]);

  useEffect(() => {
    if (!selectedBundle) return;
    order.addons.forEach(addon => {
      if (isAddonIncluded(addon)) {
        removeAddon(addon.id);
      }
    });
  }, [selectedBundle?.id]);

  const handleTollFreeConfirm = () => {
    if (tempSelectedTollFree) {
      setSelectedTollFree(tempSelectedTollFree);
      setTollFreePhoneNumber(tempSelectedTollFree);
    }
    setTollFreeModalOpen(false);
  };

  const handleOpenTollFreeModal = () => {
    setTempSelectedTollFree(selectedTollFree);
    setTollFreeModalOpen(true);
  };

  const handleAddonToggle = (addon: Addon) => {
    const isInCart = order.addons.find(a => a.id === addon.id);
    if (isInCart) {
      removeAddon(addon.id);
    } else {
      if (addon.packages && addon.packages.length > 0) {
        const defaultPackage = addon.packages[0];
        addAddon({ ...addon, selectedPackage: defaultPackage, price: defaultPackage.price });
      } else {
        addAddon(addon);
      }
    }
  };

  const handlePackageChange = (addon: Addon, packageId: string) => {
    const selectedPackage = addon.packages?.find(p => p.id === packageId);
    if (selectedPackage) {
      updateAddon({ ...addon, selectedPackage, price: selectedPackage.price });
    }
  };

  const isAddonIncluded = (addon: Addon): boolean => {
    return isAddonIncludedInBundle(addon.id, selectedBundle);
  };

  const toggleAddonExpanded = (addonId: string) => {
    setExpandedAddons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(addonId)) {
        newSet.delete(addonId);
      } else {
        newSet.add(addonId);
      }
      return newSet;
    });
  };

  const sortedAddons = useMemo(() => sortCustomizationAddons(availableAddons), []);
  const { includedAddons, optionalAddons } = partitionCustomizationAddons(sortedAddons, selectedBundle);
  const initialAddons = getInitialCustomizationAddons(sortedAddons, selectedBundle);
  const hasMoreAddons = initialAddons.length < optionalAddons.length;
  const visibleAddons = showAllAddons ? optionalAddons : initialAddons;

  const upgradeBundles = bundles.filter(b => b.id !== 'essentials');

  const bundleSuggestion = useMemo(() => {
    if (!selectedBundle) return null;

    const selectedAddonIds = order.addons.map(a => a.id);
    const mappableAddonIds = selectedAddonIds.filter(id => addonToFeatureMap[id]);

    if (mappableAddonIds.length < 2) return null;

    const currentBundleTierIndex = bundles.findIndex(b => b.id === selectedBundle.id);

    let bestSuggestion: {
      bundle: Bundle;
      matchingAddons: Addon[];
      savings: number;
      bonusFeatures: string[];
    } | null = null;

    for (let i = currentBundleTierIndex + 1; i < bundles.length; i++) {
      const candidateBundle = bundles[i];

      const matchingAddons = order.addons.filter(addon => {
        const featureKey = addonToFeatureMap[addon.id];
        if (!featureKey) return false;
        const alreadyInCurrentBundle = selectedBundle.features[featureKey];
        const includedInCandidate = candidateBundle.features[featureKey];
        return !alreadyInCurrentBundle && includedInCandidate;
      });

      if (matchingAddons.length < 2) continue;

      const addonsCost = matchingAddons.reduce((sum, a) => sum + a.price, 0);
      const upgradeCost = candidateBundle.price - selectedBundle.price;
      const savings = addonsCost - upgradeCost;

      const bonusFeatures = Object.entries(candidateBundle.features)
        .filter(([key, enabled]) => {
          if (!enabled) return false;
          if (selectedBundle.features[key as keyof Bundle['features']]) return false;
          const isMatchedAddon = matchingAddons.some(a => addonToFeatureMap[a.id] === key);
          return !isMatchedAddon;
        })
        .map(([key]) => featureLabels[key] || key);

      if (savings < 0 && bonusFeatures.length === 0) continue;

      if (!bestSuggestion || savings > bestSuggestion.savings || (savings === bestSuggestion.savings && bonusFeatures.length > bestSuggestion.bonusFeatures.length)) {
        bestSuggestion = {
          bundle: candidateBundle,
          matchingAddons,
          savings,
          bonusFeatures,
        };
      }
    }

    return bestSuggestion;
  }, [selectedBundle, order.addons]);

  const handleBundleSelect = (bundle: Bundle) => {
    setBundle(bundle);

    if (pulseTimerRef.current) {
      clearTimeout(pulseTimerRef.current);
    }
    setFooterPulse(true);
    setFooterVisible(true);
    footerLockedUntilRef.current = Date.now() + 3000;

    pulseTimerRef.current = setTimeout(() => setFooterPulse(false), 2000);

    if (suggestionTriggeredFromContinue) {
      setSuggestionTriggeredFromContinue(false);
      setTimeout(() => {
        trackComplete({ bundle: bundle.name });
        router.push('/add-location/checkout');
      }, 150);
    }
  };

  const handleContinue = () => {
    if (!selectedPhone) return;

    if (bundleSuggestion) {
      setBundleSuggestionOpen(true);
      return;
    }

    trackComplete({ bundle: selectedBundle?.name });
    router.push('/add-location/checkout');
  };

  const focusBundles = () => {
    bundleSectionRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    bundleSectionRef.current?.focus({ preventScroll: true });
  };

  const handleSuggestionSeeBundles = () => {
    setBundleSuggestionOpen(false);
    setSuggestionTriggeredFromContinue(true);
    focusBundles();
  };

  const handleSuggestionProceedWithBundle = () => {
    if (!bundleSuggestion) return;
    setBundleSuggestionOpen(false);
    setBundle(bundleSuggestion.bundle);
    setTimeout(() => {
      trackComplete({ bundle: bundleSuggestion.bundle.name });
      router.push('/add-location/checkout');
    }, 150);
  };

  const handleSuggestionDismiss = () => {
    setBundleSuggestionOpen(false);
    trackComplete({ bundle: selectedBundle?.name });
    router.push('/add-location/checkout');
  };

  const { monthly } = getCartTotal();

  if (!order.location || !selectedBundle) {
    return null;
  }

  const displayBundleName = selectedBundle.tier !== 'The Essentials' ? selectedBundle.tier : 'The Essentials';
  const hasActiveBundle = selectedBundle.id !== 'essentials';

  return (
    <VStack className="signup-shell px-4 pt-4 pb-64 lg:px-8 lg:pt-8" hAlign="center" data-testid="customize-page">
      <VStack gap={6} width="100%" maxWidth={1152}>
        <ProgressIndicator currentStep={3} />

        <VStack gap={2}>
          <Heading level={1} justify="center" data-testid="heading-customize">
            Customize Your Office
          </Heading>
          <Text color="secondary" justify="center">
            for <Text weight="medium" color="inherit">{order.location.name}</Text>, {order.location.city}
          </Text>
        </VStack>

        <Card className="signup-surface md:p-6" padding={5} data-testid="addons-section">
          <VStack gap={5}>
            <VStack gap={1}>
              <Heading level={2}>Add-ons</Heading>
              <Text color="secondary">
                Enhance your plan with additional features. Some add-ons may already be included in your bundle.
              </Text>
            </VStack>

            {includedAddons.length > 0 && (
              <HStack
                as="section"
                gap={2}
                vAlign="center"
                wrap="wrap"
                aria-labelledby="included-addons-label"
                style={tierScope(selectedBundle.id)}
                data-testid="included-addons-summary"
              >
                <Text id="included-addons-label" weight="semibold">Included on {selectedBundle.tier}:</Text>
                <HStack as="ul" gap={2} wrap="wrap">
                  {includedAddons.map(addon => (
                    <HStack
                      as="li"
                      key={addon.id}
                      // Tier chip: the scoped tier surface, border and accent.
                      className="rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-background-card)] px-3 py-1"
                      data-testid={`included-addon-${addon.id}`}
                    >
                      <Text type="supporting" weight="medium" color="accent">{addon.name}</Text>
                    </HStack>
                  ))}
                </HStack>
              </HStack>
            )}

            <VStack gap={3}>
              <Heading level={3} className="md:hidden" data-testid="optional-addons-title">Optional add-ons</Heading>
              <Grid columns={{ minWidth: 300, max: 2 }} gap={4} data-testid="addons-grid">
                {visibleAddons.map((addon) => {
                  const isInCart = order.addons.find(a => a.id === addon.id);
                  const isExpanded = expandedAddons.has(addon.id);
                  const hasPackages = Boolean(addon.packages && addon.packages.length > 0);

                  return (
                    <Card
                      key={addon.id}
                      padding={4}
                      height="100%"
                      // Selected: the same blue-ink outline as selected locations.
                      className={isInCart ? '[outline:2px_solid_var(--color-text-accent)] [outline-offset:-2px]' : undefined}
                      data-addon-status={isInCart ? 'selected' : 'available'}
                      data-testid={`addon-card-${addon.id}`}
                    >
                      <VStack gap={2} height="100%">
                        <HStack gap={3} hAlign="between" vAlign="start" wrap="wrap">
                          <StackItem size="fill">
                            <Heading level={3}>{addon.name}</Heading>
                          </StackItem>
                          <Text type="supporting" weight="semibold" hasTabularNumbers>
                            {hasPackages ? `From $${addon.packages![0].price}/mo` : `$${addon.price}/mo`}
                          </Text>
                        </HStack>
                        <Text
                          id={`addon-description-${addon.id}`}
                          type="supporting"
                          color="secondary"
                          maxLines={isExpanded ? undefined : 2}
                          data-testid={`addon-details-${addon.id}`}
                        >
                          {addon.detailedDescription || addon.description}
                        </Text>

                        <StackItem size="fill" />

                        <HStack gap={2} hAlign="between" vAlign="center" wrap="wrap">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            label={isExpanded ? 'Show less' : 'Read more'}
                            aria-label={`${isExpanded ? 'Show less about' : 'Read more about'} ${addon.name}`}
                            aria-expanded={isExpanded}
                            aria-controls={`addon-description-${addon.id}`}
                            endContent={<Icon icon={isExpanded ? ChevronUp : ChevronDown} size="sm" />}
                            onClick={() => toggleAddonExpanded(addon.id)}
                            data-testid={`button-learn-more-${addon.id}`}
                          />
                          <Button
                            type="button"
                            variant={isInCart ? 'destructive' : 'primary'}
                            label={isInCart ? 'Remove' : 'Add to Cart'}
                            icon={<Icon icon={isInCart ? X : ShoppingCart} size="sm" />}
                            onClick={() => handleAddonToggle(addon)}
                            data-testid={`button-addon-${addon.id}`}
                          />
                        </HStack>

                        {isInCart && hasPackages && (
                          <>
                            <Divider />
                            <Selector
                              label="Select Package"
                              options={addon.packages!.map(pkg => ({ value: pkg.id, label: `${pkg.name} - $${pkg.price}/mo` }))}
                              value={isInCart.selectedPackage?.id || addon.packages![0].id}
                              onChange={(value) => handlePackageChange(addon, value)}
                              data-testid={`select-package-${addon.id}`}
                            />
                          </>
                        )}
                      </VStack>
                    </Card>
                  );
                })}
              </Grid>

              {hasMoreAddons && (
                <HStack hAlign="center">
                  <Button
                    type="button"
                    variant="secondary"
                    label={showAllAddons ? 'Show fewer add-ons' : 'Show all add-ons'}
                    endContent={<Icon icon={showAllAddons ? ChevronUp : ChevronDown} size="sm" />}
                    onClick={() => setShowAllAddons(!showAllAddons)}
                    data-testid="button-show-all-addons"
                  />
                </HStack>
              )}
            </VStack>
          </VStack>
        </Card>

        <VStack
          as="section"
          ref={bundleSectionRef}
          tabIndex={-1}
          aria-labelledby="customize-bundle-title"
          className="scroll-mt-6 rounded-[var(--radius-container)] focus-visible:outline focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)]"
          data-testid="bundle-inline-section"
        >
          <Card className="signup-surface md:p-6" padding={5}>
            <VStack gap={3}>
              <VStack gap={1}>
                <Heading level={2} id="customize-bundle-title">Bundle &amp; Save</Heading>
                <Text color="secondary">
                  Upgrade your plan and save on popular features.
                  <Text color="inherit" className="md:hidden"> Swipe to compare bundles.</Text>
                </Text>
              </VStack>
              <BundleInlineSelector
                bundles={upgradeBundles}
                selectedBundleId={selectedBundle?.id}
                onSelect={handleBundleSelect}
                essentialsBundle={bundles[0]}
                comparisonOpen={bundleComparisonOpen}
                comparisonId="customize-bundle-comparison"
                comparisonControl={
                  <HStack>
                    <Button
                      type="button"
                      variant="ghost"
                      label="Compare Bundles"
                      aria-expanded={bundleComparisonOpen}
                      aria-controls="customize-bundle-comparison"
                      endContent={<Icon icon={bundleComparisonOpen ? ChevronUp : ChevronDown} size="sm" />}
                      onClick={() => setBundleComparisonOpen(open => !open)}
                      data-testid="button-toggle-customize-bundle-comparison"
                    />
                  </HStack>
                }
              />
              {hasActiveBundle && (
                <HStack hAlign="center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    label="Revert to Essentials"
                    onClick={() => handleBundleSelect(bundles[0])}
                    data-testid="button-revert-to-essentials"
                  />
                </HStack>
              )}
            </VStack>
          </Card>
        </VStack>

        {hasTollFree && selectedTollFree && (
          <Card className="signup-surface md:p-6" padding={5} data-testid="phone-section">
            <VStack gap={3}>
              <VStack gap={1}>
                <Heading level={2}>Additional Phone Services</Heading>
                <Text color="secondary">Manage your toll-free number.</Text>
              </VStack>
              <Card variant="muted" padding={4}>
                <HStack gap={3} vAlign="center">
                  <Icon icon={Phone} color="secondary" />
                  <StackItem size="fill">
                    <VStack gap={0}>
                      <Text weight="medium" hasTabularNumbers data-testid="selected-tollfree-number">{selectedTollFree.number}</Text>
                      <Text type="supporting" color="secondary">Toll-Free Number</Text>
                    </VStack>
                  </StackItem>
                  <IconButton
                    variant="ghost"
                    label="Change toll-free number"
                    icon={<Icon icon={Pencil} size="sm" />}
                    onClick={handleOpenTollFreeModal}
                    data-testid="button-change-tollfree"
                  />
                </HStack>
              </Card>
            </VStack>
          </Card>
        )}
      </VStack>

      <VStack
        className={`fixed inset-x-0 z-50 transition-[bottom] duration-300 ease-in-out motion-reduce:transition-none ${footerVisible ? 'bottom-0' : '-bottom-full pointer-events-none'}`}
        data-testid="footer-wrapper"
        aria-hidden={!footerVisible}
        ref={(element: HTMLElement | null) => { if (element) element.inert = !footerVisible; }}
      >
        {/* Bar above the footer: jumps to Bundle & Save. */}
        <Button
          type="button"
          variant="secondary"
          width="100%"
          label={hasActiveBundle ? `Active Bundle: ${displayBundleName}. Edit` : 'Bundle & Save: upgrade your plan and save on popular features'}
          onClick={focusBundles}
          className="rounded-none border-x-0"
          data-testid="bundle-save-banner"
        >
          <HStack gap={2} vAlign="center" hAlign="center">
            <Icon icon={hasActiveBundle ? Star : DollarSign} size="sm" color="secondary" />
            <Text type="supporting" weight="semibold">{hasActiveBundle ? 'Active Bundle' : 'Bundle & Save'}</Text>
            <Text type="supporting" color="secondary" className="hidden sm:inline">
              {hasActiveBundle ? `- ${displayBundleName}` : '- Upgrade your plan and save on popular features'}
            </Text>
            {hasActiveBundle
              ? <Text type="supporting" weight="medium">Edit</Text>
              : <Icon icon={ChevronUp} size="sm" color="secondary" />}
          </HStack>
        </Button>

        <EnrollmentSummaryFooter
          phoneNumber={selectedPhone}
          onContinue={handleContinue}
          disabled={!selectedPhone}
          continueTestId="button-continue-checkout"
          continueLabel="Continue to checkout"
          pulse={footerPulse}
        />
      </VStack>

      <BundleSuggestionDialog
        open={bundleSuggestionOpen}
        onOpenChange={setBundleSuggestionOpen}
        suggestion={bundleSuggestion}
        currentMonthly={monthly}
        upgradedMonthly={
          bundleSuggestion
            ? monthly
              + bundleSuggestion.bundle.price
              - selectedBundle.price
              - bundleSuggestion.matchingAddons.reduce(
                (sum, addon) => sum + (addon.billingCycle === 'monthly' ? addon.price : 0),
                0
              )
            : monthly
        }
        onUpgrade={handleSuggestionProceedWithBundle}
        onKeepCurrent={handleSuggestionDismiss}
        onCompare={handleSuggestionSeeBundles}
      />

      <Dialog
        isOpen={tollFreeModalOpen}
        onOpenChange={setTollFreeModalOpen}
        purpose="form"
        width={448}
        data-testid="tollfree-selection-modal"
      >
        <VStack gap={4}>
          <DialogHeader
            title="Select Toll-Free Number"
            subtitle="Choose a toll-free number for your business. Customers can call you at no charge."
            onOpenChange={setTollFreeModalOpen}
          />
          <RadioList
            label="Toll-free numbers"
            isLabelHidden
            value={tempSelectedTollFree?.id ?? ''}
            onChange={(id) => setTempSelectedTollFree(sampleTollFreeNumbers.find(phone => phone.id === id) ?? null)}
          >
            {sampleTollFreeNumbers.map((phone) => (
              <RadioListItem
                key={phone.id}
                value={phone.id}
                label={<Text weight="medium" hasTabularNumbers>{phone.number}</Text>}
                aria-label={phone.number}
                data-testid={`tollfree-option-${phone.id}`}
              />
            ))}
          </RadioList>
          <Grid columns={2} gap={2}>
            <Button
              type="button"
              variant="secondary"
              label="Cancel"
              width="100%"
              onClick={() => setTollFreeModalOpen(false)}
              data-testid="button-cancel-tollfree"
            />
            <Button
              type="button"
              variant="primary"
              label="Confirm Selection"
              width="100%"
              onClick={handleTollFreeConfirm}
              data-testid="button-confirm-tollfree"
            />
          </Grid>
        </VStack>
      </Dialog>
    </VStack>
  );
}
