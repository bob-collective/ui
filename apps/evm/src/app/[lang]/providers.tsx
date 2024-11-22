'use client';

import { SatsWagmiConfig } from '@gobob/sats-wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';

import { NestedProviders } from './nested-providers';

import { bitcoinNetwork, isProd } from '@/constants';
import { queryClient } from '@/lib/react-query';
import { getConfig } from '@/lib/wagmi';

export function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider isProd={getConfig({ isProd })}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <SatsWagmiConfig network={bitcoinNetwork} queryClient={queryClient}>
          <NestedProviders>{children}</NestedProviders>
        </SatsWagmiConfig>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
