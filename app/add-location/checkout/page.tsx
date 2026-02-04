'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Package, Phone, Plus, Trash2, CreditCard, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useOrder } from '../context';
import { useToast } from '@/app/hooks/use-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { order, removeAddon, setExtensionCount, setAgreementAccepted, getCartTotal } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!order.location || !order.bundle || !order.phoneNumber) {
      router.push('/add-location');
    }
  }, [order, router]);

  const { monthly, oneTime } = getCartTotal();
  const totalDueToday = monthly + oneTime;

  const handleRemoveAddon = (addonId: string) => {
    removeAddon(addonId);
    toast({
      title: 'Add-on removed',
      description: 'The add-on has been removed from your cart.',
    });
  };

  const handleCheckout = async () => {
    if (!order.agreementAccepted) {
      toast({
        title: 'Agreement required',
        description: 'Please accept the terms and conditions to proceed.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    router.push('/add-location/thank-you');
  };

  if (!order.location || !order.bundle || !order.phoneNumber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8" data-testid="checkout-page">
      <Button
        variant="ghost"
        onClick={() => router.push('/add-location/customize')}
        className="mb-6"
        data-testid="button-back-customize"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Customize
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <ProgressIndicator currentStep={3} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-checkout">
            Complete Your Order
          </h1>
          <p className="text-gray-600">
            Review your selections and complete checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="order-summary-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-[#36bff9]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{order.location.name}</p>
                        <p className="text-sm text-gray-500">
                          {order.location.address}, {order.location.city}, {order.location.stateCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-[#36bff9]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Bundle</p>
                        <p className="text-sm text-gray-600">
                          {order.bundle.name} {order.bundle.tier !== 'The Essentials' ? order.bundle.tier : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${order.bundle.price}/mo</p>
                        {order.bundle.originalPrice && (
                          <p className="text-sm text-gray-400 line-through">${order.bundle.originalPrice}/mo</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-[#36bff9]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Phone Number</p>
                        <p className="text-sm text-gray-600">{order.phoneNumber.number}</p>
                        <p className="text-sm text-gray-500">Local number</p>
                      </div>
                      <p className="font-semibold text-green-600">Included</p>
                    </div>
                  </div>
                </div>

                {(order.addons.length > 0 || order.extensionCount > 0) && (
                  <div className="pt-2">
                    <p className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add-ons
                    </p>
                    <div className="space-y-3">
                      {order.addons.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div>
                            <p className="font-medium text-gray-900">{addon.name}</p>
                            <p className="text-sm text-gray-500">{addon.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-gray-900">${addon.price}/mo</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveAddon(addon.id)}
                              data-testid={`button-remove-addon-${addon.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {order.extensionCount > 0 && (
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div>
                            <p className="font-medium text-gray-900">Additional Extensions</p>
                            <p className="text-sm text-gray-500">{order.extensionCount} extension(s) @ $10/mo each</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-gray-900">${order.extensionCount * 10}/mo</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setExtensionCount(0)}
                              data-testid="button-remove-extensions"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="agreement-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Terms & Agreements
              </h2>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="agreement"
                  checked={order.agreementAccepted}
                  onCheckedChange={(checked) => setAgreementAccepted(checked as boolean)}
                  data-testid="checkbox-agreement"
                />
                <label htmlFor="agreement" className="text-sm text-gray-600 cursor-pointer">
                  I have read and agree to the{' '}
                  <a
                    href="https://www.opusvirtualoffices.com/opus-virtual-offices-terms-of-use/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#36bff9] hover:underline"
                    data-testid="link-terms"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://www.opusvirtualoffices.com/privacy-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#36bff9] hover:underline"
                    data-testid="link-privacy"
                  >
                    Privacy Policy
                  </a>
                  . I authorize Opus Virtual Offices to charge my payment method for the selected services.
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4" data-testid="payment-summary">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bundle ({order.bundle.tier})</span>
                  <span className="font-medium">${order.bundle.price}/mo</span>
                </div>
                {order.addons.map((addon) => (
                  <div key={addon.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{addon.name}</span>
                    <span className="font-medium">${addon.price}/mo</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Monthly Total</span>
                  <span className="font-semibold text-gray-900">${monthly}/mo</span>
                </div>
                {oneTime > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">One-time Fees</span>
                    <span className="font-semibold text-gray-900">${oneTime}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Due Today</span>
                  <span className="text-2xl font-bold text-gray-900">${totalDueToday}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Then ${monthly}/mo starting next billing cycle
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={!order.agreementAccepted || isProcessing}
                className="w-full bg-[#36bff9] hover:bg-[#2aa8e0] text-white"
                data-testid="button-complete-checkout"
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Complete Checkout
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Secure payment processed by our payment provider
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => router.push('/add-location/customize')}
            disabled={isProcessing}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customize
          </Button>
        </div>
      </div>
    </div>
  );
}
