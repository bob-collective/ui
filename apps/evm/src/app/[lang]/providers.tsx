'use client';

import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import { WagmiProvider } from '@gobob/wagmi';
import { PropsWithChildren, useState } from 'react';
import { SatsWagmiConfig } from '@gobob/sats-wagmi';

import { NestedProviders } from './nested-providers';

import { bitcoinNetwork, isProd } from '@/constants';
import { FetchError } from '@/types/fetch';

export function Providers({ children }: PropsWithChildren) {
  // Instead do this, which ensures each request has its own cache:
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Ideally, these default values should never be used.
            // Each query should set its own `staleTime` and `gcTime` depending on how often the data is expected to change,
            // and how important it is to keep the data fresh every time a component mounts.
            staleTime: 15 * 1000,
            gcTime: 24 * 60 * 60 * 1000,
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

  return (
    <WagmiProvider isProd={isProd}>
      <QueryClientProvider client={queryClient}>
        <SatsWagmiConfig network={bitcoinNetwork} queryClient={queryClient}>
          <NestedProviders>{children}</NestedProviders>
        </SatsWagmiConfig>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
