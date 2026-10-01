import { useState } from 'react';
import { truckingPrograms, type ProgramBilling, type TruckingProgramId } from './_programs';

// Local canvas state only: no signup, tracking, API calls, or navigation.
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
  const [billing, updateBilling] = useState<ProgramBilling>('monthly');
  const [previewStatus, setPreviewStatus] = useState('');
  const setBilling = (frequency: ProgramBilling) => {
    updateBilling(frequency);
    setProgramId(null);
    setPreviewStatus('');
  };
  const continueToCheckout = (id: TruckingProgramId) => {
    setProgramId(id);
    const plan = truckingPrograms.find((item) => item.id === id)!;
    setPreviewStatus(`Preview only: ${plan.name} selected with ${billing === 'annual' ? 'yearly' : 'monthly'} billing (${billing === 'annual' ? `$${plan.annualTotal.toLocaleString('en-US')}/year` : `$${plan.monthly}/month`}). Checkout is not connected. No signup or payment has been started.`);
  };
  const navigatePreview = (step: string) => {
    setPreviewStatus(`Preview only: ${step} is a completed signup step. This comparison stays open; no navigation or signup changes were made.`);
  };
  return { order, programId, billing, setBilling, previewStatus, continueToCheckout, navigatePreview };
}