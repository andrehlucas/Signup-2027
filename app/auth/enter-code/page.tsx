'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';

export default function EnterCodePage() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [method, setMethod] = useState<string>('email');
  const [email, setEmail] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('signup_email');
    const storedMethod = sessionStorage.getItem('signup_method');
    if (!storedEmail) {
      router.push('/auth/signup');
      return;
    }
    setEmail(storedEmail);
    if (storedMethod) setMethod(storedMethod);
    inputRefs.current[0]?.focus();
  }, [router]);

  const isComplete = code.every(d => d !== '');

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < pasted.length; i++) {
        newCode[i] = pasted[i];
      }
      setCode(newCode);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();

    }
  };

  const handleSubmit = () => {
    if (!isComplete) return;
    router.push('/auth/new-password');
  };

  const handleRequestNewCode = () => {
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="text-center" data-testid="enter-code-page">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Enter your code</h1>

      <div className="text-left mb-2">
        <label className="text-sm font-medium text-gray-700">Secure code</label>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <div key={index} className="flex items-center">
            {index === 3 && (
              <span className="text-2xl text-gray-400 mx-1">&ndash;</span>
            )}
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-16 text-center text-2xl font-medium border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0086C9] focus:border-transparent text-gray-400"
              placeholder="0"
              data-testid={`input-code-${index}`}
            />
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {method === 'email' ? (
          <>We sent you an email to {email} with a 6 digit code. The email can take up to 3 minutes to arrive. Please check your spam/junk folder for the email if you do not see it in the inbox.</>
        ) : (
          <>We sent you a text message to ******** with a 6 digit code.</>
        )}
      </p>

      <Button
        onClick={handleSubmit}
        disabled={!isComplete}
        className="w-full h-11 bg-[#ED1C24] hover:bg-[#d41920] text-white font-medium text-base mb-4"
        data-testid="button-verify-code"
      >
        Verify Code
      </Button>

      <button
        onClick={handleRequestNewCode}
        className="text-sm font-semibold text-gray-900 hover:underline"
        data-testid="link-request-new-code"
      >
        Click to request another code
      </button>
    </div>
  );
}
