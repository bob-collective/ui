import { BOBUIProvider } from '@gobob/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { WagmiProvider } from 'wagmi';

import { ConnectWallet } from '..';

import { LinguiClientProvider } from '@/i18n/provider';
import { getConfig } from '@/lib/wagmi';

describe('ConnectWallet', () => {
  it('should render correctly', () => {
    const { unmount } = render(<ConnectWallet />, {
      wrapper: ({ children }) => (
        <LinguiClientProvider initialLocale='en' initialMessages={{}}>
          <QueryClientProvider client={new QueryClient()}>
            <WagmiProvider config={getConfig({ isProd: false })}>
              <BOBUIProvider>{children}</BOBUIProvider>
            </WagmiProvider>
          </QueryClientProvider>
        </LinguiClientProvider>
      )
    });

    expect(() => unmount()).not.toThrow();
  });
});
