'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import type { TruckingProgramId, ProgramBilling } from '../../shared/trucking-programs';
import { AvailableLocation, Bundle, PhoneNumber, Addon, OrderState, UserInfo, AppliedPromo } from './types';

interface OrderContextType {
  order: OrderState;
  selectedState: string;
  signupComplete: boolean;
  signupPending: boolean;
  signupError: string;
  continueToCheckout: () => Promise<'success' | 'error' | 'ignored'>;
  programId: TruckingProgramId | null;
  billing: ProgramBilling;
  setProgramId: (id: TruckingProgramId | null) => void;
  setBilling: (billing: ProgramBilling) => void;
  getSignupRequestId: () => string;
  setUserInfo: (userInfo: UserInfo) => void;
  setLocation: (location: AvailableLocation | null) => void;
  setSelectedState: (state: string) => void;
  completeSignup: () => void;
  setBundle: (bundle: Bundle | null) => void;
  setPhoneNumber: (phoneNumber: PhoneNumber | null) => void;
  setTollFreePhoneNumber: (phoneNumber: PhoneNumber | null) => void;
  addAddon: (addon: Addon) => void;
  removeAddon: (addonId: string) => void;
  updateAddon: (addon: Addon) => void;
  setExtensionCount: (count: number) => void;
  setAgreementAccepted: (accepted: boolean) => void;
  setAppliedPromo: (promo: AppliedPromo | null) => void;
  clearOrder: () => void;
  getCartTotal: () => { monthly: number; oneTime: number };
  getCartItems: () => Array<{ id: string; name: string; price: number; type: string; quantity?: number }>;
}

const initialUserInfo: UserInfo = {
  firstName: '',
  lastName: '',
  phone: '',
  countryCode: '+1',
  email: '',
  confirmEmail: '',
  company: '',
  termsAccepted: false,
};

