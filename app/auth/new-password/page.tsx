'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Check, X } from 'lucide-react';

export default function NewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('signup_email');
    if (!storedEmail) {
      router.push('/auth/signup');
    }
  }, [router]);

  const rules = [
    { label: 'At least 8 characters long', met: password.length >= 8 },
    { label: 'At least one capital letter', met: /[A-Z]/.test(password) },
    { label: 'At least one small letter', met: /[a-z]/.test(password) },
    { label: 'At least one number', met: /\d/.test(password) },
  ];

  const allRulesMet = rules.every(r => r.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRulesMet || !passwordsMatch) return;
    setIsSubmitting(true);
    sessionStorage.removeItem('signup_email');
    sessionStorage.removeItem('signup_method');
    sessionStorage.setItem('signup_complete', 'true');
    router.push('/add-location');
  };

  return (
    <div className="text-center" data-testid="new-password-page">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">New Password</h1>
      <p className="text-gray-500 mb-8">
        Enter a password below to be able to access the portal.
      </p>

      <form onSubmit={handleSubmit} className="text-left space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New Password
          </label>
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 bg-white"
            data-testid="input-password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm New Password
          </label>
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 bg-white"
            data-testid="input-confirm-password"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-[#ED1C24]">The password should contain:</p>
          {rules.map((rule) => (
            <div key={rule.label} className="flex items-center gap-2 text-sm">
              {password.length > 0 ? (
                rule.met ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-red-500" />
                )
              ) : (
                <span className="text-gray-400 text-xs">•</span>
              )}
              <span className={password.length > 0 ? (rule.met ? 'text-green-600' : 'text-red-500') : 'text-gray-500'}>
                {rule.label}
              </span>
            </div>
          ))}
        </div>

        <Button
          type="submit"
          disabled={!allRulesMet || !passwordsMatch || isSubmitting}
          className="w-full h-11 bg-[#ED1C24] hover:bg-[#d41920] text-white font-medium text-base"
          data-testid="button-submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
