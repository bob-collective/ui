'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { useAccount, useAccountEffect } from 'wagmi';

import PageView from './PageView';
import { PosthogEvents } from './events';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { address: evmAddress } = useAccount();
  const { address: btcAddress, connector: btcConnector } = useSatsAccount();

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true // Enable pageleave capture
    });
  }, []);

  useEffect(() => {
    if (!btcAddress || !evmAddress) return;

    posthog.capture(PosthogEvents.CONNECT_BTC_WALLET, {
      $set: { btcAddress, btcWallet: btcConnector?.name }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btcAddress, btcConnector?.name]);

  useAccountEffect({
    onConnect: (data) => {
      posthog.identify(data.address, {
        evmAddress: data.address,
        evmWallet: data.connector.name,
        btcAddress: btcAddress,
        btcWallet: btcConnector?.name
      });

      posthog.capture(PosthogEvents.CONNECT_EVM_WALLET);
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
