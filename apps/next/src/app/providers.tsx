'use client';

import { QueryClientProvider } from '@gobob/react-query';
import { SatsWagmiConfig } from '@gobob/sats-wagmi';
import { BOBUIProvider, CSSReset } from '@gobob/ui';
import { WagmiProvider } from '@gobob/wagmi';
import { ConnectProvider } from '@gobob/connect-ui';
import { ReactNode } from 'react';

import { bitcoinNetwork, isProd } from '@/constants';
import { queryClient } from '@/lib/react-query';
import StyledComponentsRegistry from '@/lib/registry';
import { Header, Layout, Sidebar } from '@/components';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider isProd={isProd}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <SatsWagmiConfig network={bitcoinNetwork}>
          <StyledComponentsRegistry>
            <BOBUIProvider>
              <ConnectProvider type='both'>
                <CSSReset />
                <Layout>
                  <Sidebar />
                  <Header />
                  {children}
                </Layout>
              </ConnectProvider>
            </BOBUIProvider>
          </StyledComponentsRegistry>
        </SatsWagmiConfig>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
