'use client';

import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { usePrices } from '@gobob/react-query';
import { BOBUIProvider, CSSReset } from '@gobob/ui';
import { useAccount, useChainId, useReconnect } from '@gobob/wagmi';
import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

import { Header, Layout } from '@/components';
import { CHAIN } from '@/constants';
import { useBalances, useTokens } from '@/hooks';
import { StyledComponentsRegistry } from '@/lib/styled-components';

const ScrollToTop = () => {
  // Extracts pathname property(key) from an object
  const pathname = usePathname();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window?.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export function NestedProviders({ children }: PropsWithChildren) {
  const router = useRouter();
  const chainId = useChainId();
  const { walletConnector } = useDynamicContext();
  const { chain } = useAccount();

  // Called here to make sure data exists
  usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API });
  useBalances(chainId);
  useTokens(chainId);

  const { reconnect } = useReconnect();

  useEffect(() => {
    reconnect();
  }, [reconnect]);

  console.log(walletConnector);

  useEffect(() => {
    const switchChain = () => {
      walletConnector!.switchNetwork({ networkChainId: CHAIN });
    };

    if (walletConnector && chain && CHAIN !== chain.id) {
      switchChain();
    }
  }, [chain, walletConnector]);

  return (
    <StyledComponentsRegistry>
      <BOBUIProvider navigate={router.push}>
        <CSSReset />
        <ScrollToTop />
        <Layout>
          <Header />
          {children}
        </Layout>
      </BOBUIProvider>
    </StyledComponentsRegistry>
  );
}
