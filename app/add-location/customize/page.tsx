'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Minus, Phone, Plus, ShoppingCart, X, ChevronRight, ChevronDown, ChevronUp, MapPin, Star, Building2, Sparkles } from 'lucide-react';
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
import { useOrder } from '../context';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';
import {
  bundles,
  featureLabels,
  availableAddons,
  getPhoneNumbersForLocation,
  getStates,
  getCitiesByState,
  getLocationsByCity,
  Bundle,
  PhoneNumber,
  Addon,
  AddonPackage,
  AvailableLocation,
} from '../types';

function getTierColor(tier: string) {
  switch (tier) {
    case 'PLUS':
      return 'text-[#36bff9]';
    case 'PRO':
      return 'text-[#c53030]';
    case 'PREMIUM':
      return 'text-[#d69e2e]';
    default:
      return 'text-gray-900';
  }
}

export default function CustomizePage() {
  const router = useRouter();
  const { order, setLocation, setBundle, setPhoneNumber, addAddon, removeAddon, updateAddon, setExtensionCount, getCartTotal } = useOrder();
  const [subStep, setSubStep] = useState<'location' | 'customize'>(order.location ? 'customize' : 'location');
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(order.bundle);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<PhoneNumber | null>(order.phoneNumber);
  const [tempSelectedPhone, setTempSelectedPhone] = useState<PhoneNumber | null>(null);
  const [expandedAddons, setExpandedAddons] = useState<Set<string>>(new Set());
  const [showAllAddons, setShowAllAddons] = useState(false);
  const [bundleExpanded, setBundleExpanded] = useState(false);
  const { trackComplete } = useFunnelTracking('customize');

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const states = useMemo(() => getStates(), []);
  const cities = useMemo(
    () => (selectedState ? getCitiesByState(selectedState) : []),
    [selectedState]
  );
  const availableLocations = useMemo(
    () => (selectedCity ? getLocationsByCity(selectedCity) : []),
    [selectedCity]
  );

  const phoneNumbers = useMemo(() => {
    if (!order.location) return [];
    return getPhoneNumbersForLocation(order.location);
  }, [order.location]);

  useEffect(() => {
    if (phoneNumbers.length > 0 && !selectedPhone) {
      const autoAssigned = phoneNumbers[0];
      setSelectedPhone(autoAssigned);
      setPhoneNumber(autoAssigned);
    }
  }, [phoneNumbers, selectedPhone, setPhoneNumber]);

  useEffect(() => {
    if (!selectedBundle && subStep === 'customize') {
      const essentialsBundle = bundles[0];
      if (essentialsBundle) {
        setSelectedBundle(essentialsBundle);
        setBundle(essentialsBundle);
      }
    }
  }, [subStep]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity('');
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleLocationSelect = (location: AvailableLocation) => {
    setLocation(location);
    setSubStep('customize');
  };

  const handleBundleSelect = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setBundle(bundle);
  };

  const handlePhoneConfirm = () => {
    if (tempSelectedPhone) {
      setSelectedPhone(tempSelectedPhone);
      setPhoneNumber(tempSelectedPhone);
    }
    setPhoneModalOpen(false);
  };

  const handleOpenPhoneModal = () => {
    setTempSelectedPhone(selectedPhone);
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

  const handleContinue = () => {
    if (selectedBundle && selectedPhone) {
      trackComplete({ bundle: selectedBundle.name });
      router.push('/add-location/checkout');
    }
  };

  const handleBackFromCustomize = () => {
    setSubStep('location');
  };

  const { monthly } = getCartTotal();

  if (subStep === 'location') {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="customize-page-location">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-6"
            data-testid="button-back-info"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Your Information
          </Button>

          <div className="mb-8">
            <ProgressIndicator currentStep={2} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Your Location</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger data-testid="select-state">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state} data-testid={`option-state-${state}`}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Select
                  value={selectedCity}
                  onValueChange={handleCityChange}
                  disabled={!selectedState}
                >
                  <SelectTrigger data-testid="select-city">
                    <SelectValue placeholder={selectedState ? 'Select a city' : 'Select state first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city} data-testid={`option-city-${city}`}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedCity && (
              <div className="space-y-3" data-testid="locations-list">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Available Locations in {selectedCity}
                </h3>
                {availableLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex flex-col rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all overflow-hidden"
                    data-testid={`location-card-${location.id}`}
                  >
                    <div className="w-full bg-gray-200 flex items-center justify-center" style={{ aspectRatio: '1.85 / 1' }}>
                      <Building2 className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-medium text-gray-900">{location.name}</h4>
                          {location.isPremium && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-semibold">
                              <Star className="h-3 w-3 fill-amber-500" />
                              Premium Location
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                            {location.address}
                          </p>
                          <p className="ml-5">{location.addressLine2}</p>
                          <p className="ml-5">{location.city}, {location.stateCode} {location.zipCode}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleLocationSelect(location)}
                        className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white flex-shrink-0 w-full sm:w-auto"
                        data-testid={`button-select-location-${location.id}`}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!selectedState && (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select a state to view available locations</p>
              </div>
            )}

            {selectedState && !selectedCity && (
              <div className="text-center py-12 text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select a city to view available locations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!order.location) {
    return null;
  }

  const upgradeBundles = bundles.filter(b => b.id !== 'essentials');
  const displayBundleName = selectedBundle
    ? (selectedBundle.tier !== 'The Essentials' ? selectedBundle.tier : 'The Essentials')
    : 'The Essentials';

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8 pb-28" data-testid="customize-page">
      <Button
        variant="ghost"
        onClick={handleBackFromCustomize}
        className="mb-6"
        data-testid="button-back-location"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Location
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <ProgressIndicator currentStep={2} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-customize">
            Customize Your Service
          </h1>
          <p className="text-gray-600">
            for <span className="font-medium">{order.location.name}</span>, {order.location.city}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden" data-testid="bundle-upgrade-banner">
          <button
            onClick={() => setBundleExpanded(!bundleExpanded)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            data-testid="button-toggle-bundle-upgrade"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#36bff9] to-[#2aa8e0] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-900">Upgrade Your Package</h2>
                <p className="text-sm text-gray-600">Unlock premium features like Toll-Free Numbers, Call Logs, and more</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900" data-testid="text-selected-bundle-name">
                  {displayBundleName}
                </p>
                <p className="text-sm text-[#36bff9] font-semibold" data-testid="text-selected-bundle-price">
                  ${selectedBundle?.price || bundles[0].price}/mo
                </p>
              </div>
              {bundleExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
              )}
            </div>
          </button>

          {bundleExpanded && (
            <div className="px-6 pb-6 border-t border-gray-100 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {upgradeBundles.map((bundle) => (
                  <div
                    key={bundle.id}
                    onClick={() => handleBundleSelect(bundle)}
                    className={`bg-white rounded-xl border-2 overflow-hidden flex flex-col transition-all cursor-pointer hover:shadow-md ${
                      selectedBundle?.id === bundle.id
                        ? 'border-[#36bff9] ring-2 ring-[#36bff9] ring-opacity-30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    data-testid={`bundle-card-${bundle.id}`}
                  >
                    <div className={`${bundle.badgeColor} text-white text-center py-2 text-sm font-medium`}>
                      {bundle.badge}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-3">
                        <h3 className="text-base font-medium text-gray-900">
                          {bundle.name}
                          <span className={`font-bold ${getTierColor(bundle.tier)}`}> {bundle.tier}</span>
                        </h3>
                      </div>

                      <div className="mb-4">
                        <span className="text-3xl font-bold text-gray-900">${bundle.price}</span>
                        {bundle.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${bundle.originalPrice}
                          </span>
                        )}
                        <span className="text-gray-500 text-sm ml-1">/mo</span>
                      </div>

                      <div className="space-y-2 flex-1">
                        {Object.entries(bundle.features).map(([key, enabled]) => (
                          <div key={key} className="flex items-center gap-2 text-sm">
                            {enabled ? (
                              <div className="w-4 h-4 rounded-full bg-[#36bff9] flex items-center justify-center flex-shrink-0">
                                <Check className="h-2.5 w-2.5 text-white" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                                <Minus className="h-3 w-3 text-gray-300" />
                              </div>
                            )}
                            <span className={`${enabled ? 'text-gray-700' : 'text-gray-400'} text-xs`}>
                              {featureLabels[key]}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBundleSelect(bundle);
                        }}
                        className={`mt-4 w-full ${
                          selectedBundle?.id === bundle.id
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-[#36bff9] hover:bg-[#2aa8e0]'
                        }`}
                        data-testid={`button-select-bundle-${bundle.id}`}
                      >
                        {selectedBundle?.id === bundle.id ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Selected
                          </>
                        ) : (
                          'Select this bundle'
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedBundle?.id !== 'essentials' && (
                <button
                  onClick={() => handleBundleSelect(bundles[0])}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
                  data-testid="button-revert-essentials"
                >
                  Revert to The Essentials ($99/mo)
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden mb-6" data-testid="essentials-info-banner">
          <div className="bg-[#36bff9] text-white text-center py-2 text-sm font-medium">
            Your Included Package
          </div>
          <div className="p-4">
            <div className="mb-3">
              <h3 className="text-base font-medium text-gray-900">The Ultimate Office Solution</h3>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">${bundles[0].price}</span>
              <span className="text-gray-500 text-sm ml-1">/mo</span>
            </div>
            <div className="space-y-2">
              {Object.entries(bundles[0].features)
                .filter(([, enabled]) => enabled)
                .map(([key]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-[#36bff9] flex items-center justify-center flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="text-gray-700 text-xs">{featureLabels[key]}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {selectedBundle && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="addons-section">
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
                          ? 'border-green-200 bg-green-50'
                          : isInCart
                          ? 'border-[#36bff9] bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      data-testid={`addon-card-${addon.id}`}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{addon.name}</h4>
                          {isIncluded ? (
                            <Badge className="bg-green-100 text-green-700 border-0">
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
                        <p className="text-sm text-gray-600 mb-2">{addon.description}</p>
                        
                        <button
                          onClick={() => toggleAddonExpanded(addon.id)}
                          className="text-sm text-[#36bff9] hover:text-[#2aa8e0] flex items-center gap-1 mb-2"
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

                        {isExpanded && addon.detailedDescription && (
                          <div 
                            className="text-sm text-gray-600 bg-gray-50 rounded-md p-3 mb-3 border border-gray-100"
                            data-testid={`addon-details-${addon.id}`}
                          >
                            {addon.detailedDescription}
                          </div>
                        )}

                        {!isIncluded && (
                          <div className="space-y-3">
                            <Button
                              variant={isInCart ? 'outline' : 'default'}
                              size="sm"
                              className={isInCart ? 'border-red-300 text-red-600 hover:bg-red-50' : 'bg-[#36bff9] hover:bg-[#2aa8e0]'}
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
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add to Cart
                                </>
                              )}
                            </Button>
                            
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

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div
                className={`rounded-lg border p-4 ${
                  order.extensionCount > 0 ? 'border-[#36bff9] bg-blue-50' : 'border-gray-200 bg-white'
                }`}
                data-testid="addon-card-additional-extensions"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Additional Extensions</h4>
                  <span className="font-semibold text-gray-900">$25/mo each</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Add more extensions to your phone system. Further customization available from the Phone System page after setup.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExtensionCount(order.extensionCount - 1)}
                    disabled={order.extensionCount === 0}
                    className="h-8 w-8 p-0"
                    data-testid="button-extension-decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-gray-900 min-w-[2rem] text-center" data-testid="extension-count">
                    {order.extensionCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExtensionCount(order.extensionCount + 1)}
                    className="h-8 w-8 p-0"
                    data-testid="button-extension-increase"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {order.extensionCount > 0 && (
                    <span className="text-sm text-gray-600 ml-2">
                      = ${order.extensionCount * 25}/mo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="phone-section">
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
                <div className="w-10 h-10 rounded-full bg-[#36bff9] flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900" data-testid="selected-phone-number">
                    {selectedPhone.number}
                  </p>
                  <p className="text-sm text-gray-500">Local Number</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleOpenPhoneModal}
                data-testid="button-change-phone"
              >
                Change
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50" data-testid="sticky-footer">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Package</p>
            <p className="font-semibold text-gray-900" data-testid="footer-package-name">{displayBundleName}</p>
            <p className="text-lg font-bold text-[#36bff9]" data-testid="footer-monthly-total">${monthly}/mo</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleBackFromCustomize}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedBundle || !selectedPhone}
              className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white px-8"
              data-testid="button-continue-checkout"
            >
              Continue to Checkout
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={phoneModalOpen} onOpenChange={setPhoneModalOpen}>
        <DialogContent className="sm:max-w-md" data-testid="phone-selection-modal">
          <DialogHeader>
            <DialogTitle>Select Phone Number</DialogTitle>
            <DialogDescription>
              Choose a phone number for your new location. All numbers are local to your selected area.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4 max-h-60 overflow-y-auto">
            {phoneNumbers.map((phone) => (
              <div
                key={phone.id}
                onClick={() => setTempSelectedPhone(phone)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  tempSelectedPhone?.id === phone.id
                    ? 'bg-blue-50 border-2 border-[#36bff9]'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
                data-testid={`phone-option-${phone.id}`}
              >
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{phone.number}</span>
                {tempSelectedPhone?.id === phone.id && (
                  <Check className="h-4 w-4 text-[#36bff9] ml-auto" />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPhoneModalOpen(false)}
              data-testid="button-cancel-phone"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePhoneConfirm}
              className="bg-[#36bff9] hover:bg-[#2aa8e0]"
              data-testid="button-confirm-phone"
            >
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
