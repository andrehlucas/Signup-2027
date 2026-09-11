'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@workspace/opus-vo-design-system/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ProgressIndicator } from './add-location/components/ProgressIndicator';
import { useOrder } from './add-location/context';
import { useFunnelTracking } from './hooks/use-funnel-tracking';

// Set to true to skip user info validation and go straight to Customize
const SKIP_USER_INFO = true;

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
    if (!SKIP_USER_INFO && !validate()) return;

    setUserInfo({
      firstName: firstName.trim() || 'Test',
      lastName: lastName.trim() || 'User',
      phone: phone.replace(/\D/g, '') || '5551234567',
      countryCode,
      email: email.trim() || 'test@example.com',
      confirmEmail: confirmEmail.trim() || 'test@example.com',
      company: company.trim() || 'Test Company',
      termsAccepted: SKIP_USER_INFO ? true : termsAccepted,
    });

    trackComplete();
    router.push('/add-location/customize');
  };

  return (
    <div className="min-h-[calc(100vh-81px)] relative overflow-hidden" style={{ backgroundColor: '#f4f7fb' }} data-testid="signup-page">
      {/* Subtle dot-grid pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#0086C9" fillOpacity="0.10" />
          </pattern>
          {/* Fade mask: visible on sides, transparent in the center where content lives */}
          <mask id="grid-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect x="20%" y="0" width="60%" height="100%" fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" mask="url(#grid-mask)" />
        {/* Thin horizontal rule under the headline area */}
        <line x1="0" y1="230" x2="100%" y2="230" stroke="#0086C9" strokeOpacity="0.06" strokeWidth="1" />
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 lg:py-12">
        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-[2rem] font-extrabold leading-tight text-[#0f2044] max-w-xl mx-auto" data-testid="heading-signup">
            You're Only 4 Steps Away From<br className="hidden sm:block" />
            <span className="text-[#0086C9]"> Securing Your Virtual Office</span>
          </h1>
        </div>

        {/* Progress indicator */}
        <div className="mb-10 max-w-2xl mx-auto">
          <ProgressIndicator currentStep={1} />
        </div>

        {/* Form card */}
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-md border border-brand-50 px-7 py-8">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`h-11 rounded-lg text-sm ${errors.firstName ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
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
                    className={`h-11 rounded-lg text-sm ${errors.lastName ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
                    data-testid="input-last-name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1" data-testid="error-last-name">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Phone field with country selector */}
              <div>
                <div className={`flex rounded-lg overflow-hidden border ${errors.phone ? 'border-red-400' : 'border-gray-200'} focus-within:ring-2 focus-within:ring-[#0086C9]/30 focus-within:border-[#0086C9] transition-all`}>
                  <div className="relative flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-1.5 h-11 px-3 bg-gray-50 hover:bg-gray-100 transition-colors border-r border-gray-200"
                      data-testid="button-country-code"
                    >
                      <span className="text-base leading-none">{selectedCountry.flag}</span>
                      <span className="text-sm text-gray-600 font-medium">{countryCode}</span>
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 z-50 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto" data-testid="dropdown-country-codes">
                        {countryCodes.map((c, idx) => (
                          <button
                            key={`${c.code}-${c.label}-${idx}`}
                            type="button"
                            onClick={() => {
                              setCountryCode(c.code);
                              setShowCountryDropdown(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-brand-50 text-left text-sm transition-colors"
                            data-testid={`option-country-${c.label}`}
                          >
                            <span className="text-base">{c.flag}</span>
                            <span className="text-gray-700 font-medium">{c.label}</span>
                            <span className="text-gray-400 ml-auto">{c.code}</span>
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
                    className="h-11 rounded-none border-0 flex-1 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
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
                  className={`h-11 rounded-lg text-sm ${errors.email ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
                  data-testid="input-email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1" data-testid="error-email">{errors.email}</p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Confirm Email Address"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className={`h-11 rounded-lg text-sm ${errors.confirmEmail ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
                  data-testid="input-confirm-email"
                />
                {errors.confirmEmail && (
                  <p className="text-red-500 text-xs mt-1" data-testid="error-confirm-email">{errors.confirmEmail}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Company Name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={`h-11 rounded-lg text-sm ${errors.company ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
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
                  <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer leading-relaxed">
                    I agree to the{' '}
                    <a href="#" className="text-[#0086C9] hover:underline font-medium" data-testid="link-terms">
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
                hierarchy="primary"
                size="xl"
                className="w-full"
                data-testid="button-continue"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Trust / security note */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-[#0086C9]" />
            <span>Your information is encrypted and never shared with third parties.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
