import { QueryClientProvider } from '@gobob/react-query';
import { SatsWagmiConfig } from '@gobob/sats-wagmi';
import { CSSReset } from '@gobob/ui';
import { WagmiProvider } from '@gobob/wagmi';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { bitcoinNetwork, isProd } from './constants';
import { queryClient } from './lib/react-query';

import '../sentry';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider isProd={isProd}>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <SatsWagmiConfig network={bitcoinNetwork} queryClient={queryClient}>
          <CSSReset />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SatsWagmiConfig>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
