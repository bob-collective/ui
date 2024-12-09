import { BitcoinWalletConnectors } from '@dynamic-labs/bitcoin';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { BOBUIProvider } from '@gobob/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';

import { getConfig } from '@/lib/wagmi';
import { LinguiClientProvider } from '@/i18n/provider';

export const wrapper = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient();

  return (
    <LinguiClientProvider initialLocale='en' initialMessages={{}}>
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
          walletConnectors: [BitcoinWalletConnectors, EthereumWalletConnectors]
        }}
      >
        <WagmiProvider config={getConfig({ isProd: false })}>
          <QueryClientProvider client={queryClient}>
            <BOBUIProvider>{children}</BOBUIProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </DynamicContextProvider>
    </LinguiClientProvider>
  );
};
