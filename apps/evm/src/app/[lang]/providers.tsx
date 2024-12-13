'use client';

import { BitcoinWalletConnectors } from '@dynamic-labs/bitcoin';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { BitcoinIcon, EthereumIcon } from '@dynamic-labs/iconic';
import { DynamicContextProvider, FilterChain } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useState } from 'react';
import { State, WagmiProvider } from 'wagmi';
import { sendGAEvent } from '@next/third-parties/google';

import { NestedProviders } from './nested-providers';

import { getConfig } from '@/lib/wagmi';
import { INTERVAL, isProd } from '@/constants';
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
  const [config] = useState(() => getConfig({ isProd, multiInjectedProviderDiscovery: false }));

  return (
    <DynamicContextProvider
      settings={{
        events: {
          onAuthSuccess({ user, primaryWallet }) {
            sendGAEvent('event', 'auth', {
              payload: {
                user,
                primaryWallet
              }
            });
          }
        },
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [BitcoinWalletConnectors, EthereumWalletConnectors],
        overrides: {
          multiWallet: true,
          views: [
            {
              type: 'wallet-list',
              tabs: {
                items: [
                  {
                    label: { text: 'All chains' }
                  },
                  {
                    label: { icon: <EthereumIcon /> },
                    walletsFilter: FilterChain('EVM'),
                    recommendedWallets: [
                      {
                        walletKey: 'okxwallet'
                      }
                    ]
                  },
                  {
                    label: { icon: <BitcoinIcon /> },
                    walletsFilter: FilterChain('BTC')
                  }
                ]
              }
            }
          ]
        }
      }}
      theme='dark'
    >
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <DynamicWagmiConnector>
            <NestedProviders>{children}</NestedProviders>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
