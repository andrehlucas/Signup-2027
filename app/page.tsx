'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { Field } from '@astryxdesign/core/Field';
import { FormLayout } from '@astryxdesign/core/FormLayout';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { VStack } from '@astryxdesign/core/VStack';
import { ContactPhoneInput } from './components/ContactPhoneInput';
import { getCountryCallingCode, type E164Number } from 'libphonenumber-js/max';
import { phoneCountries, phoneCountry, phoneValue, nationalPhone, phoneExample } from './lib/phone';
import { SIGNUP_LIMITS, validateSignup, type SignupField } from './lib/signup-validation';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from './add-location/components/ProgressIndicator';
import { useOrder } from './add-location/context';
import { useFunnelTracking } from './hooks/use-funnel-tracking';

// Astryx TextInput has no maxLength prop; set it on the native input so
// typing stops at the limit (validateSignup enforces it as well).
const maxLength = (limit: number) => (input: HTMLInputElement | null) => {
  if (input) input.maxLength = limit;
};

const errorStatus = (message: string | undefined) =>
  message ? { type: 'error' as const, message } : undefined;

// The phone composite (native country select + formatted tel input) stays
// custom, so it is styled with the same Astryx tokens the TextInputs use.
const phoneControl =
  'h-[var(--size-element-md)] border bg-[var(--color-background-surface)] text-[length:var(--text-body-size)] md:text-[length:var(--text-body-size)] text-[var(--color-text-primary)] ' +
  'focus-visible:outline focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)] focus-visible:ring-0';
const phoneBorder = (hasError: boolean) =>
  hasError ? 'border-[var(--color-border-error)]' : 'border-[var(--color-border-emphasized)]';

