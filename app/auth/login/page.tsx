'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    router.push('/');
  };

  return (
    <div className="text-center" data-testid="login-page">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Log in to your account</h1>
      <p className="text-gray-500 mb-8">Please enter your details.</p>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 bg-white"
            data-testid="input-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="keep-logged-in"
              checked={keepLoggedIn}
              onCheckedChange={(checked) => setKeepLoggedIn(checked === true)}
              data-testid="checkbox-keep-logged-in"
            />
            <label htmlFor="keep-logged-in" className="text-sm text-gray-600 cursor-pointer">
              Keep me logged in
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              if (email) sessionStorage.setItem('signup_email', email);
              router.push('/auth/get-code');
            }}
            className="text-sm font-medium text-[#0086C9] hover:underline"
            data-testid="link-forgot-password"
          >
            Forgot password
          </button>
        </div>

        <Button
          type="submit"
          disabled={!email || !password || isSubmitting}
          className="w-full h-11 bg-[#ED1C24] hover:bg-[#d41920] text-white font-medium text-base"
          data-testid="button-sign-in"
        >
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        Don't have an account?{' '}
        <button
          onClick={() => router.push('/auth/signup')}
          className="text-[#0086C9] font-medium hover:underline"
          data-testid="link-signup"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
