'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import { MapPin, Package, Phone, Plus, Trash2, CreditCard, FileText, Check, Lock, Clock, HelpCircle, Tag, X } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { Divider } from '@astryxdesign/core/Divider';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from '@astryxdesign/core/Icon';
import { IconButton } from '@astryxdesign/core/IconButton';
import { Popover } from '@astryxdesign/core/Popover';
import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';
import { StackItem } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';
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
    'appointmentMaking',
  ];
  
  for (const feature of addonFeatures) {
    if (bundle.features[feature]) {
      included.push({ name: feature, label: featureLabels[feature] });
    }
  }
  
  return included;
}

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

/** Section card with an icon heading, shared by every checkout section. */
function Section({ title, icon, testId, children }: { title: string; icon?: LucideIcon; testId: string; children: ReactNode }) {
  return (
    <Card className="signup-surface md:p-6" padding={5} data-testid={testId}>
      <VStack gap={4}>
        <HStack gap={2} vAlign="center">
          {icon && <Icon icon={icon} color="secondary" />}
          <Heading level={2}>{title}</Heading>
        </HStack>
        {children}
      </VStack>
    </Card>
  );
}

/** Soft success row (included items, applied promo, term savings). */
const successRow = 'rounded-[var(--radius-element)] bg-[var(--color-success-muted)] px-3 py-2';
const successText = 'text-[var(--color-on-success-muted)]';

interface PromoCodeFieldProps {
  suffix: '' | '-top';
  appliedPromo: AppliedPromo | null;
  promoCode: string;
  promoError: string;
  isValidating: boolean;
  onChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
}

