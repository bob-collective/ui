'use client';
import { BitcoinNetwork } from '@gobob/types';
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@gobob/hooks';

import { LeatherConnector, UnisatConnector, XverseConnector } from './connectors';
import { SatsConnector } from './connectors/base';
import { LocalStorageKeys } from './constants';
import { OKXConnector } from './connectors/okx';

type SatsConfigData = {
  connector?: SatsConnector;
  connectors: SatsConnector[];
  setConnector: (connector?: SatsConnector) => void;
  network: BitcoinNetwork;
};

const StatsWagmiContext = createContext<SatsConfigData>({
  connector: undefined,
  connectors: [],
  setConnector: () => {},
  network: 'mainnet'
});

const useSatsWagmi = (): SatsConfigData => {
  const context = useContext(StatsWagmiContext);

  if (context === undefined) {
    throw new Error('useSatsWagmi must be used within a SatsWagmiConfig!');
  }

  return context;
};

type SatsWagmiConfigProps = {
  children: ReactNode;
  network?: BitcoinNetwork;
};

const SatsWagmiConfig: FC<SatsWagmiConfigProps> = ({ children, network = 'mainnet' }) => {
  const [connectors, setConnectors] = useState<SatsConnector[]>([]);
  const [connector, setCurrentConnector] = useState<SatsConnector>();

  const [storedConnector, setStoredConnector] = useLocalStorage<string | undefined>(
    LocalStorageKeys.CONNECTOR,
    undefined
  );

  useEffect(() => {
    const init = () => {
      const readyConnectors: SatsConnector[] = [];

      if (network === 'mainnet') {
        const okx = new OKXConnector(network);

        readyConnectors.push(okx);
      }

      const xverse = new XverseConnector(network);

      readyConnectors.push(xverse);

      const unisat = new UnisatConnector(network, 'unisat');

      readyConnectors.push(unisat);

      const bitkeep = new UnisatConnector(network, 'bitkeep');

      readyConnectors.push(bitkeep);

      // TODO: to be enabled when metamask snap is tested on mainnet
      // const mmSnap = new MMSnapConnector(network);

      // readyConnectors.push(mmSnap);

      const leather = new LeatherConnector(network);

      readyConnectors.push(leather);

      setConnectors(readyConnectors);
    };

    init();
  }, [network]);

  const setConnector = useCallback(
    (connector?: SatsConnector) => {
      setCurrentConnector(connector);
      setStoredConnector(connector?.id);
    },
    [setStoredConnector]
  );

  useEffect(() => {
    const autoConnect = async () => {
      const connector = connectors.find((connector) => connector.id === storedConnector);

      if (!connector) return;

      try {
        await connector.connect();
        setConnector(connector);
      } catch (e) {
        setStoredConnector(undefined);
      }
    };

    if (!connector && storedConnector && connectors.length) {
      autoConnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectors]);

  return (
    <StatsWagmiContext.Provider value={{ connectors, connector, setConnector, network }}>
      {children}
    </StatsWagmiContext.Provider>
  );
};

export { SatsWagmiConfig, useSatsWagmi };
