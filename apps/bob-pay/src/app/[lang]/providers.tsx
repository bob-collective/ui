'use client';

import { QueryClientProvider } from '@gobob/react-query';
import { WagmiProvider } from '@gobob/wagmi';
import { PropsWithChildren } from 'react';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { ZeroDevSmartWalletConnectors } from '@dynamic-labs/ethereum-aa';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';

import { NestedProviders } from './nested-providers';

import { queryClient } from '@/lib/react-query';

export function Providers({ children }: PropsWithChildren) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors]
      }}
    >
      <WagmiProvider isProd={false}>
        <QueryClientProvider client={queryClient}>
          <NestedProviders>{children}</NestedProviders>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
