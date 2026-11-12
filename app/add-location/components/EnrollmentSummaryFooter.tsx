'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronRight, Info, MapPin, Phone, ShoppingCart } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { Popover } from '@astryxdesign/core/Popover';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { VisuallyHidden } from '@astryxdesign/core/VisuallyHidden';
import { VStack } from '@astryxdesign/core/VStack';
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
    <VStack
      // Sticky bar chrome: top rule and an upward shadow, from theme tokens.
      className="border-t border-[var(--color-border)] bg-[var(--color-background-surface)] shadow-[0_-4px_12px_var(--color-shadow)]"
      data-testid="sticky-footer"
    >
      <VStack
        gap={3}
        width="100%"
        maxWidth={compactWidth ? 1024 : 1152}
        className="mx-auto py-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <HStack gap={2} hAlign="between" vAlign="start" wrap="wrap">
          <HStack gap={2} vAlign="start" data-testid="footer-office-address">
            <Icon icon={MapPin} size="sm" color="secondary" />
            <Text type="supporting" color="secondary">
              <VisuallyHidden>Office address: </VisuallyHidden>
              {location.address}{location.addressLine2 ? `, ${location.addressLine2}` : ''}, {location.city}, {location.stateCode} {location.zipCode}
            </Text>
          </HStack>
          {phoneNumber && (
            <HStack gap={2} vAlign="center" data-testid="footer-business-phone">
              <Icon icon={Phone} size="sm" color="secondary" />
              <VisuallyHidden>Business phone number: </VisuallyHidden>
              <Text type="supporting" weight="medium" hasTabularNumbers>{phoneNumber.number}</Text>
            </HStack>
          )}
        </HStack>

        <Divider />

        <HStack gap={3} vAlign="center" wrap="wrap">
          {/* Cart mark; pulses when Customize adds an add-on. */}
          <VStack className="relative hidden shrink-0 min-[380px]:flex">
            <motion.div
              animate={pulse ? { scale: [1, 1.3, 0.9, 1.15, 1], rotate: [0, -8, 8, -4, 0] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-element)] bg-[var(--color-background-muted)]"
            >
              <Icon icon={ShoppingCart} size="sm" />
            </motion.div>
            <AnimatePresence>
              {pulse && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 0 }}
                  animate={{ scale: 1, opacity: 1, y: -6 }}
                  exit={{ scale: 0, opacity: 0, y: -12 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-background-surface)] bg-[var(--color-accent)] text-[var(--color-on-accent)]"
                  data-testid="cart-added-badge"
                >
                  <Check className="h-3 w-3" aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </VStack>

          <StackItem size="fill">
            <VStack gap={0}>
              <HStack gap={1} vAlign="center" wrap="wrap">
                <Text weight="semibold" data-testid="footer-package-name">{bundle.tier}</Text>
                <Popover
                  label={`${bundle.tier} includes`}
                  placement="above"
                  alignment="start"
                  padding={4}
                  data-testid="popover-included-features"
                  content={
                    <VStack gap={2}>
                      <Text weight="semibold">{bundle.tier} includes:</Text>
                      <VStack as="ul" gap={2}>
                        {Object.entries(bundle.features).filter(([, enabled]) => enabled).map(([key]) => (
                          <HStack as="li" key={key} gap={2} vAlign="start">
                            <Icon icon={Check} size="sm" color="secondary" />
                            <Text type="supporting">{featureLabels[key] || key}{key === 'appointmentMaking' && ' (20/mo)'}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </VStack>
                  }
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    label="See what's included"
                    aria-label={`See what's included in ${bundle.tier}`}
                    icon={<Icon icon={Info} size="sm" />}
                    data-testid="button-see-included"
                  />
                </Popover>
              </HStack>
              <HStack gap={2} vAlign="center" wrap="wrap">
                <Text size="lg" weight="bold" hasTabularNumbers data-testid="footer-monthly-total">
                  ${monthly}<Text type="supporting" color="secondary">/mo</Text>
                </Text>
                {paidAddons.length > 0 && (
                  <Popover
                    label="Your Add-ons"
                    placement="above"
                    alignment="start"
                    padding={4}
                    data-testid="popover-addon-breakdown"
                    content={
                      <VStack gap={2}>
                        <Text weight="semibold">Your Add-ons</Text>
                        {paidAddons.map(addon => (
                          <HStack key={addon.id} gap={3} hAlign="between" vAlign="start">
                            <Text type="supporting">{addon.name}{addon.selectedPackage ? ` (${addon.selectedPackage.name})` : ''}</Text>
                            <Text type="supporting" weight="medium" hasTabularNumbers>${addon.price}{addon.billingCycle === 'monthly' ? '/mo' : ' one-time'}</Text>
                          </HStack>
                        ))}
                        <Divider />
                        <HStack gap={3} hAlign="between">
                          <Text type="supporting" weight="semibold">Add-ons Total</Text>
                          <Text type="supporting" weight="semibold" hasTabularNumbers>${addonMonthly}/mo</Text>
                        </HStack>
                        {addonOneTime > 0 && <Text type="supporting" color="secondary">One-time add-ons: ${addonOneTime}</Text>}
                      </VStack>
                    }
                  >
                    <Button type="button" variant="ghost" size="sm" label="See details" data-testid="button-see-addons" />
                  </Popover>
                )}
              </HStack>
            </VStack>
          </StackItem>

          {/* Stays at the end when the row wraps on narrow phones. */}
          <StackItem className="ml-auto">
          <Button
            type="button"
            variant="primary"
            label="Continue"
            aria-label={continueLabel}
            endContent={<Icon icon={ChevronRight} size="sm" />}
            onClick={onContinue}
            isDisabled={disabled}
            data-testid={continueTestId}
          />
          </StackItem>
        </HStack>
      </VStack>
    </VStack>
  );
}
