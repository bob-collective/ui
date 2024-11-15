import { QueryCache, QueryClient, QueryClientProvider } from '@gobob/react-query';
import { BOBUIProvider } from '@gobob/ui';
import { WagmiProvider } from '@gobob/wagmi';
import { PropsWithChildren } from 'react';

import { LinguiClientProvider } from '@/i18n/provider';

export const wrapper = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (typeof query.meta?.onError === 'function') query.meta.onError(error, query);
      },
      onSuccess(data, query) {
        if (typeof query.meta?.onSuccess === 'function') query.meta.onSuccess(data, query);
      },
      onSettled(data, error, query) {
        if (typeof query.meta?.onSettled === 'function') query.meta.onSettled(data, error, query);
      }
    })
  });

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
