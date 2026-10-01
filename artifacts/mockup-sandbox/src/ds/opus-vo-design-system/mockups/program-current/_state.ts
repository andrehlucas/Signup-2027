import { useState } from 'react';
import type { ProgramBilling, TruckingProgramId } from './_programs';

// Canvas-only substitutes. Never call the live signup API from a mockup.
const router = { push: (_path: string) => {}, replace: (_path: string) => {} };
export function useRouter() { return router; }
export function useFunnelTracking(_step: string) { return { trackComplete: () => {} }; }

const order = {
  location: { name: 'Miami - Brickell Avenue', city: 'Miami', stateCode: 'FL' },
  userInfo: {
    firstName: 'Preview', lastName: 'User', phone: '3055550199',
    email: 'preview@example.com', confirmEmail: 'preview@example.com',
    company: 'Trucking Company', termsAccepted: true,
  },
};

export function useOrder() {
  const [programId, setProgramId] = useState<TruckingProgramId | null>(null);
  const [billing, setBilling] = useState<ProgramBilling>('monthly');
  const [signupComplete, setSignupComplete] = useState(false);
  return {
    order, programId, billing, signupComplete, setProgramId, setBilling,
    signupPending: false, signupError: '',
    submitSignup: async () => {
      setSignupComplete(true);
      return 'success' as const;
    },
  };
}