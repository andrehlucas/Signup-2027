'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Minus, Phone, Plus, ShoppingCart, X, ChevronRight, ChevronDown, ChevronUp, Pencil, DollarSign, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { BundleSuggestionDialog } from '../components/BundleSuggestionDialog';
import { EnrollmentSummaryFooter } from '../components/EnrollmentSummaryFooter';
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
import { getInitialCustomizationAddons, sortCustomizationAddons } from '../addon-presentation';

export default function CustomizePage() {
  const router = useRouter();
  const { order, setBundle, setPhoneNumber, setTollFreePhoneNumber, addAddon, removeAddon, updateAddon, setExtensionCount, getCartTotal } = useOrder();
  const { toast } = useToast();
  const selectedBundle = order.bundle;
  const [selectedPhone, setSelectedPhone] = useState<PhoneNumber | null>(order.phoneNumber);
  const [expandedAddons, setExpandedAddons] = useState<Set<string>>(new Set());
  const [showAllAddons, setShowAllAddons] = useState(false);
  const [tollFreeModalOpen, setTollFreeModalOpen] = useState(false);
  const [selectedTollFree, setSelectedTollFree] = useState<PhoneNumber | null>(order.tollFreePhoneNumber);
  const [tempSelectedTollFree, setTempSelectedTollFree] = useState<PhoneNumber | null>(null);
  const [bundleExpanded, setBundleExpanded] = useState(false);
  const [bundleSuggestionOpen, setBundleSuggestionOpen] = useState(false);
  const [suggestionTriggeredFromContinue, setSuggestionTriggeredFromContinue] = useState(false);
  const bundleSectionRef = useRef<HTMLDivElement>(null);
  const { trackComplete } = useFunnelTracking('customize');

  const [footerVisible, setFooterVisible] = useState(false);
  const [footerPulse, setFooterPulse] = useState(false);
  const pulseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const footerLockedUntilRef = useRef<number>(0);
  const lastScrollY = useRef(0);
  const scrollThreshold = 5;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < scrollThreshold) return;

      const atBottom = (window.innerHeight + currentScrollY) >= (document.documentElement.scrollHeight - 10);

      if (Date.now() < footerLockedUntilRef.current) {
        lastScrollY.current = currentScrollY;
        return;
      }

      if (delta > 0 && currentScrollY > 50) {
        setFooterVisible(true);
      } else if (delta < 0 && !atBottom) {
        setFooterVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const initialAddons = getInitialCustomizationAddons(sortedAddons, selectedBundle);
  const hasMoreAddons = initialAddons.length < sortedAddons.length;
  const visibleAddons = showAllAddons ? sortedAddons : initialAddons;

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
    setBundleExpanded(false);

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

  const handleSuggestionSeeBundles = () => {
    setBundleSuggestionOpen(false);
    setSuggestionTriggeredFromContinue(true);
    setBundleExpanded(true);
    setTimeout(() => {
      bundleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
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

  return (
    <div className="signup-shell px-4 pt-4 pb-64 lg:px-8 lg:pt-8" data-testid="customize-page">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <ProgressIndicator currentStep={3} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" data-testid="heading-customize">
            Customize Your Office
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            for <span className="font-medium">{order.location.name}</span>, {order.location.city}
          </p>
        </div>

        <div className="signup-surface p-5 md:p-6 mb-6" data-testid="addons-section">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Add-ons</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enhance your plan with additional features. Some add-ons may already be included in your bundle.
          </p>

          <div className="relative">
            <div 
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              data-testid="addons-grid"
            >
              {visibleAddons.map((addon) => {
                const isIncluded = isAddonIncluded(addon);
                const isInCart = order.addons.find(a => a.id === addon.id);
                const isExpanded = expandedAddons.has(addon.id);

                return (
                  <div
                    key={addon.id}
                    className={`rounded-lg border transition-all ${
                      isIncluded
                        ? 'border-gray-200 bg-gray-50'
                        : isInCart
                        ? 'border-[#006d91] bg-gray-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    data-testid={`addon-card-${addon.id}`}
                  >
                    <div className="flex h-full flex-col p-4">
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                        <h3 className="min-w-0 font-medium text-gray-900">{addon.name}</h3>
                        {isIncluded ? (
                          <Badge className="shrink-0 bg-gray-100 text-gray-700 border border-gray-200">
                            Included on {selectedBundle.tier}
                          </Badge>
                        ) : addon.packages && addon.packages.length > 0 ? (
                          <span className="shrink-0 text-sm font-semibold text-gray-900">
                            From ${addon.packages[0].price}/mo
                          </span>
                        ) : (
                          <span className="shrink-0 text-sm font-semibold text-gray-900">
                            ${addon.price}/mo
                          </span>
                        )}
                      </div>
                      <p
                        id={`addon-description-${addon.id}`}
                        className={`min-h-10 text-sm leading-5 text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}
                        data-testid={`addon-details-${addon.id}`}
                      >
                        {addon.detailedDescription || addon.description}
                      </p>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => toggleAddonExpanded(addon.id)}
                          aria-expanded={isExpanded}
                          aria-controls={`addon-description-${addon.id}`}
                          aria-label={`${isExpanded ? 'Show less about' : 'Read more about'} ${addon.name}`}
                          className="flex min-h-11 items-center gap-1 rounded-sm text-sm text-gray-700 underline decoration-gray-300 underline-offset-4 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#345b91] focus-visible:ring-offset-2"
                          data-testid={`button-learn-more-${addon.id}`}
                        >
                          {isExpanded ? (
                            <>
                              Show less
                              <ChevronUp className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              Read more
                              <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </button>
                        {!isIncluded && (
                          <Button
                            variant={isInCart ? 'outline' : 'default'}
                            size="sm"
                            className={`min-h-11 ${isInCart ? 'border-red-300 text-red-600 hover:bg-red-50' : 'signup-primary'}`}
                            onClick={() => handleAddonToggle(addon)}
                            data-testid={`button-addon-${addon.id}`}
                          >
                            {isInCart ? (
                              <>
                                <X className="h-3 w-3 mr-1" />
                                Remove
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      {!isIncluded && (
                        <div className="space-y-3">
                          {isInCart && addon.packages && addon.packages.length > 0 && (
                            <div className="pt-2 border-t border-gray-200">
                              <label className="text-xs font-medium text-gray-700 mb-1 block">
                                Select Package
                              </label>
                              <Select
                                value={isInCart.selectedPackage?.id || addon.packages[0].id}
                                onValueChange={(value) => handlePackageChange(addon, value)}
                              >
                                <SelectTrigger 
                                  className="w-full bg-white"
                                  data-testid={`select-package-${addon.id}`}
                                >
                                  <SelectValue placeholder="Select a package" />
                                </SelectTrigger>
                                <SelectContent>
                                  {addon.packages.map((pkg) => (
                                    <SelectItem 
                                      key={pkg.id} 
                                      value={pkg.id}
                                      data-testid={`package-option-${pkg.id}`}
                                    >
                                      {pkg.name} - ${pkg.price}/mo
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>

            {hasMoreAddons && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllAddons(!showAllAddons)}
                  className="bg-white border-gray-300 hover:bg-gray-50"
                  data-testid="button-show-all-addons"
                >
                  {showAllAddons ? (
                    <>
                      Show fewer add-ons
                      <ChevronUp className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Show all add-ons
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div
          ref={bundleSectionRef}
          className={`overflow-hidden transition-all duration-400 ease-in-out ${
            bundleExpanded ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0'
          }`}
          data-testid="bundle-inline-section"
        >
          <div className="signup-surface px-4 py-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Bundle & Save</h2>
              <button
                onClick={() => setBundleExpanded(false)}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                data-testid="button-close-bundle-section"
              >
                <X className="h-3.5 w-3.5" />
                Close
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Upgrade your plan and save on popular features.<span className="md:hidden"> Swipe to compare bundles.</span>
            </p>
            <div className="-mx-4 md:mx-0">
              <BundleInlineSelector
                bundles={upgradeBundles}
                selectedBundleId={selectedBundle?.id}
                onSelect={handleBundleSelect}
                essentialsBundle={bundles[0]}
              />
            </div>
            {selectedBundle && selectedBundle.id !== 'essentials' && (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => {
                    handleBundleSelect(bundles[0]);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                  data-testid="button-revert-to-essentials"
                >
                  Revert to Essentials
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="signup-surface p-5 md:p-6 mb-6" data-testid="phone-section">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Additional Phone Services</h2>
              <p className="text-sm text-gray-600">
                Add extra extensions and manage your toll-free number.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4" data-testid="addon-card-additional-extensions">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
              <h3 className="font-medium text-gray-900">Additional Extensions</h3>
              <span className="text-sm font-semibold text-gray-900">$25/mo each</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setExtensionCount(order.extensionCount - 1)}
                disabled={order.extensionCount === 0}
                aria-label="Remove an additional extension"
                className="h-11 w-11"
                data-testid="button-extension-decrease"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="min-w-6 text-center font-medium text-gray-900" aria-label="Additional extension count" aria-live="polite" data-testid="extension-count">
                {order.extensionCount}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setExtensionCount(order.extensionCount + 1)}
                aria-label="Add an additional extension"
                className="h-11 w-11"
                data-testid="button-extension-increase"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
              {order.extensionCount > 0 && (
                <span className="text-sm text-gray-600" data-testid="extensions-monthly-total">
                  ${order.extensionCount * 25}/mo
                </span>
              )}
            </div>
          </div>

          {hasTollFree && selectedTollFree && (
            <div className="mt-3 flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900" data-testid="selected-tollfree-number">
                    {selectedTollFree.number}
                  </p>
                  <p className="text-sm text-gray-500">Toll-Free Number</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenTollFreeModal}
                aria-label="Change toll-free number"
                data-testid="button-change-tollfree"
              >
                <Pencil className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out ${footerVisible ? 'bottom-0' : '-bottom-full'}`}
        data-testid="footer-wrapper"
      >
        <div
          onClick={() => {
            setBundleExpanded(!bundleExpanded);
            if (!bundleExpanded) {
              setTimeout(() => {
                bundleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }
          }}
          className="cursor-pointer border-y border-gray-200 bg-gray-50 transition-colors hover:bg-gray-100"
          data-testid="bundle-save-banner"
        >
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2">
            {selectedBundle && selectedBundle.id !== 'essentials' ? (
              <>
                <Star className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-semibold text-[#101828]">Active Bundle</span>
                <span className="text-xs text-[#475467] hidden sm:inline">- {displayBundleName}</span>
                <span className="text-xs font-medium text-gray-700 ml-1">{bundleExpanded ? 'Close' : 'Edit'}</span>
              </>
            ) : (
              <>
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-semibold text-[#101828]">Bundle & Save</span>
                <span className="text-xs text-[#475467] hidden sm:inline">- Upgrade your plan and save on popular features</span>
                {bundleExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600 ml-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600 ml-1" />
                )}
              </>
            )}
          </div>
        </div>

        <EnrollmentSummaryFooter
          phoneNumber={selectedPhone}
          onContinue={handleContinue}
          disabled={!selectedPhone}
          continueTestId="button-continue-checkout"
          continueLabel="Continue to checkout"
          pulse={footerPulse}
        />
      </div>

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

      <Dialog open={tollFreeModalOpen} onOpenChange={setTollFreeModalOpen}>
        <DialogContent className="sm:max-w-md" data-testid="tollfree-selection-modal">
          <DialogHeader>
            <DialogTitle>Select Toll-Free Number</DialogTitle>
            <DialogDescription>
              Choose a toll-free number for your business. Customers can call you at no charge.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4 max-h-60 overflow-y-auto">
            {sampleTollFreeNumbers.map((phone) => (
              <div
                key={phone.id}
                onClick={() => setTempSelectedTollFree(phone)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  tempSelectedTollFree?.id === phone.id
                    ? 'bg-gray-50 border-2 border-[#006d91]'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
                data-testid={`tollfree-option-${phone.id}`}
              >
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{phone.number}</span>
                {tempSelectedTollFree?.id === phone.id && (
                  <Check className="h-4 w-4 text-gray-700 ml-auto" />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTollFreeModalOpen(false)}
              data-testid="button-cancel-tollfree"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTollFreeConfirm}
              className="signup-primary"
              data-testid="button-confirm-tollfree"
            >
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
