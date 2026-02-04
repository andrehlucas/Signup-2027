'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/app/components/ui/tooltip';
import { useState } from 'react';
import { SubscriptionProvider } from '@/app/contexts/SubscriptionContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SubscriptionProvider>
          {children}
        </SubscriptionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
