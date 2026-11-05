'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from './components/ProgressIndicator';
import { LocationSelector } from './components/LocationSelector';
import { useOrder } from './context';
import { AvailableLocation } from './types';

export default function LocationSelectionPage() {
  const router = useRouter();
  const { order, setLocation } = useOrder();
  useEffect(() => {
    if (!order.userInfo.firstName || !order.userInfo.email) {
      router.push('/');
    }
  }, [order.userInfo, router]);

  const handleLocationSelect = (location: AvailableLocation) => {
    setLocation(location);
    router.push('/add-location/pick-plan');
  };

  return (
    <div className="signup-shell p-4 lg:p-8" data-testid="location-selection-page">
      <div className="max-w-4xl lg:max-w-6xl mx-auto">
        <div className="mb-8">
          <ProgressIndicator currentStep={2} />
        </div>

        <LocationSelector onSelect={handleLocationSelect} />
      </div>
    </div>
  );
}
