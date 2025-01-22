import { getWagmiConnectorV2 } from '@binance/w3w-wagmi-connector-v2';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

import { bob, bobSepolia } from './bob';
import { mainnet } from './mainnet';
import { sepolia } from './sepolia';
import { Config } from './types';

const binanceConnector = getWagmiConnectorV2();

const testnetChains = [bobSepolia, sepolia];

const prodChains = [bob, mainnet];

const allChains = [...testnetChains, ...prodChains];

const getConfig = ({ isProd, multiInjectedProviderDiscovery }: Config) => {
  const isDev = process.env.NODE_ENV === 'development';

  const coinbase = coinbaseWallet({
    appName: 'BOB',
    appLogoUrl: 'https://uploads-ssl.webflow.com/64e85c2f3609488b3ed725f4/64ecae53ef4b561482f1c49f_bob1.jpg'
  });

  const connectors = [
    ...(typeof window !== 'undefined' && window.ethereum !== undefined
      ? [
          injected({
            shimDisconnect: true
          })
        ]
      : []),

    ...(isDev
      ? [coinbase]
      : [
          walletConnect({
            showQrModal: true,
            projectId: 'd9a2f927549acc3da9e4893729772641',
            metadata: {
              name: 'BOB',
              description: 'BOB is a hybrid L2 that combines the security of Bitcoin with the versatility of Ethereum',
              url: 'https://www.app.gobob.xyz',
              icons: ['https://uploads-ssl.webflow.com/64e85c2f3609488b3ed725f4/64ecae53ef4b561482f1c49f_bob1.jpg']
            }
          }),
          coinbase,
          binanceConnector()
        ])
  ];

  return createConfig({
    ssr: true,
    storage: createStorage({
      storage: cookieStorage
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chains: (isProd ? prodChains : allChains) as any,
    multiInjectedProviderDiscovery,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [bob.id]: http(),
      [bobSepolia.id]: http()
    },
    connectors
  });
};

export { getConfig };
