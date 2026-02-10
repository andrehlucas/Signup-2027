'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ProgressIndicator } from './add-location/components/ProgressIndicator';
import { useOrder } from './add-location/context';
import { useFunnelTracking } from './hooks/use-funnel-tracking';

const countryCodes = [
  { code: '+1', flag: '🇺🇸', label: 'US' },
  { code: '+1', flag: '🇨🇦', label: 'CA' },
  { code: '+44', flag: '🇬🇧', label: 'UK' },
  { code: '+61', flag: '🇦🇺', label: 'AU' },
  { code: '+49', flag: '🇩🇪', label: 'DE' },
  { code: '+33', flag: '🇫🇷', label: 'FR' },
  { code: '+81', flag: '🇯🇵', label: 'JP' },
  { code: '+86', flag: '🇨🇳', label: 'CN' },
  { code: '+91', flag: '🇮🇳', label: 'IN' },
  { code: '+52', flag: '🇲🇽', label: 'MX' },
  { code: '+55', flag: '🇧🇷', label: 'BR' },
];

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} - ${digits.slice(6, 10)}`;
}

export default function SignUpPage() {
  const router = useRouter();
  const { order, setUserInfo } = useOrder();

  const [firstName, setFirstName] = useState(order.userInfo.firstName);
  const [lastName, setLastName] = useState(order.userInfo.lastName);
  const [phone, setPhone] = useState(formatPhoneNumber(order.userInfo.phone));
  const [countryCode, setCountryCode] = useState(order.userInfo.countryCode || '+1');
  const [email, setEmail] = useState(order.userInfo.email);
  const [confirmEmail, setConfirmEmail] = useState(order.userInfo.confirmEmail);
  const [company, setCompany] = useState(order.userInfo.company);
  const [termsAccepted, setTermsAccepted] = useState(order.userInfo.termsAccepted);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { trackComplete } = useFunnelTracking('your_info');

  const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.replace(/[\s()-]/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid phone number (at least 7 digits)';
    } else if (phone.replace(/[\s()-]/g, '').length > 15) {
      newErrors.phone = 'Phone number is too long';
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
      phone: phone.replace(/\D/g, ''),
      countryCode,
      email: email.trim(),
      confirmEmail: confirmEmail.trim(),
      company: company.trim(),
      termsAccepted,
    });

    trackComplete();
    router.push('/add-location/customize');
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 lg:p-8" data-testid="signup-page">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900" data-testid="heading-signup">
            You're Only 3 Steps Away From Securing Your New Virtual Office Solution!
          </h1>
        </div>

        <div className="mb-8">
          <ProgressIndicator currentStep={1} />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`h-12 ${errors.firstName ? 'border-red-500' : ''}`}
                    data-testid="input-first-name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1" data-testid="error-first-name">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`h-12 ${errors.lastName ? 'border-red-500' : ''}`}
                    data-testid="input-last-name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1" data-testid="error-last-name">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="relative flex">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className={`flex items-center gap-1.5 h-12 px-3 border border-r-0 rounded-l-md bg-gray-50 hover:bg-gray-100 transition-colors ${errors.phone ? 'border-red-500' : 'border-input'}`}
                      data-testid="button-country-code"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm text-gray-700">{countryCode}</span>
                      <ChevronDown className="h-3 w-3 text-gray-500" />
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 z-50 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto" data-testid="dropdown-country-codes">
                        {countryCodes.map((c, idx) => (
                          <button
                            key={`${c.code}-${c.label}-${idx}`}
                            type="button"
                            onClick={() => {
                              setCountryCode(c.code);
                              setShowCountryDropdown(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left text-sm"
                            data-testid={`option-country-${c.label}`}
                          >
                            <span className="text-lg">{c.flag}</span>
                            <span className="text-gray-700">{c.label}</span>
                            <span className="text-gray-500">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="(555) 555 - 5555"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    className={`h-12 rounded-l-none flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                    data-testid="input-phone"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1" data-testid="error-phone">{errors.phone}</p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                  data-testid="input-email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1" data-testid="error-email">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Please confirm your email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className={`h-12 ${errors.confirmEmail ? 'border-red-500' : ''}`}
                  data-testid="input-confirm-email"
                />
                {errors.confirmEmail && (
                  <p className="text-red-500 text-xs mt-1" data-testid="error-confirm-email">{errors.confirmEmail}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={`h-12 ${errors.company ? 'border-red-500' : ''}`}
                  data-testid="input-company"
                />
                {errors.company && (
                  <p className="text-red-500 text-xs mt-1" data-testid="error-company">{errors.company}</p>
                )}
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-0.5"
                    data-testid="checkbox-terms"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to the{' '}
                    <a href="#" className="text-[#36bff9] hover:underline" data-testid="link-terms">
                      Terms of Use
                    </a>
                    .
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-1" data-testid="error-terms">{errors.terms}</p>
                )}
              </div>

              <Button
                onClick={handleContinue}
                className="w-full h-12 bg-[#36bff9] hover:bg-[#2aa8e0] text-white text-lg font-semibold"
                data-testid="button-continue"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
