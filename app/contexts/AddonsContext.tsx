'use client';

import { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import { availableAddons, Addon as MarketplaceAddon, AddonStatus } from '@/app/add-location/types';

export interface ActiveAddon {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'inactive';
  addedDate?: string;
}

interface AddonsContextType {
  activeAddons: ActiveAddon[];
  totalAddonsCost: number;
  addAddon: (addon: MarketplaceAddon) => void;
  removeAddon: (addonId: string) => void;
  isAddonActive: (addonId: string) => boolean;
  getAddonDetails: (addonId: string) => MarketplaceAddon | undefined;
  getAddonStatus: (addonId: string, includedAddonIds: string[]) => AddonStatus;
}

const AddonsContext = createContext<AddonsContextType | undefined>(undefined);

export function AddonsProvider({ children }: { children: ReactNode }) {
  const [activeAddons, setActiveAddons] = useState<ActiveAddon[]>([]);

  const totalAddonsCost = useMemo(() => {
    return activeAddons
      .filter(a => a.status === 'active')
      .reduce((sum, addon) => sum + addon.price, 0);
  }, [activeAddons]);

  const addAddon = useCallback((addon: MarketplaceAddon) => {
    setActiveAddons(prev => {
      const existing = prev.find(a => a.id === addon.id);
      if (existing) {
        return prev.map(a => 
          a.id === addon.id 
            ? { ...a, status: 'active' as const, addedDate: new Date().toISOString().split('T')[0] }
            : a
        );
      }
      return [...prev, {
        id: addon.id,
        name: addon.name,
        price: addon.packages && addon.packages.length > 0 ? addon.packages[0].price : addon.price,
        status: 'active' as const,
        addedDate: new Date().toISOString().split('T')[0],
      }];
    });
  }, []);

  const removeAddon = useCallback((addonId: string) => {
    setActiveAddons(prev => 
      prev.map(a => 
        a.id === addonId 
          ? { ...a, status: 'inactive' as const }
          : a
      )
    );
  }, []);

  const isAddonActive = useCallback((addonId: string) => {
    const addon = activeAddons.find(a => a.id === addonId);
    return addon?.status === 'active';
  }, [activeAddons]);

  const getAddonDetails = useCallback((addonId: string) => {
    return availableAddons.find(a => a.id === addonId);
  }, []);

  // Get the status of an add-on considering bundle inclusions
  const getAddonStatus = useCallback((addonId: string, includedAddonIds: string[]): AddonStatus => {
    // First check if it's included in the bundle
    if (includedAddonIds.includes(addonId)) {
      return 'included';
    }
    // Then check if it's actively subscribed
    const addon = activeAddons.find(a => a.id === addonId);
    if (addon?.status === 'active') {
      return 'active';
    }
    // Otherwise it's available to add
    return 'available';
  }, [activeAddons]);

  return (
    <AddonsContext.Provider 
      value={{ 
        activeAddons, 
        totalAddonsCost, 
        addAddon, 
        removeAddon, 
        isAddonActive,
        getAddonDetails,
        getAddonStatus,
      }}
    >
      {children}
    </AddonsContext.Provider>
  );
}

export function useAddons() {
  const context = useContext(AddonsContext);
  if (context === undefined) {
    throw new Error('useAddons must be used within an AddonsProvider');
  }
  return context;
}
