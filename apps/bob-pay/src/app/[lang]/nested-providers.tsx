'use client';

import { usePrices } from '@gobob/hooks';
import { BOBUIProvider, CSSReset } from '@gobob/ui';
import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';
import { useChainId, useReconnect } from 'wagmi';

import { Header, Layout } from '@/components';
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

  // Called here to make sure data exists
  usePrices();
  useBalances(chainId);
  useTokens(chainId);

  const { reconnect } = useReconnect();

  useEffect(() => {
    reconnect();
  }, [reconnect]);

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
