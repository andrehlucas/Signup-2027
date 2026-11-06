'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AvailableLocation, Bundle, PhoneNumber, Addon, OrderState, UserInfo, AppliedPromo, getPhoneNumbersForLocation, resolveLocalPhoneNumber } from './types';
import { DRAFT_KEY, decodeDraft, encodeDraft, LocationFilters } from './draft';

interface OrderContextType {
  order: OrderState;
  locationFilters: LocationFilters;
  setLocationFilters: (filters: LocationFilters) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setLocation: (location: AvailableLocation | null) => void;
  setBundle: (bundle: Bundle | null) => void;
  setPhoneNumber: (phoneNumber: PhoneNumber | null) => void;
  setTollFreePhoneNumber: (phoneNumber: PhoneNumber | null) => void;
  addAddon: (addon: Addon) => void;
  removeAddon: (addonId: string) => void;
  updateAddon: (addon: Addon) => void;
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
  countryRegion: 'US',
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
  const [locationFilters, setLocationFilters] = useState<LocationFilters>({ country: 'US', state: '', city: '' });
  const [ready, setReady] = useState(false);
  const [draftResetFailed, setDraftResetFailed] = useState(false);
  const [draftNotice, setDraftNotice] = useState('');
  const [locationNotice, setLocationNotice] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);
    // Explicit, tab-local Preview reset; normal refreshes still recover the draft.
    const resetRequested = process.env.NODE_ENV === 'development'
      && url.pathname === '/' && url.searchParams.get('resetEnrollment') === '1';
    try {
      if (resetRequested) {
        sessionStorage.removeItem(DRAFT_KEY);
        url.searchParams.delete('resetEnrollment');
        window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
        setDraftNotice('Your previous enrollment was cleared. Start again below.');
      }
      const saved = resetRequested ? null : sessionStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          const restored = decodeDraft(saved, initialOrder);
          setOrder(restored.order);
          setLocationFilters(restored.filters);
        } catch {
          sessionStorage.removeItem(DRAFT_KEY);
          setDraftNotice('Your saved enrollment draft expired or could not be restored. Please start again.');
        }
      }
    } catch {
      setDraftResetFailed(resetRequested);
      setDraftNotice(resetRequested
        ? 'Your browser could not clear the saved enrollment. Clear this site’s data before using a shared device.'
        : 'Draft saving is unavailable in this browser. Keep this tab open to retain your selections.');
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || draftResetFailed) return;
    try {
      const hasDraft = Object.values(order.userInfo).some(value => typeof value === 'string' && value && value !== '+1' && value !== 'US')
        || order.location || order.bundle || locationFilters.state || locationFilters.country && locationFilters.country !== 'US';
      if (hasDraft) sessionStorage.setItem(DRAFT_KEY, encodeDraft(order, locationFilters));
      else sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      setDraftNotice('Your latest changes could not be saved. Keep this tab open to retain your selections.');
    }
  }, [ready, order, locationFilters, draftResetFailed]);

  const setUserInfo = useCallback((userInfo: UserInfo) => {
    setOrder(prev => ({ ...prev, userInfo }));
  }, []);

  const setLocation = (location: AvailableLocation | null) => {
    const needsNewPhone = location && order.phoneNumber &&
      !getPhoneNumbersForLocation(location).some(phone => phone.id === order.phoneNumber?.id && phone.isAvailable);
    setLocationNotice(needsNewPhone
      ? `Your plan and add-ons have been kept. Your previous local phone number is not available at this location; ${resolveLocalPhoneNumber(location, null) ? 'a new local number has been assigned for your selected location.' : 'no local numbers are currently available here. Please choose another location.'}`
      : '');
    setOrder(prev => {
      return { ...prev, location, phoneNumber: resolveLocalPhoneNumber(location, prev.phoneNumber) };
    });
    if (location) setLocationFilters({ country: location.countryCode ?? 'US', state: location.state, city: location.city });
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

  const setAgreementAccepted = (accepted: boolean) => {
    setOrder(prev => ({ ...prev, agreementAccepted: accepted }));
  };

  const setAppliedPromo = (promo: AppliedPromo | null) => {
    setOrder(prev => ({ ...prev, appliedPromo: promo }));
  };

  const clearOrder = () => {
    setOrder(initialOrder);
    setLocationFilters({ country: 'US', state: '', city: '' });
    setDraftNotice('');
    setLocationNotice('');
    try { sessionStorage.removeItem(DRAFT_KEY); }
    catch { setDraftNotice('The browser could not clear the saved draft. Clear this site’s data before using a shared device.'); }
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

    return items;
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        locationFilters,
        setLocationFilters,
        setUserInfo,
        setLocation,
        setBundle,
        setPhoneNumber,
        setTollFreePhoneNumber,
        addAddon,
        removeAddon,
        updateAddon,
        setAgreementAccepted,
        setAppliedPromo,
        clearOrder,
        getCartTotal,
        getCartItems,
      }}
    >
      {draftNotice && <p role="status" className="mx-auto max-w-4xl px-4 py-3 text-sm text-gray-700">{draftNotice}</p>}
      {locationNotice && <p role="status" className="mx-auto max-w-4xl px-4 py-3 text-sm text-gray-700">{locationNotice}</p>}
      {ready ? children : <p role="status" className="p-8 text-center text-sm text-gray-600">Restoring your enrollment…</p>}
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
