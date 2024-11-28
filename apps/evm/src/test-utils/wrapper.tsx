import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BOBUIProvider } from '@gobob/ui';
import { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';

import { LinguiClientProvider } from '@/i18n/provider';
import { getConfig } from '@/lib/wagmi';

export const wrapper = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient();

  return (
    <LinguiClientProvider initialLocale='en' initialMessages={{}}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={getConfig({ isProd: false })}>
          <BOBUIProvider>{children}</BOBUIProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </LinguiClientProvider>
  );
};
