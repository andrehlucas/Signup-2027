'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Minus, Phone, Plus, ShoppingCart, X, ChevronRight, ChevronDown, ChevronUp, Info, Pencil, DollarSign, Star } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { BundleSuggestionDialog } from '../components/BundleSuggestionDialog';
import { LocalPhoneNumberDialog } from '../components/LocalPhoneNumberDialog';
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
  Bundle,
  PhoneNumber,
  Addon,
} from '../types';
import { useToast } from '@/app/hooks/use-toast';

export default function CustomizePage() {
  const router = useRouter();
  const { order, setBundle, setPhoneNumber, setTollFreePhoneNumber, addAddon, removeAddon, updateAddon, setExtensionCount, getCartTotal } = useOrder();
  const { toast } = useToast();
  const selectedBundle = order.bundle;
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
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

  const handleOpenPhoneModal = () => {
    setPhoneModalOpen(true);
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
    if (!selectedBundle) return false;
    const addonToFeatureMap: Record<string, keyof Bundle['features']> = {
      'toll-free': 'tollFreeNumber',
      'callout': 'calloutFeature',
      'call-log': 'callLog',
      'supervised-transfer': 'supervisedCallTransfer',
      'message-taking': 'messageTaking',
      'appointment-scheduling': 'appointmentMaking',
    };
    const featureKey = addonToFeatureMap[addon.id];
    if (featureKey && selectedBundle.features[featureKey]) {
      return true;
    }
    return false;
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

  const addonPriorityOrder: Record<string, number> = {
    'callout': 1,
    'toll-free': 2,
    'supervised-transfer': 3,
    'message-taking': 4,
    'appointment-scheduling': 5,
    'texting': 6,
    'call-recording': 7,
    'additional-extensions': 8,
    'fax-out': 9,
    'conf-bridge': 10,
    'int-transfer': 11,
    'call-log': 12,
  };

  const sortedAddons = useMemo(() => {
    const addonsToSort = availableAddons.filter(addon => addon.id !== 'additional-extensions');
    return addonsToSort.sort((a, b) => {
      const aIncluded = isAddonIncluded(a);
      const bIncluded = isAddonIncluded(b);
      if (aIncluded && !bIncluded) return -1;
      if (!aIncluded && bIncluded) return 1;
      
      const aPriority = addonPriorityOrder[a.id] || 999;
      const bPriority = addonPriorityOrder[b.id] || 999;
      return aPriority - bPriority;
    });
  }, [selectedBundle]);

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
    <div className="signup-shell px-4 pt-4 pb-48 lg:px-8 lg:pt-8" data-testid="customize-page">
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
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300 ${
                !showAllAddons ? 'max-h-[380px] overflow-hidden' : ''
              }`}
              data-testid="addons-grid"
            >
              {sortedAddons.map((addon) => {
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
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{addon.name}</h4>
                        {isIncluded ? (
                          <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
                            Included
                          </Badge>
                        ) : addon.packages && addon.packages.length > 0 ? (
                          <span className="font-semibold text-gray-900">
                            From ${addon.packages[0].price}/mo
                          </span>
                        ) : (
                          <span className="font-semibold text-gray-900">
                            ${addon.price}/mo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <button
                          onClick={() => toggleAddonExpanded(addon.id)}
                          className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-1"
                          data-testid={`button-learn-more-${addon.id}`}
                        >
                          {isExpanded ? (
                            <>
                              Show less
                              <ChevronUp className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              Learn more
                              <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </button>
                        {!isIncluded && (
                          <Button
                            variant={isInCart ? 'outline' : 'default'}
                            size="sm"
                            className={isInCart ? 'border-red-300 text-red-600 hover:bg-red-50' : 'signup-primary'}
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

                      {isExpanded && addon.detailedDescription && (
                        <div 
                          className="text-sm text-gray-600 bg-gray-50 rounded-md p-3 mt-2 border border-gray-100"
                          data-testid={`addon-details-${addon.id}`}
                        >
                          {addon.detailedDescription}
                        </div>
                      )}

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

              <div
                className={`rounded-lg border transition-all ${
                  order.extensionCount > 0 ? 'border-[#006d91] bg-gray-50' : 'border-gray-200 bg-white'
                }`}
                data-testid="addon-card-additional-extensions"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-gray-900">Additional Extensions</h4>
                    <span className="font-semibold text-gray-900">$25/mo each</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExtensionCount(order.extensionCount - 1)}
                      disabled={order.extensionCount === 0}
                      className="h-7 w-7 p-0"
                      data-testid="button-extension-decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="font-medium text-gray-900 min-w-[1.5rem] text-center text-sm" data-testid="extension-count">
                      {order.extensionCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExtensionCount(order.extensionCount + 1)}
                      className="h-7 w-7 p-0"
                      data-testid="button-extension-increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                    {order.extensionCount > 0 && (
                      <span className="text-sm text-gray-600 ml-1">
                        = ${order.extensionCount * 25}/mo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!showAllAddons && sortedAddons.length > 6 && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"
                data-testid="addons-gradient-overlay"
              />
            )}

            {sortedAddons.length > 6 && (
              <div className={`flex justify-center ${!showAllAddons ? '-mt-4 relative z-10' : 'mt-4'}`}>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Your Business Phone Number</h2>
              <p className="text-sm text-gray-600">
                Auto-assigned based on your location. You can change it if you prefer a different number.
              </p>
            </div>
          </div>

          {selectedPhone && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900" data-testid="selected-phone-number">
                    {selectedPhone.number}
                  </p>
                  <p className="text-sm text-gray-500">Local Number</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenPhoneModal}
                data-testid="button-change-phone"
              >
                <Pencil className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          )}

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

        <div
          className="bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(16,24,40,0.08)]"
          data-testid="sticky-footer"
        >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <motion.div
                  animate={footerPulse ? {
                    scale: [1, 1.3, 0.9, 1.15, 1],
                    rotate: [0, -8, 8, -4, 0],
                  } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100"
                >
                  <ShoppingCart className="h-4 w-4 text-gray-700" />
                </motion.div>
                <AnimatePresence>
                  {footerPulse && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 0 }}
                      animate={{ scale: 1, opacity: 1, y: -6 }}
                      exit={{ scale: 0, opacity: 0, y: -12 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#344054] border-2 border-white flex items-center justify-center"
                      data-testid="cart-added-badge"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {footerPulse && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0.8 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-lg bg-gray-300 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-gray-900 leading-tight" data-testid="footer-package-name">{displayBundleName}</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900 font-medium transition-colors"
                        data-testid="button-see-included"
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">See what's included</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="center" className="w-72 p-0" data-testid="popover-included-features">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{displayBundleName} includes:</p>
                      </div>
                      <div className="px-4 py-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                          <span className="text-gray-700">Prestigious Business Address</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                          <span className="text-gray-700">Live Call Answering</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                          <span className="text-gray-700">Call Transferring</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                          <span className="text-gray-700">2 Voicemail Boxes</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                          <span className="text-gray-700">Business Phone/Fax Number</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                          <span className="text-gray-700">Voicemail/Fax to Email</span>
                        </div>
                        {selectedBundle && Object.entries(selectedBundle.features)
                          .filter(([key, enabled]) => enabled && !['businessAddress', 'liveCallAnswering', 'callTransferring'].includes(key))
                          .map(([key]) => (
                            <div key={key} className="flex items-center gap-2 text-sm">
                              <Check className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                              <span className="text-gray-700">{featureLabels[key]}</span>
                            </div>
                          ))
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-end gap-2">
                  <p className="text-lg font-bold text-gray-900 leading-tight" data-testid="footer-monthly-total">${monthly}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                  {(order.addons.length > 0 || order.extensionCount > 0) && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="inline-flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900 font-medium transition-colors mb-0.5"
                          data-testid="button-see-addons"
                        >
                          See details
                        </button>
                      </PopoverTrigger>
                    <PopoverContent side="top" align="center" className="w-72 p-0" data-testid="popover-addon-breakdown">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">Your Add-ons</p>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                          {order.addons.map((addon) => (
                            <div key={addon.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">{addon.name}{addon.selectedPackage ? ` (${addon.selectedPackage.name})` : ''}</span>
                              <span className="font-medium text-gray-900 flex-shrink-0 ml-3">${addon.price}/mo</span>
                            </div>
                          ))}
                          {order.extensionCount > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">Additional Extensions ({order.extensionCount})</span>
                              <span className="font-medium text-gray-900 flex-shrink-0 ml-3">${order.extensionCount * 25}/mo</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                            <span className="font-semibold text-gray-900">Add-ons Total</span>
                            <span className="font-semibold text-gray-900">
                              ${order.addons.reduce((sum, a) => sum + a.price, 0) + order.extensionCount * 25}/mo
                            </span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={handleContinue}
              disabled={!selectedPhone}
              className="signup-primary h-10 px-6 flex-shrink-0"
              data-testid="button-continue-checkout"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
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

      <LocalPhoneNumberDialog
        open={phoneModalOpen}
        onOpenChange={setPhoneModalOpen}
        numbers={phoneNumbers}
        selected={selectedPhone}
        city={order.location?.city || 'your location'}
        onSave={phone => {
          setSelectedPhone(phone);
          setPhoneNumber(phone);
        }}
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
