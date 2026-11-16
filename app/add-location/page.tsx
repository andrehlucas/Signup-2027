'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VStack } from '@astryxdesign/core/VStack';
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
    <VStack className="signup-shell p-4 lg:p-8" hAlign="center" data-testid="location-selection-page">
      <VStack gap={6} width="100%" maxWidth={1152}>
        <ProgressIndicator currentStep={2} />
        <LocationSelector onSelect={handleLocationSelect} />
      </VStack>
    </VStack>
  );
}
