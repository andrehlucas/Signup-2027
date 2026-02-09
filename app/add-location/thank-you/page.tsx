'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MapPin, Package, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useOrder } from '../context';
import { useFunnelTracking } from '../../hooks/use-funnel-tracking';

export default function ThankYouPage() {
  const router = useRouter();
  const { order, clearOrder } = useOrder();
  useFunnelTracking('thank_you');

  useEffect(() => {
    if (!order.location || !order.bundle) {
      router.push('/');
    }
  }, [order, router]);

  const handleStartOver = () => {
    clearOrder();
    router.push('/');
  };

  if (!order.location || !order.bundle) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="thank-you-page">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-thank-you">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your new virtual office is being set up. You'll receive a confirmation email shortly.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="order-confirmation">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-[#36bff9]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{order.location.name}</p>
                <p className="text-sm text-gray-600">
                  {order.location.address}, {order.location.city}, {order.location.stateCode} {order.location.zipCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-[#36bff9]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.bundle.name} {order.bundle.tier !== 'The Essentials' ? order.bundle.tier : ''}
                    </p>
                    <p className="text-sm text-gray-600">Monthly subscription</p>
                  </div>
                  <p className="font-semibold text-gray-900">${order.bundle.price}/mo</p>
                </div>
              </div>
            </div>

            {order.phoneNumber && (
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-[#36bff9]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.phoneNumber.number}</p>
                  <p className="text-sm text-gray-600">Your new business phone number</p>
                </div>
              </div>
            )}

            {(order.addons.length > 0 || order.extensionCount > 0) && (
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Add-ons included:</p>
                <div className="flex flex-wrap gap-2">
                  {order.addons.map((addon) => (
                    <span
                      key={addon.id}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
                    >
                      {addon.name}
                    </span>
                  ))}
                  {order.extensionCount > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                      Additional Extensions ({order.extensionCount})
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6" data-testid="onboarding-info">
          <h3 className="font-semibold text-gray-900 mb-2">What Happens Next?</h3>
          <p className="text-gray-600">
            Our team will reach out within 24 hours to help you get started with your new virtual office. A confirmation email with your order details has been sent to <strong>{order.userInfo.email}</strong>.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleStartOver}
            className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white px-8"
            data-testid="button-start-over"
          >
            Sign Up Another Location
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
