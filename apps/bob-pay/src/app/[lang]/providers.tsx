'use client';

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { ZeroDevSmartWalletConnectors } from '@dynamic-labs/ethereum-aa';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { QueryClientProvider } from '@gobob/react-query';
import { WagmiProvider } from 'wagmi';
import { PropsWithChildren } from 'react';
import { getConfig } from '@gobob/wagmi';

import { NestedProviders } from './nested-providers';

import { queryClient } from '@/lib/react-query';
import { BalanceProvider } from '@/providers';

export function Providers({ children }: PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors]
      }}
    >
      <WagmiProvider config={getConfig({ isProd: false, multiInjectedProviderDiscovery: false })}>
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
