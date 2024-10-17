'use client';

import { QueryClientProvider } from '@gobob/react-query';
import { WagmiProvider } from '@gobob/wagmi';
import { PropsWithChildren } from 'react';
import { SatsWagmiConfig } from '@gobob/sats-wagmi';

import { NestedProviders } from './nested-providers';

import { bitcoinNetwork, isProd } from '@/constants';
import { queryClient } from '@/lib/react-query';

export function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider isProd={isProd}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <SatsWagmiConfig network={bitcoinNetwork} queryClient={queryClient}>
          <NestedProviders>{children}</NestedProviders>
        </SatsWagmiConfig>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
