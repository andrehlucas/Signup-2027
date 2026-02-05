'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useAddons } from './AddonsContext';

interface Plan {
  id: string;
  name: string;
  tier: string;
  price: number;
}

interface SubscriptionContextType {
  currentPlanId: string;
  currentPlanName: string;
  basePlanAmount: number;
  addonsCost: number;
  monthlyAmount: number;
  updatePlan: (plan: Plan) => void;
}

const defaultPlan = {
  id: 'essentials',
  name: 'The Essentials',
  price: 99,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [currentPlanId, setCurrentPlanId] = useState(defaultPlan.id);
  const [currentPlanName, setCurrentPlanName] = useState(defaultPlan.name);
  const [basePlanAmount, setBasePlanAmount] = useState(defaultPlan.price);
  
  const { totalAddonsCost } = useAddons();

  const monthlyAmount = useMemo(() => {
    return basePlanAmount + totalAddonsCost;
  }, [basePlanAmount, totalAddonsCost]);

  const updatePlan = (plan: Plan) => {
    setCurrentPlanId(plan.id);
    setCurrentPlanName(plan.tier === 'The Essentials' ? 'The Essentials' : `Office ${plan.tier}`);
    setBasePlanAmount(plan.price);
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        currentPlanId, 
        currentPlanName, 
        basePlanAmount,
        addonsCost: totalAddonsCost,
        monthlyAmount, 
        updatePlan 
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
