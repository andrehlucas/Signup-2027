import { useState } from 'react';
import type { ProgramBilling, TruckingProgramId } from './_programs';

// Canvas-only substitutes. Never call the live checkout API from a mockup.
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
  const [signupError, setSignupError] = useState('');
  const selectProgram = (id: TruckingProgramId | null) => {
    setProgramId(id);
    setSignupError('');
  };
  const selectBilling = (frequency: ProgramBilling) => {
    setBilling(frequency);
    setSignupError('');
  };
  return {
    order, programId, billing, signupComplete: false, setProgramId: selectProgram, setBilling: selectBilling,
    signupPending: false, signupError,
    continueToCheckout: async (): Promise<'success' | 'error' | 'ignored'> => {
      setSignupError('Checkout is not connected in this design preview.');
      return 'error' as const;
    },
  };
}