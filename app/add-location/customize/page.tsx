'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Minus, Phone, Plus, ShoppingCart, X, ChevronRight } from 'lucide-react';
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
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useOrder } from '../context';
import {
  bundles,
  featureLabels,
  availableAddons,
  getPhoneNumbersForLocation,
  Bundle,
  PhoneNumber,
  Addon,
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
  const { order, setBundle, setPhoneNumber, addAddon, removeAddon, getCartTotal } = useOrder();
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(order.bundle);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<PhoneNumber | null>(order.phoneNumber);
  const [tempSelectedPhone, setTempSelectedPhone] = useState<PhoneNumber | null>(null);

  const phoneNumbers = useMemo(() => {
    if (!order.location) return [];
    return getPhoneNumbersForLocation(order.location);
  }, [order.location]);

  useEffect(() => {
    if (!order.location) {
      router.push('/add-location');
    }
  }, [order.location, router]);

  useEffect(() => {
    if (phoneNumbers.length > 0 && !selectedPhone) {
      const autoAssigned = phoneNumbers[0];
      setSelectedPhone(autoAssigned);
      setPhoneNumber(autoAssigned);
    }
  }, [phoneNumbers, selectedPhone, setPhoneNumber]);

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
      addAddon(addon);
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

  const handleContinue = () => {
    if (selectedBundle && selectedPhone) {
      router.push('/add-location/checkout');
    }
  };

  const { monthly } = getCartTotal();

  if (!order.location) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8" data-testid="customize-page">
      <Button
        variant="ghost"
        onClick={() => router.push('/add-location')}
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

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Your Bundle</h2>
          <p className="text-sm text-gray-600 mb-6">
            All plans include: Prestigious Business Address, Live Call Answering, Call Transferring, 2 Voicemail Boxes, Business Phone/Fax Number, and Voicemail/Fax Converted to Email.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                onClick={() => handleBundleSelect(bundle)}
                className={`bg-white rounded-xl border-2 overflow-hidden flex flex-col cursor-pointer transition-all ${
                  selectedBundle?.id === bundle.id
                    ? 'border-[#36bff9] ring-2 ring-[#36bff9] ring-opacity-30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                data-testid={`bundle-card-${bundle.id}`}
              >
                <div className={`${bundle.badgeColor} text-white text-center py-2 text-sm font-medium`}>
                  {bundle.badge}
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-base font-medium text-gray-900">
                      {bundle.name}
                      {bundle.tier !== 'The Essentials' && (
                        <span className={`font-bold ${getTierColor(bundle.tier)}`}> {bundle.tier}</span>
                      )}
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

                  <div className="space-y-2">
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
                </div>
              </div>
            ))}
          </div>
        </div>

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

        {selectedBundle && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="addons-section">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Add-ons</h2>
            <p className="text-sm text-gray-600 mb-6">
              Enhance your plan with additional features. Some add-ons may already be included in your bundle.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableAddons.map((addon) => {
                const isIncluded = isAddonIncluded(addon);
                const isInCart = order.addons.find(a => a.id === addon.id);

                return (
                  <div
                    key={addon.id}
                    className={`rounded-lg border p-4 ${
                      isIncluded
                        ? 'border-green-200 bg-green-50'
                        : isInCart
                        ? 'border-[#36bff9] bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    data-testid={`addon-card-${addon.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{addon.name}</h4>
                      {isIncluded ? (
                        <Badge className="bg-green-100 text-green-700 border-0">
                          Included
                        </Badge>
                      ) : (
                        <span className="font-semibold text-gray-900">
                          ${addon.price}/mo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{addon.description}</p>
                    {!isIncluded && (
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="cart-summary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Cart Summary</p>
                <p className="text-sm text-gray-600">
                  {selectedBundle ? selectedBundle.tier : 'No bundle selected'}
                  {order.addons.length > 0 && ` + ${order.addons.length} add-on(s)`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">${monthly}/mo</p>
              <p className="text-sm text-gray-500">Monthly total</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/add-location')}
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
