'use client';

import { WagmiProvider as LibWagmiProvider, WagmiProviderProps as LibWagmiProviderProps } from 'wagmi';
import { ReactNode, useMemo } from 'react';

import { getConfig } from './config';
import { Config } from './types';

type WagmiProviderProps = Omit<LibWagmiProviderProps, 'config'> & { children: ReactNode } & Config;

// TODO: might need different config for test env
const WagmiProvider: React.FC<WagmiProviderProps> = ({ isProd, ...props }) => {
  const config = useMemo(() => getConfig({ isProd }), [isProd]);

  return <LibWagmiProvider {...props} config={config} />;
};

export { WagmiProvider };
export type { WagmiProviderProps };