const initialOrder: OrderState = {
  userInfo: initialUserInfo,
  location: null,
  bundle: null,
  phoneNumber: null,
  tollFreePhoneNumber: null,
  addons: [],
  extensionCount: 0,
  agreementAccepted: false,
  appliedPromo: null,
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<OrderState>(initialOrder);
  const [selectedState, setSelectedStateRaw] = useState('');
  const [signupComplete, setSignupComplete] = useState(false);
  const [programId, setProgramIdState] = useState<TruckingProgramId | null>(null);
  const [billing, setBillingState] = useState<ProgramBilling>('monthly');
  const requestRef = useRef<{ key: string; id: string } | null>(null);

  const [signupPending, setSignupPending] = useState(false);
  const [signupError, setSignupError] = useState('');
  const pendingRef = useRef(false);
  const completeRef = useRef(false);
  const latest = useRef({ order, programId, billing });
  latest.current = { order, programId, billing };
  const locked = () => pendingRef.current || completeRef.current;

  useEffect(() => {
    const handleReturn = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      // Returning from the external checkout must not leave the wizard locked.
      pendingRef.current = false;
      completeRef.current = false;
      setSignupPending(false);
      setSignupComplete(false);
    };
    window.addEventListener('pageshow', handleReturn);
    return () => window.removeEventListener('pageshow', handleReturn);
  }, []);

  const setProgramId = (id: TruckingProgramId | null) => {
    if (locked()) return;
    setProgramIdState(id);
    setSignupError('');
  };
  const setBilling = (b: ProgramBilling) => {
    if (locked()) return;
    setBillingState(b);
    setSignupError('');
  };

  const getSignupRequestId = () => {
    const { order: o, programId: p, billing: bl } = latest.current;
    const key = JSON.stringify([o.userInfo, o.location?.id, p, bl]);
    if (!requestRef.current || requestRef.current.key !== key) {
      requestRef.current = { key, id: crypto.randomUUID() };
    }
    return requestRef.current.id;
  };

  const continueToCheckout = async (): Promise<'success' | 'error' | 'ignored'> => {
    const { order: o, programId: p, billing: bl } = latest.current;
    if (locked() || !p || !o.location) return 'ignored';
    pendingRef.current = true;
    setSignupPending(true);
    setSignupError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: getSignupRequestId(),
          userInfo: o.userInfo,
          locationId: o.location.id,
          programId: p,
          billing: bl,
        }),
      });
      let data: { status?: string; checkoutUrl?: string; message?: string; error?: string } | null = null;
      try { data = await response.json(); } catch { data = null; }
      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'We could not open checkout. Please try again.');
      }
      const unexpectedResponse = 'We received an unexpected checkout response. Please try again.';
      if (data?.status !== 'checkout_ready' || typeof data.checkoutUrl !== 'string') {
        throw new Error(unexpectedResponse);
      }
      let destination: URL;
      try {
        destination = new URL(data.checkoutUrl);
      } catch {
        throw new Error(unexpectedResponse);
      }
      if (destination.protocol !== 'https:' || destination.username || destination.password) {
        throw new Error(unexpectedResponse);
      }
      completeRef.current = true;
      setSignupComplete(true);
      window.location.assign(destination.href);
      return 'success';
    } catch (e) {
      completeRef.current = false;
      setSignupComplete(false);
      setSignupError(e instanceof Error ? e.message : 'We could not open checkout. Please try again.');
      return 'error';
    } finally {
      pendingRef.current = false;
      setSignupPending(false);
    }
  };

  const setSelectedState = (s: string) => {
    if (locked()) return;
    setSelectedStateRaw(s);
  };

  const setUserInfo = (userInfo: UserInfo) => {
    if (locked()) return;
    setOrder(prev => ({ ...prev, userInfo }));
  };

  const setLocation = (location: AvailableLocation | null) => {
    if (locked()) return;
    setSignupError('');
    setOrder(prev => ({ ...prev, location }));
    setProgramIdState(null);
  };

  const completeSignup = () => {
    completeRef.current = true;
    setSignupComplete(true);
  };

  const setBundle = (bundle: Bundle | null) => {
    setOrder(prev => ({ ...prev, bundle }));
  };

  const setPhoneNumber = (phoneNumber: PhoneNumber | null) => {
    setOrder(prev => ({ ...prev, phoneNumber }));
  };

  const setTollFreePhoneNumber = (phoneNumber: PhoneNumber | null) => {
    setOrder(prev => ({ ...prev, tollFreePhoneNumber: phoneNumber }));
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

  const updateAddon = (addon: Addon) => {
    setOrder(prev => ({
      ...prev,
      addons: prev.addons.map(a => a.id === addon.id ? addon : a),
    }));
  };

  const setExtensionCount = (count: number) => {
    setOrder(prev => ({ ...prev, extensionCount: Math.max(0, count) }));
  };

  const setAgreementAccepted = (accepted: boolean) => {
    setOrder(prev => ({ ...prev, agreementAccepted: accepted }));
  };

  const setAppliedPromo = (promo: AppliedPromo | null) => {
    setOrder(prev => ({ ...prev, appliedPromo: promo }));
  };

  const clearOrder = () => {
    if (pendingRef.current) return;
    completeRef.current = false;
    setSignupError('');
    setOrder(initialOrder);
    setSelectedStateRaw('');
    setSignupComplete(false);
    setProgramIdState(null);
    setBilling('monthly');
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

    if (order.extensionCount > 0) {
      monthly += order.extensionCount * 25;
    }

    return { monthly, oneTime };
  };

  const getCartItems = () => {
    const items: Array<{ id: string; name: string; price: number; type: string; quantity?: number }> = [];

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

    if (order.extensionCount > 0) {
      items.push({
        id: 'additional-extensions',
        name: 'Additional Extensions',
        price: order.extensionCount * 25,
        type: 'addon',
        quantity: order.extensionCount,
      });
    }

    return items;
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        selectedState,
        signupComplete,
        signupPending,
        signupError,
        continueToCheckout,
        programId,
        billing,
        setProgramId,
        setBilling,
        getSignupRequestId,
        setUserInfo,
        setLocation,
        setSelectedState,
        completeSignup,
        setBundle,
        setPhoneNumber,
        setTollFreePhoneNumber,
        addAddon,
        removeAddon,
        updateAddon,
        setExtensionCount,
        setAgreementAccepted,
        setAppliedPromo,
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
