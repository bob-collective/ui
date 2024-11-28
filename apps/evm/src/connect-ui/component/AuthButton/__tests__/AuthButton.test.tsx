import { render } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@gobob/react-query';
import { WagmiProvider } from '@gobob/wagmi';
import { BOBUIProvider } from '@gobob/ui';

import { AuthButton } from '..';

import { LinguiClientProvider } from '@/i18n/provider';

describe('AuthButton', () => {
  it('should render correctly', () => {
    const { unmount } = render(<AuthButton />, {
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
