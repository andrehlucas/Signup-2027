'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useAddons } from './AddonsContext';
import { Bundle, bundles, getIncludedAddonIds } from '@/app/add-location/types';

interface Plan {
  id: string;
  name: string;
  tier: string;
  price: number;
}

interface SubscriptionContextType {
  currentPlanId: string;
  currentPlanName: string;
  currentBundle: Bundle | null;
  includedAddonIds: string[];
  basePlanAmount: number;
  addonsCost: number;
  monthlyAmount: number;
  updatePlan: (plan: Plan) => void;
  isAddonIncluded: (addonId: string) => boolean;
}

const defaultPlan = {
  id: 'pro',
  name: 'Office PRO',
  price: 149,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [currentPlanId, setCurrentPlanId] = useState(defaultPlan.id);
  const [currentPlanName, setCurrentPlanName] = useState(defaultPlan.name);
  const [basePlanAmount, setBasePlanAmount] = useState(defaultPlan.price);
  
  const { totalAddonsCost } = useAddons();

  // Get the current bundle based on plan ID
  const currentBundle = useMemo(() => {
    return bundles.find(b => b.id === currentPlanId) || null;
  }, [currentPlanId]);

  // Get list of add-on IDs that are included in the current bundle
  const includedAddonIds = useMemo(() => {
    return getIncludedAddonIds(currentBundle);
  }, [currentBundle]);

  // Check if a specific add-on is included in the current bundle
  const isAddonIncluded = (addonId: string): boolean => {
    return includedAddonIds.includes(addonId);
  };

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
        currentBundle,
        includedAddonIds,
        basePlanAmount,
        addonsCost: totalAddonsCost,
        monthlyAmount, 
        updatePlan,
        isAddonIncluded,
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
