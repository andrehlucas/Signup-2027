'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    sessionStorage.setItem('signup_email', email);
    router.push('/auth/get-code');
  };

  return (
    <div className="text-center" data-testid="signup-page">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Sign Up</h1>
      <p className="text-gray-500 mb-8">
        In the space below, please enter the email you provided to Opus and click Submit
      </p>

      <form onSubmit={handleSubmit} className="text-left space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 bg-white"
            data-testid="input-email"
          />
        </div>

        <Button
          type="submit"
          disabled={!email || isSubmitting}
          className="w-full h-11 bg-[#ED1C24] hover:bg-[#d41920] text-white font-medium text-base"
          data-testid="button-submit"
        >
          Submit
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        Already have an account?{' '}
        <button
          onClick={() => router.push('/auth/login')}
          className="text-[#0086C9] font-medium hover:underline"
          data-testid="link-login"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
