'use client';

import { useState, useEffect, type ClipboardEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import PhoneInput from 'react-phone-number-input/input-max';
import { getCountryCallingCode, type E164Number } from 'libphonenumber-js/max';
import { phoneCountries, phoneCountry, phoneValue, nationalPhone, phoneExample, validPhone, pastedPhone } from './lib/phone';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ProgressIndicator } from './add-location/components/ProgressIndicator';
import { useOrder } from './add-location/context';
import { useFunnelTracking } from './hooks/use-funnel-tracking';

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { trackComplete } = useFunnelTracking('your_info');

  useEffect(() => {
    setUserInfo({ firstName, lastName, phone: nationalPhone(phone, countryRegion), countryRegion, countryCode, email, confirmEmail, company, termsAccepted });
  }, [firstName, lastName, phone, countryRegion, countryCode, email, confirmEmail, company, termsAccepted, setUserInfo]);

  const selectedCountry = phoneCountries.find((country) => country.region === countryRegion)!;
  const examplePhone = phoneExample(countryRegion);

  const clearPhoneError = () => {
    setErrors(current => {
      const { phone: _phone, ...remaining } = current;
      return remaining;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validPhone(phone, countryRegion)) {
      newErrors.phone = `Enter a valid phone number for ${selectedCountry.name}${examplePhone ? `, for example ${examplePhone}` : ''}.`;
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!confirmEmail.trim()) {
      newErrors.confirmEmail = 'Please confirm your email';
    } else if (email !== confirmEmail) {
      newErrors.confirmEmail = 'Email addresses do not match';
    }
    if (!company.trim()) newErrors.company = 'Company name is required';
    if (!termsAccepted) newErrors.terms = 'You must agree to the Terms of Use';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

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
    <div className="signup-shell p-4 lg:p-8" data-testid="signup-page">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900" data-testid="heading-signup">
            Set up your virtual office
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Enter your business contact details to begin enrollment.
          </p>
        </div>

        <div className="mb-6">
          <ProgressIndicator currentStep={1} />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="signup-surface p-5 md:p-8">
            <form
              className="space-y-4"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                handleContinue();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`h-12 ${errors.firstName ? 'border-red-500' : ''}`}
                    autoComplete="given-name"
                    aria-invalid={Boolean(errors.firstName)}
                    aria-describedby={errors.firstName ? 'error-first-name' : undefined}
                    data-testid="input-first-name"
                  />
                  {errors.firstName && (
                    <p id="error-first-name" role="alert" className="text-red-600 text-xs mt-1" data-testid="error-first-name">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="last-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`h-12 ${errors.lastName ? 'border-red-500' : ''}`}
                    autoComplete="family-name"
                    aria-invalid={Boolean(errors.lastName)}
                    aria-describedby={errors.lastName ? 'error-last-name' : undefined}
                    data-testid="input-last-name"
                  />
                  {errors.lastName && (
                    <p id="error-last-name" role="alert" className="text-red-600 text-xs mt-1" data-testid="error-last-name">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="phone-number" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone number
                </label>
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
                      clearPhoneError();
                    }}
                    aria-label={`Country and calling code: ${selectedCountry.name} (${countryCode})`}
                    className={`h-12 w-full appearance-none rounded-md border bg-gray-50 pl-3 pr-10 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006d91] min-[380px]:rounded-r-none min-[380px]:border-r-0 ${
                      errors.phone ? 'border-red-500' : 'border-input'
                    }`}
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
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
                  />
                  </div>
                  <PhoneInput
                    id="phone-number"
                    inputComponent={Input}
                    country={countryRegion}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(value) => {
                      setPhone(value);
                      clearPhoneError();
                    }}
                    onPaste={(event: ClipboardEvent<HTMLInputElement>) => {
                      const text = event.clipboardData.getData('text');
                      if (!/^\s*(\+|00)/.test(text)) return;
                      const pasted = pastedPhone(text, countryRegion);
                      if (!pasted) return;
                      event.preventDefault();
                      setCountryRegion(pasted.region);
                      setPhone(pasted.value);
                      clearPhoneError();
                    }}
                    placeholder={examplePhone}
                    autoComplete="tel-national"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'error-phone' : undefined}
                    className={`h-12 rounded-md flex-1 min-w-0 min-[380px]:rounded-l-none ${errors.phone ? 'border-red-500' : ''}`}
                    data-testid="input-phone"
                  />
                </div>
                {errors.phone && (
                  <p id="error-phone" role="alert" className="text-red-600 text-xs mt-1" data-testid="error-phone">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="email-address" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email-address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  data-testid="input-email"
                />
                {errors.email && (
                  <p id="error-email" role="alert" className="text-red-600 text-xs mt-1" data-testid="error-email">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirm-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Confirm email address
                </label>
                <Input
                  id="confirm-email"
                  type="email"
                  placeholder="Re-enter your email address"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className={`h-12 ${errors.confirmEmail ? 'border-red-500' : ''}`}
                  autoComplete="off"
                  aria-invalid={Boolean(errors.confirmEmail)}
                  aria-describedby={errors.confirmEmail ? 'error-confirm-email' : undefined}
                  data-testid="input-confirm-email"
                />
                {errors.confirmEmail && (
                  <p id="error-confirm-email" role="alert" className="text-red-600 text-xs mt-1" data-testid="error-confirm-email">{errors.confirmEmail}</p>
                )}
              </div>

              <div>
                <label htmlFor="company-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Company name
                </label>
                <Input
                  id="company-name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={`h-12 ${errors.company ? 'border-red-500' : ''}`}
                  autoComplete="organization"
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={errors.company ? 'error-company' : undefined}
                  data-testid="input-company"
                />
                {errors.company && (
                  <p id="error-company" role="alert" className="text-red-600 text-xs mt-1" data-testid="error-company">{errors.company}</p>
                )}
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-0.5"
                    aria-invalid={Boolean(errors.terms)}
                    aria-describedby={errors.terms ? 'error-terms' : undefined}
                    data-testid="checkbox-terms"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{' '}
                    <a
                      href="https://www.opusvirtualoffices.com/opus-virtual-offices-terms-of-use/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 underline underline-offset-2 hover:text-gray-950"
                      data-testid="link-terms"
                    >
                      Terms of Use
                    </a>
                    .
                  </label>
                </div>
                {errors.terms && (
                  <p id="error-terms" role="alert" className="text-red-600 text-xs mt-1" data-testid="error-terms">{errors.terms}</p>
                )}
              </div>

              <Button
                type="submit"
                className="signup-primary w-full h-12 text-lg font-semibold"
                data-testid="button-continue"
              >
                Continue
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
