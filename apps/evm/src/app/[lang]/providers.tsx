'use client';

import { SatsWagmiConfig } from '@gobob/sats-wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { State, WagmiProvider } from 'wagmi';

import { NestedProviders } from './nested-providers';

import { bitcoinNetwork, INTERVAL, isProd } from '@/constants';
import { getConfig } from '@/lib/wagmi';
import { FetchError } from '@/types/fetch';

export function Providers({ initialState, children }: PropsWithChildren<{ initialState: State | undefined }>) {
  // Instead do this, which ensures each request has its own cache:
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Ideally, these default values should never be used.
            // Each query should set its own `staleTime` and `gcTime` depending on how often the data is expected to change,
            // and how important it is to keep the data fresh every time a component mounts.
            staleTime: 15 * INTERVAL.MINUTE,
            gcTime: 24 * INTERVAL.HOUR,
            // Retry once, only if the error is a 500 fetch error.
            refetchOnWindowFocus: false,
            retry: (failureCount, error): boolean => {
              if (failureCount >= 2) return false;

              if (error instanceof FetchError && error.status === 500) {
                return true; // Retry on server error
              }

              return false;
            }
          }
        }
      })
  );
  const [config] = useState(() => getConfig({ isProd }));

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <SatsWagmiConfig network={bitcoinNetwork} queryClient={queryClient}>
          <NestedProviders>{children}</NestedProviders>
        </SatsWagmiConfig>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
