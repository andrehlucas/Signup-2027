'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronRight, Info, MapPin, Phone, ShoppingCart } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { useOrder } from '../context';
import { featureLabels, isAddonIncludedInBundle, type PhoneNumber } from '../types';

interface EnrollmentSummaryFooterProps {
  phoneNumber: PhoneNumber | null;
  onContinue: () => void;
  disabled: boolean;
  continueTestId: string;
  continueLabel: string;
  pulse?: boolean;
  compactWidth?: boolean;
}

export function EnrollmentSummaryFooter({
  phoneNumber, onContinue, disabled, continueTestId, continueLabel,
  pulse = false, compactWidth = false,
}: EnrollmentSummaryFooterProps) {
  const { order } = useOrder();
  const { location, bundle } = order;
  if (!location || !bundle) return null;

  const paidAddons = order.addons.filter(addon => !isAddonIncludedInBundle(addon.id, bundle));
  const addonMonthly = paidAddons.filter(addon => addon.billingCycle === 'monthly')
    .reduce((sum, addon) => sum + addon.price, 0);
  const addonOneTime = paidAddons.filter(addon => addon.billingCycle === 'one-time')
    .reduce((sum, addon) => sum + addon.price, 0);
  const monthly = bundle.price + addonMonthly;

  return (
    <div className="border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(16,24,40,0.08)]" data-testid="sticky-footer">
      <div className={`${compactWidth ? 'max-w-5xl' : 'max-w-6xl'} mx-auto py-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))]`}>
        <div className="mb-3 flex flex-col gap-2 border-b border-gray-100 pb-3 text-sm text-gray-600 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex min-w-0 items-start gap-2" data-testid="footer-office-address">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-words leading-5">
              <span className="sr-only">Office address: </span>
              {location.address}{location.addressLine2 ? `, ${location.addressLine2}` : ''}, {location.city}, {location.stateCode} {location.zipCode}
            </span>
          </div>
          {phoneNumber && (
            <div className="flex shrink-0 items-center gap-2" data-testid="footer-business-phone">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Business phone number: </span>
              <span className="font-medium leading-5 text-gray-800">{phoneNumber.number}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative hidden shrink-0 min-[380px]:block">
              <motion.div
                animate={pulse ? { scale: [1, 1.3, 0.9, 1.15, 1], rotate: [0, -8, 8, -4, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100"
              >
                <ShoppingCart className="h-4 w-4 text-gray-700" aria-hidden="true" />
              </motion.div>
              <AnimatePresence>
                {pulse && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, y: 0 }}
                    animate={{ scale: 1, opacity: 1, y: -6 }}
                    exit={{ scale: 0, opacity: 0, y: -12 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#344054]"
                    data-testid="cart-added-badge"
                  >
                    <Check className="h-3 w-3 text-white" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-1.5">
                <p className="text-sm font-semibold leading-tight text-gray-900" data-testid="footer-package-name">{bundle.tier}</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" aria-label={`See what's included in ${bundle.tier}`}
                      className="inline-flex min-h-6 items-center gap-1 rounded-sm text-xs font-medium text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#345b91]"
                      data-testid="button-see-included">
                      <Info className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">See what's included</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="start" className="max-h-[60dvh] w-72 overflow-y-auto p-0" data-testid="popover-included-features">
                    <p className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-900">{bundle.tier} includes:</p>
                    <ul className="space-y-2 px-4 py-3">
                      {Object.entries(bundle.features).filter(([, enabled]) => enabled).map(([key]) => (
                        <li key={key} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600" aria-hidden="true" />
                          <span>{featureLabels[key] || key}{key === 'appointmentMaking' && ' (20/mo)'}</span>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-wrap items-end gap-x-2">
                <p className="text-lg font-bold leading-tight text-gray-900" data-testid="footer-monthly-total">
                  ${monthly}<span className="text-sm font-normal text-gray-500">/mo</span>
                </p>
                {paidAddons.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="min-h-6 rounded-sm text-xs font-medium text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#345b91]" data-testid="button-see-addons">
                        See details
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="start" className="max-h-[60dvh] w-72 overflow-y-auto p-0" data-testid="popover-addon-breakdown">
                      <p className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-900">Your Add-ons</p>
                      <div className="space-y-2 px-4 py-3 text-sm">
                        {paidAddons.map(addon => (
                          <div key={addon.id} className="flex items-start justify-between gap-3">
                            <span className="text-gray-700">{addon.name}{addon.selectedPackage ? ` (${addon.selectedPackage.name})` : ''}</span>
                            <span className="shrink-0 font-medium text-gray-900">${addon.price}{addon.billingCycle === 'monthly' ? '/mo' : ' one-time'}</span>
                          </div>
                        ))}
                        <div className="flex justify-between gap-3 border-t border-gray-100 pt-2 font-semibold">
                          <span>Add-ons Total</span><span>${addonMonthly}/mo</span>
                        </div>
                        {addonOneTime > 0 && <p className="text-gray-600">One-time add-ons: ${addonOneTime}</p>}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>
          <Button onClick={onContinue} disabled={disabled} aria-label={continueLabel}
            className="signup-primary h-11 shrink-0 px-6" data-testid={continueTestId}>
            Continue <ChevronRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
