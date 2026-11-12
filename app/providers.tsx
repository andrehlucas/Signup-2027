'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { Theme } from '@astryxdesign/core/theme';
import { LinkProvider } from '@astryxdesign/core/Link';
import { opusTheme } from '@/app/themes/opus/opus';
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
    // Opus Astryx theme (app/themes/opus). Pinned to light mode: the theme
    // and the site have no dark styles yet.
    <Theme theme={opusTheme} mode="light">
      <LinkProvider component={Link}>
        <QueryClientProvider client={queryClient}>
          <OrderProvider>
            {children}
          </OrderProvider>
        </QueryClientProvider>
      </LinkProvider>
    </Theme>
  );
}
