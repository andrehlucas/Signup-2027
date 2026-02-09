'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Mail, Phone } from 'lucide-react';

export default function GetCodePage() {
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'text' | ''>('');
  const [email, setEmail] = useState('');
  const [phone] = useState('(xxx) xxx - xxxx');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('signup_email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push('/auth/signup');
    }
  }, [router]);

  const handleSendCode = () => {
    if (!method) return;
    setIsSubmitting(true);
    sessionStorage.setItem('signup_method', method);
    router.push('/auth/enter-code');
  };

  return (
    <div className="text-center" data-testid="get-code-page">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Get your code</h1>
      <p className="text-gray-500 mb-8">
        Please select how you would prefer to receive your verification code below.
      </p>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <button
          onClick={() => setMethod('email')}
          className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors border-b border-gray-200 ${
            method === 'email' ? 'bg-gray-50' : 'hover:bg-gray-50'
          }`}
          data-testid="option-email"
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            method === 'email' ? 'border-[#0086C9]' : 'border-gray-300'
          }`}>
            {method === 'email' && <div className="w-2.5 h-2.5 rounded-full bg-[#0086C9]" />}
          </div>
          <Mail className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">{email || '(email-address)'}</span>
        </button>

        <button
          onClick={() => setMethod('text')}
          className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${
            method === 'text' ? 'bg-gray-50' : 'hover:bg-gray-50'
          }`}
          data-testid="option-text"
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            method === 'text' ? 'border-[#0086C9]' : 'border-gray-300'
          }`}>
            {method === 'text' && <div className="w-2.5 h-2.5 rounded-full bg-[#0086C9]" />}
          </div>
          <Phone className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">{phone}</span>
        </button>
      </div>

      <Button
        onClick={handleSendCode}
        disabled={!method || isSubmitting}
        className="w-full h-11 bg-[#ED1C24] hover:bg-[#d41920] text-white font-medium text-base"
        data-testid="button-send-code"
      >
        Send Code
      </Button>
    </div>
  );
}