/** Promo entry / applied state. Rendered in the main column and the summary. */
function PromoCodeField({ suffix, appliedPromo, promoCode, promoError, isValidating, onChange, onApply, onRemove }: PromoCodeFieldProps) {
  if (appliedPromo) {
    return (
      <HStack gap={2} vAlign="center" className={successRow}>
        <Icon icon={Tag} size="sm" className={successText} />
        <StackItem size="fill">
          <VStack gap={0}>
            <Text type="supporting" weight="semibold" color="inherit" className={successText}>{appliedPromo.code}</Text>
            <Text type="supporting" color="inherit" className={successText}>{appliedPromo.description}</Text>
          </VStack>
        </StackItem>
        <IconButton
          variant="ghost"
          size="sm"
          label={`Remove promo code ${appliedPromo.code}`}
          icon={<Icon icon={X} size="sm" />}
          onClick={onRemove}
          data-testid={`button-remove-promo${suffix}`}
        />
      </HStack>
    );
  }
  return (
    <HStack gap={2} vAlign="start">
      <StackItem size="fill">
        <TextInput
          id={`promo-code${suffix}`}
          label="Promo code"
          isLabelHidden
          placeholder="Enter promo code"
          value={promoCode}
          onChange={onChange}
          onEnter={onApply}
          autoCapitalize="characters"
          hasSpellCheck={false}
          status={promoError ? { type: 'error', message: promoError } : undefined}
          data-testid={`input-promo-code${suffix}`}
        />
      </StackItem>
      <StackItem size="static">
        <Button
          type="button"
          variant="secondary"
          label="Apply"
          isLoading={isValidating}
          isDisabled={!promoCode.trim() || isValidating}
          onClick={onApply}
          data-testid={`button-apply-promo${suffix}`}
        />
      </StackItem>
    </HStack>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { order, removeAddon, setAgreementAccepted, setAppliedPromo, getCartTotal } = useOrder();
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
  const [paymentTerm, setPaymentTerm] = useState<PaymentTerm>(1);
  const { trackComplete } = useFunnelTracking('checkout');
  
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

  const promoProps = {
    appliedPromo: order.appliedPromo,
    promoCode,
    promoError,
    isValidating: isValidatingPromo,
    onChange: (value: string) => {
      setPromoCode(value.toUpperCase());
      setPromoError('');
    },
    onApply: handleApplyPromo,
    onRemove: handleRemovePromo,
  };
  const bundleExtras = Object.entries(order.bundle.features)
    .filter(([key, included]) => {
      const base = ['businessAddress', 'liveCallAnswering', 'callTransferring', 'businessPhoneFax', 'mailReceipt', 'voicemailToEmail'];
      return included && !base.includes(key);
    })
    .map(([key]) => featureLabels[key]);

  return (
    <VStack className="signup-shell p-4 lg:p-8" hAlign="center" data-testid="checkout-page">
      <VStack gap={6} width="100%" maxWidth={1152}>
        <ProgressIndicator currentStep={4} />

        <VStack gap={2}>
          <Heading level={1} justify="center" data-testid="heading-checkout">Complete Your Order</Heading>
          <Text color="secondary" justify="center">Review your selections and complete checkout</Text>
        </VStack>

        {/* One column on phones; on large screens a 2:1 split with a sticky summary. */}
        <Grid columns={1} gap={6} className="lg:grid-cols-3 lg:items-start">
          <VStack gap={6} className="min-w-0 lg:col-span-2">
            <Section title="Order Summary" testId="order-summary-section">
              <VStack gap={4}>
                {[
                  {
                    icon: MapPin,
                    title: 'Location',
                    lines: [order.location.name, order.location.address, order.location.addressLine2, `${order.location.city}, ${order.location.stateCode} ${order.location.zipCode}`],
                    end: null as ReactNode,
                  },
                  {
                    icon: Package,
                    title: 'Office Package',
                    lines: [`${order.bundle.name} ${order.bundle.tier !== 'The Essentials' ? order.bundle.tier : ''}`],
                    end: (
                      <VStack gap={0} hAlign="end">
                        <Text weight="semibold" hasTabularNumbers>${order.bundle.price}/mo</Text>
                        {order.bundle.originalPrice && (
                          <Text type="supporting" color="secondary" hasStrikethrough>${order.bundle.originalPrice}/mo</Text>
                        )}
                      </VStack>
                    ),
                  },
                  {
                    icon: Phone,
                    title: 'Phone Number',
                    lines: [order.phoneNumber.number, 'Local number'],
                    end: <Text weight="semibold" className="text-[var(--color-text-success)]">Included</Text>,
                  },
                ].map(row => (
                  <VStack key={row.title} gap={4}>
                    <HStack gap={3} vAlign="start">
                      <VStack hAlign="center" vAlign="center" className="h-10 w-10 shrink-0 rounded-[var(--radius-element)] bg-[var(--color-background-muted)]">
                        <Icon icon={row.icon} color="secondary" />
                      </VStack>
                      <StackItem size="fill">
                        <VStack gap={0}>
                          <Text weight="medium">{row.title}</Text>
                          {row.lines.filter(Boolean).map((line, index) => (
                            <Text key={index} type="supporting" color="secondary">{line}</Text>
                          ))}
                        </VStack>
                      </StackItem>
                      {row.end}
                    </HStack>
                    <Divider />
                  </VStack>
                ))}

                <VStack gap={3}>
                  <HStack gap={2} vAlign="center">
                    <Icon icon={Plus} size="sm" />
                    <Text weight="medium">Add-ons</Text>
                  </HStack>
                  <VStack gap={2}>
                    {bundleIncludedAddons.map((addon) => (
                      <HStack key={addon.name} gap={2} vAlign="center" className={successRow}>
                        <Icon icon={Check} size="sm" className={successText} />
                        <StackItem size="fill"><Text type="supporting" weight="medium">{addon.label}</Text></StackItem>
                        <Text type="supporting" weight="medium" color="inherit" className={successText}>Included</Text>
                      </HStack>
                    ))}
                    {order.addons.map((addon) => (
                      <HStack key={addon.id} gap={2} vAlign="center" className="rounded-[var(--radius-element)] bg-[var(--color-background-muted)] py-1 pl-3 pr-1">
                        <StackItem size="fill"><Text type="supporting" weight="medium">{addon.name}</Text></StackItem>
                        <Text type="supporting" weight="medium" hasTabularNumbers>${addon.price}/mo</Text>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          label={`Remove ${addon.name}`}
                          icon={<Icon icon={Trash2} size="sm" className="text-[var(--color-text-error)]" />}
                          onClick={() => handleRemoveAddon(addon.id)}
                          data-testid={`button-remove-addon-${addon.id}`}
                        />
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </VStack>
            </Section>

            <Section title="Promo Code" icon={Tag} testId="promo-code-section">
              <PromoCodeField suffix="-top" {...promoProps} />
            </Section>

            <Section title="Payment Term" icon={Clock} testId="payment-term-section">
              <Text color="secondary">Choose your billing cycle and save with longer terms</Text>
              <RadioList
                label="Payment term"
                isLabelHidden
                value={String(paymentTerm)}
                onChange={(value) => setPaymentTerm(Number(value) as PaymentTerm)}
              >
                {paymentTermOptions.map((option) => (
                  <RadioListItem
                    key={option.months}
                    value={String(option.months)}
                    label={option.label}
                    description={option.badge}
                    data-testid={`payment-term-${option.months}`}
                  />
                ))}
              </RadioList>
              {termSavings > 0 && (
                <HStack gap={2} vAlign="center" className={successRow}>
                  <Icon icon={Check} size="sm" className={successText} />
                  <Text type="supporting" weight="medium" color="inherit" className={successText}>
                    You save ${termSavings} with the {paymentTerm}-month plan!
                  </Text>
                </HStack>
              )}
            </Section>

            <Section title="Payment Method" icon={CreditCard} testId="payment-method-section">
              <Card variant="muted" padding={3}>
                <HStack gap={3} vAlign="center">
                  <Icon icon={CreditCard} />
                  <VStack gap={0}>
                    <Text weight="medium">Credit / Debit Card</Text>
                    <Text type="supporting" color="secondary">Visa, Mastercard, Amex</Text>
                  </VStack>
                </HStack>
              </Card>

              <VStack gap={4}>
                <TextInput
                  id="cardholderName"
                  label="Cardholder Name"
                  placeholder="John Doe"
                  autoComplete="cc-name"
                  value={cardholderName}
                  onChange={setCardholderName}
                  data-testid="input-cardholder-name"
                />
                <TextInput
                  id="cardNumber"
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  startIcon={Lock}
                  value={cardNumber}
                  onChange={(value) => {
                    const digits = value.replace(/\D/g, '').slice(0, 16);
                    setCardNumber(digits.replace(/(\d{4})(?=\d)/g, '$1 '));
                  }}
                  data-testid="input-card-number"
                />
                <Grid columns={2} gap={4}>
                  <TextInput
                    id="expiryDate"
                    label="Expiry Date"
                    placeholder="MM/YY"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={expiryDate}
                    onChange={(value) => {
                      const digits = value.replace(/\D/g, '').slice(0, 4);
                      setExpiryDate(digits.length >= 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits);
                    }}
                    data-testid="input-expiry-date"
                  />
                  <TextInput
                    id="cvv"
                    label="CVV"
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={cvv}
                    onChange={(value) => setCvv(value.replace(/\D/g, '').slice(0, 4))}
                    data-testid="input-cvv"
                  />
                </Grid>

                <Divider />
                <Heading level={3}>Billing Address</Heading>
                <TextInput
                  id="billingAddress"
                  label="Street Address"
                  placeholder="123 Main Street"
                  autoComplete="billing street-address"
                  value={billingAddress}
                  onChange={setBillingAddress}
                  data-testid="input-billing-address"
                />
                <Grid columns={2} gap={4}>
                  <TextInput
                    id="billingCity"
                    label="City"
                    placeholder="New York"
                    autoComplete="billing address-level2"
                    value={billingCity}
                    onChange={setBillingCity}
                    data-testid="input-billing-city"
                  />
                  <TextInput
                    id="billingState"
                    label="State"
                    placeholder="NY"
                    autoComplete="billing address-level1"
                    value={billingState}
                    onChange={(value) => setBillingState(value.toUpperCase().slice(0, 2))}
                    data-testid="input-billing-state"
                  />
                  <TextInput
                    id="billingZip"
                    label="ZIP Code"
                    placeholder="10001"
                    inputMode="numeric"
                    autoComplete="billing postal-code"
                    value={billingZip}
                    onChange={(value) => setBillingZip(value.replace(/\D/g, '').slice(0, 5))}
                    data-testid="input-billing-zip"
                  />
                </Grid>

                <CheckboxInput
                  id="saveCard"
                  label="Save this card for future purchases"
                  value={saveCard}
                  onChange={setSaveCard}
                  data-testid="checkbox-save-card"
                />
                <HStack gap={1} vAlign="center">
                  <Icon icon={Lock} size="sm" color="secondary" />
                  <Text type="supporting" color="secondary">Your payment information is encrypted and secure</Text>
                </HStack>
              </VStack>
            </Section>

            <Section title="Terms & Agreements" icon={FileText} testId="agreement-section">
              <VStack gap={3} id="agreement-text">
                <Text type="supporting" color="secondary">
                  I, <Text weight="medium" color="inherit">(Full name)</Text> of <Text weight="medium" color="inherit">(Company Name)</Text> agree to subscribe to the OPUS VIRTUAL OFFICES VIRTUAL OFFICE PROGRAM as stated above. I understand that my {paymentTerm === 1 ? 'monthly recurring charges must be paid in advance' : `${paymentTerm}-month term payment is due upfront`} and that services will be billed 5 business days prior to its {paymentTerm === 1 ? 'monthly' : 'term'} due date. Late payment may result in suspension of service and may be subject to a US$50 reinstatement fee.
                </Text>
                <Text type="supporting" color="secondary">
                  This agreement is for an initial {paymentTerm} month{paymentTerm > 1 ? 's' : ''} term. After the initial term this agreement shall automatically renew on a {paymentTerm === 1 ? 'month to month' : `${paymentTerm}-month`} basis provided CLIENT does not give OPUS written notice of cancellation at least 30 days prior to the term renewal. In the event Opus Virtual Offices is required to employ an attorney to enforce any provision of this Agreement; Client shall pay to Opus Virtual Offices, all attorney fees and court costs incurred.
                </Text>
              </VStack>
              <CheckboxInput
                id="agreement"
                label="I agree to the terms above"
                aria-describedby="agreement-text"
                isRequired
                value={order.agreementAccepted}
                onChange={setAgreementAccepted}
                data-testid="checkbox-agreement"
              />
            </Section>
          </VStack>

          <VStack className="lg:sticky lg:top-6">
            <Card className="signup-surface md:p-6" padding={5} data-testid="payment-summary">
              <VStack gap={4}>
                <Heading level={2}>Payment Summary</Heading>

                <VStack gap={3}>
                  <HStack gap={2} hAlign="between" vAlign="center">
                    <HStack gap={1} vAlign="center">
                      <Text type="supporting" color="secondary">Office Package ({order.bundle.tier})</Text>
                      <Popover
                        label={`What's included in ${order.bundle.tier}`}
                        padding={4}
                        width={288}
                        data-testid="bundle-breakdown-popover"
                        content={
                          <VStack gap={3}>
                            <Text type="supporting" weight="semibold">All Plans Include</Text>
                            <VStack as="ul" gap={2}>
                              {[
                                'Prestigious Business Address',
                                'Live Call Answering',
                                'Call Transferring',
                                '2 Voicemail Boxes',
                                'Business Phone/Fax Number',
                                'Voicemail/Fax Converted to Email',
                              ].map((feature) => (
                                <HStack as="li" key={feature} gap={2} vAlign="start">
                                  <Icon icon={Check} size="sm" color="secondary" />
                                  <Text type="supporting">{feature}</Text>
                                </HStack>
                              ))}
                            </VStack>
                            {bundleExtras.length > 0 && (
                              <>
                                <Divider />
                                <Text type="supporting" weight="semibold">Included in {order.bundle.tier} Bundle</Text>
                                <VStack as="ul" gap={2}>
                                  {bundleExtras.map((label) => (
                                    <HStack as="li" key={label} gap={2} vAlign="start">
                                      <Icon icon={Check} size="sm" color="secondary" />
                                      <Text type="supporting">{label}</Text>
                                    </HStack>
                                  ))}
                                </VStack>
                              </>
                            )}
                          </VStack>
                        }
                      >
                        <IconButton
                          variant="ghost"
                          size="sm"
                          label={`What's included in ${order.bundle.tier}`}
                          icon={<Icon icon={HelpCircle} size="sm" />}
                          data-testid="bundle-breakdown-trigger"
                        />
                      </Popover>
                    </HStack>
                    <Text type="supporting" weight="medium" hasTabularNumbers>${order.bundle.price}/mo</Text>
                  </HStack>
                  {order.addons.map((addon) => (
                    <HStack key={addon.id} gap={2} hAlign="between">
                      <Text type="supporting" color="secondary">{addon.name}</Text>
                      <Text type="supporting" weight="medium" hasTabularNumbers>${addon.price}/mo</Text>
                    </HStack>
                  ))}
                </VStack>

                <Divider />
                <PromoCodeField suffix="" {...promoProps} />
                <Divider />

                <VStack gap={2}>
                  <HStack gap={2} hAlign="between">
                    <Text color="secondary">Monthly Rate</Text>
                    <Text weight="semibold" hasTabularNumbers>${monthly}/mo</Text>
                  </HStack>
                  <HStack gap={2} hAlign="between">
                    <Text color="secondary">Billing Term</Text>
                    <Text weight="semibold">{paymentTerm} month{paymentTerm > 1 ? 's' : ''}</Text>
                  </HStack>
                  {termSavings > 0 && (
                    <HStack gap={2} hAlign="between" className="text-[var(--color-text-success)]">
                      <Text color="inherit">Discount ({selectedTermOption.freeMonths} month{selectedTermOption.freeMonths > 1 ? 's' : ''} free)</Text>
                      <Text weight="semibold" color="inherit" hasTabularNumbers>-${termSavings}</Text>
                    </HStack>
                  )}
                  {promoDiscount > 0 && (
                    <HStack gap={2} hAlign="between" className="text-[var(--color-text-success)]">
                      <HStack gap={1} vAlign="center">
                        <Icon icon={Tag} size="sm" color="inherit" />
                        <Text color="inherit">Promo: {order.appliedPromo?.code}</Text>
                      </HStack>
                      <Text weight="semibold" color="inherit" hasTabularNumbers>-${promoDiscount}</Text>
                    </HStack>
                  )}
                  {oneTime > 0 && (
                    <HStack gap={2} hAlign="between">
                      <Text color="secondary">One-time Fees</Text>
                      <Text weight="semibold" hasTabularNumbers>${oneTime}</Text>
                    </HStack>
                  )}
                </VStack>

                <Divider />

                <VStack gap={1}>
                  <HStack gap={2} hAlign="between" vAlign="center">
                    <Text size="lg" weight="semibold">Due Today</Text>
                    <Text size="2xl" weight="bold" hasTabularNumbers>${totalDueToday}</Text>
                  </HStack>
                  {paymentTerm > 1 && (
                    <Text type="supporting" color="secondary">Effective rate: ${effectiveMonthlyRate}/mo</Text>
                  )}
                  <Text type="supporting" color="secondary">
                    {paymentTerm === 1
                      ? `Then $${monthly}/mo starting next billing cycle`
                      : `Next payment: $${termTotal} in ${paymentTerm} months`}
                  </Text>
                </VStack>

                <Button
                  type="button"
                  variant="primary"
                  label={isProcessing ? 'Processing...' : 'Complete Checkout'}
                  icon={isProcessing ? undefined : <Icon icon={CreditCard} size="sm" />}
                  isLoading={isProcessing}
                  isDisabled={!order.agreementAccepted || isProcessing}
                  onClick={handleCheckout}
                  width="100%"
                  data-testid="button-complete-checkout"
                />
                <Text type="supporting" color="secondary" justify="center">
                  Secure payment processed by our payment provider
                </Text>
              </VStack>
            </Card>
          </VStack>
        </Grid>
      </VStack>
    </VStack>
  );
}
