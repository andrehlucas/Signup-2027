'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/app/components/ui/tooltip';
import { useState } from 'react';
import Link from 'next/link';
import { Theme } from '@astryxdesign/core/theme';
import { LinkProvider } from '@astryxdesign/core/Link';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { OrderProvider } from '@/app/add-location/context';

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
    // Astryx theme. Pinned to light mode: the site has no dark styles yet.
    <Theme theme={neutralTheme} mode="light">
      <LinkProvider component={Link}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <OrderProvider>
              {children}
            </OrderProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </LinkProvider>
    </Theme>
  );
}
