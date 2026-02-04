'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, MapPin, Package, Phone, ArrowRight, Mail, FileText, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useOrder } from '../context';

export default function ThankYouPage() {
  const router = useRouter();
  const { order, clearOrder } = useOrder();

  useEffect(() => {
    if (!order.location || !order.bundle) {
      router.push('/');
    }
  }, [order, router]);

  const handleGoToDashboard = () => {
    clearOrder();
    router.push('/');
  };

  const handleSetupOffice = () => {
    clearOrder();
    router.push('/office');
  };

  if (!order.location || !order.bundle) {
    return null;
  }

  const nextSteps = [
    {
      icon: Mail,
      title: 'Set Up Mail Forwarding',
      description: 'Configure how you want to receive your business mail',
      action: 'Set up now',
      href: '/office',
    },
    {
      icon: Phone,
      title: 'Configure Your Phone',
      description: 'Set up call forwarding, voicemail, and extensions',
      action: 'Configure',
      href: '/phone',
    },
    {
      icon: FileText,
      title: 'Upload Documents',
      description: 'Add important business documents to your virtual office',
      action: 'Upload',
      href: '/office',
    },
    {
      icon: Users,
      title: 'Add Team Members',
      description: 'Invite team members to access your virtual office',
      action: 'Add members',
      href: '/account',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8" data-testid="thank-you-page">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-thank-you">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your new location is being set up. You'll receive a confirmation email shortly.
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
              <div className="flex items-start gap-4">
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
              <div className="pt-4 border-t border-gray-100">
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

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6" data-testid="next-steps-section">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h2>
          <p className="text-gray-600 mb-6">
            Complete these steps to get the most out of your new virtual office location.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextSteps.map((step) => (
              <div
                key={step.title}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => {
                  clearOrder();
                  router.push(step.href);
                }}
                data-testid={`next-step-${step.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <step.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{step.title}</p>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <span className="text-sm text-[#36bff9] font-medium flex items-center gap-1">
                    {step.action}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6" data-testid="onboarding-info">
          <h3 className="font-semibold text-gray-900 mb-2">Onboarding Support</h3>
          <p className="text-gray-600 mb-4">
            Our team will reach out within 24 hours to help you get started. In the meantime, you can explore your new dashboard or watch our tutorial videos.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                clearOrder();
                router.push('/videos');
              }}
              data-testid="button-watch-tutorials"
            >
              Watch Tutorials
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearOrder();
                router.push('/support');
              }}
              data-testid="button-contact-support"
            >
              Contact Support
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleSetupOffice}
            className="px-8"
            data-testid="button-setup-office"
          >
            Set Up My Office
          </Button>
          <Button
            onClick={handleGoToDashboard}
            className="bg-[#36bff9] hover:bg-[#2aa8e0] text-white px-8"
            data-testid="button-go-dashboard"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
