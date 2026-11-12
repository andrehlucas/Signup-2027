'use client';

import { Check } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { Divider } from '@astryxdesign/core/Divider';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { ScrollableArea } from '@astryxdesign/core/ScrollableArea';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { tierScope } from '../bundle-theme';
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
    <Dialog
      isOpen={open}
      onOpenChange={onOpenChange}
      width={512}
      maxHeight="calc(100dvh - 2rem)"
      data-testid="bundle-suggestion-modal"
    >
      <VStack gap={4} style={suggestion ? tierScope(suggestion.bundle.id) : undefined}>
        <DialogHeader title={title} subtitle={description} onOpenChange={onOpenChange} />

        {/* Scrolls on short screens so the title and actions stay visible. */}
        <ScrollableArea label="Bundle suggestion details" overscroll="contain" className="max-h-[min(28rem,35dvh)]">
        {suggestion ? (
          <VStack gap={4}>
            <Grid columns={2} gap={4} role="group" aria-label="Monthly total comparison">
              <VStack gap={1}>
                <Text type="supporting" color="secondary">Your current setup</Text>
                <Text size="2xl" weight="bold" hasTabularNumbers data-testid="suggestion-current-total">
                  {formatCurrency(currentMonthly)}<Text type="supporting" color="secondary"> /mo</Text>
                </Text>
              </VStack>
              <VStack gap={1}>
                <Text type="supporting" weight="semibold" color="accent">With {suggestion.bundle.tier}</Text>
                <Text size="2xl" weight="bold" hasTabularNumbers data-testid="suggestion-upgraded-total">
                  {formatCurrency(upgradedMonthly)}<Text type="supporting" color="secondary"> /mo</Text>
                </Text>
                {upgradedMonthly > suggestion.bundle.price && (
                  <Text type="supporting" color="secondary">
                    {formatCurrency(suggestion.bundle.price)} bundle + {formatCurrency(upgradedMonthly - suggestion.bundle.price)} other monthly extras
                  </Text>
                )}
              </VStack>
            </Grid>

            <Divider />

            <VStack as="section" gap={2}>
              <Heading level={3}>Add-ons included in this bundle</Heading>
              <VStack as="ul" gap={2} data-testid="suggestion-included-addons">
                {suggestion.matchingAddons.map((addon) => (
                  <HStack as="li" key={addon.id} gap={2} vAlign="start" data-testid={`suggestion-addon-${addon.id}`}>
                    <Icon icon={Check} size="sm" color="secondary" />
                    <StackItem size="fill">
                      <Text type="supporting">{addon.name}</Text>
                    </StackItem>
                    <Text type="supporting" color="secondary">Included</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>

            {suggestion.bonusFeatures.length > 0 && (
              <VStack as="section" gap={2}>
                <Heading level={3}>Also included</Heading>
                <VStack as="ul" gap={2}>
                  {suggestion.bonusFeatures.map((feature) => (
                    <HStack as="li" key={feature} gap={2} vAlign="start">
                      <Icon icon={Check} size="sm" color="accent" />
                      <Text type="supporting">{bonusFeatureLabel(feature)}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            )}
          </VStack>
        ) : (
          <Text>
            Your current monthly total is {formatCurrency(currentMonthly)}/mo. You can keep this plan or review the available bundles.
          </Text>
        )}
        </ScrollableArea>

        <VStack gap={2}>
          <Grid columns={{ minWidth: 180, max: 2 }} gap={2}>
            <Button
              type="button"
              variant="primary"
              label={suggestion ? `Continue with ${suggestion.bundle.tier}` : 'Upgrade unavailable'}
              width="100%"
              isDisabled={!suggestion}
              onClick={onUpgrade}
              data-testid="button-suggestion-proceed-bundle"
            />
            <Button
              type="button"
              variant="secondary"
              label="Keep current setup"
              width="100%"
              onClick={onKeepCurrent}
              data-testid="button-suggestion-dismiss"
            />
          </Grid>
          <Button
            type="button"
            variant="ghost"
            label="Compare all bundles"
            width="100%"
            onClick={onCompare}
            data-testid="button-suggestion-see-bundles"
          />
        </VStack>
      </VStack>
    </Dialog>
  );
}
