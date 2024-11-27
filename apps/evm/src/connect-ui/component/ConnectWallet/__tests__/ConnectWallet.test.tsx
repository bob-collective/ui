import { QueryClient, QueryClientProvider } from '@gobob/react-query';
import { BOBUIProvider } from '@gobob/ui';
import { WagmiProvider } from '@gobob/wagmi';
import { render } from '@testing-library/react';

import { ConnectWallet } from '..';

import { LinguiClientProvider } from '@/i18n/provider';

describe('ConnectWallet', () => {
  it('should render correctly', () => {
    const { unmount } = render(<ConnectWallet />, {
      wrapper: ({ children }) => (
        <LinguiClientProvider initialLocale='en' initialMessages={{}}>
          <QueryClientProvider client={new QueryClient()}>
            <WagmiProvider>
              <BOBUIProvider>{children}</BOBUIProvider>
            </WagmiProvider>
          </QueryClientProvider>
        </LinguiClientProvider>
      )
    });

    expect(() => unmount()).not.toThrow();
  });
});
