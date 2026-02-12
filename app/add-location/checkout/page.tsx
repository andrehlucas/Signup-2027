'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { MapPin, Package, Phone, Plus, Trash2, CreditCard, FileText, ChevronRight, Check, Lock, Clock, HelpCircle, Tag, X, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Input } from '@/app/components/ui/input';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { useOrder } from '../context';
import { useToast } from '@/app/hooks/use-toast';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';
import { Bundle, featureLabels, AppliedPromo } from '../types';

type PaymentTerm = 1 | 3 | 6 | 12;

interface PaymentTermOption {
  months: PaymentTerm;
  label: string;
  freeMonths: number;
  badge?: string;
}

const paymentTermOptions: PaymentTermOption[] = [
  { months: 1, label: 'Monthly', freeMonths: 0 },
  { months: 3, label: '3 Months', freeMonths: 0 },
  { months: 6, label: '6 Months', freeMonths: 0 },
  { months: 12, label: '12 Months', freeMonths: 1, badge: '1 month free' },
];

function getBundleIncludedAddons(bundle: Bundle): { name: string; label: string }[] {
  const included: { name: string; label: string }[] = [];
  const addonFeatures: (keyof Bundle['features'])[] = [
    'tollFreeNumber',
    'calloutFeature',
    'callLog',
    'supervisedCallTransfer',
    'messageTaking',
  ];
  
  for (const feature of addonFeatures) {
    if (bundle.features[feature]) {
      included.push({ name: feature, label: featureLabels[feature] });
    }
  }
  
  return included;
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { order, removeAddon, setExtensionCount, setAgreementAccepted, setAppliedPromo, getCartTotal } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [bundleTooltipOpen, setBundleTooltipOpen] = useState(false);
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerm>(1);
  const { trackComplete } = useFunnelTracking('checkout');
  
  // Sticky payment summary logic
  const summaryContainerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [summaryWidth, setSummaryWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!order.location || !order.bundle || !order.phoneNumber) {
      router.push('/add-location');
    }
  }, [order, router]);

  // Handle sticky scroll behavior
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!summaryContainerRef.current) return;

    const handleScroll = () => {
      const container = summaryContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const stickyOffset = 24; // top-6 = 1.5rem = 24px
      
      // Check if we've scrolled past the container's top position
      if (containerRect.top <= stickyOffset) {
        setIsSticky(true);
        setSummaryWidth(container.offsetWidth);
      } else {
        setIsSticky(false);
        setSummaryWidth(null);
      }
    };

    const handleResize = () => {
      // Update width on resize if sticky
      if (isSticky && summaryContainerRef.current) {
        setSummaryWidth(summaryContainerRef.current.offsetWidth);
      }
    };

    // Listen to both main element scroll and window scroll
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll(); // Check initial position
    
    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSticky]);

  const { monthly, oneTime } = getCartTotal();
  
  const selectedTermOption = paymentTermOptions.find(opt => opt.months === paymentTerm)!;
  const paidMonths = paymentTerm - selectedTermOption.freeMonths;
  const termTotal = monthly * paidMonths;
  const termSavings = monthly * selectedTermOption.freeMonths;
  const promoDiscount = useMemo(() => {
    if (!order.appliedPromo) return 0;
    const promo = order.appliedPromo;
    switch (promo.type) {
      case 'percentage':
        return Math.round((termTotal * promo.value) / 100 * 100) / 100;
      case 'flat':
        return Math.min(promo.value, termTotal);
      case 'free_months':
        return monthly * Math.min(promo.value, paidMonths);
      default:
        return 0;
    }
  }, [order.appliedPromo, termTotal, monthly, paidMonths]);
  const totalDueToday = Math.max(0, termTotal + oneTime - promoDiscount);
  const effectiveMonthlyRate = paymentTerm > 1 ? (termTotal / paymentTerm).toFixed(2) : monthly.toString();

  
  const bundleIncludedAddons = useMemo(() => {
    if (!order.bundle) return [];
    return getBundleIncludedAddons(order.bundle);
  }, [order.bundle]);

  const handleRemoveAddon = (addonId: string) => {
    removeAddon(addonId);
    toast({
      title: 'Add-on removed',
      description: 'The add-on has been removed from your cart.',
    });
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError('');
    setIsValidatingPromo(true);

    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode.trim(),
          monthlyTotal: monthly,
          paymentTerm,
        }),
      });

      const data = await response.json();

      if (data.valid && data.promo) {
        setAppliedPromo(data.promo as AppliedPromo);
        setPromoCode('');
        setPromoError('');
        toast({
          title: 'Promo code applied',
          description: data.promo.description,
        });
      } else {
        setPromoError(data.error || 'Invalid promo code');
      }
    } catch {
      setPromoError('Failed to validate promo code. Please try again.');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast({
      title: 'Promo code removed',
      description: 'The promo code has been removed from your order.',
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
    
    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: order.location!.name,
          address: `${order.location!.address}, ${order.location!.city}, ${order.location!.stateCode} ${order.location!.zipCode}`,
          imageUrl: null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create location');
      }

      queryClient.invalidateQueries({ queryKey: ['/api/locations'] });
      
      trackComplete();
      router.push('/add-location/thank-you');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete your order. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  if (!order.location || !order.bundle || !order.phoneNumber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8" data-testid="checkout-page">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <ProgressIndicator currentStep={4} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-checkout">
            Complete Your Order
          </h1>
          <p className="text-gray-600">
            Review your selections and complete checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="order-summary-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-[#36bff9]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{order.location.name}</p>
                        <p className="text-sm text-gray-500">{order.location.address}</p>
                        <p className="text-sm text-gray-500">{order.location.addressLine2}</p>
                        <p className="text-sm text-gray-500">{order.location.city}, {order.location.stateCode} {order.location.zipCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-[#36bff9]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Office Package</p>
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

                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 pb-4 border-b border-gray-100">
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

                <div className="pt-2">
                  <p className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add-ons
                  </p>
                  <div className="space-y-3">
                    {bundleIncludedAddons.map((addon) => (
                      <div key={addon.name} className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-green-600" />
                          <p className="text-sm font-medium text-gray-900">{addon.label}</p>
                        </div>
                        <p className="text-sm font-medium text-green-600">Included</p>
                      </div>
                    ))}
                    {order.addons.map((addon) => (
                      <div key={addon.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-sm font-medium text-gray-900">{addon.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">${addon.price}/mo</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveAddon(addon.id)}
                            data-testid={`button-remove-addon-${addon.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {order.extensionCount > 0 && (
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-sm font-medium text-gray-900">Additional Extensions ({order.extensionCount})</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">${order.extensionCount * 10}/mo</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setExtensionCount(0)}
                            data-testid="button-remove-extensions"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="promo-code-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Promo Code
              </h2>
              {order.appliedPromo ? (
                <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-700">{order.appliedPromo.code}</p>
                      <p className="text-xs text-green-600">{order.appliedPromo.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-green-600 hover:text-green-800 p-1"
                    data-testid="button-remove-promo-top"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyPromo();
                      }}
                      className={`flex-1 text-sm ${promoError ? 'border-red-300' : ''}`}
                      data-testid="input-promo-code-top"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim() || isValidatingPromo}
                      className="shrink-0"
                      data-testid="button-apply-promo-top"
                    >
                      {isValidatingPromo ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-500 mt-1" data-testid="text-promo-error-top">{promoError}</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="payment-term-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Payment Term
              </h2>
              <p className="text-sm text-gray-600 mb-4">Choose your billing cycle and save with longer terms</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {paymentTermOptions.map((option) => (
                  <div
                    key={option.months}
                    onClick={() => setPaymentTerm(option.months)}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentTerm === option.months
                        ? 'border-[#36bff9] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    data-testid={`payment-term-${option.months}`}
                  >
                    {option.badge && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap bg-green-100 text-green-700">
                        {option.badge}
                      </span>
                    )}
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{option.label}</p>
                    </div>
                    {paymentTerm === option.months && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-[#36bff9]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {termSavings > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    You save ${termSavings} with the {paymentTerm}-month plan!
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="payment-method-section">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h2>

              <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#36bff9]">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Credit / Debit Card</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, Amex</p>
                </div>
              </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <Input
                      id="cardholderName"
                      type="text"
                      placeholder="John Doe"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full"
                      data-testid="input-cardholder-name"
                    />
                  </div>

                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setCardNumber(formatted);
                      }}
                      className="w-full pr-10"
                      data-testid="input-card-number"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (value.length >= 2) {
                          setExpiryDate(value.slice(0, 2) + '/' + value.slice(2));
                        } else {
                          setExpiryDate(value);
                        }
                      }}
                      className="w-full"
                      data-testid="input-expiry-date"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full"
                      data-testid="input-cvv"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Billing Address</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <Input
                        id="billingAddress"
                        type="text"
                        placeholder="123 Main Street"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className="w-full"
                        data-testid="input-billing-address"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <Input
                          id="billingCity"
                          type="text"
                          placeholder="New York"
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          className="w-full"
                          data-testid="input-billing-city"
                        />
                      </div>
                      <div>
                        <label htmlFor="billingState" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <Input
                          id="billingState"
                          type="text"
                          placeholder="NY"
                          value={billingState}
                          onChange={(e) => setBillingState(e.target.value.toUpperCase().slice(0, 2))}
                          className="w-full"
                          data-testid="input-billing-state"
                        />
                      </div>
                    </div>

                    <div className="w-1/2">
                      <label htmlFor="billingZip" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <Input
                        id="billingZip"
                        type="text"
                        placeholder="10001"
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        className="w-full"
                        data-testid="input-billing-zip"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Checkbox
                    id="saveCard"
                    checked={saveCard}
                    onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                    data-testid="checkbox-save-card"
                  />
                  <label htmlFor="saveCard" className="text-sm text-gray-600 cursor-pointer">
                    Save this card for future purchases
                  </label>
                </div>

                <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                    <Lock className="h-3 w-3" />
                    Your payment information is encrypted and secure
                  </p>
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
                  className="mt-1"
                  data-testid="checkbox-agreement"
                />
                <label htmlFor="agreement" className="text-sm text-gray-600 cursor-pointer space-y-3">
                  <p>
                    I, <span className="font-medium">(Full name)</span> of <span className="font-medium">(Company Name)</span> agree to subscribe to the OPUS VIRTUAL OFFICES VIRTUAL OFFICE PROGRAM as stated above. I understand that my {paymentTerm === 1 ? 'monthly recurring charges must be paid in advance' : `${paymentTerm}-month term payment is due upfront`} and that services will be billed 5 business days prior to its {paymentTerm === 1 ? 'monthly' : 'term'} due date. Late payment may result in suspension of service and may be subject to a US$50 reinstatement fee.
                  </p>
                  <p>
                    This agreement is for an initial {paymentTerm} month{paymentTerm > 1 ? 's' : ''} term. After the initial term this agreement shall automatically renew on a {paymentTerm === 1 ? 'month to month' : `${paymentTerm}-month`} basis provided CLIENT does not give OPUS written notice of cancellation at least 30 days prior to the term renewal. In the event Opus Virtual Offices is required to employ an attorney to enforce any provision of this Agreement; Client shall pay to Opus Virtual Offices, all attorney fees and court costs incurred.
                  </p>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1" ref={summaryContainerRef}>
            <div 
              className={`bg-white rounded-xl border border-gray-200 p-6 transition-none ${
                isSticky ? 'lg:fixed lg:top-6' : ''
              }`}
              style={isSticky && summaryWidth ? { width: summaryWidth } : undefined}
              data-testid="payment-summary"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    Office Package ({order.bundle.tier})
                    <button
                          className="inline-flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                          data-testid="bundle-breakdown-trigger"
                          onClick={() => setBundleTooltipOpen((v) => !v)}
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                        </button>
                    {bundleTooltipOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setBundleTooltipOpen(false)} />
                        <div className="fixed left-1/2 -translate-x-1/2 top-1/3 z-50 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg" data-testid="bundle-breakdown-popover">
                          <div className="space-y-3">
                            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">All Plans Include</p>
                            <div className="space-y-2">
                              {[
                                'Prestigious Business Address',
                                'Live Call Answering',
                                'Call Transferring',
                                '2 Voicemail Boxes',
                                'Business Phone/Fax Number',
                                'Voicemail/Fax Converted to Email',
                              ].map((feature) => (
                                <div key={feature} className="flex items-center gap-1.5 text-xs text-gray-600">
                                  <Check className="h-3 w-3 text-green-500 shrink-0" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                            {(() => {
                              const bundleExtras = Object.entries(order.bundle!.features)
                                .filter(([key, included]) => {
                                  const base = ['businessAddress', 'liveCallAnswering', 'callTransferring'];
                                  return included && !base.includes(key);
                                })
                                .map(([key]) => featureLabels[key]);
                              return bundleExtras.length > 0 ? (
                                <div className="border-t border-gray-200 pt-2 mt-1">
                                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-2">Included in Office Package</p>
                                  <div className="space-y-2">
                                    {bundleExtras.map((label) => (
                                      <div key={label} className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <Check className="h-3 w-3 text-[#36bff9] shrink-0" />
                                        {label}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      </>
                    )}
                  </span>
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
                {order.appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-700">{order.appliedPromo.code}</p>
                        <p className="text-xs text-green-600">{order.appliedPromo.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-green-600 hover:text-green-800 p-1"
                      data-testid="button-remove-promo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mb-3">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase());
                          setPromoError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleApplyPromo();
                        }}
                        className={`flex-1 text-sm ${promoError ? 'border-red-300' : ''}`}
                        data-testid="input-promo-code"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleApplyPromo}
                        disabled={!promoCode.trim() || isValidatingPromo}
                        className="shrink-0"
                        data-testid="button-apply-promo"
                      >
                        {isValidatingPromo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-red-500 mt-1" data-testid="text-promo-error">{promoError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Monthly Rate</span>
                  <span className="font-semibold text-gray-900">${monthly}/mo</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Billing Term</span>
                  <span className="font-semibold text-gray-900">{paymentTerm} month{paymentTerm > 1 ? 's' : ''}</span>
                </div>
                {termSavings > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Discount ({selectedTermOption.freeMonths} month{selectedTermOption.freeMonths > 1 ? 's' : ''} free)</span>
                    <span className="font-semibold">-${termSavings}</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Promo: {order.appliedPromo?.code}
                    </span>
                    <span className="font-semibold">-${promoDiscount}</span>
                  </div>
                )}
                {oneTime > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">One-time Fees</span>
                    <span className="font-semibold text-gray-900">${oneTime}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-lg font-semibold text-gray-900">Due Today</span>
                  <span className="text-2xl font-bold text-gray-900">${totalDueToday}</span>
                </div>
                {paymentTerm > 1 && (
                  <p className="text-sm text-gray-500">
                    Effective rate: ${effectiveMonthlyRate}/mo
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {paymentTerm === 1 
                    ? `Then $${monthly}/mo starting next billing cycle`
                    : `Next payment: $${termTotal} in ${paymentTerm} months`
                  }
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

      </div>
    </div>
  );
}
