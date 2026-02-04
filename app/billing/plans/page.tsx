'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Minus, ArrowLeft } from 'lucide-react';
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
import { useToast } from '@/app/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  tier: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  badgeColor?: string;
  features: {
    businessAddress: boolean;
    liveCallAnswering: boolean;
    callTransferring: boolean;
    calloutFeature: boolean;
    tollFreeNumber: boolean;
    callLog: boolean;
    supervisedCallTransfer: boolean;
    messageTaking: boolean;
  };
}

const plans: Plan[] = [
  {
    id: 'essentials',
    name: 'The Ultimate Office Solution',
    tier: 'The Essentials',
    price: 99,
    badge: undefined,
    badgeColor: undefined,
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      calloutFeature: false,
      tollFreeNumber: false,
      callLog: false,
      supervisedCallTransfer: false,
      messageTaking: false,
    },
  },
  {
    id: 'plus',
    name: 'The Ultimate Office',
    tier: 'PLUS',
    price: 119,
    originalPrice: 129,
    badge: 'Popular Upgrades',
    badgeColor: 'bg-[#36bff9]',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      calloutFeature: true,
      tollFreeNumber: false,
      callLog: false,
      supervisedCallTransfer: false,
      messageTaking: false,
    },
  },
  {
    id: 'pro',
    name: 'The Ultimate Office',
    tier: 'PRO',
    price: 149,
    originalPrice: 179,
    badge: 'The Professional',
    badgeColor: 'bg-[#4a5568]',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      calloutFeature: true,
      tollFreeNumber: true,
      callLog: true,
      supervisedCallTransfer: true,
      messageTaking: false,
    },
  },
  {
    id: 'premium',
    name: 'The Ultimate Office',
    tier: 'PREMIUM',
    price: 179,
    originalPrice: 229,
    badge: 'The Best Value',
    badgeColor: 'bg-[#c53030]',
    features: {
      businessAddress: true,
      liveCallAnswering: true,
      callTransferring: true,
      calloutFeature: true,
      tollFreeNumber: true,
      callLog: true,
      supervisedCallTransfer: true,
      messageTaking: true,
    },
  },
];

const optionalFeatures = [
  'Toll Free Number',
  'Callout',
  'Texting',
  'Audio Conference Bridge',
  'Additional Extension(s)/Voice Box(es)',
  'Call Recording',
  'Incoming Call Log Feature',
  'Supervised Call Transfer',
  'Message Taking',
];

const featureLabels = {
  businessAddress: 'Business Address',
  liveCallAnswering: 'Live Call Answering',
  callTransferring: 'Call Transferring',
  calloutFeature: 'Callout Feature',
  tollFreeNumber: 'Toll-Free Number',
  callLog: 'Call Log',
  supervisedCallTransfer: 'Supervised Call Transfer',
  messageTaking: 'Message Taking',
};

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

export default function PlansPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPlanId = 'essentials';

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === currentPlanId) {
      toast({
        title: 'Current Plan',
        description: 'You are already on this plan.',
      });
      return;
    }
    setSelectedPlan(plan);
    setConfirmOpen(true);
  };

  const handleConfirmPlan = async () => {
    if (!selectedPlan) return;
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setConfirmOpen(false);
    
    const isUpgrade = plans.findIndex(p => p.id === selectedPlan.id) > plans.findIndex(p => p.id === currentPlanId);
    
    toast({
      title: isUpgrade ? 'Plan Upgraded!' : 'Plan Changed',
      description: `Your plan has been ${isUpgrade ? 'upgraded' : 'changed'} to ${selectedPlan.tier === 'The Essentials' ? 'The Essentials' : `Office ${selectedPlan.tier}`}. Changes will take effect on your next billing cycle.`,
    });
    
    router.push('/billing');
  };

  return (
    <div className="p-4 lg:p-8" data-testid="plans-page">
      <Button
        variant="ghost"
        onClick={() => router.push('/billing')}
        className="mb-4"
        data-testid="button-back-billing"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Billing
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="heading-plans">
          Select Your Plan
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          All plans include the following: Prestigious Business Address, Live Call Answering, Call Transferring, 2 Voicemail Boxes, Business Phone/Fax Number, and Voicemail/Fax Converted to Email.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border-2 ${
              plan.id === currentPlanId ? 'border-[#36bff9]' : 'border-gray-200'
            } overflow-hidden`}
            data-testid={`plan-card-${plan.id}`}
          >
            {plan.badge && (
              <div className={`${plan.badgeColor} text-white text-center py-2 text-sm font-medium`}>
                {plan.badge}
              </div>
            )}
            {!plan.badge && (
              <div className="bg-gray-100 text-gray-700 text-center py-2 text-sm font-medium">
                {plan.tier}
              </div>
            )}

            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {plan.name}
                  {plan.tier !== 'The Essentials' && (
                    <span className={`font-bold ${getTierColor(plan.tier)}`}> {plan.tier}</span>
                  )}
                </h3>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                {plan.originalPrice && (
                  <span className="text-lg text-gray-400 line-through ml-2">
                    ${plan.originalPrice}
                  </span>
                )}
                <span className="text-gray-500 ml-1">per month</span>
              </div>

              <Button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full mb-6 ${
                  plan.id === currentPlanId
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-[#36bff9] hover:bg-[#2aa8e0] text-white'
                }`}
                disabled={plan.id === currentPlanId}
                data-testid={`button-select-${plan.id}`}
              >
                {plan.id === currentPlanId ? 'Current Plan' : 'Select Bundle'}
              </Button>

              <div className="space-y-3">
                {Object.entries(plan.features).map(([key, enabled]) => (
                  <div key={key} className="flex items-center gap-3">
                    {enabled ? (
                      <div className="w-5 h-5 rounded-full bg-[#36bff9] flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <Minus className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                    <span className={enabled ? 'text-gray-700' : 'text-gray-400'}>
                      {featureLabels[key as keyof typeof featureLabels]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center" data-testid="section-optional-features">
        <h2 className="text-lg font-semibold text-gray-500 tracking-wider mb-4">
          OPTIONAL FEATURES AVAILABLE
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {optionalFeatures.map((feature) => (
            <Badge
              key={feature}
              variant="outline"
              className="bg-white text-gray-600 border-gray-300 px-4 py-2"
              data-testid={`badge-feature-${feature.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
            >
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md" data-testid="modal-confirm-plan">
          <DialogHeader>
            <DialogTitle>Confirm Plan Change</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <>
                  You are about to {
                    plans.findIndex(p => p.id === selectedPlan.id) > plans.findIndex(p => p.id === currentPlanId)
                      ? 'upgrade'
                      : 'change'
                  } your plan to{' '}
                  <span className="font-semibold">
                    {selectedPlan.tier === 'The Essentials' ? 'The Essentials' : `Office ${selectedPlan.tier}`}
                  </span>{' '}
                  at <span className="font-semibold">${selectedPlan.price}/month</span>.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">New Monthly Rate</span>
                  <span className="font-semibold text-gray-900">${selectedPlan.price}.00</span>
                </div>
                <p className="text-sm text-gray-500">
                  Changes will take effect on your next billing cycle. You won't be charged until then.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isSubmitting}
              data-testid="button-cancel-plan-change"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPlan}
              disabled={isSubmitting}
              className="bg-[#36bff9] hover:bg-[#2aa8e0]"
              data-testid="button-confirm-plan-change"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Change'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
