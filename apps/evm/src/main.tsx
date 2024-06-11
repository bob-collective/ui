import './utils/sentry';
import { ConnectProvider } from '@gobob/connect-ui';
import { QueryClientProvider } from '@gobob/react-query';
import { SatsWagmiConfig } from '@gobob/sats-wagmi';
import { BOBUIProvider, CSSReset } from '@gobob/ui';
import { WagmiProvider } from '@gobob/wagmi';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './i18n';
import './index.css';

import App from './App';
import { bitcoinNetwork, isProd } from './constants';
import { queryClient } from './lib/react-query';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider isProd={isProd}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <SatsWagmiConfig network={bitcoinNetwork}>
          <BOBUIProvider>
            <ConnectProvider type='both'>
              <CSSReset />
              <App />
            </ConnectProvider>
          </BOBUIProvider>
        </SatsWagmiConfig>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
