import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { ZeroDevSmartWalletConnectors } from '@dynamic-labs/ethereum-aa';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { QueryClientProvider } from '@gobob/react-query';
import { BOBUIProvider, CSSReset } from '@gobob/ui';
import { WagmiProvider } from '@gobob/wagmi';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { queryClient } from './lib/react-query';
import './index.css';
import './utils/sentry';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors]
      }}
    >
      <WagmiProvider isProd={false}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <BOBUIProvider>
              <CSSReset />
              <App />
            </BOBUIProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  </React.StrictMode>
);
