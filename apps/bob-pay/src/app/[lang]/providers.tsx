'use client';

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { ZeroDevSmartWalletConnectors } from '@dynamic-labs/ethereum-aa';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { bob, bobSepolia } from 'viem/chains';
import { cookieStorage, createConfig, createStorage, http, State, WagmiProvider } from 'wagmi';

import { NestedProviders } from './nested-providers';

import { BalanceProvider } from '@/providers';
import { FetchError } from '@/types/fetch';
import { INTERVAL } from '@/constants';

export const config = createConfig({
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  chains: [bob, bobSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [bob.id]: http(),
    [bobSepolia.id]: http()
  }
});

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

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors]
      }}
    >
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <BalanceProvider>
              <NestedProviders>{children}</NestedProviders>
            </BalanceProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
