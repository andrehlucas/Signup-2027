'use client';

import { Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import type { Addon, Bundle } from '../types';

export interface BundleSuggestion {
  bundle: Bundle;
  matchingAddons: Addon[];
  savings: number;
  bonusFeatures: string[];
}

interface BundleSuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: BundleSuggestion | null;
  currentMonthly: number;
  upgradedMonthly: number;
  onUpgrade: () => void;
  onKeepCurrent: () => void;
  onCompare: () => void;
}

const tierAccents: Record<string, string> = {
  plus: '#185f58',
  pro: '#345b91',
  premium: '#80591e',
  prestige: '#754965',
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function bonusFeatureLabel(feature: string) {
  return feature.toLowerCase().includes('appointment') && !feature.includes('20/mo')
    ? `${feature} (20/mo)`
    : feature;
}

export function BundleSuggestionDialog({
  open,
  onOpenChange,
  suggestion,
  currentMonthly,
  upgradedMonthly,
  onUpgrade,
  onKeepCurrent,
  onCompare,
}: BundleSuggestionDialogProps) {
  const monthlyDifference = currentMonthly - upgradedMonthly;
  const tierAccent = suggestion ? tierAccents[suggestion.bundle.id] || '#344054' : '#344054';

  const title = !suggestion
    ? 'Bundle suggestion unavailable'
    : monthlyDifference > 0
      ? `Save ${formatCurrency(monthlyDifference)} each month`
      : monthlyDifference === 0
        ? 'Same monthly total. More included.'
        : `This bundle costs ${formatCurrency(Math.abs(monthlyDifference))} more per month`;

  const description = !suggestion
    ? 'Keep your current selection or compare all bundles to review your options.'
    : `${suggestion.bundle.tier} includes the add-ons below in one plan. Your other selections stay the same.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg flex-col gap-0 overflow-hidden border border-gray-200 bg-white p-0 text-gray-900 shadow-xl sm:rounded-xl"
        data-testid="bundle-suggestion-modal"
      >
        <DialogHeader className="shrink-0 border-b border-gray-100 px-5 py-5 pr-12 text-left sm:px-6 sm:pr-12">
          <DialogTitle className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-[58ch] text-sm leading-relaxed text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
          {suggestion ? (
            <>
              <section className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200 pb-4" aria-label="Monthly total comparison">
                <div className="pr-3">
                  <p className="text-xs font-medium leading-5 text-gray-600">Your current setup</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900" data-testid="suggestion-current-total">
                    {formatCurrency(currentMonthly)}
                    <span className="ml-1 text-xs font-medium text-gray-500">/mo</span>
                  </p>
                </div>
                <div className="pl-3">
                  <p className="text-xs font-semibold leading-5" style={{ color: tierAccent }}>With {suggestion.bundle.tier}</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900" data-testid="suggestion-upgraded-total">
                    {formatCurrency(upgradedMonthly)}
                    <span className="ml-1 text-xs font-medium text-gray-500">/mo</span>
                  </p>
                  {upgradedMonthly > suggestion.bundle.price && (
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      {formatCurrency(suggestion.bundle.price)} bundle + {formatCurrency(upgradedMonthly - suggestion.bundle.price)} other monthly extras
                    </p>
                  )}
                </div>
              </section>

              <section className="pt-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Add-ons included in this bundle
                </h3>
                <ul className="divide-y divide-gray-100" data-testid="suggestion-included-addons">
                  {suggestion.matchingAddons.map((addon) => (
                    <li
                      key={addon.id}
                      className="flex items-start gap-2.5 py-2.5 text-sm"
                      data-testid={`suggestion-addon-${addon.id}`}
                    >
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-600" aria-hidden="true" />
                      <span className="min-w-0 break-words leading-snug text-gray-800">
                        {addon.name}
                      </span>
                      <span className="ml-auto flex-shrink-0 text-xs font-medium text-gray-500">
                        Included
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {suggestion.bonusFeatures.length > 0 && (
                <section className="border-t border-gray-100 pt-3">
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">Also included</h3>
                  <ul className="space-y-2">
                    {suggestion.bonusFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: tierAccent }} aria-hidden="true" />
                        <span className="leading-snug text-gray-700">{bonusFeatureLabel(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <p className="text-sm leading-relaxed text-gray-700">
              Your current monthly total is {formatCurrency(currentMonthly)}/mo. You can keep this plan or review the available bundles.
            </p>
          )}
        </div>

        <DialogFooter className="grid shrink-0 grid-cols-1 gap-2 border-t border-gray-100 px-5 py-4 sm:grid-cols-2 sm:space-x-0 sm:px-6">
          <Button
            type="button"
            onClick={onUpgrade}
            disabled={!suggestion}
            className="signup-primary min-h-11 w-full"
            data-testid="button-suggestion-proceed-bundle"
          >
            {suggestion ? `Continue with ${suggestion.bundle.tier}` : 'Upgrade unavailable'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onKeepCurrent}
            className="signup-secondary min-h-11 w-full"
            data-testid="button-suggestion-dismiss"
          >
            Keep current setup
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCompare}
            className="min-h-11 w-full text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 sm:col-span-2"
            data-testid="button-suggestion-see-bundles"
          >
            Compare all bundles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
