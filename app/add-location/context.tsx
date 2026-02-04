'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AvailableLocation, Bundle, PhoneNumber, Addon, OrderState } from './types';

interface OrderContextType {
  order: OrderState;
  setLocation: (location: AvailableLocation | null) => void;
  setBundle: (bundle: Bundle | null) => void;
  setPhoneNumber: (phoneNumber: PhoneNumber | null) => void;
  addAddon: (addon: Addon) => void;
  removeAddon: (addonId: string) => void;
  setAgreementAccepted: (accepted: boolean) => void;
  clearOrder: () => void;
  getCartTotal: () => { monthly: number; oneTime: number };
  getCartItems: () => Array<{ id: string; name: string; price: number; type: string }>;
}

const initialOrder: OrderState = {
  location: null,
  bundle: null,
  phoneNumber: null,
  addons: [],
  agreementAccepted: false,
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<OrderState>(initialOrder);

  const setLocation = (location: AvailableLocation | null) => {
    setOrder(prev => ({ ...prev, location }));
  };

  const setBundle = (bundle: Bundle | null) => {
    setOrder(prev => ({ ...prev, bundle }));
  };

  const setPhoneNumber = (phoneNumber: PhoneNumber | null) => {
    setOrder(prev => ({ ...prev, phoneNumber }));
  };

  const addAddon = (addon: Addon) => {
    setOrder(prev => {
      if (prev.addons.find(a => a.id === addon.id)) return prev;
      return { ...prev, addons: [...prev.addons, addon] };
    });
  };

  const removeAddon = (addonId: string) => {
    setOrder(prev => ({
      ...prev,
      addons: prev.addons.filter(a => a.id !== addonId),
    }));
  };

  const setAgreementAccepted = (accepted: boolean) => {
    setOrder(prev => ({ ...prev, agreementAccepted: accepted }));
  };

  const clearOrder = () => {
    setOrder(initialOrder);
  };

  const getCartTotal = () => {
    let monthly = 0;
    let oneTime = 0;

    if (order.bundle) {
      monthly += order.bundle.price;
    }

    order.addons.forEach(addon => {
      if (addon.billingCycle === 'monthly') {
        monthly += addon.price;
      } else {
        oneTime += addon.price;
      }
    });

    return { monthly, oneTime };
  };

  const getCartItems = () => {
    const items: Array<{ id: string; name: string; price: number; type: string }> = [];

    if (order.location) {
      items.push({
        id: 'location',
        name: order.location.name,
        price: 0,
        type: 'location',
      });
    }

    if (order.bundle) {
      items.push({
        id: order.bundle.id,
        name: `${order.bundle.name} ${order.bundle.tier !== 'The Essentials' ? order.bundle.tier : ''}`.trim(),
        price: order.bundle.price,
        type: 'bundle',
      });
    }

    order.addons.forEach(addon => {
      items.push({
        id: addon.id,
        name: addon.name,
        price: addon.price,
        type: 'addon',
      });
    });

    return items;
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        setLocation,
        setBundle,
        setPhoneNumber,
        addAddon,
        removeAddon,
        setAgreementAccepted,
        clearOrder,
        getCartTotal,
        getCartItems,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
