'use client';

import { BitcoinWalletConnectors } from '@dynamic-labs/bitcoin';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicContextProvider, FilterChain } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { QueryClientProvider } from '@gobob/react-query';
import { getConfig } from '@gobob/wagmi';
import { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';
import { BitcoinIcon, EthereumIcon } from '@dynamic-labs/iconic';

import { NestedProviders } from './nested-providers';

import { isProd } from '@/constants';
import { queryClient } from '@/lib/react-query';

export function Providers({ children }: PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
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
    >
      <WagmiProvider config={getConfig({ isProd, multiInjectedProviderDiscovery: false })}>
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
