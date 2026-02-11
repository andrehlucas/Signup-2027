'use client';

import { useState, useEffect } from 'react';
import { Check, DollarSign, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  bundles,
  featureLabels,
  Bundle,
  AvailableLocation,
} from '../types';

interface PlanSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: AvailableLocation;
  selectedBundle: Bundle | null;
  onConfirm: (bundle: Bundle) => void;
}

export function PlanSelectionModal({
  open,
  onOpenChange,
  location,
  selectedBundle: initialBundle,
  onConfirm,
}: PlanSelectionModalProps) {
  const [selectedBundle, setSelectedBundle] = useState<Bundle>(initialBundle || bundles[0]);

  useEffect(() => {
    if (open) {
      setSelectedBundle(initialBundle || bundles[0]);
    }
  }, [open, initialBundle]);

  const upgradeBundles = bundles.filter(b => b.id !== 'essentials');
  const displayBundleName = selectedBundle.tier !== 'The Essentials' ? selectedBundle.tier : 'The Essentials';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0" data-testid="plan-selection-modal">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-gray-900" data-testid="heading-pick-plan">
            Pick Your Plan
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            for <span className="font-medium">{location.name}</span>, {location.city}
          </p>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden" data-testid="essentials-info-banner">
            <div className="bg-[#36bff9] text-white text-center py-2 text-sm font-medium">
              Your Office Package
            </div>
            <div className="p-4">
              <div className="mb-3">
                <h3 className="text-base font-medium text-gray-900">{displayBundleName}</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">${selectedBundle.price}</span>
                <span className="text-gray-500 text-sm ml-1">/mo</span>
              </div>
              <div className="space-y-2">
                {Object.entries(selectedBundle.features)
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

          <div className="rounded-xl overflow-hidden" data-testid="bundle-upgrade-section">
            <div
              className="relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0f1c2e 0%, #1a2d4a 40%, #1e3a5f 70%, #1a2d4a 100%)',
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(54, 191, 249, 0.4) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 20%, rgba(54, 191, 249, 0.3) 0%, transparent 40%),
                                    radial-gradient(circle at 60% 80%, rgba(42, 168, 224, 0.2) 0%, transparent 40%)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2336bff9' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div className="relative p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-[#36bff9]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">Bundle & Save</h2>
                    <p className="text-xs sm:text-sm text-blue-200/80">Supercharge your office with premium features</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {upgradeBundles.map((bundle) => {
                    const isSelected = selectedBundle.id === bundle.id;
                    return (
                      <div
                        key={bundle.id}
                        onClick={() => setSelectedBundle(bundle)}
                        className={`rounded-xl overflow-hidden flex flex-col transition-all cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-[#36bff9] shadow-lg shadow-[#36bff9]/20'
                            : 'hover:shadow-lg hover:shadow-white/5'
                        }`}
                        style={{
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(54,191,249,0.15) 0%, rgba(30,58,95,0.9) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                          border: isSelected ? '1px solid rgba(54,191,249,0.4)' : '1px solid rgba(255,255,255,0.1)',
                        }}
                        data-testid={`bundle-card-${bundle.id}`}
                      >
                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#36bff9]">
                              {bundle.badge}
                            </span>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full px-2 py-0.5">
                                <Check className="h-3 w-3" />
                                Active
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-white mb-1">
                            {bundle.tier}
                          </h3>

                          <div className="mb-4">
                            <span className="text-3xl font-bold text-white">${bundle.price}</span>
                            {bundle.originalPrice && (
                              <span className="text-sm text-gray-400 line-through ml-2">
                                ${bundle.originalPrice}
                              </span>
                            )}
                            <span className="text-gray-400 text-sm ml-1">/mo</span>
                          </div>

                          <div className="space-y-2 flex-1">
                            {Object.entries(bundle.features)
                              .filter(([, enabled]) => enabled)
                              .map(([key]) => (
                                <div key={key} className="flex items-center gap-2 text-sm">
                                  <div className="w-4 h-4 rounded-full bg-[#36bff9]/20 flex items-center justify-center flex-shrink-0">
                                    <Check className="h-2.5 w-2.5 text-[#36bff9]" />
                                  </div>
                                  <span className="text-white text-xs">{featureLabels[key]}</span>
                                </div>
                              ))}
                          </div>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBundle(bundle);
                            }}
                            className={`mt-4 w-full ${
                              isSelected
                                ? 'bg-[#36bff9] hover:bg-[#2aa8e0] text-white'
                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                            }`}
                            data-testid={`button-select-bundle-${bundle.id}`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Selected
                              </>
                            ) : (
                              'Select'
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedBundle.id !== 'essentials' && (
                  <button
                    onClick={() => setSelectedBundle(bundles[0])}
                    className="mt-4 text-sm text-blue-300/70 hover:text-blue-200 underline underline-offset-2"
                    data-testid="button-revert-essentials"
                  >
                    Revert to The Essentials ($99/mo)
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div>
              <p className="text-sm font-semibold text-gray-900" data-testid="modal-package-name">{displayBundleName}</p>
              <p className="text-lg font-bold text-gray-900" data-testid="modal-monthly-total">
                ${selectedBundle.price}<span className="text-sm font-normal text-gray-500">/mo</span>
              </p>
            </div>
            <Button
              onClick={() => onConfirm(selectedBundle)}
              className="h-10 px-6 bg-[#36bff9] hover:bg-[#2aa8e0] text-white"
              data-testid="button-confirm-plan"
            >
              Confirm Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
