'use client';

import { QueryClientProvider } from '@gobob/react-query';
import { WagmiProvider } from '@gobob/wagmi';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';

import { NestedProviders } from './nested-providers';

import { bitcoinNetwork, isProd } from '@/constants';
import { queryClient } from '@/lib/react-query';

const SatsWagmiConfig = dynamic(() => import('@gobob/sats-wagmi').then((mod) => mod.SatsWagmiConfig), { ssr: false });

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
