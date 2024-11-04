import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import { BOBUIProvider } from '@gobob/ui';
import { WagmiProvider } from '@gobob/wagmi';
import { PropsWithChildren } from 'react';

import { LinguiClientProvider } from '@/i18n/provider';

export const Wrapper = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient();

  return (
    <LinguiClientProvider initialLocale='en' initialMessages={{}}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          <BOBUIProvider>{children}</BOBUIProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </LinguiClientProvider>
  );
};