export default function SignUpPage() {
  const router = useRouter();
  const { order, setUserInfo } = useOrder();

  const initialCountryRegion = phoneCountry(order.userInfo.countryRegion || 'US');
  const [firstName, setFirstName] = useState(order.userInfo.firstName);
  const [lastName, setLastName] = useState(order.userInfo.lastName);
  const [phone, setPhone] = useState<E164Number | undefined>(() => phoneValue(order.userInfo.phone, initialCountryRegion));
  const [countryRegion, setCountryRegion] = useState(initialCountryRegion);
  const countryCode = `+${getCountryCallingCode(countryRegion)}`;
  const [email, setEmail] = useState(order.userInfo.email);
  const [confirmEmail, setConfirmEmail] = useState(order.userInfo.confirmEmail);
  const [company, setCompany] = useState(order.userInfo.company);
  const [termsAccepted, setTermsAccepted] = useState(order.userInfo.termsAccepted);
  const [touched, setTouched] = useState<Partial<Record<SignupField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const validationErrors = validateSignup({ firstName, lastName, phone, countryRegion, email, confirmEmail, company, termsAccepted });
  const errors = Object.fromEntries(
    Object.entries(validationErrors).filter(([field]) => submitted || touched[field as SignupField])
  );
  const markTouched = (field: SignupField) => setTouched(current => ({ ...current, [field]: true }));
  const { trackComplete } = useFunnelTracking('your_info');

  useEffect(() => {
    setUserInfo({ firstName, lastName, phone: nationalPhone(phone, countryRegion), countryRegion, countryCode, email, confirmEmail, company, termsAccepted });
  }, [firstName, lastName, phone, countryRegion, countryCode, email, confirmEmail, company, termsAccepted, setUserInfo]);

  const selectedCountry = phoneCountries.find((country) => country.region === countryRegion)!;
  const examplePhone = phoneExample(countryRegion);

  const handleContinue = () => {
    setSubmitted(true);
    const firstError = Object.keys(validationErrors)[0] as SignupField | undefined;
    if (firstError) {
      const fieldIds: Record<SignupField, string> = {
        firstName: 'first-name', lastName: 'last-name', phone: 'phone-number',
        email: 'email-address', confirmEmail: 'confirm-email', company: 'company-name', terms: 'terms',
      };
      requestAnimationFrame(() => document.getElementById(fieldIds[firstError])?.focus());
      return;
    }

    setUserInfo({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: nationalPhone(phone, countryRegion),
      countryCode,
      countryRegion,
      email: email.trim(),
      confirmEmail: confirmEmail.trim(),
      company: company.trim(),
      termsAccepted,
    });

    trackComplete();
    router.push('/add-location');
  };

  return (
    <VStack className="signup-shell p-4 lg:p-8" hAlign="center" data-testid="signup-page">
      <VStack gap={6} width="100%" maxWidth={672}>
        <VStack gap={2}>
          <Heading level={1} justify="center" data-testid="heading-signup">
            Set up your virtual office
          </Heading>
          <Text color="secondary" justify="center">
            Enter your business contact details to begin enrollment.
          </Text>
        </VStack>

        <ProgressIndicator currentStep={1} />

        <Card className="signup-surface md:p-8" padding={5}>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              handleContinue();
            }}
          >
            <FormLayout defaultOptionality="required">
              <Grid columns={{ minWidth: 240 }} gap={4}>
                <TextInput
                  id="first-name"
                  htmlName="given-name"
                  label="First name"
                  ref={maxLength(SIGNUP_LIMITS.name)}
                  autoCapitalize="words"
                  hasSpellCheck={false}
                  value={firstName}
                  onChange={setFirstName}
                  onBlur={() => markTouched('firstName')}
                  autoComplete="given-name"
                  status={errorStatus(errors.firstName)}
                  data-testid="input-first-name"
                />
                <TextInput
                  id="last-name"
                  htmlName="family-name"
                  label="Last name"
                  ref={maxLength(SIGNUP_LIMITS.name)}
                  autoCapitalize="words"
                  hasSpellCheck={false}
                  value={lastName}
                  onChange={setLastName}
                  onBlur={() => markTouched('lastName')}
                  autoComplete="family-name"
                  status={errorStatus(errors.lastName)}
                  data-testid="input-last-name"
                />
              </Grid>

              <Field label="Phone number" inputID="phone-number" status={errorStatus(errors.phone)}>
                <div className="flex flex-col gap-2 min-[380px]:flex-row min-[380px]:gap-0">
                  <div className="relative w-full min-[380px]:w-36 min-[380px]:shrink-0">
                  <select
                    id="country-region"
                    value={countryRegion}
                    onChange={(event) => {
                      const region = phoneCountry(event.target.value);
                      const national = nationalPhone(phone, countryRegion);
                      setCountryRegion(region);
                      setPhone(phoneValue(national, region));
                    }}
                    aria-label={`Country and calling code: ${selectedCountry.name} (${countryCode})`}
                    className={`${phoneControl} ${phoneBorder(Boolean(errors.phone))} w-full appearance-none rounded-[var(--radius-element)] !bg-[var(--color-background-muted)] pl-3 pr-10 min-[380px]:rounded-r-none min-[380px]:border-r-0`}
                    data-testid="select-country-region"
                  >
                    {phoneCountries.map((country) => (
                      <option key={country.region} value={country.region} aria-label={`${country.name} (${country.code})`} data-testid={`option-country-${country.region}`}>
                        {country.flag} {country.region} ({country.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-secondary)]"
                  />
                  </div>
                  <ContactPhoneInput
                    id="phone-number"
                    name="phone"
                    required
                    country={countryRegion}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onPhoneChange={(entry) => {
                      setCountryRegion(entry.country);
                      setPhone(entry.value);
                    }}
                    onBlur={() => markTouched('phone')}
                    placeholder={examplePhone}
                    autoComplete="tel"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-invalid={Boolean(errors.phone)}
                    // <Field> renders its status message as `${inputID}-status`.
                    aria-describedby={errors.phone ? 'phone-number-status' : undefined}
                    className={`${phoneControl} ${phoneBorder(Boolean(errors.phone))} flex-1 min-w-0 rounded-[var(--radius-element)] px-3 shadow-none min-[380px]:rounded-l-none`}
                    data-testid="input-phone"
                  />
                </div>
              </Field>

              <TextInput
                id="email-address"
                htmlName="email"
                label="Email address"
                type="email"
                inputMode="email"
                ref={maxLength(SIGNUP_LIMITS.email)}
                autoCapitalize="none"
                hasAutoCorrect={false}
                hasSpellCheck={false}
                value={email}
                onChange={setEmail}
                onBlur={() => markTouched('email')}
                autoComplete="email"
                status={errorStatus(errors.email)}
                data-testid="input-email"
              />

              <TextInput
                id="confirm-email"
                htmlName="confirm-email"
                label="Confirm email address"
                type="email"
                inputMode="email"
                ref={maxLength(SIGNUP_LIMITS.email)}
                autoCapitalize="none"
                hasAutoCorrect={false}
                hasSpellCheck={false}
                placeholder="Re-enter your email address"
                value={confirmEmail}
                onChange={setConfirmEmail}
                onBlur={() => markTouched('confirmEmail')}
                autoComplete="off"
                status={errorStatus(errors.confirmEmail)}
                data-testid="input-confirm-email"
              />

              <TextInput
                id="company-name"
                htmlName="organization"
                label="Company name"
                ref={maxLength(SIGNUP_LIMITS.company)}
                value={company}
                onChange={setCompany}
                onBlur={() => markTouched('company')}
                autoComplete="organization"
                status={errorStatus(errors.company)}
                data-testid="input-company"
              />

              <VStack gap={1}>
                <CheckboxInput
                  id="terms"
                  htmlName="terms"
                  label="I agree to the Terms of Use"
                  isRequired
                  value={termsAccepted}
                  onChange={setTermsAccepted}
                  onBlur={() => markTouched('terms')}
                  status={errorStatus(errors.terms)}
                  data-testid="checkbox-terms"
                />
                <Link
                  href="https://www.opusvirtualoffices.com/opus-virtual-offices-terms-of-use/"
                  isExternalLink
                  size="sm"
                  data-testid="link-terms"
                >
                  Read the Terms of Use
                </Link>
              </VStack>

              <Button type="submit" variant="primary" label="Continue" width="100%" data-testid="button-continue" />
            </FormLayout>
          </form>
        </Card>
      </VStack>
    </VStack>
  );
}
