import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import { BOBUIProvider } from '@gobob/ui';
import { WagmiProvider } from 'wagmi';
import { PropsWithChildren } from 'react';
import { getConfig } from '@gobob/wagmi';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { BitcoinWalletConnectors } from '@dynamic-labs/bitcoin';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

import { isProd } from '@/constants';
import { LinguiClientProvider } from '@/i18n/provider';

export const wrapper = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient();

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
        walletConnectors: [BitcoinWalletConnectors, EthereumWalletConnectors]
      }}
    >
      <LinguiClientProvider initialLocale='en' initialMessages={{}}>
        <WagmiProvider config={getConfig({ isProd, multiInjectedProviderDiscovery: false })}>
          <QueryClientProvider client={queryClient}>
            <DynamicWagmiConnector>
              <BOBUIProvider>{children}</BOBUIProvider>
            </DynamicWagmiConnector>
          </QueryClientProvider>
        </WagmiProvider>
      </LinguiClientProvider>
    </DynamicContextProvider>
  );
};
