'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { useAccountEffect } from 'wagmi';
import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';

import PageView from './PageView';
import { PosthogEvents } from './events';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { address: btcAddress, connector: btcConnector } = useSatsAccount();

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false // Disable automatic pageview capture, as we capture manually
    });
  }, []);

  useEffect(() => {
    if (!btcAddress) return;

    posthog.capture(PosthogEvents.CONNECT_BTC_WALLET, {
      $set: { btcAddress, btcWallet: btcConnector?.name }
    });
  }, [btcAddress, btcConnector?.name]);

  useAccountEffect({
    onConnect: (data) => {
      posthog.identify(data.address, {
        evmAddress: data.address,
        evmWallet: data.connector.name,
        btcAddress: btcAddress,
        btcWallet: btcConnector?.name
      });
    },
    onDisconnect: () => {
      posthog.reset();
    }
  });

  return (
    <PHProvider client={posthog}>
      <PageView />
      {children}
    </PHProvider>
  );
}
